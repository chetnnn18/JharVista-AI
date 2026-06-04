package com.packetanalyzer.dpi;

import java.util.ArrayList;
import java.util.List;

public final class Main {
    private Main() {
    }

    public static void main(String[] args) {
        if (args.length < 2) {
            printUsage("java -jar target/dpi-engine-1.0.0.jar");
            System.exit(1);
        }

        String inputFile = args[0];
        String outputFile = args[1];

        DPIEngine.Config config = new DPIEngine.Config();
        List<String> blockIps = new ArrayList<>();
        List<String> blockApps = new ArrayList<>();
        List<String> blockDomains = new ArrayList<>();
        String rulesFile = "";

        for (int i = 2; i < args.length; i++) {
            String arg = args[i];
            if ("--block-ip".equals(arg) && i + 1 < args.length) {
                blockIps.add(args[++i]);
            } else if ("--block-app".equals(arg) && i + 1 < args.length) {
                blockApps.add(args[++i]);
            } else if ("--block-domain".equals(arg) && i + 1 < args.length) {
                blockDomains.add(args[++i]);
            } else if ("--rules".equals(arg) && i + 1 < args.length) {
                rulesFile = args[++i];
            } else if ("--lbs".equals(arg) && i + 1 < args.length) {
                config.numLoadBalancers = Integer.parseInt(args[++i]);
            } else if ("--fps".equals(arg) && i + 1 < args.length) {
                config.fpsPerLb = Integer.parseInt(args[++i]);
            } else if ("--verbose".equals(arg)) {
                config.verbose = true;
            } else if ("--help".equals(arg) || "-h".equals(arg)) {
                printUsage("java -jar target/dpi-engine-1.0.0.jar");
                return;
            }
        }

        DPIEngine engine = new DPIEngine(config);
        if (!engine.initialize()) {
            System.err.println("Failed to initialize DPI engine");
            System.exit(1);
        }

        if (!rulesFile.isEmpty()) {
            engine.loadRules(rulesFile);
        }
        for (String ip : blockIps) {
            engine.blockIP(ip);
        }
        for (String app : blockApps) {
            engine.blockApp(app);
        }
        for (String domain : blockDomains) {
            engine.blockDomain(domain);
        }

        if (!engine.processFile(inputFile, outputFile)) {
            System.err.println("Failed to process file");
            System.exit(1);
        }

        System.out.println("\nProcessing complete!");
        System.out.println("Output written to: " + outputFile);
    }

    private static void printUsage(String program) {
        System.out.println("""
                DPI Engine v1.0 - Deep Packet Inspection System
                =================================================

                Usage: %s <input.pcap> <output.pcap> [options]

                Options:
                  --block-ip <ip>        Block packets from source IP
                  --block-app <app>      Block application (YouTube, Facebook, etc.)
                  --block-domain <dom>   Block domain (supports wildcards: *.facebook.com)
                  --rules <file>         Load blocking rules from file
                  --lbs <n>              Number of load balancer threads (default: 2)
                  --fps <n>              FP threads per LB (default: 2)
                  --verbose              Enable verbose output

                Example:
                  %s test_dpi.pcap output.pcap --block-app YouTube --block-ip 192.168.1.50
                """.formatted(program, program));
    }
}
