// This is a template for connecting to your SQL database using Node.js

/**
 * Database Connection Template
 *
 * For PostgreSQL (using node-postgres):
 * ====================================
 * import { Pool } from 'pg'
 *
 * const pool = new Pool({
 *   user: process.env.DB_USER,
 *   host: process.env.DB_HOST,
 *   database: process.env.DB_NAME,
 *   password: process.env.DB_PASSWORD,
 *   port: parseInt(process.env.DB_PORT || '5432'),
 * })
 *
 * export async function query(text: string, params?: any[]) {
 *   const start = Date.now()
 *   try {
 *     const result = await pool.query(text, params)
 *     console.log('[v0] Query executed in', Date.now() - start, 'ms')
 *     return result
 *   } catch (error) {
 *     console.error('[v0] Database error:', error)
 *     throw error
 *   }
 * }
 *
 * export default pool
 *
 * For MySQL (using mysql2):
 * =========================
 * import mysql from 'mysql2/promise'
 *
 * export async function query(sql: string, params?: any[]) {
 *   const connection = await mysql.createConnection({
 *     host: process.env.DB_HOST,
 *     user: process.env.DB_USER,
 *     password: process.env.DB_PASSWORD,
 *     database: process.env.DB_NAME,
 *   })
 *
 *   try {
 *     const [results] = await connection.execute(sql, params)
 *     return results
 *   } finally {
 *     await connection.end()
 *   }
 * }
 *
 * For Neon (PostgreSQL):
 * ====================
 * import { neon } from '@neondatabase/serverless'
 *
 * const sql = neon(process.env.DATABASE_URL)
 *
 * export async function query(text: string, params?: any[]) {
 *   return await sql(text, params)
 * }
 */

// Placeholder function - uncomment and implement the database connection above
export async function query(text: string, params?: any[]) {
  throw new Error("Database connection not configured. See comments in db.ts")
}
