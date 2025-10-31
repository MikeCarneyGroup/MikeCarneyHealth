import { db } from '@/lib/db';
import { announcements, news, events, policies, submissions, users, downloads } from '@/lib/db/schema';
import { count, eq } from 'drizzle-orm';
import { Newspaper, Calendar, FileText, MessageSquare, Users, CheckCircle, Clock, Download } from 'lucide-react';

export const metadata = {
  title: 'Admin Overview - Mike Carney Wellbeing Hub',
};

export default async function AdminOverviewPage() {
  const [
    newsCount,
    eventsCount,
    policiesCount,
    pendingSubmissions,
    totalUsers,
    downloadsCount,
  ] = await Promise.all([
    db.select({ count: count() }).from(news).then(r => r[0].count),
    db.select({ count: count() }).from(events).then(r => r[0].count),
    db.select({ count: count() }).from(policies).then(r => r[0].count),
    db.select({ count: count() }).from(submissions).where(eq(submissions.status, 'pending')).then(r => r[0].count),
    db.select({ count: count() }).from(users).then(r => r[0].count),
    db.select({ count: count() }).from(downloads).then(r => r[0].count),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Overview</h1>
        <p className="text-gray-600">Manage your wellbeing hub content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<Newspaper className="h-6 w-6" />}
          title="News Articles"
          value={newsCount}
          href="/admin/news"
        />
        <StatCard
          icon={<Calendar className="h-6 w-6" />}
          title="Events"
          value={eventsCount}
          href="/admin/events"
        />
        <StatCard
          icon={<FileText className="h-6 w-6" />}
          title="Policies"
          value={policiesCount}
          href="/admin/policies"
        />
        <StatCard
          icon={<MessageSquare className="h-6 w-6" />}
          title="Pending Submissions"
          value={pendingSubmissions}
          href="/admin/submissions"
          highlight={pendingSubmissions > 0}
        />
        <StatCard
          icon={<Users className="h-6 w-6" />}
          title="Total Users"
          value={totalUsers}
          href="/admin/users"
        />
        <StatCard
          icon={<Download className="h-6 w-6" />}
          title="Downloads"
          value={downloadsCount}
          href="/admin/downloads"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <a href="/admin/announcements/new" className="block px-4 py-2 rounded bg-primary-50 hover:bg-primary-100 text-primary-900 transition-colors">
              Create Announcement
            </a>
            <a href="/admin/news/new" className="block px-4 py-2 rounded bg-primary-50 hover:bg-primary-100 text-primary-900 transition-colors">
              Create News Article
            </a>
            <a href="/admin/events/new" className="block px-4 py-2 rounded bg-primary-50 hover:bg-primary-100 text-primary-900 transition-colors">
              Create Event
            </a>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <p className="text-sm text-gray-500">Activity tracking coming soon</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  href,
  highlight = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  href: string;
  highlight?: boolean;
}) {
  return (
    <a
      href={href}
      className={`card hover:shadow-md transition-shadow ${
        highlight ? 'border-yellow-300 bg-yellow-50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`text-${highlight ? 'yellow' : 'primary'}-600`} aria-hidden="true">
          {icon}
        </div>
      </div>
    </a>
  );
}
