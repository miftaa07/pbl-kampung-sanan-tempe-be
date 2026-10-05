"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class UserModel {
    static async findByEmail(email) {
        const [rows] = await database_1.default.query('SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE email = ? LIMIT 1', [email]);
        return rows[0] || null;
    }
    static async findById(id) {
        const [rows] = await database_1.default.query('SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ? LIMIT 1', [id]);
        return rows[0] || null;
    }
    static async create(user) {
        const [result] = await database_1.default.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [user.name, user.email, user.password, user.role || 'admin']);
        return result.insertId;
    }
}
exports.UserModel = UserModel;
