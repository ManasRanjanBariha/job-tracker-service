import jwt from 'jsonwebtoken';

import EnvVars from '@src/common/constants/env';

/******************************************************************************
                                Types
******************************************************************************/

export interface JwtPayload {
  userId: number;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Generate an access token
 */
export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, EnvVars.JwtSecret, {
    expiresIn: EnvVars.JwtExpiration,
  });
}

/**
 * Generate a refresh token
 */
export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, EnvVars.JwtRefreshSecret, {
    expiresIn: EnvVars.JwtRefreshExpiration,
  });
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokenPair(payload: JwtPayload): TokenPair {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, EnvVars.JwtSecret) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, EnvVars.JwtRefreshSecret) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}
