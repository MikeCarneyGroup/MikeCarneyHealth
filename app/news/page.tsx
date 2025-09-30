import { db } from '@/lib/db';
import { news } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import Link from 'next/link';
import { Newspaper } from 'lucide-react';

export const metadata = {
  title: 'News - Mike Carney Wellbeing Hub',
  description: 'Latest news and updates from Mike Carney Group',
};

export default async function NewsPage() {
  const articles = await db
    .select()
    .from(news)
    .where(eq(news.published, true))
    .orderBy(desc(news.createdAt));

  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Company News</h1>
          <p className="text-gray-600">Stay updated with the latest from Mike Carney Group</p>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="card hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-primary-600 mt-1" aria-hidden="true">
                    <Newspaper className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold group-hover:text-primary-600 transition-colors">
                      {article.title}
                    </h2>
                  </div>
                </div>
                {article.excerpt && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                )}
                <time className="text-xs text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString('en-AU', {
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
            <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-500">No news articles available at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
