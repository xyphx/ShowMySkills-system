import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// API Router mounted under /api
const apiRouter = express.Router();

// Swagger Documentation at /api/docs
apiRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Auth Routes at /api/auth/*
apiRouter.use('/auth', authRoutes);

// Health Check at /api/health
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), path: req.originalUrl });
});

// Dynamic / Catch-all handler for any endpoint under /api/* (e.g. /api/gieigjeijgjejjegj)
apiRouter.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'NotFound',
    message: `API endpoint '${req.originalUrl}' does not exist.`
  });
});

// Mount all API routes under /api
app.use('/api', apiRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

export default app;
