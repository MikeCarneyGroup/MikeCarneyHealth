'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateAnnouncement, deleteAnnouncement } from './actions';
import { Trash2 } from 'lucide-react';
import type { announcements } from '@/lib/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  isPublic: z.boolean().default(false),
  published: z.boolean().default(true),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;
type Announcement = InferSelectModel<typeof announcements>;

interface AnnouncementEditFormProps {
  announcement: Announcement;
}

export function AnnouncementEditForm({ announcement }: AnnouncementEditFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: announcement.title,
      content: announcement.content,
      isPublic: announcement.isPublic,
      published: announcement.published,
    },
  });

  const onSubmit = async (data: AnnouncementFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await updateAnnouncement({
        id: announcement.id,
        ...data,
      });

      if (result.success) {
        router.push('/admin/announcements');
        router.refresh();
      } else {
        setError(result.error || 'Failed to update announcement');
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
      const result = await deleteAnnouncement(announcement.id);

      if (result.success) {
        router.push('/admin/announcements');
        router.refresh();
      } else {
        setError(result.error || 'Failed to delete announcement');
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
          <label htmlFor="content" className="label">
            Content <span className="text-red-600">*</span>
          </label>
          <textarea
            id="content"
            {...register('content')}
            rows={8}
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
            Use clear, concise language. Line breaks will be preserved.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <input
              id="isPublic"
              type="checkbox"
              {...register('isPublic')}
              className="mt-1 h-4 w-4 rounded-sm border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <label htmlFor="isPublic" className="font-medium cursor-pointer">
                Public Announcement
              </label>
              <p className="text-sm text-gray-600">
                Public announcements are visible to unauthenticated visitors on the homepage.
              </p>
            </div>
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
            aria-label="Delete announcement"
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
              Delete Announcement
            </h2>
            <p className="text-gray-600">
              Are you sure you want to delete &quot;{announcement.title}&quot;? This action cannot be undone.
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

