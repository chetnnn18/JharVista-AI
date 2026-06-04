# Windows Setup - Java DPI Engine

## Prerequisites

Install:

- Java 17 or newer
- Apache Maven 3.8 or newer

Verify both tools are available:

```powershell
java -version
mvn -version
```

## Build

From the project root:

```powershell
mvn clean package
```

This creates:

```text
target\dpi-engine-1.0.0.jar
```

## Run

Basic run:

```powershell
java -jar target\dpi-engine-1.0.0.jar test_dpi.pcap filtered.pcap
```

Run with blocking rules:

```powershell
java -jar target\dpi-engine-1.0.0.jar test_dpi.pcap filtered.pcap --block-app YouTube --block-ip 192.168.1.50
```

Configure threads:

```powershell
java -jar target\dpi-engine-1.0.0.jar test_dpi.pcap filtered.pcap --lbs 2 --fps 2
```

## Generate Test PCAP

```powershell
python generate_test_pcap.py
```

Then run:

```powershell
java -jar target\dpi-engine-1.0.0.jar test_dpi.pcap output.pcap
```
