package com.packetanalyzer.dpi;

@FunctionalInterface
public interface PacketOutputCallback {
    void handle(PacketJob job, PacketAction action);
}
