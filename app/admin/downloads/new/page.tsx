import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DownloadForm } from './DownloadForm';

export const metadata = {
  title: 'New Download - Admin',
};

export default async function NewDownloadPage() {
  const session = await auth();

  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    redirect('/dashboard');
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Add Download</h1>
        <p className="text-gray-600">Upload forms and resources for staff</p>
      </div>

      <DownloadForm />
    </div>
  );
}

