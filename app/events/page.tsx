import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const metadata = {
  title: 'Events - Mike Carney Wellbeing Hub',
  description: 'Upcoming staff events and activities',
};

export default async function EventsPage() {
  const allEvents = await db
    .select()
    .from(events)
    .where(eq(events.published, true))
    .orderBy(desc(events.startDate));

  const now = new Date();
  const upcomingEvents = allEvents.filter((event) => new Date(event.startDate) >= now);
  const pastEvents = allEvents.filter((event) => new Date(event.startDate) < now);

  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Staff Events</h1>
          <p className="text-gray-600">Stay connected with upcoming company events and activities</p>
        </div>

        {upcomingEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} isPast={false} />
              ))}
            </div>
          </section>
        )}

        {pastEvents.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} isPast={true} />
              ))}
            </div>
          </section>
        )}

        {upcomingEvents.length === 0 && pastEvents.length === 0 && (
          <div className="card text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-500">No events scheduled at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({
  event,
  isPast,
}: {
  event: any;
  isPast: boolean;
}) {
  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;

  return (
    <article className={`card ${isPast ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center justify-center bg-primary-100 text-primary-900 rounded-lg px-3 py-2 min-w-[60px]">
          <span className="text-xs font-medium uppercase">
            {format(startDate, 'MMM')}
          </span>
          <span className="text-2xl font-bold">
            {format(startDate, 'd')}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
          {event.description && (
            <p className="text-gray-600 text-sm mb-3">{event.description}</p>
          )}
          <div className="space-y-1 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden="true" />
              <time>
                {format(startDate, 'h:mm a')}
                {endDate && ` - ${format(endDate, 'h:mm a')}`}
              </time>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
