import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { SubmissionForm } from '@/components/submissions/SubmissionForm';

export default async function NewSubmissionPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const session = await auth();
  const { type: typeParam } = await searchParams;
  const type = typeParam === 'idea' ? 'idea' : 'story';

  return (
    <div className="py-8">
      <div className="container-custom max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {type === 'story' ? 'Share Your Story' : 'Submit an Idea'}
          </h1>
          <p className="text-gray-600">
            {type === 'story'
              ? 'Tell us about your experience or achievement'
              : 'Share your ideas for workplace improvement'}
          </p>
        </div>

        <SubmissionForm type={type} userId={session!.user.id} />
      </div>
    </div>
  );
}
