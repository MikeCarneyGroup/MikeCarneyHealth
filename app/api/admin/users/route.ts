import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  const session = await auth();

  // Only admins can update user roles
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { userId, role } = body;

  if (!userId || !role || !['staff', 'editor', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    await db
      .update(users)
      .set({ role })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}
