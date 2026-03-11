import { Router } from 'express';

import Paths from '@src/common/constants/Paths';
import { authenticate, optionalAuth } from '@src/middleware/authMiddleware';

import authRoutes from './authRoutes';
import UserRoutes from './UserRoutes';

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

// ----------------------- Add AuthRouter --------------------------------- //

apiRouter.use(Paths.auth._, authRoutes);

// ----------------------- Add UserRouter --------------------------------- //

const userRouter = Router();

// Routes that don't require authentication
userRouter.get(Paths.Users.Get, UserRoutes.getAll);

// Routes that require authentication
userRouter.post(Paths.Users.Add, authenticate, UserRoutes.add);
userRouter.put(Paths.Users.Update, authenticate, UserRoutes.update);
userRouter.delete(Paths.Users.Delete, authenticate, UserRoutes.delete);

apiRouter.use(Paths.Users._, userRouter);

/******************************************************************************
                                Export
******************************************************************************/

export default apiRouter;
