'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

interface UpdateAnnouncementData {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  published: boolean;
}

export async function updateAnnouncement(data: UpdateAnnouncementData) {
  const session = await auth();

  // Verify authentication and authorization
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Get existing announcement
    const existingAnnouncement = await db
      .select()
      .from(announcements)
      .where(eq(announcements.id, data.id))
      .limit(1);

    if (existingAnnouncement.length === 0) {
      return { success: false, error: 'Announcement not found' };
    }

    await db
      .update(announcements)
      .set({
        title: data.title,
        content: data.content,
        isPublic: data.isPublic,
        published: data.published,
        updatedAt: new Date(),
      })
      .where(eq(announcements.id, data.id));

    revalidatePath('/admin/announcements');
    revalidatePath('/dashboard');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error updating announcement:', error);
    return { success: false, error: 'Failed to update announcement' };
  }
}

export async function deleteAnnouncement(id: string) {
  const session = await auth();

  // Verify authentication and authorization
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await db.delete(announcements).where(eq(announcements.id, id));

    revalidatePath('/admin/announcements');
    revalidatePath('/dashboard');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return { success: false, error: 'Failed to delete announcement' };
  }
}

