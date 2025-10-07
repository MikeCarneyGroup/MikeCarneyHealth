import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PolicyForm } from './PolicyForm';

export const metadata = {
  title: 'New Policy - Admin',
};

export default async function NewPolicyPage() {
  const session = await auth();

  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    redirect('/dashboard');
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create Policy</h1>
        <p className="text-gray-600">Upload and organize company policies</p>
      </div>

      <PolicyForm />
    </div>
  );
}

