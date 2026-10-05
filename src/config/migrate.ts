import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  const dbName = process.env.DB_NAME || 'sanan_tempe_db';

  console.log(`[Migration] Creating database '${dbName}' if not exists...`);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  await connection.changeUser({ database: dbName });

  console.log('[Migration] Creating tables...');

  // Users Table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'manager', 'dosen') DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_users_email (email)
    ) ENGINE=InnoDB;
  `);

  // Stores Table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS stores (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      owner VARCHAR(255) NOT NULL,
      address TEXT NOT NULL,
      gmaps_link TEXT,
      area VARCHAR(255) NOT NULL,
      whatsapp VARCHAR(50) NOT NULL,
      description TEXT,
      image VARCHAR(255),
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      status ENUM('Aktif', 'Menunggu', 'Tutup Sementara') DEFAULT 'Aktif',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_stores_name (name),
      INDEX idx_stores_status (status)
    ) ENGINE=InnoDB;
  `);

  // Products Table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      store_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      image VARCHAR(255),
      price DECIMAL(12, 2) NOT NULL,
      variant VARCHAR(255),
      size VARCHAR(100),
      description TEXT,
      status ENUM('Tersedia', 'Habis', 'Pre-Order') DEFAULT 'Tersedia',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
      INDEX idx_products_store_id (store_id),
      INDEX idx_products_name (name),
      INDEX idx_products_status (status)
    ) ENGINE=InnoDB;
  `);

  // Hampers Table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS hampers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      image VARCHAR(255),
      price DECIMAL(12, 2) NOT NULL,
      status ENUM('Aktif', 'Nonaktif', 'Habis') DEFAULT 'Aktif',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_hampers_name (name),
      INDEX idx_hampers_status (status)
    ) ENGINE=InnoDB;
  `);

  // Hampers Items Table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS hampers_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      hampers_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      FOREIGN KEY (hampers_id) REFERENCES hampers(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      INDEX idx_hampers_items_hampers_id (hampers_id),
      INDEX idx_hampers_items_product_id (product_id)
    ) ENGINE=InnoDB;
  `);

  // Activity Logs Table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NULL,
      action VARCHAR(100) NOT NULL,
      module VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_activity_created_at (created_at)
    ) ENGINE=InnoDB;
  `);

  console.log('[Migration] All tables and indexes created successfully.');
  await connection.end();
}

if (require.main === module) {
  migrate()
    .then(() => {
      console.log('[Migration] Done!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Migration] Failed:', err);
      process.exit(1);
    });
}
