package com.packetanalyzer.pcap;

public class RawPacket {
    public PcapPacketHeader header = new PcapPacketHeader();
    public byte[] data = new byte[0];
}
