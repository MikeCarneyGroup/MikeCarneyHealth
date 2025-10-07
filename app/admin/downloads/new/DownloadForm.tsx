'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createDownload } from './actions';

const downloadSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  published: z.boolean().default(true),
});

type DownloadFormData = z.infer<typeof downloadSchema>;

const DOWNLOAD_CATEGORIES = [
  'Forms',
  'Guides',
  'Templates',
  'Training Materials',
  'Health & Safety',
  'HR Documents',
  'Other',
];

export function DownloadForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DownloadFormData>({
    resolver: zodResolver(downloadSchema),
    defaultValues: {
      published: true,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (PDF, DOC, DOCX, XLS, XLSX)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF, Word, or Excel file');
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

  const onSubmit = async (data: DownloadFormData) => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createDownload({
        ...data,
        file: selectedFile,
      });

      if (result.success) {
        router.push('/admin/downloads');
        router.refresh();
      } else {
        setError(result.error || 'Failed to create download');
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
        <label htmlFor="description" className="label">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={4}
          className="input"
          placeholder="Brief description of this resource"
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
          {DOWNLOAD_CATEGORIES.map((cat) => (
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
          File <span className="text-red-600">*</span>
        </label>
        <input
          id="file"
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          onChange={handleFileChange}
          required
          className="block w-full text-sm text-gray-600
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-primary-50 file:text-primary-700
            hover:file:bg-primary-100
            cursor-pointer"
          aria-required="true"
        />
        {selectedFile && (
          <p className="text-sm text-gray-600 mt-2">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Upload a PDF, Word, or Excel file (max 10MB)
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
          disabled={isSubmitting || !selectedFile}
          className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Uploading...' : 'Create Download'}
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

