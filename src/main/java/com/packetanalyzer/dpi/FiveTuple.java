package com.packetanalyzer.dpi;

import java.util.Objects;

public class FiveTuple {
    public int srcIp;
    public int dstIp;
    public int srcPort;
    public int dstPort;
    public int protocol;

    public FiveTuple() {
    }

    public FiveTuple(int srcIp, int dstIp, int srcPort, int dstPort, int protocol) {
        this.srcIp = srcIp;
        this.dstIp = dstIp;
        this.srcPort = srcPort;
        this.dstPort = dstPort;
        this.protocol = protocol;
    }

    public FiveTuple reverse() {
        return new FiveTuple(dstIp, srcIp, dstPort, srcPort, protocol);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FiveTuple that)) return false;
        return srcIp == that.srcIp
                && dstIp == that.dstIp
                && srcPort == that.srcPort
                && dstPort == that.dstPort
                && protocol == that.protocol;
    }

    @Override
    public int hashCode() {
        int h = 0;
        h ^= Integer.hashCode(srcIp) + 0x9e3779b9 + (h << 6) + (h >>> 2);
        h ^= Integer.hashCode(dstIp) + 0x9e3779b9 + (h << 6) + (h >>> 2);
        h ^= Integer.hashCode(srcPort) + 0x9e3779b9 + (h << 6) + (h >>> 2);
        h ^= Integer.hashCode(dstPort) + 0x9e3779b9 + (h << 6) + (h >>> 2);
        h ^= Integer.hashCode(protocol) + 0x9e3779b9 + (h << 6) + (h >>> 2);
        return h;
    }

    @Override
    public String toString() {
        return TypeUtils.ipToString(srcIp) + ":" + srcPort
                + " -> " + TypeUtils.ipToString(dstIp) + ":" + dstPort
                + " (" + (protocol == 6 ? "TCP" : protocol == 17 ? "UDP" : "?") + ")";
    }

    public FiveTuple copy() {
        return new FiveTuple(srcIp, dstIp, srcPort, dstPort, protocol);
    }
}
