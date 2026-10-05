import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Store {
  id?: number;
  name: string;
  owner: string;
  address: string;
  gmaps_link?: string | null;
  area: string;
  whatsapp: string;
  description?: string;
  image?: string;
  latitude?: number | null;
  longitude?: number | null;
  status: 'Aktif' | 'Menunggu' | 'Tutup Sementara';
  created_at?: Date;
  updated_at?: Date;
  products?: any[];
}

export class StoreModel {
  static async findAll(filters: { search?: string; status?: string } = {}): Promise<Store[]> {
    let query = `
      SELECT s.*, 
        (SELECT COUNT(*) FROM products p WHERE p.store_id = s.id) as product_count
      FROM stores s
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters.search) {
      query += ` AND (s.name LIKE ? OR s.owner LIKE ? OR s.area LIKE ? OR s.address LIKE ?)`;
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (filters.status && filters.status !== 'Semua') {
      query += ` AND s.status = ?`;
      params.push(filters.status);
    }

    query += ` ORDER BY s.id DESC`;

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Store[];
  }

  static async findById(id: number): Promise<Store | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM stores WHERE id = ? LIMIT 1',
      [id]
    );

    if (rows.length === 0) return null;

    const store = rows[0] as Store;

    // Get all products belonging to this store
    const [products] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM products WHERE store_id = ? ORDER BY id DESC',
      [id]
    );
    store.products = products;

    return store;
  }

  static async create(store: Store): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO stores (name, owner, address, gmaps_link, area, whatsapp, description, image, latitude, longitude, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        store.name,
        store.owner,
        store.address,
        store.gmaps_link || null,
        store.area,
        store.whatsapp,
        store.description || '',
        store.image || null,
        store.latitude || null,
        store.longitude || null,
        store.status || 'Aktif'
      ]
    );
    return result.insertId;
  }

  static async update(id: number, store: Partial<Store>): Promise<boolean> {
    const fields: string[] = [];
    const params: any[] = [];

    const allowedKeys: (keyof Store)[] = [
      'name',
      'owner',
      'address',
      'gmaps_link',
      'area',
      'whatsapp',
      'description',
      'image',
      'latitude',
      'longitude',
      'status'
    ];

    for (const key of allowedKeys) {
      if (store[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(store[key]);
      }
    }

    if (fields.length === 0) return false;

    params.push(id);
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE stores SET ${fields.join(', ')} WHERE id = ?`,
      params
    );

    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM stores WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async countAll(): Promise<number> {
    const [rows]: any = await pool.query('SELECT COUNT(*) as count FROM stores');
    return rows[0].count;
  }

  static async countActive(): Promise<number> {
    const [rows]: any = await pool.query("SELECT COUNT(*) as count FROM stores WHERE status = 'Aktif'");
    return rows[0].count;
  }
}
