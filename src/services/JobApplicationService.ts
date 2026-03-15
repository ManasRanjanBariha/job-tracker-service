import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import { RouteError } from "@src/common/utils/route-errors";
import { IJobApplication } from "@src/models/JobApplication.model";
import JobApplicationRepo from "@src/repos/JobApplicationRepo";
import StageHistoryRepo from "@src/repos/StageHistoryRepo";


const Errors = {
  JOB_APPLICATION_NOT_FOUND: "Job application not found",
  JOB_APPLICATION_ALREADY_EXISTS: "Job application already exists",
  JOB_APPLICATION_INVALID_USER: "Job application does not belong to the user",
} as const;


// Get all job applications for a user.
function getAll(): Promise<IJobApplication[]> {
  return JobApplicationRepo.getAll();
}

// Get all job applications for a specific user.
function getAllByUserId(userId: number): Promise<IJobApplication[]> {
  return JobApplicationRepo.getAllByUserId(userId);
}

// Add a new job application.
async function addOne(jobApplication: IJobApplication): Promise<IJobApplication> {
  const newJobApplication =await JobApplicationRepo.add(jobApplication);
  console.log("New job application added:", newJobApplication);
  await StageHistoryRepo.addStageHistory(newJobApplication?.id!, newJobApplication?.stage, newJobApplication?.userId);
  return newJobApplication;

}
// Get one job application by id.
async function getOne(id: number): Promise<IJobApplication> {
  const jobApplication = await JobApplicationRepo.getOne(id);  
    if (!jobApplication) { 
        throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.JOB_APPLICATION_NOT_FOUND);
    }  
    return jobApplication;
}

// Update a job application.
async function updateOne(jobApplication: IJobApplication): Promise<IJobApplication> {
  const persists = await JobApplicationRepo.persists(jobApplication.id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.JOB_APPLICATION_NOT_FOUND);
  }
  return JobApplicationRepo.update(jobApplication);
}

// Delete a job application by id.
async function deleteOne(id: number): Promise<void> {
  const persists = await JobApplicationRepo.persists(id); 
    if (!persists) {
        throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.JOB_APPLICATION_NOT_FOUND);
    }
    return JobApplicationRepo.deleteById(id);
}
async function changeStage(applicationId: number, newStage: string,userId:number): Promise<void> {
  const persists = await JobApplicationRepo.persists(applicationId);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.JOB_APPLICATION_NOT_FOUND);
  }
   await JobApplicationRepo.changeStage(applicationId, newStage,userId);
   await StageHistoryRepo.addStageHistory(applicationId, newStage,userId);
}

export default {
    Errors,
    getAll,
    getAllByUserId,
    addOne,
    getOne,
    updateOne,
    deleteOne,
    changeStage
}