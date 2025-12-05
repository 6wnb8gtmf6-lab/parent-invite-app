import { put } from '@vercel/blob';

export async function uploadFile(filename: string, file: File | Blob | string): Promise<string> {
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
        console.warn('⚠️ BLOB_READ_WRITE_TOKEN not found. Using placeholder image.');
        // Return a placeholder image URL
        return `https://placehold.co/600x400?text=${encodeURIComponent(filename)}`;
    }

    try {
        const blob = await put(filename, file, {
            access: 'public',
            token: token, // Explicitly pass token if available
        });
        return blob.url;
    } catch (error) {
        console.error('Failed to upload to Vercel Blob:', error);
        throw new Error('Failed to upload file');
    }
}
