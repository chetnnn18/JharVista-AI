package com.packetanalyzer.dpi;

import com.packetanalyzer.pcap.PacketParser;
import com.packetanalyzer.pcap.ParsedPacket;
import com.packetanalyzer.pcap.PcapReader;
import com.packetanalyzer.pcap.RawPacket;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public final class PacketAnalyzerMain {
    private PacketAnalyzerMain() {
    }

    public static void main(String[] args) {
        if (args.length < 1) {
            printUsage();
            System.exit(1);
        }
        String filename = args[0];
        int maxPackets = args.length >= 2 ? Integer.parseInt(args[1]) : -1;

        System.out.println("====================================");
        System.out.println("     Packet Analyzer v1.0");
        System.out.println("====================================\n");

        PcapReader reader = new PcapReader();
        if (!reader.open(filename)) {
            System.exit(1);
        }

        RawPacket raw = new RawPacket();
        ParsedPacket parsed = new ParsedPacket();
        int packetCount = 0;
        int parseErrors = 0;

        while (reader.readNextPacket(raw)) {
            packetCount++;
            if (PacketParser.parse(raw, parsed)) {
                printPacketSummary(parsed, raw.data, packetCount);
            } else {
                System.err.println("Warning: Failed to parse packet #" + packetCount);
                parseErrors++;
            }
            if (maxPackets > 0 && packetCount >= maxPackets) {
                System.out.println("\n(Stopped after " + maxPackets + " packets)");
                break;
            }
        }

        System.out.println("\n====================================");
        System.out.println("Summary:");
        System.out.println("  Total packets read:  " + packetCount);
        System.out.println("  Parse errors:        " + parseErrors);
        System.out.println("====================================");
        reader.close();
    }

    private static void printPacketSummary(ParsedPacket pkt, byte[] data, int packetNum) {
        String time = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
                .withZone(ZoneId.systemDefault())
                .format(Instant.ofEpochSecond(pkt.timestampSec));
        System.out.println("\n========== Packet #" + packetNum + " ==========");
        System.out.printf("Time: %s.%06d%n", time, pkt.timestampUsec);
        System.out.println("\n[Ethernet]");
        System.out.println("  Source MAC:      " + pkt.srcMac);
        System.out.println("  Destination MAC: " + pkt.destMac);
        System.out.printf("  EtherType:       0x%04x%n", pkt.etherType);

        if (pkt.hasIp) {
            System.out.println("\n[IPv" + pkt.ipVersion + "]");
            System.out.println("  Source IP:      " + pkt.srcIp);
            System.out.println("  Destination IP: " + pkt.destIp);
            System.out.println("  Protocol:       " + PacketParser.protocolToString(pkt.protocol));
            System.out.println("  TTL:            " + pkt.ttl);
        }
        if (pkt.hasTcp) {
            System.out.println("\n[TCP]");
            System.out.println("  Source Port:      " + pkt.srcPort);
            System.out.println("  Destination Port: " + pkt.destPort);
            System.out.println("  Sequence Number:  " + pkt.seqNumber);
            System.out.println("  Ack Number:       " + pkt.ackNumber);
            System.out.println("  Flags:            " + PacketParser.tcpFlagsToString(pkt.tcpFlags));
        }
        if (pkt.hasUdp) {
            System.out.println("\n[UDP]");
            System.out.println("  Source Port:      " + pkt.srcPort);
            System.out.println("  Destination Port: " + pkt.destPort);
        }
        if (pkt.payloadLength > 0) {
            System.out.println("\n[Payload]");
            System.out.println("  Length: " + pkt.payloadLength + " bytes");
            System.out.print("  Preview: ");
            int previewLen = Math.min(pkt.payloadLength, 32);
            for (int i = 0; i < previewLen; i++) {
                System.out.printf("%02x ", data[pkt.payloadOffset + i] & 0xff);
            }
            if (pkt.payloadLength > 32) {
                System.out.print("...");
            }
            System.out.println();
        }
    }

    private static void printUsage() {
        System.out.println("Usage: java -cp target/dpi-engine-1.0.0.jar com.packetanalyzer.dpi.PacketAnalyzerMain <pcap_file> [max_packets]");
    }
}
