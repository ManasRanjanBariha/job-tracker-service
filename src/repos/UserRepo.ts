import { IUser } from '@src/models/User.model';
import { getDB } from '@src/db/database';

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get one user by email.
 */
async function getOne(email: string): Promise<IUser | null> {
  const db = getDB();
  const user = await db.get<IUser>(
    'SELECT * FROM users WHERE email = ?',
    [email],
  );
  return user || null;
}

/**
 * Get one user by id.
 */
async function getById(id: number): Promise<IUser | null> {
  const db = getDB();
  const user = await db.get<IUser>(
    'SELECT * FROM users WHERE id = ?',
    [id],
  );
  return user || null;
}

/**
 * See if a user with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
  const user = await getById(id);
  return user !== null;
}

/**
 * Get all users.
 */
async function getAll(): Promise<IUser[]> {
  const db = getDB();
  const users = await db.all<IUser[]>(
    'SELECT * FROM users',
  );
  return users || [];
}

/**
 * Add one user.
 */
async function add(user: IUser): Promise<IUser> {
  const db = getDB();
  const result = await db.run(
    'INSERT INTO users (name, email, password, refreshToken, created) VALUES (?, ?, ?, ?, ?)',
    [user.name, user.email, user.password, user.refreshToken || '', user.created],
  );
  
  return {
    ...user,
    id: result.lastID || 0,
  };
}

/**
 * Update a user.
 */
async function update(user: IUser): Promise<void> {
  const db = getDB();
  await db.run(
    'UPDATE users SET name = ?, email = ?, password = ?, refreshToken = ? WHERE id = ?',
    [user.name, user.email, user.password, user.refreshToken || '', user.id],
  );
}

/**
 * Delete one user.
 */
async function delete_(id: number): Promise<void> {
  const db = getDB();
  await db.run(
    'DELETE FROM users WHERE id = ?',
    [id],
  );
}

// **** Unit-Tests Only **** //

/**
 * @testOnly
 *
 * Delete every user record.
 */
async function deleteAllUsers(): Promise<void> {
  const db = getDB();
  await db.run('DELETE FROM users');
}

/**
 * @testOnly
 *
 * Insert multiple users.
 */
async function insertMultiple(
  users: IUser[] | readonly IUser[],
): Promise<IUser[]> {
  const db = getDB();
  const insertedUsers: IUser[] = [];

  for (const user of users) {
    const result = await db.run(
      'INSERT INTO users (name, email, password, refreshToken, created) VALUES (?, ?, ?, ?, ?)',
      [user.name, user.email, user.password, user.refreshToken || '', user.created],
    );
    insertedUsers.push({
      ...user,
      id: result.lastID || 0,
    });
  }

  return insertedUsers;
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getOne,
  getById,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
  deleteAllUsers,
  insertMultiple,
} as const;
