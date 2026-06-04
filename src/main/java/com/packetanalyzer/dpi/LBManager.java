package com.packetanalyzer.dpi;

import java.util.ArrayList;
import java.util.List;

public class LBManager {
    private final List<LoadBalancer> lbs = new ArrayList<>();
    private final int fpsPerLb;

    public LBManager(int numLbs, int fpsPerLb, List<ThreadSafeQueue<PacketJob>> fpQueues) {
        this.fpsPerLb = fpsPerLb;
        for (int lbId = 0; lbId < numLbs; lbId++) {
            List<ThreadSafeQueue<PacketJob>> lbFpQueues = new ArrayList<>();
            int fpStart = lbId * fpsPerLb;
            for (int i = 0; i < fpsPerLb; i++) {
                lbFpQueues.add(fpQueues.get(fpStart + i));
            }
            lbs.add(new LoadBalancer(lbId, lbFpQueues, fpStart));
        }
        System.out.println("[LBManager] Created " + numLbs + " load balancers, " + fpsPerLb + " FPs each");
    }

    public void startAll() {
        lbs.forEach(LoadBalancer::start);
    }

    public void stopAll() {
        lbs.forEach(LoadBalancer::stop);
    }

    public LoadBalancer getLBForPacket(FiveTuple tuple) {
        int lbIndex = Math.floorMod(tuple.hashCode(), lbs.size());
        return lbs.get(lbIndex);
    }

    public LoadBalancer getLB(int id) {
        return lbs.get(id);
    }

    public int getNumLBs() {
        return lbs.size();
    }

    public AggregatedStats getAggregatedStats() {
        AggregatedStats stats = new AggregatedStats();
        for (LoadBalancer lb : lbs) {
            LoadBalancer.LBStats lbStats = lb.getStats();
            stats.totalReceived += lbStats.packetsReceived;
            stats.totalDispatched += lbStats.packetsDispatched;
        }
        return stats;
    }

    public static class AggregatedStats {
        public long totalReceived;
        public long totalDispatched;
    }
}
