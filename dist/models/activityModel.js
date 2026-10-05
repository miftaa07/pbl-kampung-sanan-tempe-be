"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class ActivityModel {
    static async create(log) {
        const [result] = await database_1.default.query('INSERT INTO activity_logs (user_id, action, module, description) VALUES (?, ?, ?, ?)', [log.user_id || null, log.action, log.module, log.description]);
        return result.insertId;
    }
    static async getRecent(limit = 10) {
        const [rows] = await database_1.default.query(`SELECT a.*, u.name as user_name, u.role as user_role
       FROM activity_logs a
       LEFT JOIN users u ON a.user_id = u.id
       ORDER BY a.id DESC
       LIMIT ?`, [limit]);
        return rows;
    }
    static async findAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [countRows] = await database_1.default.query('SELECT COUNT(*) as count FROM activity_logs');
        const total = countRows[0].count;
        const [rows] = await database_1.default.query(`SELECT a.*, u.name as user_name, u.role as user_role
       FROM activity_logs a
       LEFT JOIN users u ON a.user_id = u.id
       ORDER BY a.id DESC
       LIMIT ? OFFSET ?`, [limit, offset]);
        return {
            logs: rows,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
}
exports.ActivityModel = ActivityModel;
