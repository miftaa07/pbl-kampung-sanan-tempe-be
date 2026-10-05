"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HampersController = void 0;
const hampersModel_1 = require("../models/hampersModel");
const activityModel_1 = require("../models/activityModel");
const sanitizer_1 = require("../utils/sanitizer");
class HampersController {
    static async getAllHampers(req, res) {
        try {
            const search = req.query.search ? String(req.query.search) : undefined;
            const status = req.query.status ? String(req.query.status) : undefined;
            const hampers = await hampersModel_1.HampersModel.findAll({ search, status });
            return res.json({
                success: true,
                message: 'Data hampers berhasil diambil',
                data: hampers
            });
        }
        catch (err) {
            console.error('[GetAllHampers Error]:', err);
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data hampers'
            });
        }
    }
    static async getHampersById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID Hampers tidak valid'
                });
            }
            const hamper = await hampersModel_1.HampersModel.findById(id);
            if (!hamper) {
                return res.status(404).json({
                    success: false,
                    message: 'Data hampers tidak ditemukan'
                });
            }
            return res.json({
                success: true,
                message: 'Detail hampers berhasil diambil',
                data: hamper
            });
        }
        catch (err) {
            console.error('[GetHampersById Error]:', err);
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil detail hampers'
            });
        }
    }
    static async createHampers(req, res) {
        try {
            const sanitized = (0, sanitizer_1.sanitizeObject)(req.body);
            const { name, description, price, status } = sanitized;
            let items = [];
            if (req.body.items) {
                if (typeof req.body.items === 'string') {
                    try {
                        items = JSON.parse(req.body.items);
                    }
                    catch {
                        items = [];
                    }
                }
                else if (Array.isArray(req.body.items)) {
                    items = req.body.items;
                }
            }
            let image = sanitized.image || null;
            if (req.file) {
                image = `/uploads/hampers/${req.file.filename}`;
            }
            const hampersId = await hampersModel_1.HampersModel.create({
                name,
                description,
                price: parseFloat(price),
                image,
                status: status || 'Aktif'
            }, items);
            // Log activity
            await activityModel_1.ActivityModel.create({
                user_id: req.user?.id || null,
                action: 'Tambah Hampers',
                module: 'Hampers',
                description: `Admin membuat paket hampers baru "${name}".`
            });
            const newHamper = await hampersModel_1.HampersModel.findById(hampersId);
            return res.status(201).json({
                success: true,
                message: 'Paket hampers berhasil ditambahkan',
                data: newHamper
            });
        }
        catch (err) {
            console.error('[CreateHampers Error]:', err);
            return res.status(500).json({
                success: false,
                message: 'Gagal menambahkan hampers'
            });
        }
    }
    static async updateHampers(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID Hampers tidak valid'
                });
            }
            const existingHamper = await hampersModel_1.HampersModel.findById(id);
            if (!existingHamper) {
                return res.status(404).json({
                    success: false,
                    message: 'Data hampers tidak ditemukan'
                });
            }
            const sanitized = (0, sanitizer_1.sanitizeObject)(req.body);
            const { name, description, price, status } = sanitized;
            let items = undefined;
            if (req.body.items !== undefined) {
                if (typeof req.body.items === 'string') {
                    try {
                        items = JSON.parse(req.body.items);
                    }
                    catch {
                        items = [];
                    }
                }
                else if (Array.isArray(req.body.items)) {
                    items = req.body.items;
                }
            }
            let image = sanitized.image !== undefined ? sanitized.image : existingHamper.image;
            if (req.file) {
                image = `/uploads/hampers/${req.file.filename}`;
            }
            await hampersModel_1.HampersModel.update(id, {
                name,
                description,
                price: price ? parseFloat(price) : undefined,
                image,
                status
            }, items);
            // Log activity
            await activityModel_1.ActivityModel.create({
                user_id: req.user?.id || null,
                action: 'Edit Hampers',
                module: 'Hampers',
                description: `Admin memperbarui isi paket hampers "${name || existingHamper.name}".`
            });
            const updatedHamper = await hampersModel_1.HampersModel.findById(id);
            return res.json({
                success: true,
                message: 'Data hampers berhasil diperbarui',
                data: updatedHamper
            });
        }
        catch (err) {
            console.error('[UpdateHampers Error]:', err);
            return res.status(500).json({
                success: false,
                message: 'Gagal memperbarui hampers'
            });
        }
    }
    static async deleteHampers(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID Hampers tidak valid'
                });
            }
            const existingHamper = await hampersModel_1.HampersModel.findById(id);
            if (!existingHamper) {
                return res.status(404).json({
                    success: false,
                    message: 'Data hampers tidak ditemukan'
                });
            }
            await hampersModel_1.HampersModel.delete(id);
            // Log activity
            await activityModel_1.ActivityModel.create({
                user_id: req.user?.id || null,
                action: 'Hapus Hampers',
                module: 'Hampers',
                description: `Admin menghapus paket hampers "${existingHamper.name}".`
            });
            return res.json({
                success: true,
                message: 'Hampers berhasil dihapus'
            });
        }
        catch (err) {
            console.error('[DeleteHampers Error]:', err);
            return res.status(500).json({
                success: false,
                message: 'Gagal menghapus hampers'
            });
        }
    }
}
exports.HampersController = HampersController;
