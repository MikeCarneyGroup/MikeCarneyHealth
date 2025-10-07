'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createPolicy } from './actions';

const policySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  published: z.boolean().default(true),
});

type PolicyFormData = z.infer<typeof policySchema>;

const POLICY_CATEGORIES = [
  'Workplace Health & Safety',
  'Employment',
  'Code of Conduct',
  'Leave & Benefits',
  'IT & Security',
  'Training & Development',
  'Other',
];

export function PolicyForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PolicyFormData>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      published: true,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        setSelectedFile(null);
        return;
      }
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        setSelectedFile(null);
        return;
      }
      setError(null);
      setSelectedFile(file);
    }
  };

  const onSubmit = async (data: PolicyFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createPolicy({
        ...data,
        file: selectedFile,
      });

      if (result.success) {
        router.push('/admin/policies');
        router.refresh();
      } else {
        setError(result.error || 'Failed to create policy');
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
          Policy Title <span className="text-red-600">*</span>
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
          rows={4}
          className="input"
          placeholder="Brief overview of this policy"
          aria-invalid={errors.description ? 'true' : 'false'}
        />
        {errors.description && (
          <p role="alert" className="text-sm text-red-600 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="label">
          Category <span className="text-red-600">*</span>
        </label>
        <select
          id="category"
          {...register('category')}
          className="input"
          aria-required="true"
          aria-invalid={errors.category ? 'true' : 'false'}
        >
          <option value="">Select a category...</option>
          {POLICY_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p role="alert" className="text-sm text-red-600 mt-1">
            {errors.category.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="file" className="label">
          Policy Document (PDF)
        </label>
        <input
          id="file"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-primary-50 file:text-primary-700
            hover:file:bg-primary-100
            cursor-pointer"
        />
        {selectedFile && (
          <p className="text-sm text-gray-600 mt-2">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Optional: Upload a PDF document (max 10MB)
        </p>
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
          {isSubmitting ? 'Creating...' : 'Create Policy'}
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

