package com.siga.config;

import java.time.Duration;
import java.time.Instant;

public class TokenBucket {
    private final long capacity;
    private final long refillTokens;
    private final long refillPeriodSeconds;
    private double tokens;
    private Instant lastRefill;

    public TokenBucket(long capacity, long refillTokens, long refillPeriodSeconds) {
        this.capacity = capacity;
        this.refillTokens = refillTokens;
        this.refillPeriodSeconds = refillPeriodSeconds;
        this.tokens = capacity;
        this.lastRefill = Instant.now();
    }

    public synchronized boolean tryConsume() {
        refill();
        if (tokens >= 1.0) {
            tokens -= 1.0;
            return true;
        }
        return false;
    }

    private void refill() {
        Instant now = Instant.now();
        double elapsedSeconds = Duration.between(lastRefill, now).toMillis() / 1000.0;
        double tokensToAdd = elapsedSeconds * ((double) refillTokens / (double) refillPeriodSeconds);
        if (tokensToAdd > 0) {
            tokens = Math.min(capacity, tokens + tokensToAdd);
            lastRefill = now;
        }
    }
}
