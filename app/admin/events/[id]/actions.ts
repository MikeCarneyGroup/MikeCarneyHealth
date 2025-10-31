'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

interface UpdateEventData {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  published: boolean;
}

export async function updateEvent(data: UpdateEventData) {
  const session = await auth();

  // Verify authentication and authorization
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Get existing event
    const existingEvent = await db
      .select()
      .from(events)
      .where(eq(events.id, data.id))
      .limit(1);

    if (existingEvent.length === 0) {
      return { success: false, error: 'Event not found' };
    }

    await db
      .update(events)
      .set({
        title: data.title,
        description: data.description || null,
        location: data.location || null,
        startDate: data.startDate,
        endDate: data.endDate || null,
        published: data.published,
        updatedAt: new Date(),
      })
      .where(eq(events.id, data.id));

    revalidatePath('/admin/events');
    revalidatePath('/events');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error updating event:', error);
    return { success: false, error: 'Failed to update event' };
  }
}

export async function deleteEvent(id: string) {
  const session = await auth();

  // Verify authentication and authorization
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await db.delete(events).where(eq(events.id, id));

    revalidatePath('/admin/events');
    revalidatePath('/events');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error deleting event:', error);
    return { success: false, error: 'Failed to delete event' };
  }
}

