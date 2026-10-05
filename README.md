# Backend Admin Web Kampung Keripik Tempe Sanan

Backend REST API untuk sistem administrasi **Kampung Keripik Tempe Sanan**, dibangun menggunakan **Node.js, Express, TypeScript, dan MySQL**.

---

## 🛠️ Tech Stack

- **Runtime & Language**: Node.js, TypeScript
- **Framework**: Express.js
- **Database**: MySQL (`mysql2/promise`)
- **Authentication**: JWT (`jsonwebtoken`) & `bcrypt`
- **File Upload**: `multer`
- **Validation**: `express-validator`
- **CORS**: `cors`

---

## 📂 Struktur Direktori

```text
kripik-tempe-sanan-be/
├── src/
│   ├── config/
│   │   ├── database.ts      # Koneksi database pool MySQL
│   │   ├── migrate.ts       # Script inisialisasi tabel & index
│   │   └── seed.ts          # Script seeding data awal
│   │
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── dashboardController.ts
│   │   ├── storeController.ts
│   │   ├── productController.ts
│   │   ├── hampersController.ts
│   │   └── activityController.ts
│   │
│   ├── models/
│   │   ├── userModel.ts
│   │   ├── storeModel.ts
│   │   ├── productModel.ts
│   │   ├── hampersModel.ts
│   │   └── activityModel.ts
│   │
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── dashboardRoutes.ts
│   │   ├── storeRoutes.ts
│   │   ├── productRoutes.ts
│   │   ├── hampersRoutes.ts
│   │   └── activityRoutes.ts
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.ts
│   │   ├── validationMiddleware.ts
│   │   ├── uploadMiddleware.ts
│   │   └── errorMiddleware.ts
│   │
│   ├── utils/
│   │   ├── validation.ts
│   │   └── sanitizer.ts
│   │
│   └── server.ts
│
├── uploads/
│   ├── stores/
│   ├── products/
│   └── hampers/
│
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🚀 Cara Menjalankan Backend

### 1. Prasyarat
- Node.js (v18+)
- MySQL Server (misalnya dari Laragon / XAMPP) yang sedang berjalan pada port `3306`.

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Database (.env)
Salin `.env.example` menjadi `.env` jika belum ada:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sanan_tempe_db
JWT_SECRET=sanan_tempe_super_secret_jwt_key_2026_!@#
CLIENT_URL=http://localhost:5173
```

### 4. Migrasi & Seeding Data Awal
```bash
npm run db:seed
```
> Akun admin default yang dibuat:
> - **Email**: `admin@sanan.com`
> - **Password**: `admin123`

### 5. Jalankan Server Development
```bash
npm run dev
```
Server akan berjalan di `http://localhost:5000`.

---

## 📡 Daftar Endpoint REST API

### 1. Autentikasi (`/api/auth`)
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Mendaftarkan akun admin baru | Tidak |
| POST | `/api/auth/login` | Login admin & mendapatkan token JWT | Tidak |
| GET | `/api/auth/me` | Mengambil profil user saat ini | Ya (Bearer) |

### 2. Dashboard (`/api/dashboard`)
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/api/dashboard` | Mengambil data statistik real-time dari database | Tidak |

### 3. Manajemen Toko (`/api/stores`)
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/api/stores` | Mengambil daftar toko (search, filter status) | Tidak |
| GET | `/api/stores/:id` | Mengambil detail toko beserta daftar produk | Tidak |
| GET | `/api/stores/:storeId/products` | Mengambil produk milik toko tertentu | Tidak |
| POST | `/api/stores` | Menambahkan toko baru (upload image/URL) | Ya (Bearer) |
| PUT | `/api/stores/:id` | Memperbarui informasi toko | Ya (Bearer) |
| DELETE | `/api/stores/:id` | Menghapus toko dan produk terkait | Ya (Bearer) |

### 4. Manajemen Produk (`/api/products`)
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/api/products` | Mengambil semua produk (search, filter) | Tidak |
| GET | `/api/products/:id` | Mengambil detail produk | Tidak |
| POST | `/api/products` | Menambahkan produk baru | Ya (Bearer) |
| PUT | `/api/products/:id` | Memperbarui produk | Ya (Bearer) |
| DELETE | `/api/products/:id` | Menghapus produk | Ya (Bearer) |

### 5. Manajemen Hampers (`/api/hampers`)
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/api/hampers` | Mengambil daftar paket hampers beserta item | Tidak |
| GET | `/api/hampers/:id` | Mengambil detail paket hampers | Tidak |
| POST | `/api/hampers` | Menambahkan paket hampers baru | Ya (Bearer) |
| PUT | `/api/hampers/:id` | Memperbarui paket hampers & itemnya | Ya (Bearer) |
| DELETE | `/api/hampers/:id` | Menghapus paket hampers | Ya (Bearer) |

### 6. Activity Log (`/api/activity`)
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/api/activity?page=1&limit=10` | Mengambil log riwayat aktivitas admin | Tidak |
