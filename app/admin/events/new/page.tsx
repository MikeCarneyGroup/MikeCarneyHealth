import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { EventForm } from './EventForm';

export const metadata = {
  title: 'New Event - Admin',
};

export default async function NewEventPage() {
  const session = await auth();

  if (!session || (session.user.role !== 'editor' && session.user.role !== 'admin')) {
    redirect('/dashboard');
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create Event</h1>
        <p className="text-gray-600">Schedule staff events and activities</p>
      </div>

      <EventForm />
    </div>
  );
}

