import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const metadata = {
  title: 'Manage Announcements - Admin',
};

export default async function AdminAnnouncementsPage() {
  const session = await auth();
  
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    redirect('/dashboard');
  }

  const allAnnouncements = await db
    .select()
    .from(announcements)
    .orderBy(desc(announcements.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Announcements</h1>
        <Link href="/admin/announcements/new" className="btn-primary px-4 py-2 inline-flex items-center gap-2">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Announcement
        </Link>
      </div>

      {allAnnouncements.length > 0 ? (
        <div className="space-y-4">
          {allAnnouncements.map((announcement) => (
            <article key={announcement.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{announcement.title}</h3>
                    {announcement.isPublic && (
                      <span className="text-xs px-2 py-1 rounded-sm bg-blue-100 text-blue-800">
                        Public
                      </span>
                    )}
                    {!announcement.published && (
                      <span className="text-xs px-2 py-1 rounded-sm bg-gray-100 text-gray-800">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
                  <time className="text-xs text-gray-500 mt-2 block">
                    {new Date(announcement.createdAt).toLocaleDateString('en-AU')}
                  </time>
                </div>
                <Link
                  href={`/admin/announcements/${announcement.id}`}
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
          <p className="text-gray-500">No announcements yet.</p>
          <Link href="/admin/announcements/new" className="btn-primary px-4 py-2 mt-4 inline-block">
            Create First Announcement
          </Link>
        </div>
      )}
    </div>
  );
}
