'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SubmissionFormProps {
  type: 'story' | 'idea';
  userId: string;
}

export function SubmissionForm({ type, userId }: SubmissionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, title, content, userId }),
      });

      if (response.ok) {
        router.push('/submissions');
      } else {
        alert('Failed to submit. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="mb-6">
        <label htmlFor="title" className="label">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={type === 'story' ? 'Give your story a title' : 'Brief title for your idea'}
          className="input"
          required
          maxLength={200}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="content" className="label">
          {type === 'story' ? 'Your Story' : 'Your Idea'}
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            type === 'story'
              ? 'Share your experience, achievement, or memorable moment...'
              : 'Describe your idea and how it could improve our workplace...'
          }
          className="input min-h-[200px] resize-y"
          required
          maxLength={2000}
        />
        <p className="text-xs text-gray-500 mt-1">
          {content.length} / 2000 characters
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> Your submission will be reviewed by our team before being published. 
          You'll be notified once it's been reviewed.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary px-6 py-2"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline px-6 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
