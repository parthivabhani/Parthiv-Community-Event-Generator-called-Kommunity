import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import eventPlaceholder from '@/assets/event-placeholder.jpg';

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    description: string | null;
    date: string;
    location: string;
    imageUrl: string | null;
    maxAttendees: number | null;
    attendeeCount?: number;
  };
}

export function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group" onClick={() => navigate(`/event/${event._id}`)}>
      <div className="aspect-video overflow-hidden">
        <img
          src={event.imageUrl || eventPlaceholder}
          alt={event.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader>
        <h3 className="text-xl font-semibold line-clamp-1">{event.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{format(new Date(event.date), 'PPP')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="line-clamp-1">{event.location}</span>
        </div>
        {event.maxAttendees && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-primary" />
            <span>
              {event.attendeeCount || 0} / {event.maxAttendees} attendees
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={(e) => {
          e.stopPropagation();
          navigate(`/event/${event._id}`);
        }}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
