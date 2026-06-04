package com.packetanalyzer.dpi;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

public class LoadBalancer {
    private final int lbId;
    private final int fpStartId;
    private final int numFps;
    private final ThreadSafeQueue<PacketJob> inputQueue = new ThreadSafeQueue<>(10000);
    private final List<ThreadSafeQueue<PacketJob>> fpQueues;
    private final AtomicLong packetsReceived = new AtomicLong();
    private final AtomicLong packetsDispatched = new AtomicLong();
    private final long[] perFpCounts;
    private final AtomicBoolean running = new AtomicBoolean(false);
    private Thread thread;

    public LoadBalancer(int lbId, List<ThreadSafeQueue<PacketJob>> fpQueues, int fpStartId) {
        this.lbId = lbId;
        this.fpQueues = new ArrayList<>(fpQueues);
        this.fpStartId = fpStartId;
        this.numFps = fpQueues.size();
        this.perFpCounts = new long[numFps];
    }

    public void start() {
        if (running.getAndSet(true)) {
            return;
        }
        thread = new Thread(this::run, "LB" + lbId);
        thread.start();
        System.out.println("[LB" + lbId + "] Started (serving FP" + fpStartId + "-FP" + (fpStartId + numFps - 1) + ")");
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
        System.out.println("[LB" + lbId + "] Stopped");
    }

    public ThreadSafeQueue<PacketJob> getInputQueue() {
        return inputQueue;
    }

    public LBStats getStats() {
        LBStats stats = new LBStats();
        stats.packetsReceived = packetsReceived.get();
        stats.packetsDispatched = packetsDispatched.get();
        stats.perFpPackets = perFpCounts.clone();
        return stats;
    }

    public int getId() {
        return lbId;
    }

    public boolean isRunning() {
        return running.get();
    }

    private void run() {
        while (running.get()) {
            Optional<PacketJob> job = inputQueue.popWithTimeout(100);
            if (job.isEmpty()) {
                continue;
            }
            packetsReceived.incrementAndGet();
            int fpIndex = selectFP(job.get().tuple);
            fpQueues.get(fpIndex).push(job.get());
            packetsDispatched.incrementAndGet();
            perFpCounts[fpIndex]++;
        }
    }

    private int selectFP(FiveTuple tuple) {
        return Math.floorMod(tuple.hashCode(), numFps);
    }

    public static class LBStats {
        public long packetsReceived;
        public long packetsDispatched;
        public long[] perFpPackets;
    }
}
