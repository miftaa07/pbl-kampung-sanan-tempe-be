import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'manager' | 'dosen';
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    return (rows[0] as User) || null;
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return (rows[0] as User) || null;
  }

  static async create(user: User): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [user.name, user.email, user.password, user.role || 'admin']
    );
    return result.insertId;
  }
}
