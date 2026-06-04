package com.packetanalyzer.pcap;

public final class PacketParser {
    private PacketParser() {
    }

    public static final class TCPFlags {
        public static final int FIN = 0x01;
        public static final int SYN = 0x02;
        public static final int RST = 0x04;
        public static final int PSH = 0x08;
        public static final int ACK = 0x10;
        public static final int URG = 0x20;

        private TCPFlags() {
        }
    }

    public static final class Protocol {
        public static final int ICMP = 1;
        public static final int TCP = 6;
        public static final int UDP = 17;

        private Protocol() {
        }
    }

    public static final class EtherType {
        public static final int IPV4 = 0x0800;
        public static final int IPV6 = 0x86dd;
        public static final int ARP = 0x0806;

        private EtherType() {
        }
    }

    public static boolean parse(RawPacket raw, ParsedPacket parsed) {
        reset(parsed);
        parsed.timestampSec = raw.header.tsSec;
        parsed.timestampUsec = raw.header.tsUsec;
        int[] offset = {0};
        byte[] data = raw.data;

        if (!parseEthernet(data, parsed, offset)) {
            return false;
        }
        if (parsed.etherType == EtherType.IPV4) {
            if (!parseIPv4(data, parsed, offset)) {
                return false;
            }
            if (parsed.protocol == Protocol.TCP) {
                if (!parseTCP(data, parsed, offset)) {
                    return false;
                }
            } else if (parsed.protocol == Protocol.UDP) {
                if (!parseUDP(data, parsed, offset)) {
                    return false;
                }
            }
        }

        if (offset[0] < data.length) {
            parsed.payloadOffset = offset[0];
            parsed.payloadLength = data.length - offset[0];
        } else {
            parsed.payloadOffset = data.length;
            parsed.payloadLength = 0;
        }
        return true;
    }

    private static void reset(ParsedPacket p) {
        p.timestampSec = 0;
        p.timestampUsec = 0;
        p.srcMac = "";
        p.destMac = "";
        p.etherType = 0;
        p.hasIp = false;
        p.ipVersion = 0;
        p.srcIp = "";
        p.destIp = "";
        p.protocol = 0;
        p.ttl = 0;
        p.hasTcp = false;
        p.hasUdp = false;
        p.srcPort = 0;
        p.destPort = 0;
        p.tcpFlags = 0;
        p.seqNumber = 0;
        p.ackNumber = 0;
        p.payloadOffset = 0;
        p.payloadLength = 0;
    }

    private static boolean parseEthernet(byte[] data, ParsedPacket parsed, int[] offset) {
        if (data.length < 14) {
            return false;
        }
        parsed.destMac = macToString(data, 0);
        parsed.srcMac = macToString(data, 6);
        parsed.etherType = readUint16BE(data, 12);
        offset[0] = 14;
        return true;
    }

    private static boolean parseIPv4(byte[] data, ParsedPacket parsed, int[] offset) {
        if (data.length < offset[0] + 20) {
            return false;
        }
        int ipOffset = offset[0];
        int versionIhl = data[ipOffset] & 0xff;
        parsed.ipVersion = (versionIhl >> 4) & 0x0f;
        int ihl = versionIhl & 0x0f;
        if (parsed.ipVersion != 4) {
            return false;
        }
        int ipHeaderLen = ihl * 4;
        if (ipHeaderLen < 20 || data.length < offset[0] + ipHeaderLen) {
            return false;
        }
        parsed.ttl = data[ipOffset + 8] & 0xff;
        parsed.protocol = data[ipOffset + 9] & 0xff;
        parsed.srcIp = ipToString(data, ipOffset + 12);
        parsed.destIp = ipToString(data, ipOffset + 16);
        parsed.hasIp = true;
        offset[0] += ipHeaderLen;
        return true;
    }

    private static boolean parseTCP(byte[] data, ParsedPacket parsed, int[] offset) {
        if (data.length < offset[0] + 20) {
            return false;
        }
        int tcpOffset = offset[0];
        parsed.srcPort = readUint16BE(data, tcpOffset);
        parsed.destPort = readUint16BE(data, tcpOffset + 2);
        parsed.seqNumber = Integer.toUnsignedLong(readIntBE(data, tcpOffset + 4));
        parsed.ackNumber = Integer.toUnsignedLong(readIntBE(data, tcpOffset + 8));
        int dataOffset = ((data[tcpOffset + 12] & 0xff) >> 4) & 0x0f;
        int tcpHeaderLen = dataOffset * 4;
        parsed.tcpFlags = data[tcpOffset + 13] & 0xff;
        if (tcpHeaderLen < 20 || data.length < offset[0] + tcpHeaderLen) {
            return false;
        }
        parsed.hasTcp = true;
        offset[0] += tcpHeaderLen;
        return true;
    }

    private static boolean parseUDP(byte[] data, ParsedPacket parsed, int[] offset) {
        if (data.length < offset[0] + 8) {
            return false;
        }
        int udpOffset = offset[0];
        parsed.srcPort = readUint16BE(data, udpOffset);
        parsed.destPort = readUint16BE(data, udpOffset + 2);
        parsed.hasUdp = true;
        offset[0] += 8;
        return true;
    }

    public static String macToString(byte[] data, int offset) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            if (i > 0) {
                sb.append(':');
            }
            sb.append(String.format("%02x", data[offset + i] & 0xff));
        }
        return sb.toString();
    }

    public static String ipToString(byte[] data, int offset) {
        return (data[offset] & 0xff) + "."
                + (data[offset + 1] & 0xff) + "."
                + (data[offset + 2] & 0xff) + "."
                + (data[offset + 3] & 0xff);
    }

    public static String ipToString(int ip) {
        return (ip & 0xff) + "."
                + ((ip >>> 8) & 0xff) + "."
                + ((ip >>> 16) & 0xff) + "."
                + ((ip >>> 24) & 0xff);
    }

    public static int parseIP(String ip) {
        int result = 0;
        int octet = 0;
        int shift = 0;
        for (int i = 0; i < ip.length(); i++) {
            char c = ip.charAt(i);
            if (c == '.') {
                result |= octet << shift;
                shift += 8;
                octet = 0;
            } else if (c >= '0' && c <= '9') {
                octet = octet * 10 + (c - '0');
            }
        }
        return result | (octet << shift);
    }

    public static String protocolToString(int protocol) {
        return switch (protocol) {
            case Protocol.ICMP -> "ICMP";
            case Protocol.TCP -> "TCP";
            case Protocol.UDP -> "UDP";
            default -> "Unknown(" + protocol + ")";
        };
    }

    public static String tcpFlagsToString(int flags) {
        StringBuilder result = new StringBuilder();
        if ((flags & TCPFlags.SYN) != 0) result.append("SYN ");
        if ((flags & TCPFlags.ACK) != 0) result.append("ACK ");
        if ((flags & TCPFlags.FIN) != 0) result.append("FIN ");
        if ((flags & TCPFlags.RST) != 0) result.append("RST ");
        if ((flags & TCPFlags.PSH) != 0) result.append("PSH ");
        if ((flags & TCPFlags.URG) != 0) result.append("URG ");
        if (result.length() == 0) {
            return "none";
        }
        result.setLength(result.length() - 1);
        return result.toString();
    }

    public static int readUint16BE(byte[] data, int offset) {
        return ((data[offset] & 0xff) << 8) | (data[offset + 1] & 0xff);
    }

    public static int readUint24BE(byte[] data, int offset) {
        return ((data[offset] & 0xff) << 16) | ((data[offset + 1] & 0xff) << 8) | (data[offset + 2] & 0xff);
    }

    private static int readIntBE(byte[] data, int offset) {
        return ((data[offset] & 0xff) << 24)
                | ((data[offset + 1] & 0xff) << 16)
                | ((data[offset + 2] & 0xff) << 8)
                | (data[offset + 3] & 0xff);
    }
}
