"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("./database"));
const migrate_1 = require("./migrate");
async function seed() {
    await (0, migrate_1.migrate)();
    console.log('[Seeding] Checking existing users...');
    const [users] = await database_1.default.query('SELECT COUNT(*) as count FROM users');
    if (users[0].count === 0) {
        console.log('[Seeding] Creating default users...');
        const hashedAdminPassword = await bcrypt_1.default.hash('admin123', 10);
        const hashedManagerPassword = await bcrypt_1.default.hash('manager123', 10);
        const hashedDosenPassword = await bcrypt_1.default.hash('dosen123', 10);
        await database_1.default.query('INSERT INTO users (name, email, password, role) VALUES ?', [[
                ['Admin Sanan', 'admin@sanan.com', hashedAdminPassword, 'admin'],
                ['Manager Sentra', 'manager@sanan.com', hashedManagerPassword, 'manager'],
                ['Dosen Pembimbing', 'dosen@ub.ac.id', hashedDosenPassword, 'dosen']
            ]]);
    }
    const [stores] = await database_1.default.query('SELECT COUNT(*) as count FROM stores');
    if (stores[0].count === 0) {
        console.log('[Seeding] Seeding initial stores, products, and hampers...');
        // Seed Stores
        const [storeRes1] = await database_1.default.query(`INSERT INTO stores (name, owner, address, area, whatsapp, description, image, latitude, longitude, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            'Keripik Tempe Rohani',
            'H. Rohani & Hj. Siti',
            'Jl. Sanan No. 125, Purwantoro, Blimbing, Kota Malang',
            'Sentra Utama Sanan',
            '+6281234567890',
            'Pusat oleh-oleh keripik tempe legendaris Sanan sejak 1988 dengan aneka varian rasa khas.',
            'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=60',
            -7.95420000,
            112.64510000,
            'Aktif'
        ]);
        const store1Id = storeRes1.insertId;
        const [storeRes2] = await database_1.default.query(`INSERT INTO stores (name, owner, address, area, whatsapp, description, image, latitude, longitude, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            'Keripik Tempe Bu Noer',
            'Ibu Noer Aini',
            'Jl. Sanan Gang 3 No. 45, Blimbing, Kota Malang',
            'Sanan Gang 3',
            '+6282198765432',
            'Spesialis keripik tempe sagu renyah dan aneka keripik buah khas Malang.',
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60',
            -7.95510000,
            112.64620000,
            'Aktif'
        ]);
        const store2Id = storeRes2.insertId;
        const [storeRes3] = await database_1.default.query(`INSERT INTO stores (name, owner, address, area, whatsapp, description, image, latitude, longitude, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            'Sentra Tempe Lancar Jaya',
            'Bpk. Subagio',
            'Jl. Tumenggung Suryo No. 88, Sanan, Kota Malang',
            'Kawasan Timur',
            '+6285643219876',
            'Produsen keripik tempe aneka bumbu gurih renyah tanpa bahan pengawet.',
            'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60',
            -7.95380000,
            112.64750000,
            'Aktif'
        ]);
        const store3Id = storeRes3.insertId;
        // Seed Products
        const [p1] = await database_1.default.query(`INSERT INTO products (store_id, name, image, price, variant, size, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            store1Id,
            'Keripik Tempe Original Rohani',
            'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=60',
            18000,
            'Original Gurih',
            '250g',
            'Keripik tempe renyah dengan bumbu bawang ketumbar khas resep warisan 1988.',
            'Tersedia'
        ]);
        const [p2] = await database_1.default.query(`INSERT INTO products (store_id, name, image, price, variant, size, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            store1Id,
            'Keripik Tempe Balado Pedas Manis',
            'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&auto=format&fit=crop&q=60',
            20000,
            'Balado',
            '250g',
            'Sensasi bumbu balado khas Jawa Timur dengan rempah cabai asli.',
            'Tersedia'
        ]);
        const [p3] = await database_1.default.query(`INSERT INTO products (store_id, name, image, price, variant, size, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            store2Id,
            'Keripik Tempe Sagu Super Renyah',
            'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=60',
            22000,
            'Bawang Seledri',
            '300g',
            'Tekstur ekstra renyah dengan campuran tepung sagu berkualitas tinggi.',
            'Tersedia'
        ]);
        const [p4] = await database_1.default.query(`INSERT INTO products (store_id, name, image, price, variant, size, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            store3Id,
            'Keripik Tempe Barbeque Smoke',
            'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&auto=format&fit=crop&q=60',
            20000,
            'BBQ',
            '250g',
            'Rasa barbeque modern yang gurih dan disukai anak muda.',
            'Tersedia'
        ]);
        // Seed Hampers
        const [h1] = await database_1.default.query(`INSERT INTO hampers (name, description, image, price, status)
       VALUES (?, ?, ?, ?, ?)`, [
            'Paket Hampers Oleh-Oleh Sanan Komplit',
            'Paket eksklusif berisi 3 varian keripik tempe favorit dengan kemasan box premium motif khas Sanan.',
            'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=60',
            65000,
            'Aktif'
        ]);
        await database_1.default.query(`INSERT INTO hampers_items (hampers_id, product_id, quantity) VALUES (?, ?, ?), (?, ?, ?)`, [
            h1.insertId, p1.insertId, 2,
            h1.insertId, p2.insertId, 1
        ]);
        const [h2] = await database_1.default.query(`INSERT INTO hampers (name, description, image, price, status)
       VALUES (?, ?, ?, ?, ?)`, [
            'Hampers Spesial Hari Raya',
            'Paket bingkisan hari raya lengkap dengan kartu ucapan dan pita elegan.',
            'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=60',
            110000,
            'Aktif'
        ]);
        await database_1.default.query(`INSERT INTO hampers_items (hampers_id, product_id, quantity) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)`, [
            h2.insertId, p1.insertId, 2,
            h2.insertId, p3.insertId, 2,
            h2.insertId, p4.insertId, 1
        ]);
        // Seed Activity Logs
        await database_1.default.query(`INSERT INTO activity_logs (user_id, action, module, description)
       VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)`, [
            1, 'Inisialisasi Sistem', 'System', 'Setup awal database dan akun admin sistem Kampung Sanan',
            1, 'Tambah Toko', 'Toko', 'Admin menambahkan toko "Keripik Tempe Rohani"',
            1, 'Tambah Hampers', 'Hampers', 'Admin membuat hampers "Paket Hampers Oleh-Oleh Sanan Komplit"'
        ]);
    }
    console.log('[Seeding] Database seeding completed successfully.');
}
if (require.main === module) {
    seed()
        .then(() => {
        console.log('[Seeding] Finished!');
        process.exit(0);
    })
        .catch((err) => {
        console.error('[Seeding] Error:', err);
        process.exit(1);
    });
}
