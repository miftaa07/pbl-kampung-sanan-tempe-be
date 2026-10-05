import { Request, Response } from 'express';
import { StoreModel } from '../models/storeModel';
import { ProductModel } from '../models/productModel';
import { HampersModel } from '../models/hampersModel';
import { ActivityModel } from '../models/activityModel';

export class DashboardController {
  static async getDashboard(req: Request, res: Response) {
    try {
      const [totalStores, activeStores, totalProducts, totalHampers, recentActivities] = await Promise.all([
        StoreModel.countAll(),
        StoreModel.countActive(),
        ProductModel.countAll(),
        HampersModel.countAll(),
        ActivityModel.getRecent(5)
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
    } catch (err: any) {
      console.error('[Dashboard Error]:', err);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data statistik dashboard'
      });
    }
  }
}
