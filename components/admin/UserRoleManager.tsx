'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserRoleManagerProps {
  userId: string;
  currentRole: 'staff' | 'editor' | 'admin';
}

export function UserRoleManager({ userId, currentRole }: UserRoleManagerProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [role, setRole] = useState(currentRole);

  const handleRoleChange = async (newRole: 'staff' | 'editor' | 'admin') => {
    if (newRole === role) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        setRole(newRole);
        router.refresh();
      } else {
        alert('Failed to update role');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={role}
      onChange={(e) => handleRoleChange(e.target.value as 'staff' | 'editor' | 'admin')}
      disabled={isUpdating}
      className="input text-sm py-1"
    >
      <option value="staff">Staff</option>
      <option value="editor">Editor</option>
      <option value="admin">Admin</option>
    </select>
  );
}
