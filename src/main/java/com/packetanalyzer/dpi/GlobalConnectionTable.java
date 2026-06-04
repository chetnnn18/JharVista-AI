package com.packetanalyzer.dpi;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class GlobalConnectionTable {
    private final List<ConnectionTracker> trackers;
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();

    public GlobalConnectionTable(int numFps) {
        trackers = new ArrayList<>();
        for (int i = 0; i < numFps; i++) {
            trackers.add(null);
        }
    }

    public void registerTracker(int fpId, ConnectionTracker tracker) {
        lock.writeLock().lock();
        try {
            if (fpId < trackers.size()) {
                trackers.set(fpId, tracker);
            }
        } finally {
            lock.writeLock().unlock();
        }
    }

    public GlobalStats getGlobalStats() {
        lock.readLock().lock();
        try {
            GlobalStats stats = new GlobalStats();
            Map<String, Long> domainCounts = new HashMap<>();
            for (ConnectionTracker tracker : trackers) {
                if (tracker == null) {
                    continue;
                }
                ConnectionTracker.TrackerStats trackerStats = tracker.getStats();
                stats.totalActiveConnections += trackerStats.activeConnections;
                stats.totalConnectionsSeen += trackerStats.totalConnectionsSeen;
                tracker.forEach(conn -> {
                    stats.appDistribution.merge(conn.appType, 1L, Long::sum);
                    if (!conn.sni.isEmpty()) {
                        domainCounts.merge(conn.sni, 1L, Long::sum);
                    }
                });
            }
            stats.topDomains = domainCounts.entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .limit(20)
                    .map(entry -> new DomainCount(entry.getKey(), entry.getValue()))
                    .toList();
            return stats;
        } finally {
            lock.readLock().unlock();
        }
    }

    public String generateReport() {
        GlobalStats stats = getGlobalStats();
        StringBuilder sb = new StringBuilder();
        sb.append("\n=== CONNECTION STATISTICS REPORT ===\n");
        sb.append(String.format("Active Connections:     %10d%n", stats.totalActiveConnections));
        sb.append(String.format("Total Connections Seen: %10d%n", stats.totalConnectionsSeen));
        sb.append("\nAPPLICATION BREAKDOWN\n");
        long total = stats.appDistribution.values().stream().mapToLong(Long::longValue).sum();
        stats.appDistribution.entrySet().stream()
                .sorted(Map.Entry.<AppType, Long>comparingByValue(Comparator.reverseOrder()))
                .forEach(entry -> {
                    double pct = total > 0 ? 100.0 * entry.getValue() / total : 0;
                    sb.append(String.format("%-20s %10d (%5.1f%%)%n",
                            TypeUtils.appTypeToString(entry.getKey()), entry.getValue(), pct));
                });
        if (!stats.topDomains.isEmpty()) {
            sb.append("\nTOP DOMAINS\n");
            for (DomainCount domain : stats.topDomains) {
                sb.append(String.format("%-40s %10d%n", domain.domain(), domain.count()));
            }
        }
        return sb.toString();
    }

    public static class GlobalStats {
        public long totalActiveConnections;
        public long totalConnectionsSeen;
        public Map<AppType, Long> appDistribution = new EnumMap<>(AppType.class);
        public List<DomainCount> topDomains = List.of();
    }

    public record DomainCount(String domain, long count) {
    }
}
