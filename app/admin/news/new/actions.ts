'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { news } from '@/lib/db/schema';
import { slugify, generateUniqueSlug } from '@/lib/utils/slugify';
import { revalidatePath } from 'next/cache';

interface CreateNewsData {
  title: string;
  excerpt?: string;
  content: string;
  authorId: string;
  published: boolean;
}

export async function createNews(data: CreateNewsData) {
  const session = await auth();

  // Verify authentication and authorization
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    return { success: false, error: 'Unauthorized' };
  }

  // Verify the author ID matches the session
  if (data.authorId !== session.user.id) {
    return { success: false, error: 'Invalid author' };
  }

  try {
    // Generate unique slug
    const baseSlug = slugify(data.title);
    const existingNews = await db.select({ slug: news.slug }).from(news);
    const existingSlugs = existingNews.map(n => n.slug);
    const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);

    await db.insert(news).values({
      title: data.title,
      slug: uniqueSlug,
      excerpt: data.excerpt || null,
      content: data.content,
      authorId: data.authorId,
      published: data.published,
    });

    revalidatePath('/admin/news');
    revalidatePath('/news');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error creating news article:', error);
    return { success: false, error: 'Failed to create article' };
  }
}

