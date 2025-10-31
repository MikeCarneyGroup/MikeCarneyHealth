'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { news } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { slugify, generateUniqueSlug } from '@/lib/utils/slugify';
import { revalidatePath } from 'next/cache';

interface UpdateNewsData {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  published: boolean;
}

export async function updateNews(data: UpdateNewsData) {
  const session = await auth();

  // Verify authentication and authorization
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Get existing article
    const existingNews = await db
      .select()
      .from(news)
      .where(eq(news.id, data.id))
      .limit(1);

    if (existingNews.length === 0) {
      return { success: false, error: 'Article not found' };
    }

    const current = existingNews[0];

    // Generate unique slug if title changed
    let slug = current.slug;
    if (data.title !== current.title) {
      const baseSlug = slugify(data.title);
      const allNews = await db.select({ slug: news.slug }).from(news);
      const existingSlugs = allNews
        .map(n => n.slug)
        .filter(s => s !== current.slug); // Exclude current article's slug
      slug = generateUniqueSlug(baseSlug, existingSlugs);
    }

    await db
      .update(news)
      .set({
        title: data.title,
        slug,
        excerpt: data.excerpt || null,
        content: data.content,
        published: data.published,
        updatedAt: new Date(),
      })
      .where(eq(news.id, data.id));

    revalidatePath('/admin/news');
    revalidatePath('/news');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error updating news article:', error);
    return { success: false, error: 'Failed to update article' };
  }
}

export async function deleteNews(id: string) {
  const session = await auth();

  // Verify authentication and authorization
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await db.delete(news).where(eq(news.id, id));

    revalidatePath('/admin/news');
    revalidatePath('/news');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error deleting news article:', error);
    return { success: false, error: 'Failed to delete article' };
  }
}

