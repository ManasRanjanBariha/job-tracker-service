import bcrypt from 'bcryptjs';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/utils/route-errors';
import { generateRefreshToken, generateTokenPair, verifyRefreshToken } from '@src/common/utils/jwt-utils';
import { IUser } from '@src/models/User.model';
import UserRepo from '@src/repos/UserRepo';

/******************************************************************************
                                Constants
******************************************************************************/

const SALT_ROUNDS = 10;

/******************************************************************************
                                Types
******************************************************************************/

export interface AuthResponse {
  user: Partial<IUser>;
  accessToken: string;
  refreshToken: string;
}

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Register a new user with email and password.
 */
async function signup(email: string, password: string, name: string): Promise<AuthResponse> {
  // Check if user already exists
  const existingUser = await UserRepo.getOne(email);
  if (existingUser) {
    throw new RouteError(
      HttpStatusCodes.CONFLICT,
      'User with this email already exists',
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create new user
  const newUser: IUser = {
    id: 0, // Will be assigned by the repo
    name,
    email,
    password: hashedPassword,
    created: new Date(),
    refreshToken: '',
  };

  const createdUser = await UserRepo.add(newUser);

  // Generate tokens
  const tokens = generateTokenPair({
    userId: createdUser.id,
    email: createdUser.email,
  });

  // Store refresh token in the database
  await UserRepo.update({
    ...createdUser,
    refreshToken: tokens.refreshToken,
  });

  // Return user without password and with tokens
  return {
    user: {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      created: createdUser.created,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

/**
 * Login user with email and password.
 */
async function login(email: string, password: string): Promise<AuthResponse> {
  const user = await UserRepo.getOne(email);
  if (!user) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      'Invalid email or password',
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      'Invalid email or password',
    );
  }

  // Generate tokens
  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
  });

  // Store refresh token in the database
  const userWithToken = { ...user, refreshToken: tokens.refreshToken };
  await UserRepo.update(userWithToken);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      created: user.created,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await UserRepo.getOne(payload.email);

    if (!user || user.refreshToken !== refreshToken) {
      throw new RouteError(
        HttpStatusCodes.UNAUTHORIZED,
        'Invalid refresh token',
      );
    }

    // Generate new tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
    });

    // Update refresh token in the database
    const userWithToken = { ...user, refreshToken: tokens.refreshToken };
    await UserRepo.update(userWithToken);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created: user.created,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  } catch (error) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      'Invalid or expired refresh token',
    );
  }
}

/**
 * Logout user by clearing refresh token
 */
async function logout(email: string): Promise<void> {
  const user = await UserRepo.getOne(email);
  if (user) {
    const userWithoutToken = { ...user, refreshToken: '' };
    await UserRepo.update(userWithoutToken);
  }
}

/******************************************************************************
                                Export
******************************************************************************/

export default {
  signup,
  login,
  refreshAccessToken,
  logout,
} as const;