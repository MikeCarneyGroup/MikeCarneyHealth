import { db } from '@/lib/db';
import { news } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await db.query.news.findFirst({
    where: and(eq(news.slug, slug), eq(news.published, true)),
  });

  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} - News`,
    description: article.excerpt,
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await db.query.news.findFirst({
    where: and(eq(news.slug, slug), eq(news.published, true)),
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="py-8">
      <div className="container-custom max-w-4xl">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to News
        </Link>

        <article className="card">
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
            <time className="text-gray-500">
              {new Date(article.createdAt).toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </header>

          <div className="prose prose-lg max-w-none">
            {article.content.split('\n').map((paragraph, index) => (
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
