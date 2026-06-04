package com.packetanalyzer.dpi;

import com.packetanalyzer.pcap.PacketParser;

import java.nio.charset.StandardCharsets;
import java.util.Optional;

public final class SNIExtractor {
    private static final int CONTENT_TYPE_HANDSHAKE = 0x16;
    private static final int HANDSHAKE_CLIENT_HELLO = 0x01;
    private static final int EXTENSION_SNI = 0x0000;
    private static final int SNI_TYPE_HOSTNAME = 0x00;

    private SNIExtractor() {
    }

    public static boolean isTLSClientHello(byte[] payload, int offset, int length) {
        if (length < 9 || offset < 0 || offset + length > payload.length) {
            return false;
        }
        if ((payload[offset] & 0xff) != CONTENT_TYPE_HANDSHAKE) {
            return false;
        }
        int version = PacketParser.readUint16BE(payload, offset + 1);
        if (version < 0x0300 || version > 0x0304) {
            return false;
        }
        int recordLength = PacketParser.readUint16BE(payload, offset + 3);
        if (recordLength > length - 5) {
            return false;
        }
        return (payload[offset + 5] & 0xff) == HANDSHAKE_CLIENT_HELLO;
    }

    public static Optional<String> extract(byte[] payload, int offset, int length) {
        if (!isTLSClientHello(payload, offset, length)) {
            return Optional.empty();
        }

        int end = offset + length;
        int cursor = offset + 5;
        cursor += 4;
        cursor += 2;
        cursor += 32;

        if (cursor >= end) {
            return Optional.empty();
        }
        int sessionIdLength = payload[cursor] & 0xff;
        cursor += 1 + sessionIdLength;

        if (cursor + 2 > end) {
            return Optional.empty();
        }
        int cipherSuitesLength = PacketParser.readUint16BE(payload, cursor);
        cursor += 2 + cipherSuitesLength;

        if (cursor >= end) {
            return Optional.empty();
        }
        int compressionMethodsLength = payload[cursor] & 0xff;
        cursor += 1 + compressionMethodsLength;

        if (cursor + 2 > end) {
            return Optional.empty();
        }
        int extensionsLength = PacketParser.readUint16BE(payload, cursor);
        cursor += 2;
        int extensionsEnd = Math.min(cursor + extensionsLength, end);

        while (cursor + 4 <= extensionsEnd) {
            int extensionType = PacketParser.readUint16BE(payload, cursor);
            int extensionLength = PacketParser.readUint16BE(payload, cursor + 2);
            cursor += 4;
            if (cursor + extensionLength > extensionsEnd) {
                break;
            }

            if (extensionType == EXTENSION_SNI) {
                if (extensionLength < 5) {
                    break;
                }
                int sniListLength = PacketParser.readUint16BE(payload, cursor);
                if (sniListLength < 3) {
                    break;
                }
                int sniType = payload[cursor + 2] & 0xff;
                int sniLength = PacketParser.readUint16BE(payload, cursor + 3);
                if (sniType != SNI_TYPE_HOSTNAME || sniLength > extensionLength - 5) {
                    break;
                }
                return Optional.of(new String(payload, cursor + 5, sniLength, StandardCharsets.US_ASCII));
            }
            cursor += extensionLength;
        }

        return Optional.empty();
    }
}
