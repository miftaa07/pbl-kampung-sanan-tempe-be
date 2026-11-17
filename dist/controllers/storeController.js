"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreController = void 0;
const storeModel_1 = require("../models/storeModel");
const activityModel_1 = require("../models/activityModel");
const sanitizer_1 = require("../utils/sanitizer");
class StoreController {
    static async getAllStores(req, res) {
        try {
            const search = req.query.search
                ? String(req.query.search)
                : undefined;
            const status = req.query.status
                ? String(req.query.status)
                : undefined;
            // Pagination hanya aktif jika parameter dikirim
            const hasPagination = req.query.page !== undefined ||
                req.query.perPage !== undefined;
            if (hasPagination) {
                const parsedPage = Number(req.query.page ?? 1);
                const parsedPerPage = Number(req.query.perPage ?? 10);
                if (!Number.isInteger(parsedPage) ||
                    !Number.isInteger(parsedPerPage) ||
                    parsedPage < 1 ||
                    parsedPerPage < 1 ||
                    parsedPerPage > 100) {
                    return res.status(400).json({
                        success: false,
                        message: 'Parameter page atau perPage tidak valid'
                    });
                }
                const result = await storeModel_1.StoreModel.findAllPaginated({ search, status }, parsedPage, parsedPerPage);
                return res.json({
                    success: true,
                    message: 'Data toko berhasil diambil',
                    data: result.data,
                    pagination: result.pagination
                });
            }
            // Format lama tetap dipertahankan untuk pengguna API lama
            const stores = await storeModel_1.StoreModel.findAll({ search, status });
            return res.json({
                success: true,
                message: 'Data toko berhasil diambil',
                data: stores
            });
        }
        catch (err) {
            console.error('[GetAllStores Error]:', err);
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data toko'
            });
        }
    }
    static async getStoreById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID Toko tidak valid'
                });
            }
            const store = await storeModel_1.StoreModel.findById(id);
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
        }
        catch (err) {
            console.error('[GetStoreById Error]:', err);
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil detail toko'
            });
        }
    }
    static async createStore(req, res) {
        try {
            const sanitized = (0, sanitizer_1.sanitizeObject)(req.body);
            const { name, owner, address, gmaps_link, area, whatsapp, description, status } = sanitized;
            // Handle image file or string URL
            let image = sanitized.image || null;
            if (req.file) {
                image = req.file.path;
            }
            const storeId = await storeModel_1.StoreModel.create({
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
            await activityModel_1.ActivityModel.create({
                user_id: req.user?.id || null,
                action: 'Tambah Toko',
                module: 'Toko',
                description: `Admin menambahkan toko baru "${name}" (Pemilik: ${owner}).`
            });
            const newStore = await storeModel_1.StoreModel.findById(storeId);
            return res.status(201).json({
                success: true,
                message: 'Toko berhasil ditambahkan',
                data: newStore
            });
        }
        catch (err) {
            console.error('[CreateStore Error]:', err);
            return res.status(500).json({
                success: false,
                message: 'Gagal menambahkan toko'
            });
        }
    }
    static async updateStore(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID Toko tidak valid'
                });
            }
            const existingStore = await storeModel_1.StoreModel.findById(id);
            if (!existingStore) {
                return res.status(404).json({
                    success: false,
                    message: 'Data toko tidak ditemukan'
                });
            }
            const sanitized = (0, sanitizer_1.sanitizeObject)(req.body);
            const { name, owner, address, gmaps_link, area, whatsapp, description, status } = sanitized;
            let image = sanitized.image !== undefined ? sanitized.image : existingStore.image;
            if (req.file) {
                image = req.file.path;
            }
            await storeModel_1.StoreModel.update(id, {
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
            await activityModel_1.ActivityModel.create({
                user_id: req.user?.id || null,
                action: 'Edit Toko',
                module: 'Toko',
                description: `Admin memperbarui informasi toko "${name || existingStore.name}".`
            });
            const updatedStore = await storeModel_1.StoreModel.findById(id);
            return res.json({
                success: true,
                message: 'Data toko berhasil diperbarui',
                data: updatedStore
            });
        }
        catch (err) {
            console.error('[UpdateStore Error]:', err);
            return res.status(500).json({
                success: false,
                message: 'Gagal memperbarui data toko'
            });
        }
    }
    static async deleteStore(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID Toko tidak valid'
                });
            }
            const existingStore = await storeModel_1.StoreModel.findById(id);
            if (!existingStore) {
                return res.status(404).json({
                    success: false,
                    message: 'Data toko tidak ditemukan'
                });
            }
            await storeModel_1.StoreModel.delete(id);
            // Log activity
            await activityModel_1.ActivityModel.create({
                user_id: req.user?.id || null,
                action: 'Hapus Toko',
                module: 'Toko',
                description: `Admin menghapus toko "${existingStore.name}".`
            });
            return res.json({
                success: true,
                message: 'Toko berhasil dihapus'
            });
        }
        catch (err) {
            console.error('[DeleteStore Error]:', err);
            return res.status(500).json({
                success: false,
                message: 'Gagal menghapus toko'
            });
        }
    }
}
exports.StoreController = StoreController;
