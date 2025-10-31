import { auth } from '@/auth';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Announcements - Mike Carney Wellbeing Hub',
  description: 'Company announcements and updates',
};

export default async function AnnouncementsPage() {
  const session = await auth();

  // Fetch all published announcements
  // If user is logged in, show all announcements
  // If not logged in, show only public announcements
  const allAnnouncements = session
    ? await db
        .select()
        .from(announcements)
        .where(eq(announcements.published, true))
        .orderBy(desc(announcements.createdAt))
    : await db
        .select()
        .from(announcements)
        .where(and(eq(announcements.isPublic, true), eq(announcements.published, true)))
        .orderBy(desc(announcements.createdAt));

  return (
    <div className="py-8">
      <div className="container-custom max-w-4xl">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Announcements</h1>
          <p className="text-gray-600">Stay up to date with the latest company announcements and updates</p>
        </div>

        {allAnnouncements.length > 0 ? (
          <div className="space-y-4">
            {allAnnouncements.map((announcement) => (
              <Link
                key={announcement.id}
                href={`/announcements/${announcement.id}`}
                className="card hover:shadow-md transition-shadow block"
              >
                <h2 className="font-semibold text-lg mb-2">{announcement.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-3 mb-3">{announcement.content}</p>
                <time className="text-xs text-gray-500">
                  {new Date(announcement.createdAt).toLocaleDateString('en-AU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-500">No announcements at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}

