'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createEvent } from './actions';

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

export function EventForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      published: true,
    },
  });

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Combine date and time
      const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
      
      let endDateTime: Date | undefined;
      if (data.endDate && data.endTime) {
        endDateTime = new Date(`${data.endDate}T${data.endTime}`);
      }

      const result = await createEvent({
        title: data.title,
        description: data.description,
        location: data.location,
        startDate: startDateTime,
        endDate: endDateTime,
        published: data.published,
      });

      if (result.success) {
        router.push('/admin/events');
        router.refresh();
      } else {
        setError(result.error || 'Failed to create event');
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
            Publish Immediately
          </label>
          <p className="text-sm text-gray-600">
            Uncheck to save as draft
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary px-6 py-2"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Event'}
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

