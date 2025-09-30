import { auth } from '@/auth';
import { db } from '@/lib/db';
import { submissions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { submissionId, status, note } = body;

  if (!submissionId || !status) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    await db
      .update(submissions)
      .set({
        status,
        reviewedBy: session.user.id,
        reviewNote: note || null,
        updatedAt: new Date(),
      })
      .where(eq(submissions.id, submissionId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}
