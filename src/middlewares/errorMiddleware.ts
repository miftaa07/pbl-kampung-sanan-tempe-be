import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[Error Middleware]:', err);

  if (err instanceof multer.MulterError) {
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
