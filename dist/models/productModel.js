"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class ProductModel {
    static async findAll(filters = {}) {
        let query = `
      SELECT p.*, s.name as store_name
      FROM products p
      LEFT JOIN stores s ON p.store_id = s.id
      WHERE 1=1
    `;
        const params = [];
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
        const [rows] = await database_1.default.query(query, params);
        return rows;
    }
    static async findById(id) {
        const [rows] = await database_1.default.query(`SELECT p.*, s.name as store_name
       FROM products p
       LEFT JOIN stores s ON p.store_id = s.id
       WHERE p.id = ? LIMIT 1`, [id]);
        return rows[0] || null;
    }
    static async findByStoreId(storeId) {
        const [rows] = await database_1.default.query(`SELECT p.*, s.name as store_name
       FROM products p
       LEFT JOIN stores s ON p.store_id = s.id
       WHERE p.store_id = ?
       ORDER BY p.id DESC`, [storeId]);
        return rows;
    }
    static async create(product) {
        const [result] = await database_1.default.query(`INSERT INTO products (store_id, name, image, price, variant, size, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            product.store_id,
            product.name,
            product.image || null,
            product.price,
            product.variant || '',
            product.size || '',
            product.description || '',
            product.status || 'Tersedia'
        ]);
        return result.insertId;
    }
    static async update(id, product) {
        const fields = [];
        const params = [];
        const allowedKeys = [
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
        if (fields.length === 0)
            return false;
        params.push(id);
        const [result] = await database_1.default.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, params);
        return result.affectedRows > 0;
    }
    static async delete(id) {
        const [result] = await database_1.default.query('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    static async countAll() {
        const [rows] = await database_1.default.query('SELECT COUNT(*) as count FROM products');
        return rows[0].count;
    }
}
exports.ProductModel = ProductModel;
