package com.packetanalyzer.dpi;

import java.util.Optional;

public final class QUICSNIExtractor {
    private QUICSNIExtractor() {
    }

    public static boolean isQUICInitial(byte[] payload, int offset, int length) {
        if (length < 5 || offset + length > payload.length) {
            return false;
        }
        int firstByte = payload[offset] & 0xff;
        return (firstByte & 0x80) != 0;
    }

    public static Optional<String> extract(byte[] payload, int offset, int length) {
        if (!isQUICInitial(payload, offset, length)) {
            return Optional.empty();
        }
        int end = offset + length;
        for (int i = offset; i + 50 < end; i++) {
            if ((payload[i] & 0xff) == 0x01 && i >= offset + 5) {
                Optional<String> result = SNIExtractor.extract(payload, i - 5, end - (i - 5));
                if (result.isPresent()) {
                    return result;
                }
            }
        }
        return Optional.empty();
    }
}
