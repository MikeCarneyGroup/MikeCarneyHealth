import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { policies } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const metadata = {
  title: 'Manage Policies - Admin',
};

export default async function AdminPoliciesPage() {
  const session = await auth();
  
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    redirect('/dashboard');
  }

  const allPolicies = await db
    .select()
    .from(policies)
    .orderBy(desc(policies.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Policies</h1>
        <Link href="/admin/policies/new" className="btn-primary px-4 py-2 inline-flex items-center gap-2">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Policy
        </Link>
      </div>

      {allPolicies.length > 0 ? (
        <div className="space-y-4">
          {allPolicies.map((policy) => (
            <article key={policy.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{policy.title}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
                      {policy.category}
                    </span>
                    {!policy.published && (
                      <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                        Draft
                      </span>
                    )}
                  </div>
                  {policy.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{policy.description}</p>
                  )}
                  {policy.fileUrl && (
                    <p className="text-xs text-gray-500 mt-2">📄 PDF attached</p>
                  )}
                </div>
                <Link
                  href={`/admin/policies/${policy.id}`}
                  className="btn-outline px-4 py-2 text-sm"
                >
                  Edit
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500">No policies yet.</p>
          <Link href="/admin/policies/new" className="btn-primary px-4 py-2 mt-4 inline-block">
            Create First Policy
          </Link>
        </div>
      )}
    </div>
  );
}
