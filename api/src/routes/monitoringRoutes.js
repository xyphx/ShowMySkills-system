import express from 'express';
import monitoringService from '../services/monitoringService.js';

const router = express.Router();

/**
 * @openapi
 * /api/monitoring/metrics:
 *   get:
 *     summary: Get live backend performance and system telemetry
 *     description: Returns real-time metrics including memory usage, request rates (RPS), status code breakdown, and latency percentiles.
 *     tags:
 *       - Monitoring
 *     responses:
 *       200:
 *         description: Live system metrics snapshot
 */
router.get('/metrics', (req, res) => {
  res.json({
    success: true,
    data: monitoringService.getMetricsSnapshot(),
  });
});

/**
 * @openapi
 * /api/monitoring/requests:
 *   get:
 *     summary: Get recent HTTP requests buffer
 *     description: Returns the last 100 HTTP requests with latency, status, IP, and timestamp.
 *     tags:
 *       - Monitoring
 *     responses:
 *       200:
 *         description: List of recent HTTP requests
 */
router.get('/requests', (req, res) => {
  res.json({
    success: true,
    count: monitoringService.recentRequests.length,
    data: monitoringService.recentRequests,
  });
});

/**
 * @openapi
 * /api/monitoring/errors:
 *   get:
 *     summary: Get recent backend errors buffer
 *     description: Returns the last 50 recorded backend errors for diagnostics.
 *     tags:
 *       - Monitoring
 *     responses:
 *       200:
 *         description: List of recent errors
 */
router.get('/errors', (req, res) => {
  res.json({
    success: true,
    count: monitoringService.recentErrors.length,
    data: monitoringService.recentErrors,
  });
});

/**
 * @openapi
 * /api/monitoring/stream:
 *   get:
 *     summary: Real-time Server-Sent Events (SSE) telemetry stream
 *     description: Establishes a persistent SSE stream broadcasting real-time metrics and incoming request logs every 2 seconds.
 *     tags:
 *       - Monitoring
 *     responses:
 *       200:
 *         description: Continuous event-stream of backend telemetry
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 */
router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  monitoringService.addSubscriber(res);
});

/**
 * @openapi
 * /api/monitoring/dashboard:
 *   get:
 *     summary: Interactive Real-time Backend Monitoring Dashboard
 *     description: Serves an HTML page with live charts, status counters, and auto-updating HTTP request log stream.
 *     tags:
 *       - Monitoring
 *     responses:
 *       200:
 *         description: HTML monitoring dashboard
 */
router.get('/dashboard', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ShowMySkills • Live Backend Monitoring</title>
  <link rel="icon" href="/uploads/logo.png">
  <style>
    :root {
      --bg: #090e17;
      --card-bg: #111827;
      --card-border: #1f2937;
      --primary: #4b9c93;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --green: #10b981;
      --yellow: #f59e0b;
      --red: #ef4444;
      --blue: #3b82f6;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      padding: 24px;
      line-height: 1.5;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--card-border);
      margin-bottom: 24px;
    }
    .title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 22px;
      font-weight: 800;
      color: #fff;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: var(--green);
      font-size: 12px;
      font-weight: 600;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--green);
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.2); }
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 18px;
    }
    .card-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 6px;
    }
    .card-value {
      font-size: 26px;
      font-weight: 800;
      color: #fff;
    }
    .card-sub {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 4px;
    }
    .meter {
      height: 6px;
      border-radius: 4px;
      background: #1f2937;
      margin-top: 8px;
      overflow: hidden;
    }
    .meter-bar {
      height: 100%;
      background: var(--primary);
      width: 0%;
      transition: width 0.4s ease;
    }
    .logs-container {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 20px;
    }
    .logs-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .logs-table {
      width: 100%;
      border-collapse: collapse;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12px;
    }
    .logs-table th {
      text-align: left;
      padding: 10px 12px;
      border-bottom: 1px solid var(--card-border);
      color: var(--text-muted);
      font-weight: 600;
    }
    .logs-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #1a2234;
      white-space: nowrap;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 11px;
    }
    .b-get { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
    .b-post { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .b-put, .b-patch { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .b-delete { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    .status-2xx { color: var(--green); font-weight: 700; }
    .status-3xx { color: var(--blue); font-weight: 700; }
    .status-4xx { color: var(--yellow); font-weight: 700; }
    .status-5xx { color: var(--red); font-weight: 700; }
    .slow-badge { color: var(--yellow); font-weight: 700; font-size: 10px; margin-left: 4px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">
      <span>⚡ ShowMySkills</span>
      <span style="color: var(--primary);">Real-Time Backend Monitor</span>
    </div>
    <div class="status-badge">
      <div class="pulse-dot"></div>
      <span id="conn-status">LIVE STREAM ACTIVE</span>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-label">Throughput (RPS)</div>
      <div class="card-value" id="rps-val">0.00</div>
      <div class="card-sub"><span id="rpm-val">0</span> requests in last 60s</div>
    </div>
    <div class="card">
      <div class="card-label">Total Requests</div>
      <div class="card-value" id="total-val">0</div>
      <div class="card-sub"><span id="active-val">0</span> currently active</div>
    </div>
    <div class="card">
      <div class="card-label">Avg Latency</div>
      <div class="card-value" id="lat-val">0ms</div>
      <div class="card-sub">P95: <span id="p95-val">0ms</span></div>
    </div>
    <div class="card">
      <div class="card-label">Memory Usage (Heap)</div>
      <div class="card-value" id="mem-val">0 MB</div>
      <div class="meter"><div class="meter-bar" id="mem-bar"></div></div>
      <div class="card-sub" id="mem-sub">Heap: 0%</div>
    </div>
    <div class="card">
      <div class="card-label">Server Uptime</div>
      <div class="card-value" id="uptime-val">0s</div>
      <div class="card-sub" id="pid-val">Node process</div>
    </div>
  </div>

  <div class="logs-container">
    <div class="logs-header">
      <h3 style="font-size: 15px; font-weight: 700;">Live HTTP Traffic Stream</h3>
      <span style="font-size: 12px; color: var(--text-muted);" id="stream-count">Listening for requests...</span>
    </div>
    <div style="overflow-x: auto; max-height: 480px; overflow-y: auto;">
      <table class="logs-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>ID</th>
            <th>Method</th>
            <th>Endpoint</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Client IP</th>
          </tr>
        </thead>
        <tbody id="logs-body">
          <tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">Waiting for incoming traffic...</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <script>
    const evtSource = new EventSource('/api/monitoring/stream');
    let requestCount = 0;

    evtSource.addEventListener('snapshot', (e) => {
      const snap = JSON.parse(e.data);
      document.getElementById('rps-val').innerText = snap.requests.requestsPerSecond.toFixed(2);
      document.getElementById('rpm-val').innerText = snap.requests.requestsPerMinute;
      document.getElementById('total-val').innerText = snap.requests.total;
      document.getElementById('active-val').innerText = snap.requests.active;
      document.getElementById('lat-val').innerText = snap.performance.latencyMs.avg + 'ms';
      document.getElementById('p95-val').innerText = snap.performance.latencyMs.p95 + 'ms';
      document.getElementById('mem-val').innerText = snap.memory.heapUsedMB + ' MB';
      document.getElementById('mem-bar').style.width = snap.memory.heapPercent + '%';
      document.getElementById('mem-sub').innerText = 'Heap: ' + snap.memory.heapPercent + '% of ' + snap.memory.heapTotalMB + 'MB';
      document.getElementById('uptime-val').innerText = snap.uptime.formatted;
      document.getElementById('pid-val').innerText = 'PID ' + snap.process.pid + ' (' + snap.process.nodeVersion + ')';
    });

    evtSource.addEventListener('request', (e) => {
      const req = JSON.parse(e.data);
      requestCount++;
      document.getElementById('stream-count').innerText = requestCount + ' live requests captured';

      const tbody = document.getElementById('logs-body');
      if (tbody.querySelector('td[colspan]')) {
        tbody.innerHTML = '';
      }

      const tr = document.createElement('tr');
      const methodClass = 'b-' + req.method.toLowerCase();
      let statusClass = 'status-2xx';
      if (req.status >= 500) statusClass = 'status-5xx';
      else if (req.status >= 400) statusClass = 'status-4xx';
      else if (req.status >= 300) statusClass = 'status-3xx';

      const slowTag = req.durationMs > 500 ? '<span class="slow-badge">[SLOW]</span>' : '';

      tr.innerHTML = \`
        <td style="color: var(--text-muted);">\${new Date(req.timestamp).toLocaleTimeString()}</td>
        <td style="color: var(--text-muted);">#\${req.id}</td>
        <td><span class="badge \${methodClass}">\${req.method}</span></td>
        <td style="font-weight: 600; color: #fff;">\${req.path}</td>
        <td class="\${statusClass}">\${req.status}</td>
        <td>\${req.durationMs}ms \${slowTag}</td>
        <td style="color: var(--text-muted);">\${req.ip}</td>
      \`;

      tbody.insertBefore(tr, tbody.firstChild);
      while (tbody.children.length > 50) {
        tbody.removeChild(tbody.lastChild);
      }
    });

    evtSource.onerror = () => {
      document.getElementById('conn-status').innerText = 'RECONNECTING...';
    };
    evtSource.onopen = () => {
      document.getElementById('conn-status').innerText = 'LIVE STREAM ACTIVE';
    };
  </script>
</body>
</html>`);
});

export default router;
