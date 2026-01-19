'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface Session {
  user: {
    id: string;
    role: 'staff' | 'editor' | 'admin';
    email: string;
    name?: string | null;
    image?: string | null;
  };
  expires: string;
}

interface NavigationProps {
  session: Session | null;
}

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/health-initiatives', label: 'Health Initiatives' },
  { href: '/careers', label: 'Careers' },
];

const privateLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/news', label: 'News' },
  { href: '/mch', label: 'MCH' },
  { href: '/policies', label: 'Policies' },
  { href: '/events', label: 'Events' },
  { href: '/downloads', label: 'Downloads' },
];

export function Navigation({ session }: NavigationProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = session ? [...publicLinks, ...privateLinks] : publicLinks;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {link.label}
            </Link>
          );
        })}
        {session?.user?.role === 'admin' || session?.user?.role === 'editor' ? (
          <Link
            href="/admin"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname.startsWith('/admin')
                ? 'bg-primary-100 text-primary-900'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            Admin
          </Link>
        ) : null}
      </nav>

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="md:hidden btn-outline p-2"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-expanded={mobileMenuOpen}
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg">
          <nav className="container-custom py-4 flex flex-col gap-2" aria-label="Mobile navigation">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
            {session?.user?.role === 'admin' || session?.user?.role === 'editor' ? (
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname.startsWith('/admin')
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            ) : null}
          </nav>
        </div>
      )}
    </>
  );
}
