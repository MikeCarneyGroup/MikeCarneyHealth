'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateNews, deleteNews } from './actions';
import { Trash2 } from 'lucide-react';
import type { news } from '@/lib/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

const newsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  excerpt: z.string().max(500, 'Excerpt is too long').optional(),
  content: z.string().min(1, 'Content is required'),
  published: z.boolean().default(false),
});

type NewsFormData = z.infer<typeof newsSchema>;
type News = InferSelectModel<typeof news>;

interface NewsEditFormProps {
  article: News;
}

export function NewsEditForm({ article }: NewsEditFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content,
      published: article.published,
    },
  });

  const onSubmit = async (data: NewsFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await updateNews({
        id: article.id,
        ...data,
      });

      if (result.success) {
        router.push('/admin/news');
        router.refresh();
      } else {
        setError(result.error || 'Failed to update article');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteNews(article.id);

      if (result.success) {
        router.push('/admin/news');
        router.refresh();
      } else {
        setError(result.error || 'Failed to delete article');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
        {error && (
          <div
            role="alert"
            className="px-4 py-3 rounded-sm bg-red-50 border border-red-200 text-red-800"
          >
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="label">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="input"
            aria-required="true"
            aria-invalid={errors.title ? 'true' : 'false'}
          />
          {errors.title && (
            <p role="alert" className="text-sm text-red-600 mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="excerpt" className="label">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            {...register('excerpt')}
            rows={3}
            className="input"
            aria-invalid={errors.excerpt ? 'true' : 'false'}
          />
          {errors.excerpt && (
            <p role="alert" className="text-sm text-red-600 mt-1">
              {errors.excerpt.message}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            A brief summary for article previews (optional)
          </p>
        </div>

        <div>
          <label htmlFor="content" className="label">
            Content <span className="text-red-600">*</span>
          </label>
          <textarea
            id="content"
            {...register('content')}
            rows={12}
            className="input"
            aria-required="true"
            aria-invalid={errors.content ? 'true' : 'false'}
          />
          {errors.content && (
            <p role="alert" className="text-sm text-red-600 mt-1">
              {errors.content.message}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Full article content
          </p>
        </div>

        <div className="flex items-start gap-3">
          <input
            id="published"
            type="checkbox"
            {...register('published')}
            className="mt-1 h-4 w-4 rounded-sm border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <div>
            <label htmlFor="published" className="font-medium cursor-pointer">
              Published
            </label>
            <p className="text-sm text-gray-600">
              Uncheck to save as draft
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-4 border-t">
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-6 py-2"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-outline px-6 py-2"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-outline px-4 py-2 text-red-600 border-red-300 hover:bg-red-50 inline-flex items-center gap-2"
            disabled={isSubmitting}
            aria-label="Delete article"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete
          </button>
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
            <h2 id="delete-dialog-title" className="text-xl font-bold text-gray-900">
              Delete Article
            </h2>
            <p className="text-gray-600">
              Are you sure you want to delete &quot;{article.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn-primary bg-red-600 hover:bg-red-700 px-4 py-2 flex-1"
                aria-busy={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="btn-outline px-4 py-2 flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

