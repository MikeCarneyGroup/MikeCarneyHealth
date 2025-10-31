import { auth } from '@/auth';
import { db } from '@/lib/db';
import { announcements, events, news } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import Link from 'next/link';
import { Calendar, FileText, Newspaper, Users } from 'lucide-react';

export const metadata = {
  title: 'Dashboard - Mike Carney Wellbeing Hub',
};

export default async function DashboardPage() {
  const session = await auth();

  // Fetch recent content
  const [recentNews, upcomingEvents, recentAnnouncements] = await Promise.all([
    db.select().from(news).where(eq(news.published, true)).orderBy(desc(news.createdAt)).limit(3),
    db.select().from(events).where(eq(events.published, true)).orderBy(desc(events.startDate)).limit(3),
    db.select().from(announcements).where(eq(announcements.published, true)).orderBy(desc(announcements.createdAt)).limit(3),
  ]);

  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {session?.user?.name || 'Staff Member'}
          </h1>
          <p className="text-gray-600">
            Here's what's happening at Mike Carney Group
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <QuickLink
            href="/news"
            icon={<Newspaper className="h-6 w-6" />}
            title="News"
            description="Latest company updates"
          />
          <QuickLink
            href="/events"
            icon={<Calendar className="h-6 w-6" />}
            title="Events"
            description="Upcoming staff events"
          />
          <QuickLink
            href="/policies"
            icon={<FileText className="h-6 w-6" />}
            title="Policies"
            description="Company policies & docs"
          />
          <QuickLink
            href="/submissions"
            icon={<Users className="h-6 w-6" />}
            title="Submissions"
            description="Share your stories"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Announcements */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Recent Announcements</h2>
              <Link href="/announcements" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
            {recentAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {recentAnnouncements.map((announcement) => (
                  <Link
                    key={announcement.id}
                    href={`/announcements/${announcement.id}`}
                    className="card hover:shadow-md transition-shadow block"
                  >
                    <h3 className="font-semibold mb-1">{announcement.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
                    <time className="text-xs text-gray-500 mt-2 block">
                      {new Date(announcement.createdAt).toLocaleDateString('en-AU')}
                    </time>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No announcements at this time.</p>
            )}
          </section>

          {/* Upcoming Events */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
              <Link href="/events" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="card hover:shadow-md transition-shadow block"
                  >
                    <h3 className="font-semibold mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      <time>{new Date(event.startDate).toLocaleDateString('en-AU')}</time>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming events.</p>
            )}
          </section>
        </div>

        {/* Latest News */}
        {recentNews.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Latest News</h2>
              <Link href="/news" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentNews.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`} className="card hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{article.excerpt}</p>
                  <time className="text-xs text-gray-500 mt-3 block">
                    {new Date(article.createdAt).toLocaleDateString('en-AU')}
                  </time>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="card hover:shadow-md transition-shadow group">
      <div className="text-primary-600 mb-3 group-hover:scale-110 transition-transform" aria-hidden="true">
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
