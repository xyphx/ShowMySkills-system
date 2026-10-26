import assert from 'node:assert';
import { test } from 'node:test';
import mongoose from 'mongoose';
import { checkHealth, checkLiveness } from '../src/controllers/healthController.js';

test('Health Check API: Liveness check returns 200 OK', () => {
  let statusCode = null;
  let jsonResponse = null;

  const mockReq = {};
  const mockRes = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonResponse = data;
      return this;
    },
  };

  checkLiveness(mockReq, mockRes);

  assert.strictEqual(statusCode, 200);
  assert.strictEqual(jsonResponse.status, 'ok');
  assert.strictEqual(jsonResponse.service, 'backend');
  assert.strictEqual(typeof jsonResponse.uptimeSeconds, 'number');
});

test('Health Check API: Returns 503 when MongoDB is disconnected', async () => {
  let statusCode = null;
  let jsonResponse = null;

  const mockReq = {};
  const mockRes = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonResponse = data;
      return this;
    },
  };

  await checkHealth(mockReq, mockRes);

  if (mongoose.connection.readyState === 0) {
    assert.strictEqual(statusCode, 503);
    assert.strictEqual(jsonResponse.status, 'unhealthy');
    assert.strictEqual(jsonResponse.statusCode, 503);
    assert.strictEqual(jsonResponse.services.backend.status, 'up');
    assert.strictEqual(jsonResponse.services.database.status, 'disconnected');
    assert.ok(
      jsonResponse.message.includes('MongoDB is not running') ||
      jsonResponse.message.includes('Database service unavailable')
    );
    assert.strictEqual(typeof jsonResponse.system.memory.heapUsedMB, 'number');
    assert.strictEqual(typeof jsonResponse.uptimeSeconds, 'number');
  } else {
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(jsonResponse.status, 'healthy');
    assert.strictEqual(jsonResponse.services.database.status, 'connected');
  }
});

test('Health Check API: System metrics and memory snapshots are accurately reported', async () => {
  let jsonResponse = null;
  const mockRes = {
    status() { return this; },
    json(data) {
      jsonResponse = data;
      return this;
    },
  };

  await checkHealth({}, mockRes);

  assert.ok(jsonResponse);
  assert.ok(jsonResponse.timestamp);
  assert.strictEqual(typeof jsonResponse.system.nodeVersion, 'string');
  assert.strictEqual(typeof jsonResponse.system.memory.rssMB, 'number');
  assert.strictEqual(typeof jsonResponse.system.memory.heapTotalMB, 'number');
  assert.strictEqual(typeof jsonResponse.system.memory.heapUsedMB, 'number');
  assert.strictEqual(jsonResponse.services.backend.serviceName, 'ShowMySkills Express API');
});
