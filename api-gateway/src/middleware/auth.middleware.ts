import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = 'comic_secret_key';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const protectedRoutes = [
    '/api/comics',
    '/api/chapters',
  ];

  const isProtected =
    protectedRoutes.some((route) =>
      req.originalUrl.startsWith(route),
    ) &&
    ['POST', 'PATCH', 'DELETE'].includes(req.method);

  if (!isProtected) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET,
    );

    req['user'] = decoded;

    next();
  } catch {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }
}