import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Newspaper, 
  FileText, 
  Calendar, 
  Download, 
  Users, 
  MessageSquare,
  Megaphone 
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Only editors and admins can access admin area
  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    redirect('/dashboard');
  }

  const navItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { href: '/admin/news', label: 'News', icon: Newspaper },
    { href: '/admin/events', label: 'Events', icon: Calendar },
    { href: '/admin/policies', label: 'Policies', icon: FileText },
    { href: '/admin/downloads', label: 'Downloads', icon: Download },
    { href: '/admin/submissions', label: 'Submissions', icon: MessageSquare },
  ];

  if (session.user.role === 'admin') {
    navItems.push({ href: '/admin/users', label: 'Users', icon: Users });
  }

  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                Admin Panel
              </h2>
              <nav aria-label="Admin navigation" className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
