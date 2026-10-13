import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel';
import { ActivityModel } from '../models/activityModel';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { sanitizeObject } from '../utils/sanitizer';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const sanitized = sanitizeObject(req.body);
      const { name, email, password, role } = sanitized;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email sudah terdaftar dalam sistem',
          errors: { email: 'Email sudah digunakan' }
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'admin'
      });

      // Log activity
      await ActivityModel.create({
        user_id: userId,
        action: 'Register User',
        module: 'Auth',
        description: `Pengguna baru "${name}" (${email}) dengan peran ${role || 'admin'} telah terdaftar.`
      });

      return res.status(201).json({
        success: true,
        message: 'Registrasi berhasil',
        data: {
          id: userId,
          name,
          email,
          role: role || 'admin'
        }
      });
    } catch (err: any) {
      console.error('[Register Error]:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat registrasi'
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const sanitized = sanitizeObject(req.body);
      const { email, password } = sanitized;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email dan password wajib diisi',
          errors: {
            email: !email ? 'Email wajib diisi' : undefined,
            password: !password ? 'Password wajib diisi' : undefined
          }
        });
      }

      const user = await UserModel.findByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({
          success: false,
          message: 'Email atau password salah'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Email atau password salah'
        });
      }

      const secret = process.env.JWT_SECRET || 'sanan_tempe_super_secret_jwt_key_2026_!@#';
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        secret,
        { expiresIn: '7d' }
      );

      // Log activity
      await ActivityModel.create({
        user_id: user.id,
        action: 'Login',
        module: 'Auth',
        description: `User "${user.name}" (${user.role}) berhasil login ke sistem admin.`
      });

      return res.json({
        success: true,
        message: 'Login berhasil',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (err: any) {
      console.error('[Login Error]:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat login'
      });
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Belum terautentikasi'
        });
      }

      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }

      return res.json({
        success: true,
        data: user
      });
    } catch (err: any) {
      console.error('[GetMe Error]:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil profil'
      });
    }
  }

  // ==========================================
  // BARU: FUNGSI LOGOUT (MENGGUNAKAN CLASS METHOD)
  // ==========================================
  static async logout(req: AuthenticatedRequest, res: Response) {
    try {
      // Jika request membawa data user terautentikasi, catat aktivitas logout ke database
      if (req.user) {
        await ActivityModel.create({
          user_id: req.user.id,
          action: 'Logout',
          module: 'Auth',
          description: `User "${req.user.name}" (${req.user.role}) telah keluar dari sistem admin.`
        });
      }

      return res.json({
        success: true,
        message: 'Logout berhasil'
      });
    } catch (err: any) {
      console.error('[Logout Error]:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat logout'
      });
    }
  }
}
