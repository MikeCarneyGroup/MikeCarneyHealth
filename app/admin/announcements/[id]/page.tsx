import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { AnnouncementEditForm } from './AnnouncementEditForm';

export const metadata = {
  title: 'Edit Announcement - Admin',
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAnnouncementPage({ params }: PageProps) {
  const session = await auth();
  
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    redirect('/dashboard');
  }

  const { id } = await params;

  const announcement = await db
    .select()
    .from(announcements)
    .where(eq(announcements.id, id))
    .limit(1);

  if (announcement.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Edit Announcement</h1>
        <p className="text-gray-600">Update announcement details and manage publication status</p>
      </div>

      <AnnouncementEditForm announcement={announcement[0]} />
    </div>
  );
}

