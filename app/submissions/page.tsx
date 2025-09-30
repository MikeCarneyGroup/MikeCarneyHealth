import { auth } from '@/auth';
import { db } from '@/lib/db';
import { submissions } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import Link from 'next/link';
import { PenSquare, Lightbulb } from 'lucide-react';

export const metadata = {
  title: 'Submissions - Mike Carney Wellbeing Hub',
  description: 'Share your stories and ideas',
};

export default async function SubmissionsPage() {
  const session = await auth();
  
  const userSubmissions = await db
    .select()
    .from(submissions)
    .where(eq(submissions.authorId, session!.user.id))
    .orderBy(desc(submissions.createdAt));

  return (
    <div className="py-8">
      <div className="container-custom max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Staff Submissions</h1>
          <p className="text-gray-600">Share your stories and ideas with the team</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link href="/submissions/new?type=story" className="card hover:shadow-md transition-shadow group">
            <div className="flex items-start gap-4">
              <div className="text-primary-600 group-hover:scale-110 transition-transform" aria-hidden="true">
                <PenSquare className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Share Your Story</h2>
                <p className="text-gray-600 text-sm">
                  Tell us about your experiences, achievements, or memorable moments at Mike Carney Group.
                </p>
              </div>
            </div>
          </Link>

          <Link href="/submissions/new?type=idea" className="card hover:shadow-md transition-shadow group">
            <div className="flex items-start gap-4">
              <div className="text-primary-600 group-hover:scale-110 transition-transform" aria-hidden="true">
                <Lightbulb className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Submit an Idea</h2>
                <p className="text-gray-600 text-sm">
                  Have a suggestion for improving our workplace? We'd love to hear your ideas!
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Your Submissions</h2>
        </div>

        {userSubmissions.length > 0 ? (
          <div className="space-y-4">
            {userSubmissions.map((submission) => (
              <article key={submission.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{submission.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                        submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {submission.status}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 capitalize">
                        {submission.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{submission.content}</p>
                    {submission.reviewNote && (
                      <p className="text-sm text-gray-500 mt-2">
                        <strong>Reviewer note:</strong> {submission.reviewNote}
                      </p>
                    )}
                  </div>
                  <time className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(submission.createdAt).toLocaleDateString('en-AU')}
                  </time>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="card text-center py-8">
            <p className="text-gray-500">You haven't submitted anything yet.</p>
            <p className="text-sm text-gray-400 mt-2">Click one of the options above to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
