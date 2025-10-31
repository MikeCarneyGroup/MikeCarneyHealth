import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await db
    .select()
    .from(events)
    .where(and(eq(events.id, id), eq(events.published, true)))
    .limit(1);

  const event = result[0];
  if (!event) return { title: 'Event Not Found' };

  return {
    title: `${event.title} - Events`,
    description: event.description || `Event details for ${event.title}`,
  };
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await db
    .select()
    .from(events)
    .where(and(eq(events.id, id), eq(events.published, true)))
    .limit(1);

  const event = result[0];
  if (!event) {
    notFound();
  }

  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;

  return (
    <div className="py-8">
      <div className="container-custom max-w-4xl">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Events
        </Link>

        <article className="card">
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-5 w-5 text-primary-600" aria-hidden="true" />
                <time>
                  {format(startDate, 'EEEE, MMMM d, yyyy')}
                  {endDate && startDate.toDateString() !== endDate.toDateString() && 
                    ` - ${format(endDate, 'EEEE, MMMM d, yyyy')}`}
                </time>
              </div>

              {(event.startDate || endDate) && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-5 w-5 text-primary-600" aria-hidden="true" />
                  <time>
                    {format(startDate, 'h:mm a')}
                    {endDate && ` - ${format(endDate, 'h:mm a')}`}
                  </time>
                </div>
              )}

              {event.location && (
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="h-5 w-5 text-primary-600" aria-hidden="true" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </header>

          {event.description && (
            <div className="prose prose-lg max-w-none">
              {event.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

