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
  const jobApplications = await JobApplicationService.getAll();
  res.status(HttpStatusCodes.OK).json({ jobApplications });
}

/**
 * Add a new job application for the authenticated user.
 * @route POST /api/job-applications/add
 */
async function addOne(req: AuthenticatedRequest, res: any) {
  const jobApplication: IJobApplication = req.body;
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
  const id = parseInt(req.params.id as string, 10);
  const jobApplication = await JobApplicationService.getOne(id);
  res.status(HttpStatusCodes.OK).json({ jobApplication });
}

/**
 * Update a job application for the authenticated user.
 * @route PUT /api/job-applications/update
 */
async function updateOne(req: AuthenticatedRequest, res: any) {
  const jobApplication: IJobApplication = req.body;
  const updatedJobApplication =
    await JobApplicationService.updateOne(jobApplication);
  res
    .status(HttpStatusCodes.OK)
    .json({ jobApplication: updatedJobApplication });
}

/**
 * Delete a job application by id for the authenticated user.
 * @route DELETE /api/job-applications/delete/:id
 * @params id - Job application id
 * */
async function deleteOne(req: AuthenticatedRequest, res: any) {
  const id = parseInt(req.params.id as string, 10);
  await JobApplicationService.deleteOne(id);
  res.status(HttpStatusCodes.NO_CONTENT).end();
}

export default {
  getAll,
  addOne,
  getOne,
  updateOne,
  deleteOne,
} as const;
