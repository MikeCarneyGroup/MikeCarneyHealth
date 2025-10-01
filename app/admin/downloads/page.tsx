import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { downloads } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const metadata = {
  title: 'Manage Downloads - Admin',
};

export default async function AdminDownloadsPage() {
  const session = await auth();
  
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    redirect('/dashboard');
  }

  const allDownloads = await db
    .select()
    .from(downloads)
    .orderBy(desc(downloads.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Downloads</h1>
        <Link href="/admin/downloads/new" className="btn-primary px-4 py-2 inline-flex items-center gap-2">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Download
        </Link>
      </div>

      {allDownloads.length > 0 ? (
        <div className="space-y-4">
          {allDownloads.map((download) => (
            <article key={download.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{download.title}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
                      {download.category}
                    </span>
                    {!download.published && (
                      <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                        Draft
                      </span>
                    )}
                  </div>
                  {download.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{download.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    📄 {download.fileName}
                    {download.fileSize && ` • ${(download.fileSize / 1024).toFixed(1)} KB`}
                  </p>
                </div>
                <Link
                  href={`/admin/downloads/${download.id}`}
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
          <p className="text-gray-500">No downloads yet.</p>
          <Link href="/admin/downloads/new" className="btn-primary px-4 py-2 mt-4 inline-block">
            Add First Download
          </Link>
        </div>
      )}
    </div>
  );
}
