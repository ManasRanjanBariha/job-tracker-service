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

// Add a new job application.
async function add(jobApplication: IJobApplication): Promise<IJobApplication> {
  const db = getDB();
    const result = await db.run(
        "INSERT INTO job_applications (company, role, stage, appliedDate, note) VALUES (?, ?, ?, ?, ?)",
        [jobApplication.company, jobApplication.role, jobApplication.stage, jobApplication.appliedDate, jobApplication.note]
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
    await db.run(
        "UPDATE job_applications SET company = ?, role = ?, stage = ?, appliedDate = ?, note = ? WHERE id = ?",
        [jobApplication.company, jobApplication.role, jobApplication.stage, jobApplication.appliedDate, jobApplication.note, jobApplication.id]
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

// check if a job application with the given id exists.
async function persists(id: number): Promise<boolean> {
  const jobApplication = await getOne(id);
  return jobApplication !== null;
}

export default{
    getAll,
    add,
    getOne,
    update,
    deleteById,
    persists,
}