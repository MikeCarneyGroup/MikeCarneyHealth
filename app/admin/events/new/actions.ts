'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';

interface CreateEventData {
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  published: boolean;
}

export async function createEvent(data: CreateEventData) {
  const session = await auth();

  // Verify authentication and authorization
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await db.insert(events).values({
      title: data.title,
      description: data.description || null,
      location: data.location || null,
      startDate: data.startDate,
      endDate: data.endDate || null,
      published: data.published,
    });

    revalidatePath('/admin/events');
    revalidatePath('/events');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error creating event:', error);
    return { success: false, error: 'Failed to create event' };
  }
}

