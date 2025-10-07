'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createAnnouncement } from './actions';

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  isPublic: z.boolean().default(false),
  published: z.boolean().default(true),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

interface AnnouncementFormProps {
  authorId: string;
}

export function AnnouncementForm({ authorId }: AnnouncementFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      isPublic: false,
      published: true,
    },
  });

  const onSubmit = async (data: AnnouncementFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createAnnouncement({
        ...data,
        authorId,
      });

      if (result.success) {
        router.push('/admin/announcements');
        router.refresh();
      } else {
        setError(result.error || 'Failed to create announcement');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
      {error && (
        <div
          role="alert"
          className="px-4 py-3 rounded bg-red-50 border border-red-200 text-red-800"
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
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
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
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <div>
            <label htmlFor="published" className="font-medium cursor-pointer">
              Publish Immediately
            </label>
            <p className="text-sm text-gray-600">
              Uncheck to save as draft
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary px-6 py-2"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Announcement'}
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
    </form>
  );
}

