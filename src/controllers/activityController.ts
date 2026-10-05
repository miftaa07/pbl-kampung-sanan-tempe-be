import { Request, Response } from 'express';
import { ActivityModel } from '../models/activityModel';

export class ActivityController {
  static async getActivityLogs(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const result = await ActivityModel.findAll(page, limit);
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
    } catch (err: any) {
      console.error('[GetActivityLogs Error]:', err);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data activity log'
      });
    }
  }
}
