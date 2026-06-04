package com.packetanalyzer.dpi;

import java.util.Arrays;

public class PacketJob {
    public long packetId;
    public FiveTuple tuple = new FiveTuple();
    public byte[] data = new byte[0];
    public int ethOffset;
    public int ipOffset;
    public int transportOffset;
    public int payloadOffset;
    public int payloadLength;
    public int tcpFlags;
    public long tsSec;
    public long tsUsec;

    public PacketJob copy() {
        PacketJob copy = new PacketJob();
        copy.packetId = packetId;
        copy.tuple = tuple.copy();
        copy.data = Arrays.copyOf(data, data.length);
        copy.ethOffset = ethOffset;
        copy.ipOffset = ipOffset;
        copy.transportOffset = transportOffset;
        copy.payloadOffset = payloadOffset;
        copy.payloadLength = payloadLength;
        copy.tcpFlags = tcpFlags;
        copy.tsSec = tsSec;
        copy.tsUsec = tsUsec;
        return copy;
    }
}
