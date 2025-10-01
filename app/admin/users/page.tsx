import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { UserRoleManager } from '@/components/admin/UserRoleManager';

export const metadata = {
  title: 'Manage Users - Admin',
};

export default async function AdminUsersPage() {
  const session = await auth();
  
  // Only admins can access user management
  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard');
  }

  const allUsers = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-gray-600 mt-2">Manage user roles and permissions</p>
      </div>

      {allUsers.length > 0 ? (
        <div className="space-y-4">
          {allUsers.map((user) => (
            <article key={user.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold">{user.name || 'No name'}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                    <time className="text-xs text-gray-500">
                      Joined {new Date(user.createdAt).toLocaleDateString('en-AU')}
                    </time>
                  </div>
                </div>
                <UserRoleManager userId={user.id} currentRole={user.role} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500">No users yet.</p>
        </div>
      )}
    </div>
  );
}
