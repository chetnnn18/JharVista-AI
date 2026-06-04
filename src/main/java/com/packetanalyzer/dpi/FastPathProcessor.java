package com.packetanalyzer.dpi;

import java.time.Duration;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

public class FastPathProcessor {
    private final int fpId;
    private final ThreadSafeQueue<PacketJob> inputQueue = new ThreadSafeQueue<>(10000);
    private final ConnectionTracker connTracker;
    private final RuleManager ruleManager;
    private final PacketOutputCallback outputCallback;
    private final AtomicLong packetsProcessed = new AtomicLong();
    private final AtomicLong packetsForwarded = new AtomicLong();
    private final AtomicLong packetsDropped = new AtomicLong();
    private final AtomicLong sniExtractions = new AtomicLong();
    private final AtomicLong classificationHits = new AtomicLong();
    private final AtomicBoolean running = new AtomicBoolean(false);
    private Thread thread;

    public FastPathProcessor(int fpId, RuleManager ruleManager, PacketOutputCallback outputCallback) {
        this.fpId = fpId;
        this.connTracker = new ConnectionTracker(fpId);
        this.ruleManager = ruleManager;
        this.outputCallback = outputCallback;
    }

    public void start() {
        if (running.getAndSet(true)) {
            return;
        }
        thread = new Thread(this::run, "FP" + fpId);
        thread.start();
        System.out.println("[FP" + fpId + "] Started");
    }

    public void stop() {
        if (!running.getAndSet(false)) {
            return;
        }
        inputQueue.shutdown();
        if (thread != null) {
            try {
                thread.join();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        System.out.println("[FP" + fpId + "] Stopped (processed " + packetsProcessed.get() + " packets)");
    }

    public ThreadSafeQueue<PacketJob> getInputQueue() {
        return inputQueue;
    }

    public ConnectionTracker getConnectionTracker() {
        return connTracker;
    }

    public FPStats getStats() {
        FPStats stats = new FPStats();
        stats.packetsProcessed = packetsProcessed.get();
        stats.packetsForwarded = packetsForwarded.get();
        stats.packetsDropped = packetsDropped.get();
        stats.connectionsTracked = connTracker.getActiveCount();
        stats.sniExtractions = sniExtractions.get();
        stats.classificationHits = classificationHits.get();
        return stats;
    }

    public int getId() {
        return fpId;
    }

    public boolean isRunning() {
        return running.get();
    }

    private void run() {
        while (running.get()) {
            Optional<PacketJob> job = inputQueue.popWithTimeout(100);
            if (job.isEmpty()) {
                connTracker.cleanupStale(Duration.ofSeconds(300));
                continue;
            }

            packetsProcessed.incrementAndGet();
            PacketAction action = processPacket(job.get());
            if (outputCallback != null) {
                outputCallback.handle(job.get(), action);
            }
            if (action == PacketAction.DROP) {
                packetsDropped.incrementAndGet();
            } else {
                packetsForwarded.incrementAndGet();
            }
        }
    }

    private PacketAction processPacket(PacketJob job) {
        Connection conn = connTracker.getOrCreateConnection(job.tuple);
        if (conn == null) {
            return PacketAction.FORWARD;
        }
        connTracker.updateConnection(conn, job.data.length, true);

        if (job.tuple.protocol == 6) {
            updateTCPState(conn, job.tcpFlags);
        }

        if (conn.state == ConnectionState.BLOCKED) {
            return PacketAction.DROP;
        }

        if (conn.state != ConnectionState.CLASSIFIED && job.payloadLength > 0) {
            inspectPayload(job, conn);
        }

        return checkRules(job, conn);
    }

    private void inspectPayload(PacketJob job, Connection conn) {
        if (job.payloadLength == 0 || job.payloadOffset >= job.data.length) {
            return;
        }
        if (tryExtractSNI(job, conn)) {
            return;
        }
        if (tryExtractHTTPHost(job, conn)) {
            return;
        }
        if (job.tuple.dstPort == 53 || job.tuple.srcPort == 53) {
            Optional<String> domain = DNSExtractor.extractQuery(job.data, job.payloadOffset, job.payloadLength);
            if (domain.isPresent()) {
                connTracker.classifyConnection(conn, AppType.DNS, domain.get());
                return;
            }
        }
        if (job.tuple.dstPort == 80) {
            connTracker.classifyConnection(conn, AppType.HTTP, "");
        } else if (job.tuple.dstPort == 443) {
            connTracker.classifyConnection(conn, AppType.HTTPS, "");
        }
    }

    private boolean tryExtractSNI(PacketJob job, Connection conn) {
        if (job.tuple.dstPort != 443 && job.payloadLength < 50) {
            return false;
        }
        if (job.payloadOffset >= job.data.length || job.payloadLength == 0) {
            return false;
        }
        Optional<String> sni = SNIExtractor.extract(job.data, job.payloadOffset, job.payloadLength);
        if (sni.isPresent()) {
            sniExtractions.incrementAndGet();
            AppType app = TypeUtils.sniToAppType(sni.get());
            connTracker.classifyConnection(conn, app, sni.get());
            if (app != AppType.UNKNOWN && app != AppType.HTTPS) {
                classificationHits.incrementAndGet();
            }
            return true;
        }
        return false;
    }

    private boolean tryExtractHTTPHost(PacketJob job, Connection conn) {
        if (job.tuple.dstPort != 80) {
            return false;
        }
        if (job.payloadOffset >= job.data.length || job.payloadLength == 0) {
            return false;
        }
        Optional<String> host = HTTPHostExtractor.extract(job.data, job.payloadOffset, job.payloadLength);
        if (host.isPresent()) {
            AppType app = TypeUtils.sniToAppType(host.get());
            connTracker.classifyConnection(conn, app, host.get());
            if (app != AppType.UNKNOWN && app != AppType.HTTP) {
                classificationHits.incrementAndGet();
            }
            return true;
        }
        return false;
    }

    private PacketAction checkRules(PacketJob job, Connection conn) {
        if (ruleManager == null) {
            return PacketAction.FORWARD;
        }
        Optional<RuleManager.BlockReason> blockReason = ruleManager.shouldBlock(
                job.tuple.srcIp,
                job.tuple.dstPort,
                conn.appType,
                conn.sni
        );

        if (blockReason.isPresent()) {
            RuleManager.BlockReason reason = blockReason.get();
            String label = switch (reason.type()) {
                case IP -> "IP ";
                case APP -> "App ";
                case DOMAIN -> "Domain ";
                case PORT -> "Port ";
            };
            System.out.println("[FP" + fpId + "] BLOCKED packet: " + label + reason.detail());
            connTracker.blockConnection(conn);
            return PacketAction.DROP;
        }
        return PacketAction.FORWARD;
    }

    private void updateTCPState(Connection conn, int tcpFlags) {
        int syn = 0x02;
        int ack = 0x10;
        int fin = 0x01;
        int rst = 0x04;

        if ((tcpFlags & syn) != 0) {
            if ((tcpFlags & ack) != 0) {
                conn.synAckSeen = true;
            } else {
                conn.synSeen = true;
            }
        }
        if (conn.synSeen && conn.synAckSeen && (tcpFlags & ack) != 0 && conn.state == ConnectionState.NEW) {
            conn.state = ConnectionState.ESTABLISHED;
        }
        if ((tcpFlags & fin) != 0) {
            conn.finSeen = true;
        }
        if ((tcpFlags & rst) != 0) {
            conn.state = ConnectionState.CLOSED;
        }
        if (conn.finSeen && (tcpFlags & ack) != 0) {
            conn.state = ConnectionState.CLOSED;
        }
    }

    public static class FPStats {
        public long packetsProcessed;
        public long packetsForwarded;
        public long packetsDropped;
        public long connectionsTracked;
        public long sniExtractions;
        public long classificationHits;
    }
}
