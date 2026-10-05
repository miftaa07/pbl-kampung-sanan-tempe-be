import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const uploadDirs = [
  path.join(process.cwd(), 'uploads'),
  path.join(process.cwd(), 'uploads', 'stores'),
  path.join(process.cwd(), 'uploads', 'products'),
  path.join(process.cwd(), 'uploads', 'hampers')
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export function createUploader(subfolder: 'stores' | 'products' | 'hampers') {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dest = path.join(process.cwd(), 'uploads', subfolder);
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      // Safe unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname).toLowerCase();
      const safeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      cb(null, `${safeName}-${uniqueSuffix}${ext}`);
    }
  });

  const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar (JPEG, PNG, WEBP, GIF) yang diperbolehkan'));
    }
  };

  return multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5 MB max
    },
    fileFilter
  });
}

export const uploadStoreImage = createUploader('stores').single('image');
export const uploadProductImage = createUploader('products').single('image');
export const uploadHampersImage = createUploader('hampers').single('image');
