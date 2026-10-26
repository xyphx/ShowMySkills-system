import mongoose from 'mongoose';

/**
 * Health Check Controller for ShowMySkills API.
 * Performs deep diagnostics on Express server and MongoDB database connection.
 * Responds with HTTP 200 when healthy, or HTTP 503 when degraded/unhealthy.
 */

export const checkHealth = async (req, res) => {
  const startTime = Date.now();
  const readyState = mongoose.connection.readyState;

  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const stateText = stateMap[readyState] || 'unknown';

  let dbStatus = 'disconnected';
  let dbPingMs = null;
  let dbError = null;

  if (readyState === 1 && mongoose.connection.db) {
    try {
      const pingStart = Date.now();
      await Promise.race([
        mongoose.connection.db.admin().ping(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('MongoDB ping timed out after 3000ms')), 3000)
        ),
      ]);
      dbPingMs = Date.now() - pingStart;
      dbStatus = 'connected';
    } catch (err) {
      dbStatus = 'disconnected';
      dbError = err.message || 'MongoDB ping command failed';
    }
  } else if (readyState === 2) {
    dbStatus = 'connecting';
    dbError = 'MongoDB connection is currently in progress';
  } else {
    dbStatus = 'disconnected';
    dbError = `MongoDB is not running or disconnected (readyState: ${readyState})`;
  }

  const isHealthy = dbStatus === 'connected';
  const statusCode = isHealthy ? 200 : 503;

  const mem = process.memoryUsage();
  const uptimeSeconds = Math.floor(process.uptime());

  let message = 'All core services (Backend API & MongoDB) are operational.';
  if (!isHealthy) {
    message = 'Database service unavailable. MongoDB is not running or disconnected.';
  }

  const responsePayload = {
    status: isHealthy ? 'healthy' : 'unhealthy',
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    services: {
      backend: {
        status: 'up',
        serviceName: 'ShowMySkills Express API',
        uptimeSeconds,
        environment: process.env.NODE_ENV || 'development',
        port: Number(process.env.PORT) || 5000,
        pid: process.pid,
      },
      database: {
        status: dbStatus,
        type: 'mongodb',
        readyState,
        readyStateText: stateText,
        host: mongoose.connection.host || null,
        name: mongoose.connection.name || null,
        pingLatencyMs: dbPingMs,
        error: dbError,
      },
    },
    system: {
      memory: {
        rssMB: +(mem.rss / (1024 * 1024)).toFixed(2),
        heapTotalMB: +(mem.heapTotal / (1024 * 1024)).toFixed(2),
        heapUsedMB: +(mem.heapUsed / (1024 * 1024)).toFixed(2),
      },
      nodeVersion: process.version,
      platform: process.platform,
    },
    responseTimeMs: Date.now() - startTime,
  };

  return res.status(statusCode).json(responsePayload);
};

export const checkLiveness = (req, res) => {
  return res.status(200).json({
    status: 'ok',
    service: 'backend',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
};
