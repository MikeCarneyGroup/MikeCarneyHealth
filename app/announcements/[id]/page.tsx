import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { auth } from '@/auth';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  
  const result = session
    ? await db
        .select()
        .from(announcements)
        .where(and(eq(announcements.id, id), eq(announcements.published, true)))
        .limit(1)
    : await db
        .select()
        .from(announcements)
        .where(and(eq(announcements.id, id), eq(announcements.isPublic, true), eq(announcements.published, true)))
        .limit(1);

  const announcement = result[0];
  if (!announcement) return { title: 'Announcement Not Found' };

  return {
    title: `${announcement.title} - Announcements`,
  };
}

export default async function AnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const result = session
    ? await db
        .select()
        .from(announcements)
        .where(and(eq(announcements.id, id), eq(announcements.published, true)))
        .limit(1)
    : await db
        .select()
        .from(announcements)
        .where(and(eq(announcements.id, id), eq(announcements.isPublic, true), eq(announcements.published, true)))
        .limit(1);

  const announcement = result[0];
  if (!announcement) {
    notFound();
  }

  return (
    <div className="py-8">
      <div className="container-custom max-w-4xl">
        <Link
          href="/announcements"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Announcements
        </Link>

        <article className="card">
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{announcement.title}</h1>
            <time className="text-gray-500">
              {new Date(announcement.createdAt).toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </header>

          <div className="prose prose-lg max-w-none">
            {announcement.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

