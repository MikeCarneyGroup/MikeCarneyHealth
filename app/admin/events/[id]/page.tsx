import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { EventEditForm } from './EventEditForm';

export const metadata = {
  title: 'Edit Event - Admin',
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const session = await auth();
  
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    redirect('/dashboard');
  }

  const { id } = await params;

  const event = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .limit(1);

  if (event.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Edit Event</h1>
        <p className="text-gray-600">Update event details and manage publication status</p>
      </div>

      <EventEditForm event={event[0]} />
    </div>
  );
}

