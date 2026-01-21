import { db } from '@/lib/db';
import { news, policies, events, announcements, downloads } from '@/lib/db/schema';
import { or, eq, and, sql } from 'drizzle-orm';
import Link from 'next/link';
import { Search, Newspaper, FileText, Calendar, Megaphone, Download } from 'lucide-react';
import { auth } from '@/auth';

export const metadata = {
  title: 'Search - Mike Carney Wellbeing Hub',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || '';
  const session = await auth();

  let results = {
    news: [] as Array<typeof news.$inferSelect>,
    policies: [] as Array<typeof policies.$inferSelect>,
    events: [] as Array<typeof events.$inferSelect>,
    announcements: [] as Array<typeof announcements.$inferSelect>,
    downloads: [] as Array<typeof downloads.$inferSelect>,
  };

  if (query.trim()) {
    const searchTerm = `%${query}%`;

    // For announcements: if user is logged in, show all published; if not, only show public
    const announcementCondition = session
      ? and(eq(announcements.published, true))
      : and(eq(announcements.published, true), eq(announcements.isPublic, true));

    const [newsResults, policyResults, eventResults, announcementResults, downloadResults] =
      await Promise.all([
        db
          .select()
          .from(news)
          .where(
            and(
              eq(news.published, true),
              or(
                sql`${news.title} ILIKE ${searchTerm}`,
                sql`${news.content} ILIKE ${searchTerm}`
              )
            )
          )
          .limit(10),
        db
          .select()
          .from(policies)
          .where(
            and(
              eq(policies.published, true),
              or(
                sql`${policies.title} ILIKE ${searchTerm}`,
                sql`${policies.description} ILIKE ${searchTerm}`
              )
            )
          )
          .limit(10),
        db
          .select()
          .from(events)
          .where(
            and(
              eq(events.published, true),
              or(
                sql`${events.title} ILIKE ${searchTerm}`,
                sql`${events.description} ILIKE ${searchTerm}`
              )
            )
          )
          .limit(10),
        db
          .select()
          .from(announcements)
          .where(
            and(
              announcementCondition,
              or(
                sql`${announcements.title} ILIKE ${searchTerm}`,
                sql`${announcements.content} ILIKE ${searchTerm}`
              )
            )
          )
          .limit(10),
        db
          .select()
          .from(downloads)
          .where(
            and(
              eq(downloads.published, true),
              or(
                sql`${downloads.title} ILIKE ${searchTerm}`,
                sql`${downloads.description} ILIKE ${searchTerm}`
              )
            )
          )
          .limit(10),
      ]);

    results = {
      news: newsResults,
      policies: policyResults,
      events: eventResults,
      announcements: announcementResults,
      downloads: downloadResults,
    };
  }

  const totalResults =
    results.news.length +
    results.policies.length +
    results.events.length +
    results.announcements.length +
    results.downloads.length;

  return (
    <div className="py-8">
      <div className="container-custom max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Search</h1>
          <SearchForm initialQuery={query} />
        </div>

        {query && (
          <>
            <p className="text-gray-600 mb-6">
              Found {totalResults} result{totalResults !== 1 ? 's' : ''} for &quot;{query}&quot;
            </p>

            {totalResults === 0 && (
              <div className="card text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
                <p className="text-gray-500">No results found. Try different keywords.</p>
              </div>
            )}

            {results.news.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">News Articles</h2>
                <div className="space-y-4">
                  {results.news.map((article) => (
                    <Link
                      key={article.id}
                      href={`/news/${article.slug}`}
                      className="card hover:shadow-md transition-shadow flex items-start gap-3"
                    >
                      <Newspaper className="h-5 w-5 text-primary-600 mt-1" aria-hidden="true" />
                      <div>
                        <h3 className="font-semibold mb-1">{article.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.policies.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Policies</h2>
                <div className="space-y-4">
                  {results.policies.map((policy) => (
                    <div key={policy.id} className="card flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary-600 mt-1" aria-hidden="true" />
                      <div>
                        <h3 className="font-semibold mb-1">{policy.title}</h3>
                        <p className="text-sm text-gray-600">{policy.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {results.events.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Events</h2>
                <div className="space-y-4">
                  {results.events.map((event) => (
                    <div key={event.id} className="card flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary-600 mt-1" aria-hidden="true" />
                      <div>
                        <h3 className="font-semibold mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <time className="text-xs text-gray-500">
                          {new Date(event.startDate).toLocaleDateString('en-AU')}
                        </time>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {results.announcements.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Announcements</h2>
                <div className="space-y-4">
                  {results.announcements.map((announcement) => (
                    <Link
                      key={announcement.id}
                      href={`/announcements/${announcement.id}`}
                      className="card hover:shadow-md transition-shadow flex items-start gap-3"
                    >
                      <Megaphone className="h-5 w-5 text-primary-600 mt-1" aria-hidden="true" />
                      <div>
                        <h3 className="font-semibold mb-1">{announcement.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.downloads.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Downloads</h2>
                <div className="space-y-4">
                  {results.downloads.map((download) => (
                    <Link
                      key={download.id}
                      href="/downloads"
                      className="card hover:shadow-md transition-shadow flex items-start gap-3"
                    >
                      <Download className="h-5 w-5 text-primary-600 mt-1" aria-hidden="true" />
                      <div>
                        <h3 className="font-semibold mb-1">{download.title}</h3>
                        {download.description && (
                          <p className="text-sm text-gray-600">{download.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">{download.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SearchForm({ initialQuery }: { initialQuery: string }) {
  return (
    <form action="/search" method="GET" className="flex gap-2">
      <label htmlFor="search-query" className="sr-only">
        Search for content
      </label>
      <input
        id="search-query"
        type="search"
        name="q"
        defaultValue={initialQuery}
        placeholder="Search news, policies, events, announcements, downloads..."
        className="input flex-1"
        autoComplete="off"
      />
      <button type="submit" className="btn-primary px-6">
        <span className="hidden sm:inline">Search</span>
        <Search className="h-5 w-5 sm:hidden" aria-hidden="true" />
      </button>
    </form>
  );
}
