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
    const extension = path.extname(file.originalname).toLowerCase();
    const allowedTypes: Record<string, string[]> = {
      '.jpg': ['image/jpeg', 'image/jpg'],
      '.jpeg': ['image/jpeg', 'image/jpg'],
      '.png': ['image/png']
    };

    if (allowedTypes[extension]?.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar JPG, JPEG, dan PNG yang diperbolehkan'));
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

function createImageUpload(subfolder: 'stores' | 'products' | 'hampers') {
  const upload = createUploader(subfolder).single('image');

  return (req: any, res: any, next: (error?: Error) => void) => {
    upload(req, res, async (error) => {
      if (error) return next(error);
      if (!req.file) return next();

      try {
        const handle = await fs.promises.open(req.file.path, 'r');
        const signature = Buffer.alloc(8);
        let bytesRead: number;

        try {
          ({ bytesRead } = await handle.read(signature, 0, signature.length, 0));
        } finally {
          await handle.close();
        }

        const extension = path.extname(req.file.originalname).toLowerCase();
        const isPng = bytesRead === 8 && signature.equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
        const isJpeg = bytesRead >= 3 && signature[0] === 255 && signature[1] === 216 && signature[2] === 255;
        const signatureMatchesExtension = extension === '.png' ? isPng : isJpeg;

        if (!signatureMatchesExtension) {
          await fs.promises.unlink(req.file.path);
          return next(new Error('Hanya file gambar JPG, JPEG, dan PNG yang diperbolehkan'));
        }

        next();
      } catch (validationError) {
        await fs.promises.unlink(req.file.path).catch(() => undefined);
        next(validationError as Error);
      }
    });
  };
}

export const uploadStoreImage = createImageUpload('stores');
export const uploadProductImage = createImageUpload('products');
export const uploadHampersImage = createImageUpload('hampers');
