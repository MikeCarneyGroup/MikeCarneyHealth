import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { NewsForm } from './NewsForm';

export const metadata = {
  title: 'New Article - Admin',
};

export default async function NewNewsPage() {
  const session = await auth();

  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    redirect('/dashboard');
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create News Article</h1>
        <p className="text-gray-600">Share news and updates with staff</p>
      </div>

      <NewsForm authorId={session.user.id} />
    </div>
  );
}

