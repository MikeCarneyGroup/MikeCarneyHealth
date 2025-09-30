'use client';

import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

interface UserMenuProps {
  user: Session['user'];
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white">
          <User className="h-4 w-4" aria-hidden="true" />
        </div>
        <span className="hidden sm:inline">{user.name || user.email}</span>
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <p className="text-xs text-gray-500 mt-1">
              Role: <span className="capitalize">{user.role}</span>
            </p>
          </div>
          <div className="py-1">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
