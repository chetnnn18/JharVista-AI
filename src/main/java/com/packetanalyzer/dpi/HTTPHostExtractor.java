package com.packetanalyzer.dpi;

import java.nio.charset.StandardCharsets;
import java.util.Optional;

public final class HTTPHostExtractor {
    private HTTPHostExtractor() {
    }

    public static boolean isHTTPRequest(byte[] payload, int offset, int length) {
        if (length < 4 || offset + length > payload.length) {
            return false;
        }
        String prefix = new String(payload, offset, 4, StandardCharsets.US_ASCII);
        return prefix.equals("GET ")
                || prefix.equals("POST")
                || prefix.equals("PUT ")
                || prefix.equals("HEAD")
                || prefix.equals("DELE")
                || prefix.equals("PATC")
                || prefix.equals("OPTI");
    }

    public static Optional<String> extract(byte[] payload, int offset, int length) {
        if (!isHTTPRequest(payload, offset, length)) {
            return Optional.empty();
        }
        int endLimit = offset + length;
        for (int i = offset; i + 5 < endLimit; i++) {
            if (equalsIgnoreCase(payload[i], 'h')
                    && equalsIgnoreCase(payload[i + 1], 'o')
                    && equalsIgnoreCase(payload[i + 2], 's')
                    && equalsIgnoreCase(payload[i + 3], 't')
                    && payload[i + 4] == ':') {
                int start = i + 5;
                while (start < endLimit && (payload[start] == ' ' || payload[start] == '\t')) {
                    start++;
                }
                int end = start;
                while (end < endLimit && payload[end] != '\r' && payload[end] != '\n') {
                    end++;
                }
                if (end > start) {
                    String host = new String(payload, start, end - start, StandardCharsets.US_ASCII);
                    int colon = host.indexOf(':');
                    if (colon >= 0) {
                        host = host.substring(0, colon);
                    }
                    return Optional.of(host);
                }
            }
        }
        return Optional.empty();
    }

    private static boolean equalsIgnoreCase(byte value, char expectedLower) {
        int c = value & 0xff;
        return c == expectedLower || c == Character.toUpperCase(expectedLower);
    }
}
