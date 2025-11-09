import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, PlusCircle, User } from 'lucide-react';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <img
              src="/K.png"
              alt="Kommunity Events Logo"
              className="h-6 w-6 object-contain"
            />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Kommunity Events
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/my-events')}
                  className="hidden sm:flex"
                >
                  <User className="mr-2 h-4 w-4" />
                  My Events
                </Button>
                <Button onClick={() => navigate('/create-event')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
                <Button variant="outline" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
