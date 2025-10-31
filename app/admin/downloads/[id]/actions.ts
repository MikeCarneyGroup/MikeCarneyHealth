'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { downloads } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { uploadFile } from '@/lib/utils/file-upload';
import { revalidatePath } from 'next/cache';

interface UpdateDownloadData {
  id: string;
  title: string;
  description?: string;
  category: string;
  file: File | null;
  published: boolean;
}

export async function updateDownload(data: UpdateDownloadData) {
  const session = await auth();

  // Verify authentication and authorization
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Get existing download
    const existingDownload = await db
      .select()
      .from(downloads)
      .where(eq(downloads.id, data.id))
      .limit(1);

    if (existingDownload.length === 0) {
      return { success: false, error: 'Download not found' };
    }

    const current = existingDownload[0];

    let fileUrl = current.fileUrl;
    let fileName = current.fileName;
    let fileSize = current.fileSize;

    // Upload new file if provided
    if (data.file) {
      const uploadResult = await uploadFile(data.file, 'downloads');
      fileUrl = uploadResult.url;
      fileName = uploadResult.filename;
      fileSize = uploadResult.size;
    }

    await db
      .update(downloads)
      .set({
        title: data.title,
        description: data.description || null,
        category: data.category,
        fileUrl,
        fileName,
        fileSize,
        published: data.published,
        updatedAt: new Date(),
      })
      .where(eq(downloads.id, data.id));

    revalidatePath('/admin/downloads');
    revalidatePath('/downloads');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error updating download:', error);
    return { success: false, error: 'Failed to update download' };
  }
}

export async function deleteDownload(id: string) {
  const session = await auth();

  // Verify authentication and authorization
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await db.delete(downloads).where(eq(downloads.id, id));

    revalidatePath('/admin/downloads');
    revalidatePath('/downloads');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error deleting download:', error);
    return { success: false, error: 'Failed to delete download' };
  }
}

