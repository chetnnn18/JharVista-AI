package com.packetanalyzer.dpi;

import java.time.Instant;

public class Connection {
    public FiveTuple tuple = new FiveTuple();
    public ConnectionState state = ConnectionState.NEW;
    public AppType appType = AppType.UNKNOWN;
    public String sni = "";

    public long packetsIn;
    public long packetsOut;
    public long bytesIn;
    public long bytesOut;

    public Instant firstSeen = Instant.now();
    public Instant lastSeen = firstSeen;

    public PacketAction action = PacketAction.FORWARD;

    public boolean synSeen;
    public boolean synAckSeen;
    public boolean finSeen;

    public Connection copy() {
        Connection c = new Connection();
        c.tuple = tuple.copy();
        c.state = state;
        c.appType = appType;
        c.sni = sni;
        c.packetsIn = packetsIn;
        c.packetsOut = packetsOut;
        c.bytesIn = bytesIn;
        c.bytesOut = bytesOut;
        c.firstSeen = firstSeen;
        c.lastSeen = lastSeen;
        c.action = action;
        c.synSeen = synSeen;
        c.synAckSeen = synAckSeen;
        c.finSeen = finSeen;
        return c;
    }
}
