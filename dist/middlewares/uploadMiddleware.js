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
        const extension = path_1.default.extname(file.originalname).toLowerCase();
        const allowedTypes = {
            '.jpg': ['image/jpeg', 'image/jpg'],
            '.jpeg': ['image/jpeg', 'image/jpg'],
            '.png': ['image/png']
        };
        if (allowedTypes[extension]?.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Hanya file gambar JPG, JPEG, dan PNG yang diperbolehkan'));
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
function createImageUpload(subfolder) {
    const upload = createUploader(subfolder).single('image');
    return (req, res, next) => {
        upload(req, res, async (error) => {
            if (error)
                return next(error);
            if (!req.file)
                return next();
            try {
                const handle = await fs_1.default.promises.open(req.file.path, 'r');
                const signature = Buffer.alloc(8);
                let bytesRead;
                try {
                    ({ bytesRead } = await handle.read(signature, 0, signature.length, 0));
                }
                finally {
                    await handle.close();
                }
                const extension = path_1.default.extname(req.file.originalname).toLowerCase();
                const isPng = bytesRead === 8 && signature.equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
                const isJpeg = bytesRead >= 3 && signature[0] === 255 && signature[1] === 216 && signature[2] === 255;
                const signatureMatchesExtension = extension === '.png' ? isPng : isJpeg;
                if (!signatureMatchesExtension) {
                    await fs_1.default.promises.unlink(req.file.path);
                    return next(new Error('Hanya file gambar JPG, JPEG, dan PNG yang diperbolehkan'));
                }
                next();
            }
            catch (validationError) {
                await fs_1.default.promises.unlink(req.file.path).catch(() => undefined);
                next(validationError);
            }
        });
    };
}
exports.uploadStoreImage = createImageUpload('stores');
exports.uploadProductImage = createImageUpload('products');
exports.uploadHampersImage = createImageUpload('hampers');
