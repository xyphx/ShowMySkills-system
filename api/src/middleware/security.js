import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

/**
 * ──── 1. Helmet Security Headers ────
 * Configures HTTP security headers to protect against common web vulnerabilities.
 */
export const helmetSecurity = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https:", "http:"],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows /uploads static assets
  crossOriginEmbedderPolicy: false,
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
});

/**
 * ──── 2. CORS Whitelist Policy ────
 */
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const defaultOrigins = [
  'https://showmyskills.xyphx.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, postman, server-to-server)
    if (!origin) return callback(null, true);

    const originsList = allowedOrigins.length > 0 ? allowedOrigins : defaultOrigins;
    if (originsList.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy violation: Origin '${origin}' is not allowed.`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
  credentials: true,
  maxAge: 86400, // 24 hours preflight cache
};

/**
 * ──── 3. Rate Limiters ────
 */

// Global general API limiter: 300 requests per 15 minutes per IP
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TooManyRequests',
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

// Authentication rate limiter: 10 attempts per 15 minutes per IP (Login, Register, Password Reset)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TooManyRequests',
    message: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
  },
});

// Strict OTP rate limiter: 5 attempts per 10 minutes to prevent OTP brute-forcing
export const otpRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TooManyRequests',
    message: 'Too many verification attempts. Please wait 10 minutes before requesting a new code.',
  },
});

// Submission rate limiter: 20 per 15 minutes (Support tickets, applications, verifications)
export const submissionRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TooManyRequests',
    message: 'Too many submissions. Please slow down and try again later.',
  },
});

// Click telemetry limiter: 60 per minute per IP
export const clickRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TooManyRequests',
    message: 'Click rate limit exceeded.',
  },
});

/**
 * ──── 4. NoSQL Injection Sanitizer ────
 * Recursively strips keys starting with '$' or containing '.' from body, query, and params.
 */
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    // Remove MongoDB operators like $gt, $where, $ne, etc.
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    clean[key] = typeof value === 'object' ? sanitizeObject(value) : value;
  }
  return clean;
}

export const noSqlSanitizer = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
};

/**
 * ──── 5. XSS Defense Sanitizer ────
 * Strips dangerous HTML script tags and javascript: execution strings from inputs.
 */
function cleanXssString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:[^\s]*/gi, '')
    .replace(/onload\s*=\s*['"][^'"]*['"]/gi, '')
    .replace(/onerror\s*=\s*['"][^'"]*['"]/gi, '');
}

function sanitizeXss(obj) {
  if (!obj || typeof obj !== 'object') {
    return typeof obj === 'string' ? cleanXssString(obj) : obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeXss);
  }
  const clean = {};
  for (const [k, v] of Object.entries(obj)) {
    clean[k] = sanitizeXss(v);
  }
  return clean;
}

export const xssSanitizer = (req, res, next) => {
  if (req.body) req.body = sanitizeXss(req.body);
  if (req.query) req.query = sanitizeXss(req.query);
  next();
};

/**
 * ──── 6. HTTP Parameter Pollution (HPP) Protection ────
 * Enforces single-value parameters for common query fields to prevent array spoofing.
 */
export const hppProtection = (req, res, next) => {
  const singleValueFields = ['page', 'limit', 'search', 'role', 'mode', 'roleTag', 'status'];
  if (req.query) {
    for (const field of singleValueFields) {
      if (Array.isArray(req.query[field])) {
        req.query[field] = req.query[field][req.query[field].length - 1];
      }
    }
  }
  next();
};
