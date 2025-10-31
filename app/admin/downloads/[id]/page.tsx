import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { downloads } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { DownloadEditForm } from './DownloadEditForm';

export const metadata = {
  title: 'Edit Download - Admin',
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditDownloadPage({ params }: PageProps) {
  const session = await auth();
  
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    redirect('/dashboard');
  }

  const { id } = await params;

  const download = await db
    .select()
    .from(downloads)
    .where(eq(downloads.id, id))
    .limit(1);

  if (download.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Edit Download</h1>
        <p className="text-gray-600">Update download details and manage publication status</p>
      </div>

      <DownloadEditForm download={download[0]} />
    </div>
  );
}

