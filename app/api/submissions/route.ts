import { auth } from '@/auth';
import { db } from '@/lib/db';
import { submissions } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { type, title, content, userId } = body;

  // Validate
  if (!type || !title || !content || userId !== session.user.id) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    await db.insert(submissions).values({
      type,
      title,
      content,
      authorId: userId,
      status: 'pending',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
  }
}
