import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AnnouncementForm } from './AnnouncementForm';

export const metadata = {
  title: 'New Announcement - Admin',
};

export default async function NewAnnouncementPage() {
  const session = await auth();

  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    redirect('/dashboard');
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create Announcement</h1>
        <p className="text-gray-600">Share important updates with staff members</p>
      </div>

      <AnnouncementForm authorId={session.user.id} />
    </div>
  );
}

