
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function importData() {
  let connection;

  try {
    const filePath = path.join(__dirname, 'backup-sanan-data.sql');

    if (!fs.existsSync(filePath)) {
      throw new Error('File backup-sanan-data.sql tidak ditemukan!');
    }

    const sql = fs.readFileSync(filePath, 'utf8');

    // Ambil perintah INSERT saja dari file backup.
    const matches = [
      ...sql.matchAll(/INSERT\s+INTO\s+`([^`]+)`[\s\S]*?;/gi),
    ];

    const statements = new Map();

    for (const match of matches) {
      const table = match[1].toLowerCase();

      if (statements.has(table)) {
        throw new Error(`INSERT ganda ditemukan untuk tabel ${table}`);
      }

      statements.set(table, match[0]);
    }

    // Urutan mengikuti relasi foreign key.
    const order = [
      'users',
      'stores',
      'hampers',
      'products',
      'hampers_items',
      'activity_logs',
    ];

    for (const table of order) {
      if (!statements.has(table)) {
        throw new Error(`INSERT untuk tabel ${table} tidak ditemukan!`);
      }
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 4000),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { minVersion: 'TLSv1.2' },
    });

    console.log('[Import] Terhubung ke TiDB.');

    // Pastikan semua tabel masih kosong.
    for (const table of order) {
      const [rows] = await connection.query(
        `SELECT COUNT(*) AS total FROM \`${table}\``
      );

      if (Number(rows[0].total) !== 0) {
        throw new Error(
          `Tabel ${table} tidak kosong. Import dibatalkan agar tidak duplikat.`
        );
      }
    }

    await connection.beginTransaction();

    for (const table of order) {
      await connection.query(statements.get(table));
      console.log(`[Import] ${table} berhasil dimasukkan.`);
    }

    await connection.commit();

    console.log('\n[Import] Verifikasi jumlah data:');

    for (const table of order) {
      const [rows] = await connection.query(
        `SELECT COUNT(*) AS total FROM \`${table}\``
      );

      console.log(`${table}: ${rows[0].total}`);
    }

    console.log('\n[Import] Semua data berhasil dipindahkan!');
  } catch (error) {
    if (connection) {
      await connection.rollback().catch(() => {});
    }

    console.error('\n[Import] Gagal:', error.message);
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

importData();
