
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Bearer token required',
    });
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Token is missing',
    });
  }

  const jwtSecret = process.env.JWT_SECRET || 'dev_secret_key_showmyskills_2026';

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (!decoded.sub) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_TOKEN',
        message: 'Unauthorized: Invalid token payload',
      });
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      roleTag: decoded.roleTag,
    };

    next();
  } catch (error) {
    const isExpired = error.name === 'TokenExpiredError';
    return res.status(401).json({
      success: false,
      code: isExpired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
      message: isExpired
        ? 'Unauthorized: Access token has expired'
        : 'Unauthorized: Invalid or expired token',
    });
  }
};
