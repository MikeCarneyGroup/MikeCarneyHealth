import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { policies } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { PolicyEditForm } from './PolicyEditForm';

export const metadata = {
  title: 'Edit Policy - Admin',
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPolicyPage({ params }: PageProps) {
  const session = await auth();
  
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    redirect('/dashboard');
  }

  const { id } = await params;

  const policy = await db
    .select()
    .from(policies)
    .where(eq(policies.id, id))
    .limit(1);

  if (policy.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Edit Policy</h1>
        <p className="text-gray-600">Update policy details and manage publication status</p>
      </div>

      <PolicyEditForm policy={policy[0]} />
    </div>
  );
}

