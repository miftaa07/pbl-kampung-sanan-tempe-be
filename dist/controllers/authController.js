"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../models/userModel");
const activityModel_1 = require("../models/activityModel");
const sanitizer_1 = require("../utils/sanitizer");
class AuthController {
    static async register(req, res) {
        try {
            const sanitized = (0, sanitizer_1.sanitizeObject)(req.body);
            const { name, email, password, role } = sanitized;
            const existingUser = await userModel_1.UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email sudah terdaftar dalam sistem',
                    errors: { email: 'Email sudah digunakan' }
                });
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const userId = await userModel_1.UserModel.create({
                name,
                email,
                password: hashedPassword,
                role: role || 'admin'
            });
            // Log activity
            await activityModel_1.ActivityModel.create({
                user_id: userId,
                action: 'Register User',
                module: 'Auth',
                description: `Pengguna baru "${name}" (${email}) dengan peran ${role || 'admin'} telah terdaftar.`
            });
            return res.status(201).json({
                success: true,
                message: 'Registrasi berhasil',
                data: {
                    id: userId,
                    name,
                    email,
                    role: role || 'admin'
                }
            });
        }
        catch (err) {
            console.error('[Register Error]:', err);
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat registrasi'
            });
        }
    }
    static async login(req, res) {
        try {
            const sanitized = (0, sanitizer_1.sanitizeObject)(req.body);
            const { email, password } = sanitized;
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email dan password wajib diisi',
                    errors: {
                        email: !email ? 'Email wajib diisi' : undefined,
                        password: !password ? 'Password wajib diisi' : undefined
                    }
                });
            }
            const user = await userModel_1.UserModel.findByEmail(email);
            if (!user || !user.password) {
                return res.status(401).json({
                    success: false,
                    message: 'Email atau password salah'
                });
            }
            const isMatch = await bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Email atau password salah'
                });
            }
            const secret = process.env.JWT_SECRET || 'sanan_tempe_super_secret_jwt_key_2026_!@#';
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }, secret, { expiresIn: '7d' });
            // Log activity
            await activityModel_1.ActivityModel.create({
                user_id: user.id,
                action: 'Login',
                module: 'Auth',
                description: `User "${user.name}" (${user.role}) berhasil login ke sistem admin.`
            });
            return res.json({
                success: true,
                message: 'Login berhasil',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }
        catch (err) {
            console.error('[Login Error]:', err);
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat login'
            });
        }
    }
    static async getMe(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Belum terautentikasi'
                });
            }
            const user = await userModel_1.UserModel.findById(req.user.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User tidak ditemukan'
                });
            }
            return res.json({
                success: true,
                data: user
            });
        }
        catch (err) {
            console.error('[GetMe Error]:', err);
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat mengambil profil'
            });
        }
    }
}
exports.AuthController = AuthController;
