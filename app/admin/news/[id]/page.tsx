import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { news } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NewsEditForm } from './NewsEditForm';

export const metadata = {
  title: 'Edit News Article - Admin',
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditNewsPage({ params }: PageProps) {
  const session = await auth();
  
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    redirect('/dashboard');
  }

  const { id } = await params;

  const article = await db
    .select()
    .from(news)
    .where(eq(news.id, id))
    .limit(1);

  if (article.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Edit News Article</h1>
        <p className="text-gray-600">Update article details and manage publication status</p>
      </div>

      <NewsEditForm article={article[0]} />
    </div>
  );
}

