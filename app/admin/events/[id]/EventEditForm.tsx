'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateEvent, deleteEvent } from './actions';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { events } from '@/lib/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  published: z.boolean().default(true),
});

type EventFormData = z.infer<typeof eventSchema>;
type Event = InferSelectModel<typeof events>;

interface EventEditFormProps {
  event: Event;
}

export function EventEditForm({ event }: EventEditFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Parse existing dates for form defaults
  const startDateTime = new Date(event.startDate);
  const endDateTime = event.endDate ? new Date(event.endDate) : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event.title,
      description: event.description || '',
      location: event.location || '',
      startDate: format(startDateTime, 'yyyy-MM-dd'),
      startTime: format(startDateTime, 'HH:mm'),
      endDate: endDateTime ? format(endDateTime, 'yyyy-MM-dd') : '',
      endTime: endDateTime ? format(endDateTime, 'HH:mm') : '',
      published: event.published,
    },
  });

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Combine date and time
      const startDate = new Date(`${data.startDate}T${data.startTime}`);
      
      let endDate: Date | undefined;
      if (data.endDate && data.endTime) {
        endDate = new Date(`${data.endDate}T${data.endTime}`);
      }

      const result = await updateEvent({
        id: event.id,
        title: data.title,
        description: data.description,
        location: data.location,
        startDate,
        endDate,
        published: data.published,
      });

      if (result.success) {
        router.push('/admin/events');
        router.refresh();
      } else {
        setError(result.error || 'Failed to update event');
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
      const result = await deleteEvent(event.id);

      if (result.success) {
        router.push('/admin/events');
        router.refresh();
      } else {
        setError(result.error || 'Failed to delete event');
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
            className="px-4 py-3 rounded bg-red-50 border border-red-200 text-red-800"
          >
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="label">
            Event Title <span className="text-red-600">*</span>
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
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={5}
            className="input"
            aria-invalid={errors.description ? 'true' : 'false'}
          />
          {errors.description && (
            <p role="alert" className="text-sm text-red-600 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="label">
            Location
          </label>
          <input
            id="location"
            type="text"
            {...register('location')}
            className="input"
            placeholder="e.g., Mike Carney Health, Townsville"
            aria-invalid={errors.location ? 'true' : 'false'}
          />
          {errors.location && (
            <p role="alert" className="text-sm text-red-600 mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="label">
              Start Date <span className="text-red-600">*</span>
            </label>
            <input
              id="startDate"
              type="date"
              {...register('startDate')}
              className="input"
              aria-required="true"
              aria-invalid={errors.startDate ? 'true' : 'false'}
            />
            {errors.startDate && (
              <p role="alert" className="text-sm text-red-600 mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="startTime" className="label">
              Start Time <span className="text-red-600">*</span>
            </label>
            <input
              id="startTime"
              type="time"
              {...register('startTime')}
              className="input"
              aria-required="true"
              aria-invalid={errors.startTime ? 'true' : 'false'}
            />
            {errors.startTime && (
              <p role="alert" className="text-sm text-red-600 mt-1">
                {errors.startTime.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="endDate" className="label">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              {...register('endDate')}
              className="input"
              aria-invalid={errors.endDate ? 'true' : 'false'}
            />
            {errors.endDate && (
              <p role="alert" className="text-sm text-red-600 mt-1">
                {errors.endDate.message}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">Optional</p>
          </div>

          <div>
            <label htmlFor="endTime" className="label">
              End Time
            </label>
            <input
              id="endTime"
              type="time"
              {...register('endTime')}
              className="input"
              aria-invalid={errors.endTime ? 'true' : 'false'}
            />
            {errors.endTime && (
              <p role="alert" className="text-sm text-red-600 mt-1">
                {errors.endTime.message}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">Optional</p>
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
            aria-label="Delete event"
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
              Delete Event
            </h2>
            <p className="text-gray-600">
              Are you sure you want to delete &quot;{event.title}&quot;? This action cannot be undone.
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

