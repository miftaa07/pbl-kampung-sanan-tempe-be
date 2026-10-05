import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Product {
  id?: number;
  store_id: number;
  name: string;
  image?: string;
  price: number;
  variant?: string;
  size?: string;
  description?: string;
  status: 'Tersedia' | 'Habis' | 'Pre-Order';
  created_at?: Date;
  updated_at?: Date;
  store_name?: string;
}

export class ProductModel {
  static async findAll(filters: { search?: string; store_id?: number; status?: string } = {}): Promise<Product[]> {
    let query = `
      SELECT p.*, s.name as store_name
      FROM products p
      LEFT JOIN stores s ON p.store_id = s.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters.search) {
      query += ` AND (p.name LIKE ? OR p.variant LIKE ? OR s.name LIKE ?)`;
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (filters.store_id) {
      query += ` AND p.store_id = ?`;
      params.push(filters.store_id);
    }

    if (filters.status && filters.status !== 'Semua') {
      query += ` AND p.status = ?`;
      params.push(filters.status);
    }

    query += ` ORDER BY p.id DESC`;

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Product[];
  }

  static async findById(id: number): Promise<Product | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, s.name as store_name
       FROM products p
       LEFT JOIN stores s ON p.store_id = s.id
       WHERE p.id = ? LIMIT 1`,
      [id]
    );
    return (rows[0] as Product) || null;
  }

  static async findByStoreId(storeId: number): Promise<Product[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, s.name as store_name
       FROM products p
       LEFT JOIN stores s ON p.store_id = s.id
       WHERE p.store_id = ?
       ORDER BY p.id DESC`,
      [storeId]
    );
    return rows as Product[];
  }

  static async create(product: Product): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO products (store_id, name, image, price, variant, size, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.store_id,
        product.name,
        product.image || null,
        product.price,
        product.variant || '',
        product.size || '',
        product.description || '',
        product.status || 'Tersedia'
      ]
    );
    return result.insertId;
  }

  static async update(id: number, product: Partial<Product>): Promise<boolean> {
    const fields: string[] = [];
    const params: any[] = [];

    const allowedKeys: (keyof Product)[] = [
      'store_id',
      'name',
      'image',
      'price',
      'variant',
      'size',
      'description',
      'status'
    ];

    for (const key of allowedKeys) {
      if (product[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(product[key]);
      }
    }

    if (fields.length === 0) return false;

    params.push(id);
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      params
    );

    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM products WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async countAll(): Promise<number> {
    const [rows]: any = await pool.query('SELECT COUNT(*) as count FROM products');
    return rows[0].count;
  }
}
