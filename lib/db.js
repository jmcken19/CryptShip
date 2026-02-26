import Database from 'better-sqlite3';
import path from 'path';

let db;

function getDb() {
    if (!db) {
        const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'cryptship.db');
        db = new Database(dbPath);
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
        initTables();
    }
    return db;
}

function initTables() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
      reminder_opt_in INTEGER DEFAULT 0,
      last_visit DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      chain TEXT NOT NULL,
      waypoint INTEGER NOT NULL,
      completed INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, chain, waypoint)
    );

    CREATE TABLE IF NOT EXISTS reset_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      code TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      used INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
}

export function createUser(email, passwordHash) {
    const stmt = getDb().prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
    const result = stmt.run(email, passwordHash);
    return result.lastInsertRowid;
}

export function findUserByEmail(email) {
    const stmt = getDb().prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
}

export function findUserById(id) {
    const stmt = getDb().prepare('SELECT id, email, created_at, last_login, reminder_opt_in FROM users WHERE id = ?');
    return stmt.get(id);
}

export function updateLastLogin(userId) {
    const stmt = getDb().prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?');
    return stmt.run(userId);
}

export function updatePassword(userId, newPasswordHash) {
    const stmt = getDb().prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    return stmt.run(newPasswordHash, userId);
}

export function getProgress(userId) {
    const stmt = getDb().prepare('SELECT chain, waypoint, completed FROM progress WHERE user_id = ?');
    return stmt.all(userId);
}

export function setProgress(userId, chain, waypoint, completed) {
    const stmt = getDb().prepare(`
    INSERT INTO progress (user_id, chain, waypoint, completed, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, chain, waypoint)
    DO UPDATE SET completed = excluded.completed, updated_at = CURRENT_TIMESTAMP
  `);
    return stmt.run(userId, chain, waypoint, completed ? 1 : 0);
}

export function createResetCode(userId, code, expiresAt) {
    const stmt = getDb().prepare('INSERT INTO reset_codes (user_id, code, expires_at) VALUES (?, ?, ?)');
    return stmt.run(userId, code, expiresAt);
}

export function findValidResetCode(userId, code) {
    const stmt = getDb().prepare(
        'SELECT * FROM reset_codes WHERE user_id = ? AND code = ? AND used = 0 AND expires_at > CURRENT_TIMESTAMP ORDER BY created_at DESC LIMIT 1'
    );
    return stmt.get(userId, code);
}

export function markResetCodeUsed(codeId) {
    const stmt = getDb().prepare('UPDATE reset_codes SET used = 1 WHERE id = ?');
    return stmt.run(codeId);
}

export function countRecentResetCodes(userId, sinceMinutes = 10) {
    const stmt = getDb().prepare(
        `SELECT COUNT(*) as count FROM reset_codes WHERE user_id = ? AND created_at > datetime('now', '-' || ? || ' minutes')`
    );
    return stmt.get(userId, sinceMinutes).count;
}

export function updateReminderOptIn(userId, optIn) {
    const stmt = getDb().prepare('UPDATE users SET reminder_opt_in = ? WHERE id = ?');
    return stmt.run(optIn ? 1 : 0, userId);
}

export function updateLastVisit(userId) {
    const stmt = getDb().prepare('UPDATE users SET last_visit = CURRENT_TIMESTAMP WHERE id = ?');
    return stmt.run(userId);
}

export default getDb;
