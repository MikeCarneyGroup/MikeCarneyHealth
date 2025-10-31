'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { policies } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { slugify, generateUniqueSlug } from '@/lib/utils/slugify';
import { uploadFile } from '@/lib/utils/file-upload';
import { revalidatePath } from 'next/cache';

interface UpdatePolicyData {
  id: string;
  title: string;
  description?: string;
  category: string;
  file: File | null;
  published: boolean;
}

export async function updatePolicy(data: UpdatePolicyData) {
  const session = await auth();

  // Verify authentication and authorization
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Get existing policy
    const existingPolicy = await db
      .select()
      .from(policies)
      .where(eq(policies.id, data.id))
      .limit(1);

    if (existingPolicy.length === 0) {
      return { success: false, error: 'Policy not found' };
    }

    const current = existingPolicy[0];

    // Generate unique slug if title changed
    let slug = current.slug;
    if (data.title !== current.title) {
      const baseSlug = slugify(data.title);
      const allPolicies = await db.select({ slug: policies.slug }).from(policies);
      const existingSlugs = allPolicies
        .map(p => p.slug)
        .filter(s => s !== current.slug); // Exclude current policy's slug
      slug = generateUniqueSlug(baseSlug, existingSlugs);
    }

    let fileUrl = current.fileUrl;

    // Upload new file if provided
    if (data.file) {
      const uploadResult = await uploadFile(data.file, 'policies');
      fileUrl = uploadResult.url;
    }

    await db
      .update(policies)
      .set({
        title: data.title,
        slug,
        description: data.description || null,
        category: data.category,
        fileUrl,
        published: data.published,
        updatedAt: new Date(),
      })
      .where(eq(policies.id, data.id));

    revalidatePath('/admin/policies');
    revalidatePath('/policies');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error updating policy:', error);
    return { success: false, error: 'Failed to update policy' };
  }
}

export async function deletePolicy(id: string) {
  const session = await auth();

  // Verify authentication and authorization
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await db.delete(policies).where(eq(policies.id, id));

    revalidatePath('/admin/policies');
    revalidatePath('/policies');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error deleting policy:', error);
    return { success: false, error: 'Failed to delete policy' };
  }
}

