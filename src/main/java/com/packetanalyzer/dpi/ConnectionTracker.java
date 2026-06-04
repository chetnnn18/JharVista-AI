package com.packetanalyzer.dpi;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

public class ConnectionTracker {
    private final int fpId;
    private final int maxConnections;
    private final Map<FiveTuple, Connection> connections = new HashMap<>();
    private long totalSeen;
    private long classifiedCount;
    private long blockedCount;

    public ConnectionTracker(int fpId) {
        this(fpId, 100000);
    }

    public ConnectionTracker(int fpId, int maxConnections) {
        this.fpId = fpId;
        this.maxConnections = maxConnections;
    }

    public synchronized Connection getOrCreateConnection(FiveTuple tuple) {
        Connection existing = connections.get(tuple);
        if (existing != null) {
            return existing;
        }
        if (connections.size() >= maxConnections) {
            evictOldest();
        }
        Connection conn = new Connection();
        conn.tuple = tuple.copy();
        conn.state = ConnectionState.NEW;
        conn.firstSeen = Instant.now();
        conn.lastSeen = conn.firstSeen;
        connections.put(tuple.copy(), conn);
        totalSeen++;
        return conn;
    }

    public synchronized Connection getConnection(FiveTuple tuple) {
        Connection conn = connections.get(tuple);
        if (conn != null) {
            return conn;
        }
        return connections.get(tuple.reverse());
    }

    public synchronized void updateConnection(Connection conn, int packetSize, boolean outbound) {
        if (conn == null) {
            return;
        }
        conn.lastSeen = Instant.now();
        if (outbound) {
            conn.packetsOut++;
            conn.bytesOut += packetSize;
        } else {
            conn.packetsIn++;
            conn.bytesIn += packetSize;
        }
    }

    public synchronized void classifyConnection(Connection conn, AppType app, String sni) {
        if (conn == null) {
            return;
        }
        if (conn.state != ConnectionState.CLASSIFIED) {
            conn.appType = app;
            conn.sni = sni == null ? "" : sni;
            conn.state = ConnectionState.CLASSIFIED;
            classifiedCount++;
        }
    }

    public synchronized void blockConnection(Connection conn) {
        if (conn == null) {
            return;
        }
        conn.state = ConnectionState.BLOCKED;
        conn.action = PacketAction.DROP;
        blockedCount++;
    }

    public synchronized void closeConnection(FiveTuple tuple) {
        Connection conn = connections.get(tuple);
        if (conn != null) {
            conn.state = ConnectionState.CLOSED;
        }
    }

    public synchronized int cleanupStale(Duration timeout) {
        Instant now = Instant.now();
        int before = connections.size();
        connections.entrySet().removeIf(entry ->
                Duration.between(entry.getValue().lastSeen, now).compareTo(timeout) > 0
                        || entry.getValue().state == ConnectionState.CLOSED);
        return before - connections.size();
    }

    public synchronized List<Connection> getAllConnections() {
        List<Connection> result = new ArrayList<>();
        for (Connection conn : connections.values()) {
            result.add(conn.copy());
        }
        return result;
    }

    public synchronized int getActiveCount() {
        return connections.size();
    }

    public synchronized TrackerStats getStats() {
        TrackerStats stats = new TrackerStats();
        stats.activeConnections = connections.size();
        stats.totalConnectionsSeen = totalSeen;
        stats.classifiedConnections = classifiedCount;
        stats.blockedConnections = blockedCount;
        return stats;
    }

    public synchronized void clear() {
        connections.clear();
    }

    public synchronized void forEach(Consumer<Connection> callback) {
        for (Connection conn : connections.values()) {
            callback.accept(conn.copy());
        }
    }

    private void evictOldest() {
        connections.entrySet().stream()
                .min(Comparator.comparing(entry -> entry.getValue().lastSeen))
                .ifPresent(entry -> connections.remove(entry.getKey()));
    }

    public static class TrackerStats {
        public long activeConnections;
        public long totalConnectionsSeen;
        public long classifiedConnections;
        public long blockedConnections;
    }
}
