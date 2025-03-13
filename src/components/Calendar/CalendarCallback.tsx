import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export function CalendarCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCalendarCallback = async () => {
      try {
        // Get the session from the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
          return;
        }
        
        if (data?.session) {
          // Store the fact that the user has authorized Google Calendar
          const { error: updateError } = await supabase
            .from('users')
            .update({
              google_calendar_authorized: true,
              // Store the timestamp of when the user authorized Google Calendar
              google_calendar_authorized_at: new Date().toISOString(),
            })
            .eq('id', data.session.user.id);
            
          if (updateError) {
            console.error('Error updating user record:', updateError);
          }
          
          // Redirect back to the birthdays page or dashboard
          navigate('/dashboard?calendar_connected=true');
        } else {
          // No session found, redirect to login
          navigate('/login');
        }
      } catch (err) {
        console.error('Unexpected error during calendar callback:', err);
        setError('An unexpected error occurred');
      }
    };

    handleCalendarCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Calendar Connection Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-medium text-gray-700">Connecting to Google Calendar...</h2>
          <p className="text-gray-500 mt-2">Please wait while we set up your calendar integration.</p>
        </div>
      )}
    </div>
  );
} 