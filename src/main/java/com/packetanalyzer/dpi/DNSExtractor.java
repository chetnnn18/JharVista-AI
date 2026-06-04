package com.packetanalyzer.dpi;

import java.nio.charset.StandardCharsets;
import java.util.Optional;

public final class DNSExtractor {
    private DNSExtractor() {
    }

    public static boolean isDNSQuery(byte[] payload, int offset, int length) {
        if (length < 12 || offset + length > payload.length) {
            return false;
        }
        int flags = payload[offset + 2] & 0xff;
        if ((flags & 0x80) != 0) {
            return false;
        }
        int qdCount = ((payload[offset + 4] & 0xff) << 8) | (payload[offset + 5] & 0xff);
        return qdCount > 0;
    }

    public static Optional<String> extractQuery(byte[] payload, int offset, int length) {
        if (!isDNSQuery(payload, offset, length)) {
            return Optional.empty();
        }
        int cursor = offset + 12;
        int end = offset + length;
        StringBuilder domain = new StringBuilder();
        while (cursor < end) {
            int labelLength = payload[cursor] & 0xff;
            if (labelLength == 0) {
                break;
            }
            if (labelLength > 63) {
                break;
            }
            cursor++;
            if (cursor + labelLength > end) {
                break;
            }
            if (domain.length() > 0) {
                domain.append('.');
            }
            domain.append(new String(payload, cursor, labelLength, StandardCharsets.US_ASCII));
            cursor += labelLength;
        }
        return domain.length() == 0 ? Optional.empty() : Optional.of(domain.toString());
    }
}
