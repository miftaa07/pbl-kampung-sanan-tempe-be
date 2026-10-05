import { Request, Response } from 'express';
import { ProductModel } from '../models/productModel';
import { StoreModel } from '../models/storeModel';
import { ActivityModel } from '../models/activityModel';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { sanitizeObject } from '../utils/sanitizer';

export class ProductController {
  static async getAllProducts(req: Request, res: Response) {
    try {
      const search = req.query.search ? String(req.query.search) : undefined;
      const store_id = req.query.store_id ? parseInt(String(req.query.store_id), 10) : undefined;
      const status = req.query.status ? String(req.query.status) : undefined;

      const products = await ProductModel.findAll({ search, store_id, status });
      return res.json({
        success: true,
        message: 'Data produk berhasil diambil',
        data: products
      });
    } catch (err: any) {
      console.error('[GetAllProducts Error]:', err);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data produk'
      });
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID Produk tidak valid'
        });
      }

      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Data produk tidak ditemukan'
        });
      }

      return res.json({
        success: true,
        message: 'Detail produk berhasil diambil',
        data: product
      });
    } catch (err: any) {
      console.error('[GetProductById Error]:', err);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil detail produk'
      });
    }
  }

  static async getProductsByStore(req: Request, res: Response) {
    try {
      const storeId = parseInt(req.params.storeId, 10);
      if (isNaN(storeId)) {
        return res.status(400).json({
          success: false,
          message: 'ID Toko tidak valid'
        });
      }

      const products = await ProductModel.findByStoreId(storeId);
      return res.json({
        success: true,
        message: 'Data produk toko berhasil diambil',
        data: products
      });
    } catch (err: any) {
      console.error('[GetProductsByStore Error]:', err);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data produk toko'
      });
    }
  }

  static async createProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const sanitized = sanitizeObject(req.body);
      const { store_id, name, price, variant, size, description, status } = sanitized;

      const store = await StoreModel.findById(parseInt(store_id, 10));
      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Toko yang dipilih tidak ditemukan'
        });
      }

      let image = sanitized.image || null;
      if (req.file) {
        image = `/uploads/products/${req.file.filename}`;
      }

      const productId = await ProductModel.create({
        store_id: parseInt(store_id, 10),
        name,
        price: parseFloat(price),
        variant,
        size,
        description,
        image,
        status: status || 'Tersedia'
      });

      // Log activity
      await ActivityModel.create({
        user_id: req.user?.id || null,
        action: 'Tambah Produk',
        module: 'Produk',
        description: `Admin menambahkan produk baru "${name}" untuk toko "${store.name}".`
      });

      const newProduct = await ProductModel.findById(productId);

      return res.status(201).json({
        success: true,
        message: 'Produk berhasil ditambahkan',
        data: newProduct
      });
    } catch (err: any) {
      console.error('[CreateProduct Error]:', err);
      return res.status(500).json({
        success: false,
        message: 'Gagal menambahkan produk'
      });
    }
  }

  static async updateProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID Produk tidak valid'
        });
      }

      const existingProduct = await ProductModel.findById(id);
      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: 'Data produk tidak ditemukan'
        });
      }

      const sanitized = sanitizeObject(req.body);
      const { store_id, name, price, variant, size, description, status } = sanitized;

      let image = sanitized.image !== undefined ? sanitized.image : existingProduct.image;
      if (req.file) {
        image = `/uploads/products/${req.file.filename}`;
      }

      await ProductModel.update(id, {
        store_id: store_id ? parseInt(store_id, 10) : undefined,
        name,
        price: price ? parseFloat(price) : undefined,
        variant,
        size,
        description,
        image,
        status
      });

      // Log activity
      await ActivityModel.create({
        user_id: req.user?.id || null,
        action: 'Edit Produk',
        module: 'Produk',
        description: `Admin mengubah rincian produk "${name || existingProduct.name}".`
      });

      const updatedProduct = await ProductModel.findById(id);

      return res.json({
        success: true,
        message: 'Data produk berhasil diperbarui',
        data: updatedProduct
      });
    } catch (err: any) {
      console.error('[UpdateProduct Error]:', err);
      return res.status(500).json({
        success: false,
        message: 'Gagal memperbarui data produk'
      });
    }
  }

  static async deleteProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID Produk tidak valid'
        });
      }

      const existingProduct = await ProductModel.findById(id);
      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: 'Data produk tidak ditemukan'
        });
      }

      await ProductModel.delete(id);

      // Log activity
      await ActivityModel.create({
        user_id: req.user?.id || null,
        action: 'Hapus Produk',
        module: 'Produk',
        description: `Admin menghapus produk "${existingProduct.name}".`
      });

      return res.json({
        success: true,
        message: 'Produk berhasil dihapus'
      });
    } catch (err: any) {
      console.error('[DeleteProduct Error]:', err);
      return res.status(500).json({
        success: false,
        message: 'Gagal menghapus produk'
      });
    }
  }
}
