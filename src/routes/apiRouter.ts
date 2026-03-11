import { Router } from 'express';

import Paths from '@src/common/constants/Paths';
import { authenticate, optionalAuth } from '@src/middleware/authMiddleware';

import authRoutes from './authRoutes';
import UserRoutes from './UserRoutes';
import JobApplicationRouter from './JobApplicationRouter';

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


// Routes for job applications
const applicationRouter = Router();
applicationRouter.get(Paths.JobApplications.GetAll, authenticate, JobApplicationRouter.getAll);
applicationRouter.post(Paths.JobApplications.Add, authenticate, JobApplicationRouter.addOne);
applicationRouter.get(Paths.JobApplications.GetOne, authenticate, JobApplicationRouter.getOne);
applicationRouter.put(Paths.JobApplications.Update, authenticate, JobApplicationRouter.updateOne);
applicationRouter.delete(Paths.JobApplications.Delete, authenticate, JobApplicationRouter.deleteOne);

apiRouter.use(Paths.Users._, userRouter);

/******************************************************************************
                                Export
******************************************************************************/

export default apiRouter;
