import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/auth';
import { Navigation } from './Navigation';
import { UserMenu } from './UserMenu';
import { Search } from 'lucide-react';

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="container-custom flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-600 rounded-sm">
            <Image
              src="/MCG-Logo-white.png"
              alt="Mike Carney Group"
              width={180}
              height={40}
              className="h-10 w-auto bg-gray-900 px-3 py-1 rounded-sm"
              priority
            />
          </Link>
        </div>

        <Navigation session={session} />

        <div className="flex items-center gap-4">
          {session?.user && (
            <Link
              href="/search"
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-700" />
            </Link>
          )}
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Link
              href="/login"
              className="btn-primary px-4 py-2"
              aria-label="Sign in to your account"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
