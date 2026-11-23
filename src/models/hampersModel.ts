import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface HampersItem {
  id?: number;
  hampers_id?: number;
  product_id: number;
  quantity: number;
  product_name?: string;
  product_price?: number;
  product_image?: string;
  store_name?: string;
}

export interface Hampers {
  id?: number;
  name: string;
  description?: string;
  image?: string;
  price: number;
  status: 'Aktif' | 'Nonaktif' | 'Habis';
  created_at?: Date;
  updated_at?: Date;
  items?: HampersItem[];
  item_count?: number;
}

export class HampersModel {
  static async findAll(filters: {
    search?: string;
    status?: string;
    storeId?: number;
  } = {}): Promise<Hampers[]> {
    const { where, params } = this.buildWhereClause(filters);
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT h.*,
        COUNT(hi.id) as item_count,
        COALESCE(SUM(hi.quantity), 0) as total_products
       FROM hampers h
       LEFT JOIN hampers_items hi ON h.id = hi.hampers_id
       ${where}
       GROUP BY h.id
       ORDER BY h.id DESC`,
      params
    );

    return this.attachItems(rows as Hampers[]);
  }

  static async findAllPaginated(
    filters: { search?: string; status?: string; storeId?: number } = {},
    page: number = 1,
    perPage: number = 10
  ) {
    const { where, params } = this.buildWhereClause(filters);
    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total
       FROM hampers h
       ${where}`,
      params
    );
    const totalData = Number(countRows[0].total);
    const totalPages = Math.ceil(totalData / perPage);
    const offset = (page - 1) * perPage;
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT h.*,
        COUNT(hi.id) as item_count,
        COALESCE(SUM(hi.quantity), 0) as total_products
       FROM hampers h
       LEFT JOIN hampers_items hi ON h.id = hi.hampers_id
       ${where}
       GROUP BY h.id
       ORDER BY h.id DESC
       LIMIT ? OFFSET ?`,
      [...params, perPage, offset]
    );

    return {
      data: await this.attachItems(rows as Hampers[]),
      pagination: { currentPage: page, perPage, totalData, totalPages }
    };
  }

  private static buildWhereClause(filters: {
    search?: string;
    status?: string;
    storeId?: number;
  }) {
    let where = 'WHERE 1=1';
    const params: (string | number)[] = [];

    if (filters.search) {
      where += ` AND (h.name LIKE ? OR h.description LIKE ?)`;
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern);
    }

    if (filters.status && filters.status !== 'Semua') {
      where += ` AND h.status = ?`;
      params.push(filters.status);
    }

    if (filters.storeId !== undefined) {
      where += ` AND EXISTS (
        SELECT 1
        FROM hampers_items hi
        JOIN products p ON hi.product_id = p.id
        WHERE hi.hampers_id = h.id AND p.store_id = ?
      )`;
      params.push(filters.storeId);
    }

    return { where, params };
  }

  private static async attachItems(hampersList: Hampers[]): Promise<Hampers[]> {
    for (const h of hampersList) {
      const [items] = await pool.query<RowDataPacket[]>(
        `SELECT hi.*, p.name as product_name, p.price as product_price, p.image as product_image, s.name as store_name
         FROM hampers_items hi
         JOIN products p ON hi.product_id = p.id
         LEFT JOIN stores s ON p.store_id = s.id
         WHERE hi.hampers_id = ?`,
        [h.id]
      );
      h.items = items as HampersItem[];
    }

    return hampersList;
  }

  static async findById(id: number): Promise<Hampers | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM hampers WHERE id = ? LIMIT 1',
      [id]
    );

    if (rows.length === 0) return null;

    const hamper = rows[0] as Hampers;

    const [items] = await pool.query<RowDataPacket[]>(
      `SELECT hi.*, p.name as product_name, p.price as product_price, p.image as product_image, s.name as store_name
       FROM hampers_items hi
       JOIN products p ON hi.product_id = p.id
       LEFT JOIN stores s ON p.store_id = s.id
       WHERE hi.hampers_id = ?`,
      [id]
    );
    hamper.items = items as HampersItem[];

    return hamper;
  }

  static async create(hamper: Hampers, items: { product_id: number; quantity: number }[] = []): Promise<number> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO hampers (name, description, image, price, status)
         VALUES (?, ?, ?, ?, ?)`,
        [
          hamper.name,
          hamper.description || '',
          hamper.image || null,
          hamper.price,
          hamper.status || 'Aktif'
        ]
      );
      const hampersId = result.insertId;

      if (items && items.length > 0) {
        const itemValues = items.map((item) => [hampersId, item.product_id, item.quantity || 1]);
        await connection.query(
          'INSERT INTO hampers_items (hampers_id, product_id, quantity) VALUES ?',
          [itemValues]
        );
      }

      await connection.commit();
      return hampersId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async update(id: number, hamper: Partial<Hampers>, items?: { product_id: number; quantity: number }[]): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const fields: string[] = [];
      const params: any[] = [];

      const allowedKeys: (keyof Hampers)[] = ['name', 'description', 'image', 'price', 'status'];

      for (const key of allowedKeys) {
        if (hamper[key] !== undefined) {
          fields.push(`${key} = ?`);
          params.push(hamper[key]);
        }
      }

      if (fields.length > 0) {
        params.push(id);
        await connection.query<ResultSetHeader>(
          `UPDATE hampers SET ${fields.join(', ')} WHERE id = ?`,
          params
        );
      }

      if (items !== undefined) {
        // Replace items
        await connection.query('DELETE FROM hampers_items WHERE hampers_id = ?', [id]);
        if (items.length > 0) {
          const itemValues = items.map((item) => [id, item.product_id, item.quantity || 1]);
          await connection.query(
            'INSERT INTO hampers_items (hampers_id, product_id, quantity) VALUES ?',
            [itemValues]
          );
        }
      }

      await connection.commit();
      return true;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM hampers WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async countAll(): Promise<number> {
    const [rows]: any = await pool.query('SELECT COUNT(*) as count FROM hampers');
    return rows[0].count;
  }
}
