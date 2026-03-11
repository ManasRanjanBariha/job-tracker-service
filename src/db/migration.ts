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

  console.log('Migrations completed successfully');
};
