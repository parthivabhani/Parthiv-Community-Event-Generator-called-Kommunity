import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Calendar, MapPin, Users, ArrowLeft, UserCheck, UserX } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/services/api';
import eventPlaceholder from '@/assets/event-placeholder.jpg';

interface EventDetail {
  _id: string;
  title: string;
  description: string | null;
  date: string;
  location: string;
  imageUrl: string | null;
  maxAttendees: number | null;
  creatorId: {
    _id: string;
    fullName: string;
    email: string;
  };
  attendeeCount?: number;
}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAttending, setIsAttending] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEvent();
      if (user) {
        checkAttendance();
      }
    }
  }, [id, user]);

  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Event not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const checkAttendance = async () => {
    try {
      const { data } = await api.get(`/events/${id}/check-registration`);
      setIsAttending(data.isRegistered);
    } catch (error) {
      console.error('Error checking attendance:', error);
    }
  };

  const handleAttendance = async () => {
    if (!user) {
      toast.error('Please sign in to register for events');
      navigate('/auth');
      return;
    }

    setActionLoading(true);

    try {
      if (isAttending) {
        await api.delete(`/events/${id}/register`);
        setIsAttending(false);
        toast.success('Unregistered from event');
      } else {
        if (event?.maxAttendees && event.attendeeCount && event.attendeeCount >= event.maxAttendees) {
          toast.error('Event is full');
          setActionLoading(false);
          return;
        }

        await api.post(`/events/${id}/register`);
        setIsAttending(true);
        toast.success('Registered for event!');
      }
      fetchEvent();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!event) return null;

  const isFull = event.maxAttendees && event.attendeeCount ? event.attendeeCount >= event.maxAttendees : false;
  const isCreator = user?._id === event.creatorId._id;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video overflow-hidden rounded-xl">
              <img
                src={event.imageUrl || eventPlaceholder}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
              <p className="text-lg text-muted-foreground whitespace-pre-wrap">
                {event.description || 'No description provided.'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.date), 'PPP')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.date), 'p')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Attendees</p>
                    <p className="text-sm text-muted-foreground">
                      {event.maxAttendees 
                        ? `${event.attendeeCount || 0} / ${event.maxAttendees}`
                        : `${event.attendeeCount || 0} registered`
                      }
                    </p>
                  </div>
                </div>

                {event.creatorId?.fullName && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">Organized by</p>
                    <p className="font-medium">{event.creatorId.fullName}</p>
                  </div>
                )}

                {user && !isCreator && (
                  <Button
                    className="w-full"
                    onClick={handleAttendance}
                    disabled={actionLoading || (isFull && !isAttending)}
                    variant={isAttending ? 'outline' : 'default'}
                  >
                    {actionLoading ? (
                      'Processing...'
                    ) : isAttending ? (
                      <>
                        <UserX className="mr-2 h-4 w-4" />
                        Unregister
                      </>
                    ) : isFull ? (
                      'Event Full'
                    ) : (
                      <>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Register
                      </>
                    )}
                  </Button>
                )}

                {!user && (
                  <Button className="w-full" onClick={() => navigate('/auth')}>
                    Sign In to Register
                  </Button>
                )}

                {isCreator && (
                  <Badge className="w-full justify-center">You created this event</Badge>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
