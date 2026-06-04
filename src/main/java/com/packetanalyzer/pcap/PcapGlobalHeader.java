package com.packetanalyzer.pcap;

import java.nio.ByteOrder;

public class PcapGlobalHeader {
    public int magicNumber;
    public int versionMajor;
    public int versionMinor;
    public int thiszone;
    public long sigfigs;
    public long snaplen;
    public long network;
    public ByteOrder byteOrder = ByteOrder.LITTLE_ENDIAN;

    public boolean isEthernet() {
        return network == 1;
    }
}
