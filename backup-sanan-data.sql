-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 23, 2026 at 07:53 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sanan_tempe_db`
--

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `module`, `description`, `created_at`) VALUES
(1, 1, 'Inisialisasi Sistem', 'System', 'Setup awal database dan akun admin sistem Kampung Sanan', '2026-10-02 19:18:39'),
(2, 1, 'Tambah Toko', 'Toko', 'Admin menambahkan toko \"Keripik Tempe Rohani\"', '2026-10-02 19:18:39'),
(3, 1, 'Tambah Hampers', 'Hampers', 'Admin membuat hampers \"Paket Hampers Oleh-Oleh Sanan Komplit\"', '2026-10-02 19:18:39'),
(4, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-02 19:23:10'),
(5, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-02 19:26:19'),
(6, 1, 'Tambah Toko', 'Toko', 'Admin menambahkan toko baru \"Keripik Tempe Bu Siti Sanan\" (Pemilik: Ibu Siti).', '2026-10-02 19:26:20'),
(7, 1, 'Tambah Produk', 'Produk', 'Admin menambahkan produk baru \"Keripik Tempe Renyah Gurih Bu Siti\" untuk toko \"Keripik Tempe Bu Siti Sanan\".', '2026-10-02 19:26:20'),
(8, 1, 'Tambah Hampers', 'Hampers', 'Admin membuat paket hampers baru \"Paket Oleh-Oleh Istimewa\".', '2026-10-02 19:26:20'),
(9, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-02 19:52:59'),
(10, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-02 19:53:29'),
(11, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-02 19:53:49'),
(12, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-02 19:55:57'),
(13, 1, 'Tambah Toko', 'Toko', 'Admin menambahkan toko baru \"toko ar ridlo\" (Pemilik: pak ridlo).', '2026-10-02 20:08:45'),
(14, 1, 'Tambah Produk', 'Produk', 'Admin menambahkan produk baru \"kripik balado\" untuk toko \"toko ar ridlo\".', '2026-10-02 20:09:31'),
(15, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-05 05:46:37'),
(16, 1, 'Hapus Toko', 'Toko', 'Admin menghapus toko \"Keripik Tempe Bu Siti Sanan\".', '2026-10-05 06:34:26'),
(17, 1, 'Hapus Toko', 'Toko', 'Admin menghapus toko \"Sentra Tempe Lancar Jaya\".', '2026-10-05 06:34:31'),
(18, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-05 08:25:32'),
(19, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-05 12:39:11'),
(20, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-05 12:54:31'),
(21, 1, 'Tambah Produk', 'Produk', 'Admin menambahkan produk baru \"ardan ganteng\" untuk toko \"Keripik Tempe Bu Noer\".', '2026-10-05 12:55:09'),
(22, 1, 'Tambah Produk', 'Produk', 'Admin menambahkan produk baru \"cwwwww\" untuk toko \"Keripik Tempe Bu Noer\".', '2026-10-05 12:56:36'),
(23, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-06 02:50:06'),
(24, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-06 02:51:10'),
(25, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-06 02:55:50'),
(26, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-06 10:00:25'),
(27, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-13 02:55:44'),
(28, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-13 04:13:04'),
(29, 1, 'Logout', 'Auth', 'User \"Admin Sanan\" (admin) telah keluar dari sistem admin.', '2026-10-13 04:14:47'),
(30, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-15 06:30:47'),
(31, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-15 06:38:20'),
(32, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-15 07:29:23'),
(33, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-15 07:32:32'),
(34, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-20 00:08:34'),
(35, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-21 07:50:41'),
(36, 1, 'Tambah Produk', 'Produk', 'Admin menambahkan produk baru \"asuuuuu\" untuk toko \"Keripik Tempe Bu Noer\".', '2026-10-21 10:50:34'),
(37, 1, 'Hapus Produk', 'Produk', 'Admin menghapus produk \"asuuuuu\".', '2026-10-21 11:01:58'),
(38, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-27 04:04:03'),
(39, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-10-27 04:04:04'),
(40, 1, 'Tambah Produk', 'Produk', 'Admin menambahkan produk baru \"ard4n ganteng\" untuk toko \"toko ar ridlo\".', '2026-10-27 04:06:18'),
(41, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-11-02 07:46:34'),
(42, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-11-04 07:28:27'),
(43, 1, 'Tambah Produk', 'Produk', 'Admin menambahkan produk baru \"ardan beruntung\" untuk toko \"toko ar ridlo\".', '2026-11-04 07:30:49'),
(44, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-11-09 06:16:00'),
(45, 1, 'Tambah Produk', 'Produk', 'Admin menambahkan produk baru \"heee\" untuk toko \"toko ar ridlo\".', '2026-11-09 08:10:05'),
(46, 1, 'Tambah Produk', 'Produk', 'Admin menambahkan produk baru \"ardan nguantengg\" untuk toko \"toko ar ridlo\".', '2026-11-09 08:15:34'),
(47, 1, 'Tambah Produk', 'Produk', 'Admin menambahkan produk baru \"ardan beruntunggg\" untuk toko \"toko ar ridlo\".', '2026-11-09 09:05:04'),
(48, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-11-10 02:53:02'),
(49, 1, 'Tambah Produk', 'Produk', 'Admin menambahkan produk baru \"oke baikkk\" untuk toko \"toko ar ridlo\".', '2026-11-10 03:20:52'),
(50, 1, 'Tambah Produk', 'Produk', 'Admin menambahkan produk baru \"oke baik\" untuk toko \"toko ar ridlo\".', '2026-11-10 03:46:12'),
(51, 1, 'Hapus Produk', 'Produk', 'Admin menghapus produk \"oke baik\".', '2026-11-10 03:46:15'),
(52, 1, 'Tambah Produk', 'Produk', 'Admin menambahkan produk baru \"ardan ganteng\" untuk toko \"toko ar ridlo\".', '2026-11-10 03:47:26'),
(53, 1, 'Tambah Produk', 'Produk', 'Admin menambahkan produk baru \"okeeeeeeeeee\" untuk toko \"toko ar ridlo\".', '2026-11-10 04:10:06'),
(54, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-11-13 12:22:58'),
(55, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-11-15 14:51:12'),
(56, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-11-16 12:41:49'),
(57, 1, 'Tambah Produk', 'Produk', 'Admin menambahkan produk baru \"ardan nguantengg\" untuk toko \"Keripik Tempe Bu Noer\".', '2026-11-16 12:44:07'),
(58, 1, 'Tambah Produk', 'Produk', 'Admin menambahkan produk baru \"ardan beruntunggg\" untuk toko \"Keripik Tempe Bu Noer\".', '2026-11-16 13:41:01'),
(59, 1, 'Login', 'Auth', 'User \"Admin Sanan\" (admin) berhasil login ke sistem admin.', '2026-11-17 03:44:36'),
(60, 1, 'Tambah Produk', 'Produk', 'Admin menambahkan produk baru \"oke baik\" untuk toko \"toko ar ridlo\".', '2026-11-17 03:57:14'),
(61, 1, 'Tambah Produk', 'Produk', 'Admin menambahkan produk baru \"oke baik\" untuk toko \"toko ar ridlo\".', '2026-11-17 04:41:45');

--
-- Dumping data for table `hampers`
--

INSERT INTO `hampers` (`id`, `name`, `description`, `image`, `price`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Paket Hampers Oleh-Oleh Sanan Komplit', 'Paket eksklusif berisi 3 varian keripik tempe favorit dengan kemasan box premium motif khas Sanan.', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=60', 65000.00, 'Aktif', '2026-10-02 19:18:39', '2026-10-02 19:18:39'),
(2, 'Hampers Spesial Hari Raya', 'Paket bingkisan hari raya lengkap dengan kartu ucapan dan pita elegan.', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=60', 110000.00, 'Aktif', '2026-10-02 19:18:39', '2026-10-02 19:18:39'),
(3, 'Paket Oleh-Oleh Istimewa', 'Paket bundling oleh-oleh khas Sanan', NULL, 85000.00, 'Aktif', '2026-10-02 19:26:20', '2026-10-02 19:26:20');

--
-- Dumping data for table `hampers_items`
--

INSERT INTO `hampers_items` (`id`, `hampers_id`, `product_id`, `quantity`) VALUES
(1, 1, 1, 2),
(2, 1, 2, 1),
(3, 2, 1, 2),
(4, 2, 3, 2);

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `store_id`, `name`, `image`, `price`, `variant`, `size`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Keripik Tempe Original Rohani', 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=60', 18000.00, 'Original Gurih', '250g', 'Keripik tempe renyah dengan bumbu bawang ketumbar khas resep warisan 1988.', 'Tersedia', '2026-10-02 19:18:39', '2026-10-02 19:18:39'),
(2, 1, 'Keripik Tempe Balado Pedas Manis', 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&auto=format&fit=crop&q=60', 20000.00, 'Balado', '250g', 'Sensasi bumbu balado khas Jawa Timur dengan rempah cabai asli.', 'Tersedia', '2026-10-02 19:18:39', '2026-10-02 19:18:39'),
(3, 2, 'Keripik Tempe Sagu Super Renyah', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=60', 22000.00, 'Bawang Seledri', '300g', 'Tekstur ekstra renyah dengan campuran tepung sagu berkualitas tinggi.', 'Tersedia', '2026-10-02 19:18:39', '2026-10-02 19:18:39'),
(6, 5, 'kripik balado', '/uploads/products/id-11134207-8224p-mhal2xaf99n2dc-1790971771432-378094208.jpg', 10000.00, 'balado', '250g', '', 'Tersedia', '2026-10-02 20:09:31', '2026-10-02 20:09:31'),
(7, 2, 'ardan ganteng', '/uploads/products/kecerdasan-1791204909038-997027901.jpeg', 1212121212.00, 'ori', '250g', '', 'Tersedia', '2026-10-05 12:55:09', '2026-10-05 12:55:09'),
(8, 2, 'cwwwww', '/uploads/products/image-1791204996334-939408537.jpg', 2313232323.00, 'ori', '250g', '', 'Tersedia', '2026-10-05 12:56:36', '2026-10-05 12:56:36'),
(10, 5, 'ard4n ganteng', '/uploads/products/DSCF4112_JPG-1793073977994-716182673.jpg', 9999999999.99, 'ori', '250g', 'zdxfcgvhb', 'Tersedia', '2026-10-27 04:06:18', '2026-10-27 04:06:18'),
(11, 5, 'ardan beruntung', '/uploads/products/3in1_Program_-_PM_AI-1793777449094-256840944.png', 1000000000.00, 'ori', '250g', '', 'Pre-Order', '2026-11-04 07:30:49', '2026-11-04 07:30:49'),
(12, 5, 'heee', 'https://res.cloudinary.com/qdpihmxh/image/upload/v1794214886/sanan-tempe/products/znergjiepedirxtsnli8.jpg', 900000000.00, 'enak', '250g', '', 'Tersedia', '2026-11-09 08:10:05', '2026-11-09 08:10:05'),
(13, 5, 'ardan nguantengg', 'https://res.cloudinary.com/qdpihmxh/image/upload/v1794215215/sanan-tempe/products/ha2is8idhprmxnflwgmp.jpg', 1000000000.00, 'wangi', '250g', '', 'Tersedia', '2026-11-09 08:15:34', '2026-11-09 08:15:34'),
(14, 5, 'ardan beruntunggg', 'https://res.cloudinary.com/qdpihmxh/image/upload/v1794218185/sanan-tempe/products/zl43bjepa0kznejnryst.jpg', 700000000.00, 'wangi', '5kg', '', 'Tersedia', '2026-11-09 09:05:03', '2026-11-09 09:05:03'),
(15, 5, 'oke baikkk', 'https://res.cloudinary.com/qdpihmxh/image/upload/v1794283931/sanan-tempe/products/ywydcgywx1dcv0wptkcb.jpg', 789999.00, 'ori', '5kg', '', 'Tersedia', '2026-11-10 03:20:52', '2026-11-10 03:20:52'),
(17, 5, 'ardan ganteng', 'https://res.cloudinary.com/qdpihmxh/image/upload/v1794285525/sanan-tempe/products/fnv0vbt1mmo2gxjgkj0b.jpg', 1000000.00, 'ori', '250g', '', 'Tersedia', '2026-11-10 03:47:26', '2026-11-10 03:47:26'),
(18, 5, 'okeeeeeeeeee', 'https://res.cloudinary.com/qdpihmxh/image/upload/v1794286884/sanan-tempe/products/yl4uaajuv15yplmd8toe.jpg', 900000900.00, 'ori', '250g', '', 'Tersedia', '2026-11-10 04:10:06', '2026-11-10 04:10:06'),
(19, 2, 'ardan nguantengg', 'https://res.cloudinary.com/qdpihmxh/image/upload/v1794833046/sanan-tempe/products/cwa1zymfwfhicpvnh2oc.jpg', 100000.00, 'BBQ', '250g', '', 'Tersedia', '2026-11-16 12:44:07', '2026-11-16 12:44:07'),
(20, 2, 'ardan beruntunggg', 'https://res.cloudinary.com/qdpihmxh/image/upload/v1794836460/sanan-tempe/products/ujutaqs0tpcjgqwfs6nq.jpg', 300000.00, 'wangi', '250g', '', 'Tersedia', '2026-11-16 13:41:01', '2026-11-16 13:41:01'),
(21, 5, 'oke baik', 'https://res.cloudinary.com/qdpihmxh/image/upload/v1794887832/sanan-tempe/products/bzqzpt0wohnunvif3ibw.jpg', 9000.00, 'ori', '250g', '', 'Tersedia', '2026-11-17 03:57:14', '2026-11-17 03:57:14'),
(22, 5, 'oke baik', 'https://res.cloudinary.com/qdpihmxh/image/upload/v1794890504/sanan-tempe/products/hrmj9696iwxt6ebr0ul7.jpg', 40000.00, 'ori', '250g', '', 'Tersedia', '2026-11-17 04:41:45', '2026-11-17 04:41:45');

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `name`, `owner`, `address`, `gmaps_link`, `area`, `whatsapp`, `description`, `image`, `latitude`, `longitude`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Keripik Tempe Rohani', 'H. Rohani & Hj. Siti', 'Jl. Sanan No. 125, Purwantoro, Blimbing, Kota Malang', NULL, 'Sentra Utama Sanan', '+6281234567890', 'Pusat oleh-oleh keripik tempe legendaris Sanan sejak 1988 dengan aneka varian rasa khas.', 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=60', -7.95420000, 112.64510000, 'Aktif', '2026-10-02 19:18:39', '2026-10-02 19:18:39'),
(2, 'Keripik Tempe Bu Noer', 'Ibu Noer Aini', 'Jl. Sanan Gang 3 No. 45, Blimbing, Kota Malang', NULL, 'Sanan Gang 3', '+6282198765432', 'Spesialis keripik tempe sagu renyah dan aneka keripik buah khas Malang.', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60', -7.95510000, 112.64620000, 'Aktif', '2026-10-02 19:18:39', '2026-10-02 19:18:39'),
(5, 'toko ar ridlo', 'pak ridlo', 'JL. Sanan No 38', 'https://share.google/ercmiio4yVyhzgEnD', 'Sentra Utama Sanan', '+6281234567890', 'toko ini jual berbagai macam rasa kripik tempe', '/uploads/stores/WhatsApp_Image_2026-09-09_at_13_50_28-1790971725061-352156316.jpeg', NULL, NULL, 'Aktif', '2026-10-02 20:08:45', '2026-10-02 20:08:45');

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Admin Sanan', 'admin@sanan.com', '$2b$10$LXDYpdlNtHtBbIeR73k9UemqXBkQSlKvVn3tq6kbxPHOdbuP3/aI2', 'admin', '2026-10-02 19:18:39', '2026-10-02 19:18:39'),
(2, 'Manager Sentra', 'manager@sanan.com', '$2b$10$dJBBaV0zbJFQnEtQnvqfaORfr2ioiP2dXcg03EmMAuum4dVbOJHji', 'manager', '2026-10-02 19:18:39', '2026-10-02 19:18:39'),
(3, 'Dosen Pembimbing', 'dosen@ub.ac.id', '$2b$10$QxVmz74muSN2OxP54np9cOFNHHx15vigeXQzGaduG1M/QpGK/vZfS', 'dosen', '2026-10-02 19:18:39', '2026-10-02 19:18:39');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
