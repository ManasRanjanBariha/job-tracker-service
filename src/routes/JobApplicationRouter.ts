import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/utils/route-errors';
import {
  authenticate,
  AuthenticatedRequest,
} from '@src/middleware/authMiddleware';
import { IJobApplication } from '@src/models/JobApplication.model';
import JobApplicationService from '@src/services/JobApplicationService';

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get all job applications for the authenticated user.
 * @route GET /api/job-applications/all
 */
async function getAll(req: AuthenticatedRequest, res: any) {
  // Extract userId from authenticated user
  if (!req.user) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      'User not authenticated',
    );
  }

  const jobApplications = await JobApplicationService.getAllByUserId(req.user.userId);
  res.status(HttpStatusCodes.OK).json({ jobApplications });
}

/**
 * Add a new job application for the authenticated user.
 * @route POST /api/job-applications/add
 */
async function addOne(req: AuthenticatedRequest, res: any) {
  // Extract userId from authenticated user
  if (!req.user) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      'User not authenticated',
    );
  }

  const jobApplication: IJobApplication = {
    ...req.body,
    userId: req.user.userId, // Automatically set userId from token
  };

  const newJobApplication = await JobApplicationService.addOne(jobApplication);
  res
    .status(HttpStatusCodes.CREATED)
    .json({ jobApplication: newJobApplication });
}

/**
 * Get one job application by id for the authenticated user.
 * @route GET /api/job-applications/:id
 * @params id - Job application id
 */
async function getOne(req: AuthenticatedRequest, res: any) {
  if (!req.user) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      'User not authenticated',
    );
  }

  const id = parseInt(req.params.id as string, 10);
  const jobApplication = await JobApplicationService.getOne(id);

  // Verify the job application belongs to the current user
  if (jobApplication.userId !== req.user.userId) {
    throw new RouteError(
      HttpStatusCodes.FORBIDDEN,
      'You do not have permission to access this job application',
    );
  }

  res.status(HttpStatusCodes.OK).json({ jobApplication });
}

/**
 * Update a job application for the authenticated user.
 * @route PUT /api/job-applications/update/:id
 */
async function updateOne(req: AuthenticatedRequest, res: any) {
  if (!req.user) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      'User not authenticated',
    );
  }

  const id = parseInt(req.params.id as string, 10);
  
  if (!id) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      'Job application ID is required',
    );
  }

  // Verify the job application belongs to the current user
  const existingApp = await JobApplicationService.getOne(id);
  if (existingApp.userId !== req.user.userId) {
    throw new RouteError(
      HttpStatusCodes.FORBIDDEN,
      'You do not have permission to update this job application',
    );
  }

  const jobApplication: IJobApplication = {
    ...req.body,
    id,
    userId: req.user.userId, // Ensure userId is set from token
  };

  const updatedJobApplication =
    await JobApplicationService.updateOne(jobApplication);
  res
    .status(HttpStatusCodes.OK)
    .json({  updatedJobApplication });
}

/**
 * Delete a job application by id for the authenticated user.
 * @route DELETE /api/job-applications/delete/:id
 * @params id - Job application id
 * */
async function deleteOne(req: AuthenticatedRequest, res: any) {
  if (!req.user) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      'User not authenticated',
    );
  }

  const id = parseInt(req.params.id as string, 10);
  
  // Verify the job application belongs to the current user
  const jobApplication = await JobApplicationService.getOne(id);
  if (jobApplication.userId !== req.user.userId) {
    throw new RouteError(
      HttpStatusCodes.FORBIDDEN,
      'You do not have permission to delete this job application',
    );
  }

  await JobApplicationService.deleteOne(id);
  res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function changeStage(req: AuthenticatedRequest, res: any) {
  if (!req.user) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      'User not authenticated',
    );
  }

   const id = parseInt(req.params.id as string, 10);
  const { newStage } = req.body;

  // Verify the job application belongs to the current user
  const jobApplication = await JobApplicationService.getOne(id);
  if (jobApplication.userId !== req.user.userId) {
    throw new RouteError(
      HttpStatusCodes.FORBIDDEN,
      'You do not have permission to delete this job application',
    );
  }
  await JobApplicationService.changeStage(id, newStage, req.user.userId);
  res.status(HttpStatusCodes.OK).json({ message: 'Stage updated successfully' });
}


export default {
  getAll,
  addOne,
  getOne,
  updateOne,
  deleteOne,
  changeStage,
} as const;
