'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';

interface CreateAnnouncementData {
  title: string;
  content: string;
  authorId: string;
  isPublic: boolean;
  published: boolean;
}

export async function createAnnouncement(data: CreateAnnouncementData) {
  const session = await auth();

  // Verify authentication and authorization
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    return { success: false, error: 'Unauthorized' };
  }

  // Verify the author ID matches the session
  if (data.authorId !== session.user.id) {
    return { success: false, error: 'Invalid author' };
  }

  try {
    await db.insert(announcements).values({
      title: data.title,
      content: data.content,
      authorId: data.authorId,
      isPublic: data.isPublic,
      published: data.published,
    });

    revalidatePath('/admin/announcements');
    revalidatePath('/dashboard');
    if (data.isPublic) {
      revalidatePath('/');
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating announcement:', error);
    return { success: false, error: 'Failed to create announcement' };
  }
}

