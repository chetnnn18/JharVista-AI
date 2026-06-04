package com.packetanalyzer.pcap;

import java.io.BufferedInputStream;
import java.io.Closeable;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.file.Files;
import java.nio.file.Path;

public class PcapReader implements Closeable {
    private BufferedInputStream input;
    private final PcapGlobalHeader globalHeader = new PcapGlobalHeader();
    private boolean open;
    private boolean needsByteSwap;

    public boolean open(String filename) {
        close();
        try {
            input = new BufferedInputStream(Files.newInputStream(Path.of(filename)));
            byte[] magic = readFully(4);
            if (magic == null) {
                System.err.println("Error: Could not read PCAP magic number");
                close();
                return false;
            }

            if ((magic[0] & 0xff) == 0xd4 && (magic[1] & 0xff) == 0xc3
                    && (magic[2] & 0xff) == 0xb2 && (magic[3] & 0xff) == 0xa1) {
                globalHeader.byteOrder = ByteOrder.LITTLE_ENDIAN;
                globalHeader.magicNumber = 0xa1b2c3d4;
                needsByteSwap = false;
            } else if ((magic[0] & 0xff) == 0xa1 && (magic[1] & 0xff) == 0xb2
                    && (magic[2] & 0xff) == 0xc3 && (magic[3] & 0xff) == 0xd4) {
                globalHeader.byteOrder = ByteOrder.BIG_ENDIAN;
                globalHeader.magicNumber = 0xa1b2c3d4;
                needsByteSwap = true;
            } else {
                System.err.printf("Error: Invalid PCAP magic number: %02x%02x%02x%02x%n",
                        magic[0] & 0xff, magic[1] & 0xff, magic[2] & 0xff, magic[3] & 0xff);
                close();
                return false;
            }

            byte[] rest = readFully(20);
            if (rest == null) {
                System.err.println("Error: Could not read PCAP global header");
                close();
                return false;
            }
            ByteBuffer b = ByteBuffer.wrap(rest).order(globalHeader.byteOrder);
            globalHeader.versionMajor = Short.toUnsignedInt(b.getShort());
            globalHeader.versionMinor = Short.toUnsignedInt(b.getShort());
            globalHeader.thiszone = b.getInt();
            globalHeader.sigfigs = Integer.toUnsignedLong(b.getInt());
            globalHeader.snaplen = Integer.toUnsignedLong(b.getInt());
            globalHeader.network = Integer.toUnsignedLong(b.getInt());
            open = true;

            System.out.println("Opened PCAP file: " + filename);
            System.out.println("  Version: " + globalHeader.versionMajor + "." + globalHeader.versionMinor);
            System.out.println("  Snaplen: " + globalHeader.snaplen + " bytes");
            System.out.println("  Link type: " + globalHeader.network + (globalHeader.isEthernet() ? " (Ethernet)" : ""));
            return true;
        } catch (IOException e) {
            System.err.println("Error: Could not open file: " + filename);
            close();
            return false;
        }
    }

    public boolean readNextPacket(RawPacket packet) {
        if (!open || input == null) {
            return false;
        }
        try {
            byte[] headerBytes = readFully(16);
            if (headerBytes == null) {
                return false;
            }
            ByteBuffer b = ByteBuffer.wrap(headerBytes).order(globalHeader.byteOrder);
            packet.header = new PcapPacketHeader();
            packet.header.tsSec = Integer.toUnsignedLong(b.getInt());
            packet.header.tsUsec = Integer.toUnsignedLong(b.getInt());
            packet.header.inclLen = Integer.toUnsignedLong(b.getInt());
            packet.header.origLen = Integer.toUnsignedLong(b.getInt());

            if (packet.header.inclLen > globalHeader.snaplen || packet.header.inclLen > 65535) {
                System.err.println("Error: Invalid packet length: " + packet.header.inclLen);
                return false;
            }
            packet.data = readFully((int) packet.header.inclLen);
            if (packet.data == null) {
                System.err.println("Error: Could not read packet data");
                return false;
            }
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    public PcapGlobalHeader getGlobalHeader() {
        return globalHeader;
    }

    public boolean isOpen() {
        return open;
    }

    public boolean needsByteSwap() {
        return needsByteSwap;
    }

    private byte[] readFully(int length) throws IOException {
        byte[] data = new byte[length];
        int off = 0;
        while (off < length) {
            int read = input.read(data, off, length - off);
            if (read < 0) {
                return null;
            }
            off += read;
        }
        return data;
    }

    @Override
    public void close() {
        if (input != null) {
            try {
                input.close();
            } catch (IOException ignored) {
            }
        }
        input = null;
        open = false;
        needsByteSwap = false;
    }
}
