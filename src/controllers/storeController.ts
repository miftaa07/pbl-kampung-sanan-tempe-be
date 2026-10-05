import { Request, Response } from 'express';
import { StoreModel } from '../models/storeModel';
import { ActivityModel } from '../models/activityModel';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { sanitizeObject } from '../utils/sanitizer';

export class StoreController {
  static async getAllStores(req: Request, res: Response) {
    try {
      const search = req.query.search ? String(req.query.search) : undefined;
      const status = req.query.status ? String(req.query.status) : undefined;

      const stores = await StoreModel.findAll({ search, status });
      return res.json({
        success: true,
        message: 'Data toko berhasil diambil',
        data: stores
      });
    } catch (err: any) {
      console.error('[GetAllStores Error]:', err);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data toko'
      });
    }
  }

  static async getStoreById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID Toko tidak valid'
        });
      }

      const store = await StoreModel.findById(id);
      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Data toko tidak ditemukan'
        });
      }

      return res.json({
        success: true,
        message: 'Detail toko berhasil diambil',
        data: store
      });
    } catch (err: any) {
      console.error('[GetStoreById Error]:', err);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil detail toko'
      });
    }
  }

  static async createStore(req: AuthenticatedRequest, res: Response) {
    try {
      const sanitized = sanitizeObject(req.body);
      const { name, owner, address, gmaps_link, area, whatsapp, description, status } = sanitized;

      // Handle image file or string URL
      let image = sanitized.image || null;
      if (req.file) {
        image = `/uploads/stores/${req.file.filename}`;
      }

      const storeId = await StoreModel.create({
        name,
        owner,
        address,
        gmaps_link: gmaps_link && gmaps_link.trim() !== '' ? gmaps_link.trim() : null,
        area,
        whatsapp,
        description,
        image,
        status: status || 'Aktif'
      });

      // Log activity
      await ActivityModel.create({
        user_id: req.user?.id || null,
        action: 'Tambah Toko',
        module: 'Toko',
        description: `Admin menambahkan toko baru "${name}" (Pemilik: ${owner}).`
      });

      const newStore = await StoreModel.findById(storeId);

      return res.status(201).json({
        success: true,
        message: 'Toko berhasil ditambahkan',
        data: newStore
      });
    } catch (err: any) {
      console.error('[CreateStore Error]:', err);
      return res.status(500).json({
        success: false,
        message: 'Gagal menambahkan toko'
      });
    }
  }

  static async updateStore(req: AuthenticatedRequest, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID Toko tidak valid'
        });
      }

      const existingStore = await StoreModel.findById(id);
      if (!existingStore) {
        return res.status(404).json({
          success: false,
          message: 'Data toko tidak ditemukan'
        });
      }

      const sanitized = sanitizeObject(req.body);
      const { name, owner, address, gmaps_link, area, whatsapp, description, status } = sanitized;

      let image = sanitized.image !== undefined ? sanitized.image : existingStore.image;
      if (req.file) {
        image = `/uploads/stores/${req.file.filename}`;
      }

      await StoreModel.update(id, {
        name,
        owner,
        address,
        gmaps_link: gmaps_link !== undefined ? (gmaps_link && gmaps_link.trim() !== '' ? gmaps_link.trim() : null) : undefined,
        area,
        whatsapp,
        description,
        image,
        status
      });

      // Log activity
      await ActivityModel.create({
        user_id: req.user?.id || null,
        action: 'Edit Toko',
        module: 'Toko',
        description: `Admin memperbarui informasi toko "${name || existingStore.name}".`
      });

      const updatedStore = await StoreModel.findById(id);

      return res.json({
        success: true,
        message: 'Data toko berhasil diperbarui',
        data: updatedStore
      });
    } catch (err: any) {
      console.error('[UpdateStore Error]:', err);
      return res.status(500).json({
        success: false,
        message: 'Gagal memperbarui data toko'
      });
    }
  }

  static async deleteStore(req: AuthenticatedRequest, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID Toko tidak valid'
        });
      }

      const existingStore = await StoreModel.findById(id);
      if (!existingStore) {
        return res.status(404).json({
          success: false,
          message: 'Data toko tidak ditemukan'
        });
      }

      await StoreModel.delete(id);

      // Log activity
      await ActivityModel.create({
        user_id: req.user?.id || null,
        action: 'Hapus Toko',
        module: 'Toko',
        description: `Admin menghapus toko "${existingStore.name}".`
      });

      return res.json({
        success: true,
        message: 'Toko berhasil dihapus'
      });
    } catch (err: any) {
      console.error('[DeleteStore Error]:', err);
      return res.status(500).json({
        success: false,
        message: 'Gagal menghapus toko'
      });
    }
  }
}
