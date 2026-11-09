import cloudinary from '../config/cloudinary';

export async function deleteFromCloudinary(imageUrl: string | null | undefined) {
  if (!imageUrl || !imageUrl.includes('://cloudinary.com')) return;

  try {
    // Mengambil public_id dari URL, contoh: "sanan-tempe/products/namafile"
    const parts = imageUrl.split('/upload/');
    if (parts.length < 2) return;

    const pathWithoutVersion = parts[1].replace(/^v\d+\//, '');
    const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, '');

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('[Cloudinary Delete Error]:', error);
  }
}
