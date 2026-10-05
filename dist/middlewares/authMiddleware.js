"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.roleMiddleware = roleMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Akses ditolak: Token autentikasi tidak ditemukan'
        });
    }
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'sanan_tempe_super_secret_jwt_key_2026_!@#';
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Token kedaluwarsa atau tidak valid'
        });
    }
}
function roleMiddleware(roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Akses ditolak: Anda tidak memiliki izin untuk aksi ini'
            });
        }
        next();
    };
}
