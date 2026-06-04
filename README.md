# DPI Engine - Java Deep Packet Inspection System

This project is a Java implementation of the original DPI Engine. It keeps the same architecture and processing flow:

```text
PCAP Reader -> Load Balancer threads -> Fast Path threads -> Output Writer
```

The engine reads packets from an input `.pcap`, parses Ethernet/IPv4/TCP/UDP headers, extracts TLS SNI, HTTP Host headers, and DNS queries, tracks flows, applies blocking rules, and writes forwarded packets to an output `.pcap`.

## Project Structure

```text
packet_analyzer/
├── pom.xml
├── src/main/java/com/packetanalyzer/pcap/
│   ├── PcapReader.java
│   ├── PcapGlobalHeader.java
│   ├── PcapPacketHeader.java
│   ├── RawPacket.java
│   ├── ParsedPacket.java
│   └── PacketParser.java
├── src/main/java/com/packetanalyzer/dpi/
│   ├── Main.java
│   ├── DPIEngine.java
│   ├── LoadBalancer.java
│   ├── LBManager.java
│   ├── FastPathProcessor.java
│   ├── FPManager.java
│   ├── ConnectionTracker.java
│   ├── GlobalConnectionTable.java
│   ├── RuleManager.java
│   ├── SNIExtractor.java
│   ├── HTTPHostExtractor.java
│   ├── DNSExtractor.java
│   ├── QUICSNIExtractor.java
│   ├── FiveTuple.java
│   ├── PacketJob.java
│   └── supporting enums/types
├── generate_test_pcap.py
├── test_dpi.pcap
└── output.pcap
```

## Prerequisites

- Java 17 or newer
- Apache Maven 3.8 or newer

No third-party Java libraries are required.

## Build

Build the Java project with Maven:

```bash
mvn clean package
```

The executable JAR is created at:

```text
target/dpi-engine-1.0.0.jar
```

## Run

Basic usage:

```bash
java -jar target/dpi-engine-1.0.0.jar test_dpi.pcap filtered.pcap
```

With blocking rules:

```bash
java -jar target/dpi-engine-1.0.0.jar test_dpi.pcap filtered.pcap \
  --block-app YouTube \
  --block-app TikTok \
  --block-ip 192.168.1.50 \
  --block-domain facebook
```

Configure the multi-threaded pipeline:

```bash
java -jar target/dpi-engine-1.0.0.jar input.pcap output.pcap --lbs 4 --fps 4
```

This creates 4 load balancer threads and 16 fast path threads.

Load rules from a file:

```bash
java -jar target/dpi-engine-1.0.0.jar input.pcap output.pcap --rules blocking_rules.txt
```

## Optional Utility Entry Points

Packet analyzer view:

```bash
java -cp target/dpi-engine-1.0.0.jar com.packetanalyzer.dpi.PacketAnalyzerMain test_dpi.pcap 10
```

Simple SNI scan:

```bash
java -cp target/dpi-engine-1.0.0.jar com.packetanalyzer.dpi.SimpleMain test_dpi.pcap
```

## Creating Test Data

The existing Python generator is unchanged:

```bash
python generate_test_pcap.py
```

It creates `test_dpi.pcap` with sample traffic for the Java DPI engine.

## Supported Blocking Options

```text
--block-ip <ip>        Block packets from a source IP
--block-app <app>      Block an application detected from SNI/Host
--block-domain <dom>   Block a domain or wildcard domain pattern
--rules <file>         Load blocking rules from a file
--lbs <n>              Number of load balancer threads
--fps <n>              Fast path threads per load balancer
--verbose              Enable verbose output
```

Supported app names include:

```text
Google, YouTube, Facebook, Instagram, Twitter/X, Netflix, Amazon,
Microsoft, Apple, WhatsApp, Telegram, TikTok, Spotify, Zoom,
Discord, GitHub, Cloudflare
```

## Processing Flow

1. `PcapReader` opens the input file and reads the global PCAP header.
2. `PacketParser` parses Ethernet, IPv4, TCP, and UDP headers.
3. The reader creates a `PacketJob` with the five-tuple and payload offsets.
4. `LBManager` hashes the five-tuple to select a load balancer.
5. Each `LoadBalancer` hashes the same five-tuple to select a fast path processor.
6. `FastPathProcessor` tracks the flow, extracts SNI/Host/DNS information, classifies the application, checks `RuleManager`, and forwards or drops the packet.
7. The output writer writes forwarded packets to the output PCAP.

## Output

At the end of processing, the engine prints:

- Packet totals
- Forwarded and dropped packet counts
- Load balancer and fast path statistics
- Active connection counts
- Configured blocking rule counts
- Application classification breakdown
- Detected domains/SNIs

The output PCAP contains only forwarded packets.
