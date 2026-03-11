import { Request, Response, NextFunction } from 'express';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/utils/route-errors';
import { verifyAccessToken, JwtPayload } from '@src/common/utils/jwt-utils';

/******************************************************************************
                                Types
******************************************************************************/

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

/******************************************************************************
                                Middleware
******************************************************************************/

/**
 * Middleware to verify JWT access token
 * Extracts token from Authorization header (Bearer token)
 */
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new RouteError(
        HttpStatusCodes.UNAUTHORIZED,
        'Missing or invalid authorization header',
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token and extract payload
    const payload = verifyAccessToken(token);

    // Attach user info to request
    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof RouteError) {
      throw error;
    }
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      'Invalid or expired token',
    );
  }
};

/**
 * Optional authentication middleware
 * Doesn't throw error if token is missing, but verifies if present
 */
export const optionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = verifyAccessToken(token);
      req.user = payload;
    }

    next();
  } catch (error) {
    // If token is invalid but optional, just continue
    next();
  }
};
