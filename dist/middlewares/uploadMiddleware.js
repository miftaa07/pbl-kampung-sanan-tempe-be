"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadHampersImage = exports.uploadProductImage = exports.uploadStoreImage = void 0;
exports.createUploader = createUploader;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure upload directories exist
const uploadDirs = [
    path_1.default.join(process.cwd(), 'uploads'),
    path_1.default.join(process.cwd(), 'uploads', 'stores'),
    path_1.default.join(process.cwd(), 'uploads', 'products'),
    path_1.default.join(process.cwd(), 'uploads', 'hampers')
];
uploadDirs.forEach((dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
});
function createUploader(subfolder) {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const dest = path_1.default.join(process.cwd(), 'uploads', subfolder);
            cb(null, dest);
        },
        filename: (req, file, cb) => {
            // Safe unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = path_1.default.extname(file.originalname).toLowerCase();
            const safeName = path_1.default.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
            cb(null, `${safeName}-${uniqueSuffix}${ext}`);
        }
    });
    const fileFilter = (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Hanya file gambar (JPEG, PNG, WEBP, GIF) yang diperbolehkan'));
        }
    };
    return (0, multer_1.default)({
        storage,
        limits: {
            fileSize: 5 * 1024 * 1024 // 5 MB max
        },
        fileFilter
    });
}
exports.uploadStoreImage = createUploader('stores').single('image');
exports.uploadProductImage = createUploader('products').single('image');
exports.uploadHampersImage = createUploader('hampers').single('image');
