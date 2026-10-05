"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class StoreModel {
    static async findAll(filters = {}) {
        let query = `
      SELECT s.*, 
        (SELECT COUNT(*) FROM products p WHERE p.store_id = s.id) as product_count
      FROM stores s
      WHERE 1=1
    `;
        const params = [];
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
        const [rows] = await database_1.default.query(query, params);
        return rows;
    }
    static async findById(id) {
        const [rows] = await database_1.default.query('SELECT * FROM stores WHERE id = ? LIMIT 1', [id]);
        if (rows.length === 0)
            return null;
        const store = rows[0];
        // Get all products belonging to this store
        const [products] = await database_1.default.query('SELECT * FROM products WHERE store_id = ? ORDER BY id DESC', [id]);
        store.products = products;
        return store;
    }
    static async create(store) {
        const [result] = await database_1.default.query(`INSERT INTO stores (name, owner, address, gmaps_link, area, whatsapp, description, image, latitude, longitude, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
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
        ]);
        return result.insertId;
    }
    static async update(id, store) {
        const fields = [];
        const params = [];
        const allowedKeys = [
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
        if (fields.length === 0)
            return false;
        params.push(id);
        const [result] = await database_1.default.query(`UPDATE stores SET ${fields.join(', ')} WHERE id = ?`, params);
        return result.affectedRows > 0;
    }
    static async delete(id) {
        const [result] = await database_1.default.query('DELETE FROM stores WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    static async countAll() {
        const [rows] = await database_1.default.query('SELECT COUNT(*) as count FROM stores');
        return rows[0].count;
    }
    static async countActive() {
        const [rows] = await database_1.default.query("SELECT COUNT(*) as count FROM stores WHERE status = 'Aktif'");
        return rows[0].count;
    }
}
exports.StoreModel = StoreModel;
