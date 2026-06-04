package com.packetanalyzer.dpi;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class RuleManager {
    private final ReentrantReadWriteLock ipLock = new ReentrantReadWriteLock();
    private final Set<Integer> blockedIps = new HashSet<>();

    private final ReentrantReadWriteLock appLock = new ReentrantReadWriteLock();
    private final EnumSet<AppType> blockedApps = EnumSet.noneOf(AppType.class);

    private final ReentrantReadWriteLock domainLock = new ReentrantReadWriteLock();
    private final Set<String> blockedDomains = new HashSet<>();
    private final List<String> domainPatterns = new ArrayList<>();

    private final ReentrantReadWriteLock portLock = new ReentrantReadWriteLock();
    private final Set<Integer> blockedPorts = new HashSet<>();

    public void blockIP(int ip) {
        ipLock.writeLock().lock();
        try {
            blockedIps.add(ip);
        } finally {
            ipLock.writeLock().unlock();
        }
        System.out.println("[RuleManager] Blocked IP: " + TypeUtils.ipToString(ip));
    }

    public void blockIP(String ip) {
        blockIP(TypeUtils.parseIP(ip));
    }

    public void unblockIP(int ip) {
        ipLock.writeLock().lock();
        try {
            blockedIps.remove(ip);
        } finally {
            ipLock.writeLock().unlock();
        }
        System.out.println("[RuleManager] Unblocked IP: " + TypeUtils.ipToString(ip));
    }

    public void unblockIP(String ip) {
        unblockIP(TypeUtils.parseIP(ip));
    }

    public boolean isIPBlocked(int ip) {
        ipLock.readLock().lock();
        try {
            return blockedIps.contains(ip);
        } finally {
            ipLock.readLock().unlock();
        }
    }

    public List<String> getBlockedIPs() {
        ipLock.readLock().lock();
        try {
            List<String> result = new ArrayList<>();
            for (int ip : blockedIps) {
                result.add(TypeUtils.ipToString(ip));
            }
            return result;
        } finally {
            ipLock.readLock().unlock();
        }
    }

    public void blockApp(AppType app) {
        appLock.writeLock().lock();
        try {
            blockedApps.add(app);
        } finally {
            appLock.writeLock().unlock();
        }
        System.out.println("[RuleManager] Blocked app: " + TypeUtils.appTypeToString(app));
    }

    public void unblockApp(AppType app) {
        appLock.writeLock().lock();
        try {
            blockedApps.remove(app);
        } finally {
            appLock.writeLock().unlock();
        }
        System.out.println("[RuleManager] Unblocked app: " + TypeUtils.appTypeToString(app));
    }

    public boolean isAppBlocked(AppType app) {
        appLock.readLock().lock();
        try {
            return blockedApps.contains(app);
        } finally {
            appLock.readLock().unlock();
        }
    }

    public List<AppType> getBlockedApps() {
        appLock.readLock().lock();
        try {
            return new ArrayList<>(blockedApps);
        } finally {
            appLock.readLock().unlock();
        }
    }

    public void blockDomain(String domain) {
        domainLock.writeLock().lock();
        try {
            if (domain.contains("*")) {
                domainPatterns.add(domain);
            } else {
                blockedDomains.add(domain);
            }
        } finally {
            domainLock.writeLock().unlock();
        }
        System.out.println("[RuleManager] Blocked domain: " + domain);
    }

    public void unblockDomain(String domain) {
        domainLock.writeLock().lock();
        try {
            if (domain.contains("*")) {
                domainPatterns.remove(domain);
            } else {
                blockedDomains.remove(domain);
            }
        } finally {
            domainLock.writeLock().unlock();
        }
        System.out.println("[RuleManager] Unblocked domain: " + domain);
    }

    public boolean isDomainBlocked(String domain) {
        domainLock.readLock().lock();
        try {
            if (blockedDomains.contains(domain)) {
                return true;
            }
            String lowerDomain = domain.toLowerCase(Locale.ROOT);
            for (String pattern : domainPatterns) {
                if (domainMatchesPattern(lowerDomain, pattern.toLowerCase(Locale.ROOT))) {
                    return true;
                }
            }
            return false;
        } finally {
            domainLock.readLock().unlock();
        }
    }

    public List<String> getBlockedDomains() {
        domainLock.readLock().lock();
        try {
            List<String> result = new ArrayList<>(blockedDomains);
            result.addAll(domainPatterns);
            return result;
        } finally {
            domainLock.readLock().unlock();
        }
    }

    public void blockPort(int port) {
        portLock.writeLock().lock();
        try {
            blockedPorts.add(port);
        } finally {
            portLock.writeLock().unlock();
        }
        System.out.println("[RuleManager] Blocked port: " + port);
    }

    public void unblockPort(int port) {
        portLock.writeLock().lock();
        try {
            blockedPorts.remove(port);
        } finally {
            portLock.writeLock().unlock();
        }
    }

    public boolean isPortBlocked(int port) {
        portLock.readLock().lock();
        try {
            return blockedPorts.contains(port);
        } finally {
            portLock.readLock().unlock();
        }
    }

    public Optional<BlockReason> shouldBlock(int srcIp, int dstPort, AppType app, String domain) {
        if (isIPBlocked(srcIp)) {
            return Optional.of(new BlockReason(BlockReason.Type.IP, TypeUtils.ipToString(srcIp)));
        }
        if (isPortBlocked(dstPort)) {
            return Optional.of(new BlockReason(BlockReason.Type.PORT, Integer.toString(dstPort)));
        }
        if (isAppBlocked(app)) {
            return Optional.of(new BlockReason(BlockReason.Type.APP, TypeUtils.appTypeToString(app)));
        }
        if (domain != null && !domain.isEmpty() && isDomainBlocked(domain)) {
            return Optional.of(new BlockReason(BlockReason.Type.DOMAIN, domain));
        }
        return Optional.empty();
    }

    public boolean saveRules(String filename) {
        try (BufferedWriter writer = Files.newBufferedWriter(Path.of(filename))) {
            writer.write("[BLOCKED_IPS]\n");
            for (String ip : getBlockedIPs()) {
                writer.write(ip);
                writer.write('\n');
            }
            writer.write("\n[BLOCKED_APPS]\n");
            for (AppType app : getBlockedApps()) {
                writer.write(TypeUtils.appTypeToString(app));
                writer.write('\n');
            }
            writer.write("\n[BLOCKED_DOMAINS]\n");
            for (String domain : getBlockedDomains()) {
                writer.write(domain);
                writer.write('\n');
            }
            writer.write("\n[BLOCKED_PORTS]\n");
            portLock.readLock().lock();
            try {
                for (int port : blockedPorts) {
                    writer.write(Integer.toString(port));
                    writer.write('\n');
                }
            } finally {
                portLock.readLock().unlock();
            }
            System.out.println("[RuleManager] Rules saved to: " + filename);
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    public boolean loadRules(String filename) {
        try (BufferedReader reader = Files.newBufferedReader(Path.of(filename))) {
            String section = "";
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.isEmpty()) {
                    continue;
                }
                if (line.charAt(0) == '[') {
                    section = line;
                    continue;
                }
                switch (section) {
                    case "[BLOCKED_IPS]" -> blockIP(line);
                    case "[BLOCKED_APPS]" -> {
                        AppType app = AppType.fromDisplayName(line);
                        if (app != null) {
                            blockApp(app);
                        }
                    }
                    case "[BLOCKED_DOMAINS]" -> blockDomain(line);
                    case "[BLOCKED_PORTS]" -> blockPort(Integer.parseInt(line));
                    default -> {
                    }
                }
            }
            System.out.println("[RuleManager] Rules loaded from: " + filename);
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    public void clearAll() {
        ipLock.writeLock().lock();
        appLock.writeLock().lock();
        domainLock.writeLock().lock();
        portLock.writeLock().lock();
        try {
            blockedIps.clear();
            blockedApps.clear();
            blockedDomains.clear();
            domainPatterns.clear();
            blockedPorts.clear();
        } finally {
            portLock.writeLock().unlock();
            domainLock.writeLock().unlock();
            appLock.writeLock().unlock();
            ipLock.writeLock().unlock();
        }
        System.out.println("[RuleManager] All rules cleared");
    }

    public RuleStats getStats() {
        RuleStats stats = new RuleStats();
        ipLock.readLock().lock();
        try {
            stats.blockedIps = blockedIps.size();
        } finally {
            ipLock.readLock().unlock();
        }
        appLock.readLock().lock();
        try {
            stats.blockedApps = blockedApps.size();
        } finally {
            appLock.readLock().unlock();
        }
        domainLock.readLock().lock();
        try {
            stats.blockedDomains = blockedDomains.size() + domainPatterns.size();
        } finally {
            domainLock.readLock().unlock();
        }
        portLock.readLock().lock();
        try {
            stats.blockedPorts = blockedPorts.size();
        } finally {
            portLock.readLock().unlock();
        }
        return stats;
    }

    private static boolean domainMatchesPattern(String domain, String pattern) {
        if (pattern.length() >= 2 && pattern.charAt(0) == '*' && pattern.charAt(1) == '.') {
            String suffix = pattern.substring(1);
            if (domain.length() >= suffix.length() && domain.endsWith(suffix)) {
                return true;
            }
            return domain.equals(pattern.substring(2));
        }
        return false;
    }

    public record BlockReason(Type type, String detail) {
        public enum Type {
            IP,
            APP,
            DOMAIN,
            PORT
        }
    }

    public static class RuleStats {
        public int blockedIps;
        public int blockedApps;
        public int blockedDomains;
        public int blockedPorts;
    }
}
