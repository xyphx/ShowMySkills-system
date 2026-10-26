import crypto from 'node:crypto';
import monitoringService from '../services/monitoringService.js';

// ANSI color escape codes for terminal styling
const c = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
};

const getMethodColor = (method) => {
  switch (method) {
    case 'GET':
      return c.green;
    case 'POST':
      return c.cyan;
    case 'PUT':
    case 'PATCH':
      return c.yellow;
    case 'DELETE':
      return c.red;
    default:
      return c.blue;
  }
};

const getStatusColor = (status) => {
  if (status >= 500) return c.red;
  if (status >= 400) return c.yellow;
  if (status >= 300) return c.cyan;
  if (status >= 200) return c.green;
  return c.gray;
};

export const requestLogger = (req, res, next) => {
  const reqId = req.headers['x-request-id'] || crypto.randomUUID().slice(0, 8);
  req.id = reqId;
  res.setHeader('X-Request-Id', reqId);

  const startHrTime = process.hrtime.bigint();
  monitoringService.recordRequestStart();

  res.on('finish', () => {
    const endHrTime = process.hrtime.bigint();
    const durationMs = Number(endHrTime - startHrTime) / 1_000_000;

    const ip = req.ip || req.socket?.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Record into real-time monitoring engine
    monitoringService.recordRequestEnd({
      id: reqId,
      method: req.method,
      path: req.originalUrl || req.url,
      status: res.statusCode,
      durationMs,
      ip,
      userAgent,
    });

    // Don't clutter terminal with internal monitoring stream or heartbeat polling
    if (req.originalUrl?.includes('/api/monitoring/stream')) {
      return;
    }

    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    const methodColored = `${getMethodColor(req.method)}${c.bold}${req.method.padEnd(6)}${c.reset}`;
    const statusColored = `${getStatusColor(res.statusCode)}${c.bold}${res.statusCode}${c.reset}`;
    const durationColored =
      durationMs > 500
        ? `${c.yellow}${c.bold}${durationMs.toFixed(1)}ms [SLOW]${c.reset}`
        : `${c.dim}${durationMs.toFixed(1)}ms${c.reset}`;

    const pathDisplay = `${c.bold}${req.originalUrl || req.url}${c.reset}`;
    const ipDisplay = `${c.dim}[${ip}]${c.reset}`;
    const idDisplay = `${c.gray}#${reqId}${c.reset}`;

    // Colorized real-time log output
    console.log(
      `${c.gray}${timeStr}${c.reset} ${idDisplay} ${methodColored} ${pathDisplay} ${statusColored} ${durationColored} ${ipDisplay}`
    );
  });

  next();
};

export default requestLogger;
