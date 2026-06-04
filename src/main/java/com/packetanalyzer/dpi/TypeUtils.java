package com.packetanalyzer.dpi;

import java.util.Locale;

public final class TypeUtils {
    private TypeUtils() {
    }

    public static String appTypeToString(AppType type) {
        return type == null ? "Unknown" : type.displayName();
    }

    public static AppType sniToAppType(String sni) {
        if (sni == null || sni.isEmpty()) {
            return AppType.UNKNOWN;
        }
        String lower = sni.toLowerCase(Locale.ROOT);

        if (containsAny(lower, "google", "gstatic", "googleapis", "ggpht", "gvt1")) {
            return AppType.GOOGLE;
        }
        if (containsAny(lower, "youtube", "ytimg", "youtu.be", "yt3.ggpht")) {
            return AppType.YOUTUBE;
        }
        if (containsAny(lower, "facebook", "fbcdn", "fb.com", "fbsbx", "meta.com")) {
            return AppType.FACEBOOK;
        }
        if (containsAny(lower, "instagram", "cdninstagram")) {
            return AppType.INSTAGRAM;
        }
        if (containsAny(lower, "whatsapp", "wa.me")) {
            return AppType.WHATSAPP;
        }
        if (containsAny(lower, "twitter", "twimg", "x.com", "t.co")) {
            return AppType.TWITTER;
        }
        if (containsAny(lower, "netflix", "nflxvideo", "nflximg")) {
            return AppType.NETFLIX;
        }
        if (containsAny(lower, "amazon", "amazonaws", "cloudfront", "aws")) {
            return AppType.AMAZON;
        }
        if (containsAny(lower, "microsoft", "msn.com", "office", "azure", "live.com", "outlook", "bing")) {
            return AppType.MICROSOFT;
        }
        if (containsAny(lower, "apple", "icloud", "mzstatic", "itunes")) {
            return AppType.APPLE;
        }
        if (containsAny(lower, "telegram", "t.me")) {
            return AppType.TELEGRAM;
        }
        if (containsAny(lower, "tiktok", "tiktokcdn", "musical.ly", "bytedance")) {
            return AppType.TIKTOK;
        }
        if (containsAny(lower, "spotify", "scdn.co")) {
            return AppType.SPOTIFY;
        }
        if (lower.contains("zoom")) {
            return AppType.ZOOM;
        }
        if (containsAny(lower, "discord", "discordapp")) {
            return AppType.DISCORD;
        }
        if (containsAny(lower, "github", "githubusercontent")) {
            return AppType.GITHUB;
        }
        if (containsAny(lower, "cloudflare", "cf-")) {
            return AppType.CLOUDFLARE;
        }
        return AppType.HTTPS;
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

    public static String ipToString(int ip) {
        return (ip & 0xff) + "."
                + ((ip >>> 8) & 0xff) + "."
                + ((ip >>> 16) & 0xff) + "."
                + ((ip >>> 24) & 0xff);
    }

    private static boolean containsAny(String value, String... needles) {
        for (String needle : needles) {
            if (value.contains(needle)) {
                return true;
            }
        }
        return false;
    }
}
