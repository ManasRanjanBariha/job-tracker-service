import  sqlite3  from "sqlite3";
import { Database,open } from "sqlite";

let db: Database<sqlite3.Database, sqlite3.Statement>;

export const connectDB = async () => {
  db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  console.log("SQLite database connected");

  return db;
};

/**
 * Get database instance
 */
export const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
};