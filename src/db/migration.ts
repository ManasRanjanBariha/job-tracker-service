import { getDB } from './database';

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Run all migrations
 */
export const runMigrations = async () => {
  const db = getDB();

  // Create users table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      refreshToken TEXT,
      created DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create job_applications table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS job_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      stage TEXT NOT NULL DEFAULT 'Applied',
      salary INTEGER DEFAULT 0,
      appliedDate DATETIME NOT NULL,
      interviewDate DATETIME,
      note TEXT,
      jobUrl TEXT,
      created DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create documents table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      applicationId INTEGER NOT NULL,
      fileName TEXT NOT NULL,
      filePath TEXT NOT NULL,
      docType TEXT NOT NULL,
      uploadedAt DATETIME NOT NULL,
      created DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (applicationId) REFERENCES job_applications(id) ON DELETE CASCADE
    )
  `);

  await db.exec(`CREATE TABLE IF NOT EXISTS application_stage_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  applicationId INTEGER NOT NULL,
  userId INTEGER NOT NULL,
  stage TEXT NOT NULL,
  changedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (applicationId) REFERENCES job_applications(id) ON DELETE CASCADE
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);`);

  console.log('Migrations completed successfully');
};
