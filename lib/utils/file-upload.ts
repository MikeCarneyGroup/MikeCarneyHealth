import { put } from '@vercel/blob';

export async function uploadFile(file: File, folder: string = 'uploads') {
  try {
    const blob = await put(`${folder}/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    return {
      url: blob.url,
      filename: file.name,
      size: file.size,
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}
