import os from 'node:os';
import process from 'node:process';

class MonitoringService {
  constructor() {
    this.startTime = Date.now();
    this.totalRequests = 0;
    this.activeRequests = 0;
    this.statusCodes = {
      '2xx': 0,
      '3xx': 0,
      '4xx': 0,
      '5xx': 0,
    };
    this.latencyHistory = []; // Last 200 latency values (ms)
    this.requestsLastMinute = []; // Timestamps of requests in last 60s
    this.endpointHitCounts = new Map(); // endpoint -> count
    this.recentRequests = []; // Last 100 requests
    this.recentErrors = []; // Last 50 errors
    this.sseClients = new Set(); // Active SSE stream clients

    // Heartbeat & cleanup timer every 2 seconds
    this.intervalId = setInterval(() => {
      this.purgeExpiredTimestamps();
      this.broadcastMetrics();
    }, 2000);

    if (this.intervalId.unref) {
      this.intervalId.unref();
    }
  }

  purgeExpiredTimestamps() {
    const oneMinuteAgo = Date.now() - 60_000;
    while (this.requestsLastMinute.length > 0 && this.requestsLastMinute[0] < oneMinuteAgo) {
      this.requestsLastMinute.shift();
    }
  }

  recordRequestStart() {
    this.totalRequests++;
    this.activeRequests++;
    this.requestsLastMinute.push(Date.now());
  }

  recordRequestEnd({ id, method, path, status, durationMs, ip, userAgent }) {
    this.activeRequests = Math.max(0, this.activeRequests - 1);

    // Track status code tier
    if (status >= 200 && status < 300) this.statusCodes['2xx']++;
    else if (status >= 300 && status < 400) this.statusCodes['3xx']++;
    else if (status >= 400 && status < 500) this.statusCodes['4xx']++;
    else if (status >= 500) this.statusCodes['5xx']++;

    // Track latency
    this.latencyHistory.push(durationMs);
    if (this.latencyHistory.length > 200) {
      this.latencyHistory.shift();
    }

    // Track route hit counts
    const cleanRoute = path.split('?')[0];
    const currentHits = this.endpointHitCounts.get(cleanRoute) || 0;
    this.endpointHitCounts.set(cleanRoute, currentHits + 1);

    // Push into recent requests buffer
    const entry = {
      id,
      timestamp: new Date().toISOString(),
      method,
      path,
      status,
      durationMs: Number(durationMs.toFixed(2)),
      ip: ip || '127.0.0.1',
      userAgent: userAgent || 'unknown',
    };

    this.recentRequests.unshift(entry);
    if (this.recentRequests.length > 100) {
      this.recentRequests.pop();
    }

    // Broadcast live event to connected SSE monitors
    this.broadcastToClients('request', entry);
  }

  recordError({ id, method, path, status, message, stack }) {
    const errorEntry = {
      id,
      timestamp: new Date().toISOString(),
      method,
      path,
      status: status || 500,
      message: message || 'Unknown server error',
      stack: process.env.NODE_ENV === 'production' ? null : stack,
    };

    this.recentErrors.unshift(errorEntry);
    if (this.recentErrors.length > 50) {
      this.recentErrors.pop();
    }

    this.broadcastToClients('error', errorEntry);
  }

  computeLatencyStats() {
    if (this.latencyHistory.length === 0) {
      return { avg: 0, min: 0, max: 0, p95: 0 };
    }
    const sorted = [...this.latencyHistory].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, v) => acc + v, 0);
    const avg = Number((sum / sorted.length).toFixed(2));
    const min = Number(sorted[0].toFixed(2));
    const max = Number(sorted[sorted.length - 1].toFixed(2));
    const p95Index = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95));
    const p95 = Number(sorted[p95Index].toFixed(2));
    return { avg, min, max, p95 };
  }

  getTopEndpoints(limit = 8) {
    return Array.from(this.endpointHitCounts.entries())
      .map(([route, hits]) => ({ route, hits }))
      .sort((a, b) => b.hits - a.hits)
      .slice(0, limit);
  }

  getMetricsSnapshot() {
    this.purgeExpiredTimestamps();
    const mem = process.memoryUsage();
    const uptimeSec = Math.floor(process.uptime());
    const latency = this.computeLatencyStats();
    const rps = Number((this.requestsLastMinute.length / 60).toFixed(2));

    const totalSystemMem = os.totalmem();
    const freeSystemMem = os.freemem();
    const usedSystemMem = totalSystemMem - freeSystemMem;

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: uptimeSec,
        formatted: this.formatUptime(uptimeSec),
      },
      process: {
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      requests: {
        total: this.totalRequests,
        active: this.activeRequests,
        requestsPerMinute: this.requestsLastMinute.length,
        requestsPerSecond: rps,
        statusBreakdown: { ...this.statusCodes },
      },
      performance: {
        latencyMs: latency,
      },
      memory: {
        rssMB: Number((mem.rss / 1024 / 1024).toFixed(2)),
        heapTotalMB: Number((mem.heapTotal / 1024 / 1024).toFixed(2)),
        heapUsedMB: Number((mem.heapUsed / 1024 / 1024).toFixed(2)),
        heapPercent: Number(((mem.heapUsed / mem.heapTotal) * 100).toFixed(1)),
        systemUsedMB: Number((usedSystemMem / 1024 / 1024).toFixed(2)),
        systemTotalMB: Number((totalSystemMem / 1024 / 1024).toFixed(2)),
        systemFreePercent: Number(((freeSystemMem / totalSystemMem) * 100).toFixed(1)),
      },
      topEndpoints: this.getTopEndpoints(8),
      recentErrorsCount: this.recentErrors.length,
    };
  }

  formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${secs}s`);
    return parts.join(' ');
  }

  // --- Real-time SSE Broadcasting ---
  addSubscriber(res) {
    this.sseClients.add(res);

    // Initial message
    res.write(`event: connected\ndata: ${JSON.stringify({ message: 'Connected to real-time metrics feed' })}\n\n`);
    res.write(`event: snapshot\ndata: ${JSON.stringify(this.getMetricsSnapshot())}\n\n`);

    res.on('close', () => {
      this.sseClients.delete(res);
    });
  }

  broadcastMetrics() {
    if (this.sseClients.size === 0) return;
    const snapshot = this.getMetricsSnapshot();
    this.broadcastToClients('snapshot', snapshot);
  }

  broadcastToClients(event, data) {
    if (this.sseClients.size === 0) return;
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of this.sseClients) {
      try {
        client.write(payload);
      } catch {
        this.sseClients.delete(client);
      }
    }
  }
}

export const monitoringService = new MonitoringService();
export default monitoringService;
