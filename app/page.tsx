import Link from 'next/link';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { ArrowRight, Calendar, FileText, Heart, Users } from 'lucide-react';

export default async function HomePage() {
  const session = await auth();
  
  // Fetch public announcements
  const publicAnnouncements = await db
    .select()
    .from(announcements)
    .where(eq(announcements.isPublic, true))
    .orderBy(desc(announcements.createdAt))
    .limit(3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-linear-to-br from-primary-600 to-primary-800 text-white py-16 md:py-24">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to Mike Carney Wellbeing Hub
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl opacity-90">
            Your central resource for staff wellbeing, health initiatives, and company information.
          </p>
          {!session ? (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Staff Login
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Go to Dashboard
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Heart className="h-8 w-8" />}
              title="Health Initiatives"
              description="Access our wellness programs and health resources."
              href="/health-initiatives"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Mike Carney Health"
              description="Learn about our gym facilities and fitness programs."
              href="/mch"
              requiresAuth={true}
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8" />}
              title="Staff Events"
              description="Stay updated on upcoming company events."
              href="/events"
              requiresAuth={true}
            />
            <FeatureCard
              icon={<FileText className="h-8 w-8" />}
              title="Policies & Downloads"
              description="Access important documents and company policies."
              href="/policies"
              requiresAuth={true}
            />
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      {publicAnnouncements.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8">Latest Announcements</h2>
            <div className="grid gap-6">
              {publicAnnouncements.map((announcement) => (
                <article key={announcement.id} className="card">
                  <h3 className="text-xl font-semibold mb-2">{announcement.title}</h3>
                  <p className="text-gray-600 mb-4">{announcement.content}</p>
                  <time className="text-sm text-gray-500">
                    {new Date(announcement.createdAt).toLocaleDateString('en-AU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Explore exciting career opportunities at Mike Carney Group and be part of our growing team.
          </p>
          <Link
            href="/careers"
            className="btn-primary px-6 py-3 text-base"
          >
            View Career Opportunities
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  requiresAuth = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  requiresAuth?: boolean;
}) {
  return (
    <Link
      href={href}
      className="card hover:shadow-md transition-shadow group"
    >
      <div className="text-primary-600 mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {title}
        {requiresAuth && (
          <span className="ml-2 text-xs text-gray-500">(Login required)</span>
        )}
      </h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}
