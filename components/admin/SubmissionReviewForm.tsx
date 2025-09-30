'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';

interface SubmissionReviewFormProps {
  submissionId: string;
}

export function SubmissionReviewForm({ submissionId }: SubmissionReviewFormProps) {
  const router = useRouter();
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReview = async (status: 'approved' | 'rejected') => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, status, note }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to update submission');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t pt-4 mt-4">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note for the author (optional)"
        className="input mb-3 text-sm"
        rows={2}
        disabled={isSubmitting}
      />
      <div className="flex gap-2">
        <button
          onClick={() => handleReview('approved')}
          disabled={isSubmitting}
          className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          Approve
        </button>
        <button
          onClick={() => handleReview('rejected')}
          disabled={isSubmitting}
          className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Reject
        </button>
      </div>
    </div>
  );
}
