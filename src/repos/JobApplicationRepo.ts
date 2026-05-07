import { IJobApplication } from "@src/models/JobApplication.model";
import { getDB } from "@src/db/database";


/******************************************************************************
 *                               Functions      
 * *****************************************************************************/


// Get all job applications.
async function getAll(): Promise<IJobApplication[]> {
  const db = getDB();
  const jobApplications = await db.all<IJobApplication[]>(
    'SELECT * FROM job_applications',
  );
  return jobApplications || [];
}

// Get job applications for a specific user.
async function getAllByUserId(userId: number): Promise<IJobApplication[]> {
  const db = getDB();
  const jobApplications = await db.all<IJobApplication[]>(
    'SELECT * FROM job_applications WHERE userId = ?',
    [userId],
  );
  return jobApplications || [];
}

// Add a new job application.
async function add(jobApplication: IJobApplication): Promise<IJobApplication> {
  const db = getDB();
    const result = await db.run(
        "INSERT INTO job_applications (userId, company, role, stage, salary, appliedDate, interviewDate, note, jobUrl, location, priority, source, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [jobApplication.userId, jobApplication.company, jobApplication.role, jobApplication.stage, jobApplication.salary, jobApplication.appliedDate, jobApplication.interviewDate || null, jobApplication.note, jobApplication.jobUrl, jobApplication.location || null, jobApplication.priority || null, jobApplication.source || null, jobApplication.status || null]
    );
    return { ...jobApplication, id: result.lastID as number };
}

// get one job application by id.
async function getOne(id: number): Promise<IJobApplication | null> {
  const db = getDB();
  const jobApplication = await db.get<IJobApplication>(
    'SELECT * FROM job_applications WHERE id = ?',
    [id]
  );
  return jobApplication || null;
}

// update a job application.
async function update(jobApplication: IJobApplication): Promise<IJobApplication> {
  const db = getDB();  
  console.log("Updating job application:", jobApplication);  
    await db.run(
        "UPDATE job_applications SET company = ?, role = ?, stage = ?, appliedDate = ?, note = ?, location = ?, priority = ?, source = ?, status = ? WHERE id = ? and userId = ?",
        [jobApplication.company, jobApplication.role, jobApplication.stage, jobApplication.appliedDate, jobApplication.note, jobApplication.location, jobApplication.priority, jobApplication.source, jobApplication.status, jobApplication.id, jobApplication.userId]
    );
    return jobApplication;
}

// delete a job application by id.
async function deleteById(id: number): Promise<void> { 
    const db = getDB();
    await db.run(
        "DELETE FROM job_applications WHERE id = ?",
        [id]
    );
}

async function changeStage(applicationId: number, newStage: string,userId:number): Promise<void> {
    const db = getDB();
    await db.run(
        "UPDATE job_applications SET stage = ? WHERE id = ? AND userId = ?",
        [newStage, applicationId]
    );
}

// check if a job application with the given id exists.
async function persists(id: number): Promise<boolean> {
  const jobApplication = await getOne(id);
  return jobApplication !== null;
}

async function getlastSixApplications(userId: number): Promise<IJobApplication[]> {
  const db = getDB();
  const jobApplications = await db.all<IJobApplication[]>(
    'SELECT * FROM job_applications WHERE userId = ? ORDER BY appliedDate DESC LIMIT 6',
    [userId]
  );
  return jobApplications || [];
}

export default{
    getAll,
    getAllByUserId,
    add,
    getOne,
    update,
    deleteById,
    persists,
    changeStage,
    getlastSixApplications
}