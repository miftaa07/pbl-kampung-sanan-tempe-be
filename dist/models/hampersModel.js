"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HampersModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class HampersModel {
    static async findAll(filters = {}) {
        let query = `
      SELECT h.*, 
        COUNT(hi.id) as item_count,
        COALESCE(SUM(hi.quantity), 0) as total_products
      FROM hampers h
      LEFT JOIN hampers_items hi ON h.id = hi.hampers_id
      WHERE 1=1
    `;
        const params = [];
        if (filters.search) {
            query += ` AND (h.name LIKE ? OR h.description LIKE ?)`;
            const searchPattern = `%${filters.search}%`;
            params.push(searchPattern, searchPattern);
        }
        if (filters.status && filters.status !== 'Semua') {
            query += ` AND h.status = ?`;
            params.push(filters.status);
        }
        query += ` GROUP BY h.id ORDER BY h.id DESC`;
        const [rows] = await database_1.default.query(query, params);
        // Fetch items for each hamper
        const hampersList = rows;
        for (const h of hampersList) {
            const [items] = await database_1.default.query(`SELECT hi.*, p.name as product_name, p.price as product_price, p.image as product_image, s.name as store_name
         FROM hampers_items hi
         JOIN products p ON hi.product_id = p.id
         LEFT JOIN stores s ON p.store_id = s.id
         WHERE hi.hampers_id = ?`, [h.id]);
            h.items = items;
        }
        return hampersList;
    }
    static async findById(id) {
        const [rows] = await database_1.default.query('SELECT * FROM hampers WHERE id = ? LIMIT 1', [id]);
        if (rows.length === 0)
            return null;
        const hamper = rows[0];
        const [items] = await database_1.default.query(`SELECT hi.*, p.name as product_name, p.price as product_price, p.image as product_image, s.name as store_name
       FROM hampers_items hi
       JOIN products p ON hi.product_id = p.id
       LEFT JOIN stores s ON p.store_id = s.id
       WHERE hi.hampers_id = ?`, [id]);
        hamper.items = items;
        return hamper;
    }
    static async create(hamper, items = []) {
        const connection = await database_1.default.getConnection();
        try {
            await connection.beginTransaction();
            const [result] = await connection.query(`INSERT INTO hampers (name, description, image, price, status)
         VALUES (?, ?, ?, ?, ?)`, [
                hamper.name,
                hamper.description || '',
                hamper.image || null,
                hamper.price,
                hamper.status || 'Aktif'
            ]);
            const hampersId = result.insertId;
            if (items && items.length > 0) {
                const itemValues = items.map((item) => [hampersId, item.product_id, item.quantity || 1]);
                await connection.query('INSERT INTO hampers_items (hampers_id, product_id, quantity) VALUES ?', [itemValues]);
            }
            await connection.commit();
            return hampersId;
        }
        catch (err) {
            await connection.rollback();
            throw err;
        }
        finally {
            connection.release();
        }
    }
    static async update(id, hamper, items) {
        const connection = await database_1.default.getConnection();
        try {
            await connection.beginTransaction();
            const fields = [];
            const params = [];
            const allowedKeys = ['name', 'description', 'image', 'price', 'status'];
            for (const key of allowedKeys) {
                if (hamper[key] !== undefined) {
                    fields.push(`${key} = ?`);
                    params.push(hamper[key]);
                }
            }
            if (fields.length > 0) {
                params.push(id);
                await connection.query(`UPDATE hampers SET ${fields.join(', ')} WHERE id = ?`, params);
            }
            if (items !== undefined) {
                // Replace items
                await connection.query('DELETE FROM hampers_items WHERE hampers_id = ?', [id]);
                if (items.length > 0) {
                    const itemValues = items.map((item) => [id, item.product_id, item.quantity || 1]);
                    await connection.query('INSERT INTO hampers_items (hampers_id, product_id, quantity) VALUES ?', [itemValues]);
                }
            }
            await connection.commit();
            return true;
        }
        catch (err) {
            await connection.rollback();
            throw err;
        }
        finally {
            connection.release();
        }
    }
    static async delete(id) {
        const [result] = await database_1.default.query('DELETE FROM hampers WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    static async countAll() {
        const [rows] = await database_1.default.query('SELECT COUNT(*) as count FROM hampers');
        return rows[0].count;
    }
}
exports.HampersModel = HampersModel;
