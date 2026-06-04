package com.packetanalyzer.dpi;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FPManager {
    private final List<FastPathProcessor> fps = new ArrayList<>();

    public FPManager(int numFps, RuleManager ruleManager, PacketOutputCallback outputCallback) {
        for (int i = 0; i < numFps; i++) {
            fps.add(new FastPathProcessor(i, ruleManager, outputCallback));
        }
        System.out.println("[FPManager] Created " + numFps + " fast path processors");
    }

    public void startAll() {
        fps.forEach(FastPathProcessor::start);
    }

    public void stopAll() {
        fps.forEach(FastPathProcessor::stop);
    }

    public FastPathProcessor getFP(int id) {
        return fps.get(id);
    }

    public ThreadSafeQueue<PacketJob> getFPQueue(int id) {
        return fps.get(id).getInputQueue();
    }

    public List<ThreadSafeQueue<PacketJob>> getQueuePtrs() {
        List<ThreadSafeQueue<PacketJob>> ptrs = new ArrayList<>();
        for (FastPathProcessor fp : fps) {
            ptrs.add(fp.getInputQueue());
        }
        return ptrs;
    }

    public int getNumFPs() {
        return fps.size();
    }

    public AggregatedStats getAggregatedStats() {
        AggregatedStats stats = new AggregatedStats();
        for (FastPathProcessor fp : fps) {
            FastPathProcessor.FPStats fpStats = fp.getStats();
            stats.totalProcessed += fpStats.packetsProcessed;
            stats.totalForwarded += fpStats.packetsForwarded;
            stats.totalDropped += fpStats.packetsDropped;
            stats.totalConnections += fpStats.connectionsTracked;
        }
        return stats;
    }

    public String generateClassificationReport() {
        Map<AppType, Long> appCounts = new EnumMap<>(AppType.class);
        Map<String, Long> domainCounts = new HashMap<>();
        long[] totals = {0, 0};

        for (FastPathProcessor fp : fps) {
            fp.getConnectionTracker().forEach(conn -> {
                appCounts.merge(conn.appType, 1L, Long::sum);
                if (conn.appType == AppType.UNKNOWN) {
                    totals[1]++;
                } else {
                    totals[0]++;
                }
                if (!conn.sni.isEmpty()) {
                    domainCounts.merge(conn.sni, 1L, Long::sum);
                }
            });
        }

        long total = totals[0] + totals[1];
        double classifiedPct = total > 0 ? 100.0 * totals[0] / total : 0;
        double unknownPct = total > 0 ? 100.0 * totals[1] / total : 0;

        StringBuilder sb = new StringBuilder();
        sb.append("\n=== APPLICATION CLASSIFICATION REPORT ===\n");
        sb.append(String.format("Total Connections:    %10d%n", total));
        sb.append(String.format("Classified:           %10d (%5.1f%%)%n", totals[0], classifiedPct));
        sb.append(String.format("Unidentified:         %10d (%5.1f%%)%n", totals[1], unknownPct));
        sb.append("\nAPPLICATION DISTRIBUTION\n");

        appCounts.entrySet().stream()
                .sorted(Map.Entry.<AppType, Long>comparingByValue(Comparator.reverseOrder()))
                .forEach(entry -> {
                    double pct = total > 0 ? 100.0 * entry.getValue() / total : 0;
                    int barLen = (int) (pct / 5);
                    sb.append(String.format("%-15s %8d %5.1f%% %-20s%n",
                            TypeUtils.appTypeToString(entry.getKey()), entry.getValue(), pct, "#".repeat(barLen)));
                });

        if (!domainCounts.isEmpty()) {
            sb.append("\n[Detected Domains/SNIs]\n");
            domainCounts.entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .forEach(entry -> sb.append("  - ").append(entry.getKey()).append(" -> ")
                            .append(entry.getValue()).append('\n'));
        }
        return sb.toString();
    }

    public static class AggregatedStats {
        public long totalProcessed;
        public long totalForwarded;
        public long totalDropped;
        public long totalConnections;
    }
}
