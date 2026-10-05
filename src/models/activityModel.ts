import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface ActivityLog {
  id?: number;
  user_id?: number | null;
  user_name?: string;
  action: string;
  module: string;
  description: string;
  created_at?: Date;
}

export class ActivityModel {
  static async create(log: { user_id?: number | null; action: string; module: string; description: string }): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO activity_logs (user_id, action, module, description) VALUES (?, ?, ?, ?)',
      [log.user_id || null, log.action, log.module, log.description]
    );
    return result.insertId;
  }

  static async getRecent(limit: number = 10): Promise<ActivityLog[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT a.*, u.name as user_name, u.role as user_role
       FROM activity_logs a
       LEFT JOIN users u ON a.user_id = u.id
       ORDER BY a.id DESC
       LIMIT ?`,
      [limit]
    );
    return rows as ActivityLog[];
  }

  static async findAll(page: number = 1, limit: number = 10): Promise<{ logs: ActivityLog[]; total: number; page: number; totalPages: number }> {
    const offset = (page - 1) * limit;

    const [countRows]: any = await pool.query('SELECT COUNT(*) as count FROM activity_logs');
    const total = countRows[0].count;

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT a.*, u.name as user_name, u.role as user_role
       FROM activity_logs a
       LEFT JOIN users u ON a.user_id = u.id
       ORDER BY a.id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return {
      logs: rows as ActivityLog[],
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }
}
