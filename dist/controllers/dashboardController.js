"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const storeModel_1 = require("../models/storeModel");
const productModel_1 = require("../models/productModel");
const hampersModel_1 = require("../models/hampersModel");
const activityModel_1 = require("../models/activityModel");
class DashboardController {
    static async getDashboard(req, res) {
        try {
            const [totalStores, activeStores, totalProducts, totalHampers, recentActivities] = await Promise.all([
                storeModel_1.StoreModel.countAll(),
                storeModel_1.StoreModel.countActive(),
                productModel_1.ProductModel.countAll(),
                hampersModel_1.HampersModel.countAll(),
                activityModel_1.ActivityModel.getRecent(5)
            ]);
            return res.json({
                success: true,
                message: 'Data dashboard berhasil diambil',
                data: {
                    totalStores,
                    activeStores,
                    totalProducts,
                    totalHampers,
                    recentActivities
                }
            });
        }
        catch (err) {
            console.error('[Dashboard Error]:', err);
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data statistik dashboard'
            });
        }
    }
}
exports.DashboardController = DashboardController;
