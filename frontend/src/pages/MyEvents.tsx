import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, PlusCircle } from 'lucide-react';
import api from '@/services/api';

interface Event {
  _id: string;
  title: string;
  description: string | null;
  date: string;
  location: string;
  imageUrl: string | null;
  maxAttendees: number | null;
  creatorId: string;
  attendeeCount?: number;
}

export default function MyEvents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyEvents();
    }
  }, [user]);

  const fetchMyEvents = async () => {
    if (!user) return;

    setLoading(true);

    try {
      // Fetch created events
      const { data: created } = await api.get('/events/my/created');
      setCreatedEvents(created);

      // Fetch attending events
      const { data: attending } = await api.get('/events/my/attending');
      setAttendingEvents(attending);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">My Events</h1>
          <Button onClick={() => navigate('/create-event')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>

        <Tabs defaultValue="created" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="created">Created Events</TabsTrigger>
            <TabsTrigger value="attending">Attending</TabsTrigger>
          </TabsList>

          <TabsContent value="created" className="mt-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : createdEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-2xl font-semibold mb-2">No events created yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first event and start building your community!
                </p>
                <Button onClick={() => navigate('/create-event')}>Create Event</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="attending" className="mt-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : attendingEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-2xl font-semibold mb-2">No events registered</h3>
                <p className="text-muted-foreground mb-6">
                  Browse events and register to join the community!
                </p>
                <Button onClick={() => navigate('/')}>Browse Events</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attendingEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
