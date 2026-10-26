import express from 'express';
import { checkHealth, checkLiveness } from '../controllers/healthController.js';

const router = express.Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Deep system health check and component diagnostics
 *     description: Evaluates operational readiness of Express API and MongoDB database. Returns HTTP 200 if all services are connected, or HTTP 503 if MongoDB or critical services are down.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: All core systems (Backend API & MongoDB) are operational.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "All core services (Backend API & MongoDB) are operational."
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptimeSeconds:
 *                   type: integer
 *                   example: 124
 *                 services:
 *                   type: object
 *                   properties:
 *                     backend:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: "up"
 *                         serviceName:
 *                           type: string
 *                         uptimeSeconds:
 *                           type: integer
 *                         environment:
 *                           type: string
 *                         port:
 *                           type: integer
 *                     database:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: "connected"
 *                         type:
 *                           type: string
 *                           example: "mongodb"
 *                         readyState:
 *                           type: integer
 *                           example: 1
 *                         readyStateText:
 *                           type: string
 *                           example: "connected"
 *                         pingLatencyMs:
 *                           type: number
 *                           example: 2.5
 *       503:
 *         description: Degraded state or service unavailable (e.g., MongoDB disconnected or not running).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "unhealthy"
 *                 statusCode:
 *                   type: integer
 *                   example: 503
 *                 message:
 *                   type: string
 *                   example: "Database service unavailable. MongoDB is not running or disconnected."
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 services:
 *                   type: object
 *                   properties:
 *                     backend:
 *                       type: object
 *                     database:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: "disconnected"
 *                         error:
 *                           type: string
 *                           example: "MongoDB is not running or disconnected (readyState: 0)"
 */
router.get('/', checkHealth);

/**
 * @openapi
 * /api/health/live:
 *   get:
 *     summary: Quick backend process liveness probe
 *     description: Returns 200 OK if Express process is accepting HTTP traffic.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Process is alive
 */
router.get('/live', checkLiveness);

export default router;
