"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const multer_1 = __importDefault(require("multer"));
function errorHandler(err, req, res, next) {
    console.error('[Error Middleware]:', err);
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Ukuran file terlalu besar. Maksimal 5 MB.'
            });
        }
        return res.status(400).json({
            success: false,
            message: `Error saat upload file: ${err.message}`
        });
    }
    if (err.message && err.message.includes('Hanya file gambar')) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    return res.status(500).json({
        success: false,
        message: err.message || 'Terjadi kesalahan internal server'
    });
}
