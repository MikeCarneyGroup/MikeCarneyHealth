import { db } from '@/lib/db';
import { submissions, users } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { SubmissionReviewForm } from '@/components/admin/SubmissionReviewForm';

export const metadata = {
  title: 'Manage Submissions - Admin',
};

export default async function AdminSubmissionsPage() {
  const allSubmissions = await db
    .select({
      submission: submissions,
      author: users,
    })
    .from(submissions)
    .leftJoin(users, eq(submissions.authorId, users.id))
    .orderBy(desc(submissions.createdAt));

  const pending = allSubmissions.filter((s) => s.submission.status === 'pending');
  const reviewed = allSubmissions.filter((s) => s.submission.status !== 'pending');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Staff Submissions</h1>
        <p className="text-gray-600">Review and moderate staff stories and ideas</p>
      </div>

      {pending.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Pending Review ({pending.length})</h2>
          <div className="space-y-4">
            {pending.map(({ submission, author }) => (
              <article key={submission.id} className="card border-yellow-300 bg-yellow-50">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{submission.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-sm bg-gray-100 text-gray-800 capitalize">
                        {submission.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{submission.content}</p>
                    <p className="text-xs text-gray-500">
                      Submitted by {author?.name || author?.email} on{' '}
                      {new Date(submission.createdAt).toLocaleDateString('en-AU')}
                    </p>
                  </div>
                </div>
                <SubmissionReviewForm submissionId={submission.id} />
              </article>
            ))}
          </div>
        </section>
      )}

      {reviewed.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Reviewed</h2>
          <div className="space-y-4">
            {reviewed.map(({ submission, author }) => (
              <article key={submission.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{submission.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          submission.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {submission.status}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-sm bg-gray-100 text-gray-800 capitalize">
                        {submission.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{submission.content}</p>
                    {submission.reviewNote && (
                      <p className="text-sm text-gray-500">
                        <strong>Review note:</strong> {submission.reviewNote}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Submitted by {author?.name || author?.email}
                    </p>
                  </div>
                  <time className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(submission.createdAt).toLocaleDateString('en-AU')}
                  </time>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {allSubmissions.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500">No submissions yet.</p>
        </div>
      )}
    </div>
  );
}
