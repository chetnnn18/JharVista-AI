package com.packetanalyzer.dpi;

import com.packetanalyzer.pcap.PacketParser;
import com.packetanalyzer.pcap.ParsedPacket;
import com.packetanalyzer.pcap.PcapGlobalHeader;
import com.packetanalyzer.pcap.PcapReader;
import com.packetanalyzer.pcap.RawPacket;

import java.io.BufferedOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.atomic.AtomicBoolean;

public class DPIEngine {
    private final Config config;
    private RuleManager ruleManager;
    private GlobalConnectionTable globalConnTable;
    private FPManager fpManager;
    private LBManager lbManager;
    private final ThreadSafeQueue<PacketJob> outputQueue = new ThreadSafeQueue<>(10000);
    private Thread outputThread;
    private BufferedOutputStream outputFile;
    private final Object outputLock = new Object();
    private final DPIStats stats = new DPIStats();
    private final AtomicBoolean running = new AtomicBoolean(false);
    private final AtomicBoolean processingComplete = new AtomicBoolean(false);
    private Thread readerThread;
    private ByteOrder outputByteOrder = ByteOrder.LITTLE_ENDIAN;

    public DPIEngine(Config config) {
        this.config = config;
        System.out.println();
        System.out.println("==============================================================");
        System.out.println("                    DPI ENGINE v1.0");
        System.out.println("               Deep Packet Inspection System");
        System.out.println("==============================================================");
        System.out.println("Configuration:");
        System.out.println("  Load Balancers:   " + config.numLoadBalancers);
        System.out.println("  FPs per LB:       " + config.fpsPerLb);
        System.out.println("  Total FP threads: " + (config.numLoadBalancers * config.fpsPerLb));
        System.out.println("==============================================================");
    }

    public boolean initialize() {
        ruleManager = new RuleManager();
        if (config.rulesFile != null && !config.rulesFile.isEmpty()) {
            ruleManager.loadRules(config.rulesFile);
        }

        PacketOutputCallback outputCallback = this::handleOutput;
        int totalFps = config.numLoadBalancers * config.fpsPerLb;
        fpManager = new FPManager(totalFps, ruleManager, outputCallback);
        lbManager = new LBManager(config.numLoadBalancers, config.fpsPerLb, fpManager.getQueuePtrs());

        globalConnTable = new GlobalConnectionTable(totalFps);
        for (int i = 0; i < totalFps; i++) {
            globalConnTable.registerTracker(i, fpManager.getFP(i).getConnectionTracker());
        }

        System.out.println("[DPIEngine] Initialized successfully");
        return true;
    }

    public boolean processFile(String inputFile, String outputPath) {
        System.out.println("\n[DPIEngine] Processing: " + inputFile);
        System.out.println("[DPIEngine] Output to:  " + outputPath + "\n");

        if (ruleManager == null && !initialize()) {
            return false;
        }

        try {
            outputFile = new BufferedOutputStream(Files.newOutputStream(Path.of(outputPath)));
        } catch (IOException e) {
            System.err.println("[DPIEngine] Error: Cannot open output file");
            return false;
        }

        start();
        readerThread = new Thread(() -> readerThreadFunc(inputFile), "PCAP-Reader");
        readerThread.start();
        waitForCompletion();
        sleep(200);
        stop();

        synchronized (outputLock) {
            if (outputFile != null) {
                try {
                    outputFile.close();
                } catch (IOException ignored) {
                }
            }
        }

        System.out.print(generateReport());
        System.out.print(fpManager.generateClassificationReport());
        return true;
    }

    public void start() {
        if (running.getAndSet(true)) {
            return;
        }
        processingComplete.set(false);
        outputThread = new Thread(this::outputThreadFunc, "PCAP-Output");
        outputThread.start();
        fpManager.startAll();
        lbManager.startAll();
        System.out.println("[DPIEngine] All threads started");
    }

    public void stop() {
        if (!running.getAndSet(false)) {
            return;
        }
        if (lbManager != null) {
            lbManager.stopAll();
        }
        if (fpManager != null) {
            fpManager.stopAll();
        }
        outputQueue.shutdown();
        if (outputThread != null) {
            try {
                outputThread.join();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        System.out.println("[DPIEngine] All threads stopped");
    }

    public void waitForCompletion() {
        if (readerThread != null) {
            try {
                readerThread.join();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        sleep(500);
        processingComplete.set(true);
    }

    public void blockIP(String ip) {
        if (ruleManager != null) {
            ruleManager.blockIP(ip);
        }
    }

    public void unblockIP(String ip) {
        if (ruleManager != null) {
            ruleManager.unblockIP(ip);
        }
    }

    public void blockApp(AppType app) {
        if (ruleManager != null) {
            ruleManager.blockApp(app);
        }
    }

    public void blockApp(String appName) {
        AppType app = AppType.fromDisplayName(appName);
        if (app != null) {
            blockApp(app);
        } else {
            System.err.println("[DPIEngine] Unknown app: " + appName);
        }
    }

    public void unblockApp(AppType app) {
        if (ruleManager != null) {
            ruleManager.unblockApp(app);
        }
    }

    public void unblockApp(String appName) {
        AppType app = AppType.fromDisplayName(appName);
        if (app != null) {
            unblockApp(app);
        }
    }

    public void blockDomain(String domain) {
        if (ruleManager != null) {
            ruleManager.blockDomain(domain);
        }
    }

    public void unblockDomain(String domain) {
        if (ruleManager != null) {
            ruleManager.unblockDomain(domain);
        }
    }

    public boolean loadRules(String filename) {
        return ruleManager != null && ruleManager.loadRules(filename);
    }

    public boolean saveRules(String filename) {
        return ruleManager != null && ruleManager.saveRules(filename);
    }

    public String generateReport() {
        StringBuilder sb = new StringBuilder();
        sb.append("\n=== DPI ENGINE STATISTICS ===\n");
        sb.append("PACKET STATISTICS\n");
        sb.append(String.format("  Total Packets:      %12d%n", stats.totalPackets.get()));
        sb.append(String.format("  Total Bytes:        %12d%n", stats.totalBytes.get()));
        sb.append(String.format("  TCP Packets:        %12d%n", stats.tcpPackets.get()));
        sb.append(String.format("  UDP Packets:        %12d%n", stats.udpPackets.get()));
        sb.append("\nFILTERING STATISTICS\n");
        sb.append(String.format("  Forwarded:          %12d%n", stats.forwardedPackets.get()));
        sb.append(String.format("  Dropped/Blocked:    %12d%n", stats.droppedPackets.get()));
        if (stats.totalPackets.get() > 0) {
            double dropRate = 100.0 * stats.droppedPackets.get() / stats.totalPackets.get();
            sb.append(String.format("  Drop Rate:          %11.2f%%%n", dropRate));
        }
        if (lbManager != null) {
            LBManager.AggregatedStats lbStats = lbManager.getAggregatedStats();
            sb.append("\nLOAD BALANCER STATISTICS\n");
            sb.append(String.format("  LB Received:        %12d%n", lbStats.totalReceived));
            sb.append(String.format("  LB Dispatched:      %12d%n", lbStats.totalDispatched));
        }
        if (fpManager != null) {
            FPManager.AggregatedStats fpStats = fpManager.getAggregatedStats();
            sb.append("\nFAST PATH STATISTICS\n");
            sb.append(String.format("  FP Processed:       %12d%n", fpStats.totalProcessed));
            sb.append(String.format("  FP Forwarded:       %12d%n", fpStats.totalForwarded));
            sb.append(String.format("  FP Dropped:         %12d%n", fpStats.totalDropped));
            sb.append(String.format("  Active Connections: %12d%n", fpStats.totalConnections));
        }
        if (ruleManager != null) {
            RuleManager.RuleStats ruleStats = ruleManager.getStats();
            sb.append("\nBLOCKING RULES\n");
            sb.append(String.format("  Blocked IPs:        %12d%n", ruleStats.blockedIps));
            sb.append(String.format("  Blocked Apps:       %12d%n", ruleStats.blockedApps));
            sb.append(String.format("  Blocked Domains:    %12d%n", ruleStats.blockedDomains));
            sb.append(String.format("  Blocked Ports:      %12d%n", ruleStats.blockedPorts));
        }
        return sb.toString();
    }

    public String generateClassificationReport() {
        return fpManager == null ? "" : fpManager.generateClassificationReport();
    }

    public DPIStats getStats() {
        return stats;
    }

    public void printStatus() {
        System.out.println("\n--- Live Status ---");
        System.out.println("Packets: " + stats.totalPackets.get()
                + " | Forwarded: " + stats.forwardedPackets.get()
                + " | Dropped: " + stats.droppedPackets.get());
        if (fpManager != null) {
            System.out.println("Connections: " + fpManager.getAggregatedStats().totalConnections);
        }
    }

    public RuleManager getRuleManager() {
        return ruleManager;
    }

    public Config getConfig() {
        return config;
    }

    public boolean isRunning() {
        return running.get();
    }

    private void outputThreadFunc() {
        while (running.get() || !outputQueue.empty()) {
            outputQueue.popWithTimeout(100).ifPresent(this::writeOutputPacket);
        }
    }

    private void handleOutput(PacketJob job, PacketAction action) {
        if (action == PacketAction.DROP) {
            stats.droppedPackets.incrementAndGet();
            return;
        }
        stats.forwardedPackets.incrementAndGet();
        outputQueue.push(job.copy());
    }

    private boolean writeOutputHeader(PcapGlobalHeader header) {
        synchronized (outputLock) {
            if (outputFile == null) {
                return false;
            }
            outputByteOrder = header.byteOrder;
            ByteBuffer buffer = ByteBuffer.allocate(24).order(outputByteOrder);
            if (outputByteOrder == ByteOrder.LITTLE_ENDIAN) {
                buffer.putInt(0xa1b2c3d4);
            } else {
                buffer.putInt(0xa1b2c3d4);
            }
            buffer.putShort((short) header.versionMajor);
            buffer.putShort((short) header.versionMinor);
            buffer.putInt(header.thiszone);
            buffer.putInt((int) header.sigfigs);
            buffer.putInt((int) header.snaplen);
            buffer.putInt((int) header.network);
            try {
                outputFile.write(buffer.array());
                return true;
            } catch (IOException e) {
                return false;
            }
        }
    }

    private void writeOutputPacket(PacketJob job) {
        synchronized (outputLock) {
            if (outputFile == null) {
                return;
            }
            ByteBuffer header = ByteBuffer.allocate(16).order(outputByteOrder);
            header.putInt((int) job.tsSec);
            header.putInt((int) job.tsUsec);
            header.putInt(job.data.length);
            header.putInt(job.data.length);
            try {
                outputFile.write(header.array());
                outputFile.write(job.data);
            } catch (IOException ignored) {
            }
        }
    }

    private void readerThreadFunc(String inputFile) {
        PcapReader reader = new PcapReader();
        if (!reader.open(inputFile)) {
            System.err.println("[Reader] Error: Cannot open input file");
            return;
        }

        writeOutputHeader(reader.getGlobalHeader());
        RawPacket raw = new RawPacket();
        ParsedPacket parsed = new ParsedPacket();
        long packetId = 0;

        System.out.println("[Reader] Starting packet processing...");
        while (reader.readNextPacket(raw)) {
            if (!PacketParser.parse(raw, parsed)) {
                continue;
            }
            if (!parsed.hasIp || (!parsed.hasTcp && !parsed.hasUdp)) {
                continue;
            }

            PacketJob job = createPacketJob(raw, parsed, packetId++);
            stats.totalPackets.incrementAndGet();
            stats.totalBytes.addAndGet(raw.data.length);
            if (parsed.hasTcp) {
                stats.tcpPackets.incrementAndGet();
            } else if (parsed.hasUdp) {
                stats.udpPackets.incrementAndGet();
            }

            LoadBalancer lb = lbManager.getLBForPacket(job.tuple);
            lb.getInputQueue().push(job);
        }

        System.out.println("[Reader] Finished reading " + packetId + " packets");
        reader.close();
    }

    private PacketJob createPacketJob(RawPacket raw, ParsedPacket parsed, long packetId) {
        PacketJob job = new PacketJob();
        job.packetId = packetId;
        job.tsSec = raw.header.tsSec;
        job.tsUsec = raw.header.tsUsec;
        job.tuple = new FiveTuple(
                TypeUtils.parseIP(parsed.srcIp),
                TypeUtils.parseIP(parsed.destIp),
                parsed.srcPort,
                parsed.destPort,
                parsed.protocol
        );
        job.tcpFlags = parsed.tcpFlags;
        job.data = raw.data.clone();
        job.ethOffset = 0;
        job.ipOffset = 14;
        if (job.data.length > 14) {
            int ipIhl = job.data[14] & 0x0f;
            int ipHeaderLen = ipIhl * 4;
            job.transportOffset = 14 + ipHeaderLen;
            if (parsed.hasTcp && job.data.length > job.transportOffset + 12) {
                int tcpDataOffset = ((job.data[job.transportOffset + 12] & 0xff) >> 4) & 0x0f;
                job.payloadOffset = job.transportOffset + tcpDataOffset * 4;
            } else if (parsed.hasUdp) {
                job.payloadOffset = job.transportOffset + 8;
            }
            if (job.payloadOffset < job.data.length) {
                job.payloadLength = job.data.length - job.payloadOffset;
            }
        }
        return job;
    }

    private static void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    public static class Config {
        public int numLoadBalancers = 2;
        public int fpsPerLb = 2;
        public int queueSize = 10000;
        public String rulesFile = "";
        public boolean verbose;
    }
}
