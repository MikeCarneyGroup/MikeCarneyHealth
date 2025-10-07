'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { downloads } from '@/lib/db/schema';
import { uploadFile } from '@/lib/utils/file-upload';
import { revalidatePath } from 'next/cache';

interface CreateDownloadData {
  title: string;
  description?: string;
  category: string;
  file: File;
  published: boolean;
}

export async function createDownload(data: CreateDownloadData) {
  const session = await auth();

  // Verify authentication and authorization
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Upload file
    const uploadResult = await uploadFile(data.file, 'downloads');

    await db.insert(downloads).values({
      title: data.title,
      description: data.description || null,
      category: data.category,
      fileUrl: uploadResult.url,
      fileName: uploadResult.filename,
      fileSize: uploadResult.size,
      published: data.published,
    });

    revalidatePath('/admin/downloads');
    revalidatePath('/downloads');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error creating download:', error);
    return { success: false, error: 'Failed to create download' };
  }
}

