"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityController = void 0;
const activityModel_1 = require("../models/activityModel");
class ActivityController {
    static async getActivityLogs(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const result = await activityModel_1.ActivityModel.findAll(page, limit);
            return res.json({
                success: true,
                message: 'Data activity log berhasil diambil',
                data: result.logs,
                pagination: {
                    total: result.total,
                    page: result.page,
                    totalPages: result.totalPages,
                    limit
                }
            });
        }
        catch (err) {
            console.error('[GetActivityLogs Error]:', err);
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data activity log'
            });
        }
    }
}
exports.ActivityController = ActivityController;
