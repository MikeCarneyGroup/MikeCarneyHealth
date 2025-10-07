'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { policies } from '@/lib/db/schema';
import { slugify, generateUniqueSlug } from '@/lib/utils/slugify';
import { uploadFile } from '@/lib/utils/file-upload';
import { revalidatePath } from 'next/cache';

interface CreatePolicyData {
  title: string;
  description?: string;
  category: string;
  file: File | null;
  published: boolean;
}

export async function createPolicy(data: CreatePolicyData) {
  const session = await auth();

  // Verify authentication and authorization
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Generate unique slug
    const baseSlug = slugify(data.title);
    const existingPolicies = await db.select({ slug: policies.slug }).from(policies);
    const existingSlugs = existingPolicies.map(p => p.slug);
    const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);

    let fileUrl: string | null = null;

    // Upload file if provided
    if (data.file) {
      const uploadResult = await uploadFile(data.file, 'policies');
      fileUrl = uploadResult.url;
    }

    await db.insert(policies).values({
      title: data.title,
      slug: uniqueSlug,
      description: data.description || null,
      category: data.category,
      fileUrl: fileUrl,
      published: data.published,
    });

    revalidatePath('/admin/policies');
    revalidatePath('/policies');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error creating policy:', error);
    return { success: false, error: 'Failed to create policy' };
  }
}

