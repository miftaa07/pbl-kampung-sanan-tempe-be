import { body, param, query } from 'express-validator';

// Email validation
export const emailValidation = body('email')
  .isEmail()
  .withMessage('Format email tidak valid')
  .normalizeEmail();

// Password validation
export const passwordValidation = body('password')
  .isLength({ min: 6 })
  .withMessage('Password minimal 6 karakter');

// Name validation (Huruf, spasi, karakter nama umum)
export const nameValidation = (field: string = 'name', label: string = 'Nama') =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`${label} tidak boleh kosong`)
    .matches(/^[a-zA-Z0-9\s.,'’\-–()]+$/)
    .withMessage(`${label} mengandung karakter terlarang`);

// WhatsApp validation (+ dan angka)
export const whatsappValidation = body('whatsapp')
  .trim()
  .notEmpty()
  .withMessage('Nomor WhatsApp tidak boleh kosong')
  .matches(/^\+?[0-9]{9,16}$/)
  .withMessage('Nomor WhatsApp hanya boleh berisi angka dan diawali dengan tanda + (9-16 digit)');

// Price validation
export const priceValidation = (field: string = 'price', label: string = 'Harga') =>
  body(field)
    .notEmpty()
    .withMessage(`${label} tidak boleh kosong`)
    .isFloat({ min: 0 })
    .withMessage(`${label} harus berupa angka positif`);

// Store form validation rules
export const storeValidationRules = [
  nameValidation('name', 'Nama Toko'),
  nameValidation('owner', 'Nama Pemilik'),
  body('address').trim().notEmpty().withMessage('Alamat toko tidak boleh kosong'),
  body('area').trim().notEmpty().withMessage('Kawasan / Area tidak boleh kosong'),
  whatsappValidation,
  body('status')
    .optional()
    .isIn(['Aktif', 'Menunggu', 'Tutup Sementara'])
    .withMessage('Status toko harus Aktif, Menunggu, atau Tutup Sementara')
];

// Product form validation rules
export const productValidationRules = [
  body('store_id')
    .notEmpty()
    .withMessage('ID Toko wajib dipilih')
    .isInt({ min: 1 })
    .withMessage('ID Toko tidak valid'),
  nameValidation('name', 'Nama Produk'),
  priceValidation('price', 'Harga'),
  body('variant').optional().trim(),
  body('size').optional().trim(),
  body('status')
    .optional()
    .isIn(['Tersedia', 'Habis', 'Pre-Order'])
    .withMessage('Status produk harus Tersedia, Habis, atau Pre-Order')
];

// Hampers form validation rules
export const hampersValidationRules = [
  nameValidation('name', 'Nama Hampers'),
  priceValidation('price', 'Harga Hampers'),
  body('status')
    .optional()
    .isIn(['Aktif', 'Nonaktif', 'Habis'])
    .withMessage('Status hampers harus Aktif, Nonaktif, atau Habis'),
  body('items')
    .optional()
    .custom((val) => {
      if (typeof val === 'string') {
        try {
          val = JSON.parse(val);
        } catch {
          throw new Error('Format items tidak valid');
        }
      }
      if (val && !Array.isArray(val)) {
        throw new Error('Items harus berupa list produk');
      }
      return true;
    })
];
