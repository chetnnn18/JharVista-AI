package com.packetanalyzer.dpi;

import com.packetanalyzer.pcap.PacketParser;
import com.packetanalyzer.pcap.ParsedPacket;
import com.packetanalyzer.pcap.PcapReader;
import com.packetanalyzer.pcap.RawPacket;

public final class SimpleMain {
    private SimpleMain() {
    }

    public static void main(String[] args) {
        if (args.length < 1) {
            System.err.println("Usage: java -cp target/dpi-engine-1.0.0.jar com.packetanalyzer.dpi.SimpleMain <pcap_file>");
            System.exit(1);
        }

        PcapReader reader = new PcapReader();
        if (!reader.open(args[0])) {
            System.exit(1);
        }

        RawPacket raw = new RawPacket();
        ParsedPacket parsed = new ParsedPacket();
        int count = 0;
        int tlsCount = 0;

        System.out.println("Processing packets...");
        while (reader.readNextPacket(raw)) {
            count++;
            if (!PacketParser.parse(raw, parsed) || !parsed.hasIp) {
                continue;
            }
            System.out.print("Packet " + count + ": "
                    + parsed.srcIp + ":" + parsed.srcPort
                    + " -> " + parsed.destIp + ":" + parsed.destPort);
            if (parsed.hasTcp && parsed.destPort == 443 && parsed.payloadLength > 0) {
                var sni = SNIExtractor.extract(raw.data, parsed.payloadOffset, parsed.payloadLength);
                if (sni.isPresent()) {
                    System.out.print(" [SNI: " + sni.get() + "]");
                    tlsCount++;
                }
            }
            System.out.println();
        }

        System.out.println("\nTotal packets: " + count);
        System.out.println("SNI extracted: " + tlsCount);
        reader.close();
    }
}
