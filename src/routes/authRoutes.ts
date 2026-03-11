import { Request, Response, Router } from 'express';
import { isNonEmptyString } from 'jet-validators';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/utils/route-errors';
import AuthService from '@src/services/authService';

/******************************************************************************
                                Setup
******************************************************************************/

const router = Router();

/******************************************************************************
                                Helpers
******************************************************************************/

/**
 * Simple email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/******************************************************************************
                                Routes
******************************************************************************/

/**
 * Signup route - Register a new user
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  // Validate input
  if (!isValidEmail(email)) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      'Invalid email format',
    );
  }

  if (!isNonEmptyString(password) || password.length < 6) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      'Password must be at least 6 characters long',
    );
  }

  if (!isNonEmptyString(name)) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      'Name is required',
    );
  }

  // Call signup service
  const result = await AuthService.signup(email, password, name);

  return res.status(HttpStatusCodes.CREATED).json({
    message: 'User registered successfully',
    ...result,
  });
});

/**
 * Login route
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate input
  if (!isValidEmail(email)) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      'Invalid email format',
    );
  }

  if (!isNonEmptyString(password)) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      'Password is required',
    );
  }

  // Call login service
  const result = await AuthService.login(email, password);

  return res.status(HttpStatusCodes.OK).json({
    message: 'Login successful',
    ...result,
  });
});

/**
 * Refresh token route
 * POST /api/auth/refresh
 */
router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!isNonEmptyString(refreshToken)) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      'Refresh token is required',
    );
  }

  // Call refresh service
  const result = await AuthService.refreshAccessToken(refreshToken);

  return res.status(HttpStatusCodes.OK).json({
    message: 'Token refreshed successfully',
    ...result,
  });
});

/**
 * Logout route
 * POST /api/auth/logout
 */
router.post('/logout', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!isValidEmail(email)) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      'Invalid email format',
    );
  }

  // Call logout service
  await AuthService.logout(email);

  return res.status(HttpStatusCodes.OK).json({
    message: 'Logout successful',
  });
});

/******************************************************************************
                                Export
******************************************************************************/

export default router;

