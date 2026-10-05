"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hampersValidationRules = exports.productValidationRules = exports.storeValidationRules = exports.priceValidation = exports.whatsappValidation = exports.nameValidation = exports.passwordValidation = exports.emailValidation = void 0;
const express_validator_1 = require("express-validator");
// Email validation
exports.emailValidation = (0, express_validator_1.body)('email')
    .isEmail()
    .withMessage('Format email tidak valid')
    .normalizeEmail();
// Password validation
exports.passwordValidation = (0, express_validator_1.body)('password')
    .isLength({ min: 6 })
    .withMessage('Password minimal 6 karakter');
// Name validation (Huruf, spasi, karakter nama umum)
const nameValidation = (field = 'name', label = 'Nama') => (0, express_validator_1.body)(field)
    .trim()
    .notEmpty()
    .withMessage(`${label} tidak boleh kosong`)
    .matches(/^[a-zA-Z0-9\s.,'’\-–()]+$/)
    .withMessage(`${label} mengandung karakter terlarang`);
exports.nameValidation = nameValidation;
// WhatsApp validation (+ dan angka)
exports.whatsappValidation = (0, express_validator_1.body)('whatsapp')
    .trim()
    .notEmpty()
    .withMessage('Nomor WhatsApp tidak boleh kosong')
    .matches(/^\+?[0-9]{9,16}$/)
    .withMessage('Nomor WhatsApp hanya boleh berisi angka dan diawali dengan tanda + (9-16 digit)');
// Price validation
const priceValidation = (field = 'price', label = 'Harga') => (0, express_validator_1.body)(field)
    .notEmpty()
    .withMessage(`${label} tidak boleh kosong`)
    .isFloat({ min: 0 })
    .withMessage(`${label} harus berupa angka positif`);
exports.priceValidation = priceValidation;
// Store form validation rules
exports.storeValidationRules = [
    (0, exports.nameValidation)('name', 'Nama Toko'),
    (0, exports.nameValidation)('owner', 'Nama Pemilik'),
    (0, express_validator_1.body)('address').trim().notEmpty().withMessage('Alamat toko tidak boleh kosong'),
    (0, express_validator_1.body)('area').trim().notEmpty().withMessage('Kawasan / Area tidak boleh kosong'),
    exports.whatsappValidation,
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['Aktif', 'Menunggu', 'Tutup Sementara'])
        .withMessage('Status toko harus Aktif, Menunggu, atau Tutup Sementara')
];
// Product form validation rules
exports.productValidationRules = [
    (0, express_validator_1.body)('store_id')
        .notEmpty()
        .withMessage('ID Toko wajib dipilih')
        .isInt({ min: 1 })
        .withMessage('ID Toko tidak valid'),
    (0, exports.nameValidation)('name', 'Nama Produk'),
    (0, exports.priceValidation)('price', 'Harga'),
    (0, express_validator_1.body)('variant').optional().trim(),
    (0, express_validator_1.body)('size').optional().trim(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['Tersedia', 'Habis', 'Pre-Order'])
        .withMessage('Status produk harus Tersedia, Habis, atau Pre-Order')
];
// Hampers form validation rules
exports.hampersValidationRules = [
    (0, exports.nameValidation)('name', 'Nama Hampers'),
    (0, exports.priceValidation)('price', 'Harga Hampers'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['Aktif', 'Nonaktif', 'Habis'])
        .withMessage('Status hampers harus Aktif, Nonaktif, atau Habis'),
    (0, express_validator_1.body)('items')
        .optional()
        .custom((val) => {
        if (typeof val === 'string') {
            try {
                val = JSON.parse(val);
            }
            catch {
                throw new Error('Format items tidak valid');
            }
        }
        if (val && !Array.isArray(val)) {
            throw new Error('Items harus berupa list produk');
        }
        return true;
    })
];
