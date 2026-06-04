package com.packetanalyzer.dpi;

import java.util.Optional;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

public class ThreadSafeQueue<T> {
    private final ArrayBlockingQueue<T> queue;
    private final AtomicBoolean shutdown = new AtomicBoolean(false);

    public ThreadSafeQueue() {
        this(10000);
    }

    public ThreadSafeQueue(int maxSize) {
        this.queue = new ArrayBlockingQueue<>(maxSize);
    }

    public void push(T item) {
        while (!shutdown.get()) {
            try {
                if (queue.offer(item, 100, TimeUnit.MILLISECONDS)) {
                    return;
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }
    }

    public boolean tryPush(T item) {
        return !shutdown.get() && queue.offer(item);
    }

    public Optional<T> pop() {
        while (!shutdown.get()) {
            try {
                T item = queue.poll(100, TimeUnit.MILLISECONDS);
                if (item != null) {
                    return Optional.of(item);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return Optional.empty();
            }
        }
        T item = queue.poll();
        return Optional.ofNullable(item);
    }

    public Optional<T> popWithTimeout(long timeoutMillis) {
        try {
            T item = queue.poll(timeoutMillis, TimeUnit.MILLISECONDS);
            return Optional.ofNullable(item);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return Optional.empty();
        }
    }

    public boolean empty() {
        return queue.isEmpty();
    }

    public int size() {
        return queue.size();
    }

    public void shutdown() {
        shutdown.set(true);
    }

    public boolean isShutdown() {
        return shutdown.get();
    }
}
