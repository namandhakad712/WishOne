import { supabase } from './supabaseClient';

// Define the birthday event interface
interface BirthdayEvent {
  id: string;
  name: string;
  date: string;
  notes?: string;
  googleCalendarEventId?: string;
}

// Function to get Google Calendar authorization URL
export const getGoogleCalendarAuthUrl = () => {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/calendar/callback`,
      scopes: 'https://www.googleapis.com/auth/calendar',
    }
  });
};

// Function to add a birthday to Google Calendar
export const addBirthdayToGoogleCalendar = async (birthday: BirthdayEvent): Promise<string | null> => {
  try {
    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.provider_token) {
      console.error('No provider token available. User needs to authenticate with Google Calendar permissions.');
      return null;
    }

    // Parse the birthday date
    const birthdayDate = new Date(birthday.date);
    const currentYear = new Date().getFullYear();
    
    // Create an event that repeats annually
    const event = {
      summary: `${birthday.name}'s Birthday`,
      description: birthday.notes || `Birthday reminder for ${birthday.name}`,
      start: {
        date: `${currentYear}-${String(birthdayDate.getMonth() + 1).padStart(2, '0')}-${String(birthdayDate.getDate()).padStart(2, '0')}`,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        date: `${currentYear}-${String(birthdayDate.getMonth() + 1).padStart(2, '0')}-${String(birthdayDate.getDate() + 1).padStart(2, '0')}`,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      recurrence: ['RRULE:FREQ=YEARLY'],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 24 * 60 }, // 1 day before
        ],
      },
    };

    // Call the Google Calendar API
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.provider_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error adding event to Google Calendar:', errorData);
      return null;
    }

    const data = await response.json();
    return data.id; // Return the Google Calendar event ID
  } catch (error) {
    console.error('Error in addBirthdayToGoogleCalendar:', error);
    return null;
  }
};

// Function to update a birthday in Google Calendar
export const updateBirthdayInGoogleCalendar = async (
  birthday: BirthdayEvent, 
  googleCalendarEventId: string
): Promise<boolean> => {
  try {
    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.provider_token) {
      console.error('No provider token available. User needs to authenticate with Google Calendar permissions.');
      return false;
    }

    // Parse the birthday date
    const birthdayDate = new Date(birthday.date);
    const currentYear = new Date().getFullYear();
    
    // Update the event
    const event = {
      summary: `${birthday.name}'s Birthday`,
      description: birthday.notes || `Birthday reminder for ${birthday.name}`,
      start: {
        date: `${currentYear}-${String(birthdayDate.getMonth() + 1).padStart(2, '0')}-${String(birthdayDate.getDate()).padStart(2, '0')}`,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        date: `${currentYear}-${String(birthdayDate.getMonth() + 1).padStart(2, '0')}-${String(birthdayDate.getDate() + 1).padStart(2, '0')}`,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      recurrence: ['RRULE:FREQ=YEARLY'],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 24 * 60 }, // 1 day before
        ],
      },
    };

    // Call the Google Calendar API to update the event
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleCalendarEventId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.provider_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error updating event in Google Calendar:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateBirthdayInGoogleCalendar:', error);
    return false;
  }
};

// Function to delete a birthday from Google Calendar
export const deleteBirthdayFromGoogleCalendar = async (googleCalendarEventId: string): Promise<boolean> => {
  try {
    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.provider_token) {
      console.error('No provider token available. User needs to authenticate with Google Calendar permissions.');
      return false;
    }

    // Call the Google Calendar API to delete the event
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleCalendarEventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.provider_token}`,
      },
    });

    if (!response.ok && response.status !== 410) { // 410 Gone is OK, it means the event was already deleted
      console.error('Error deleting event from Google Calendar:', response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteBirthdayFromGoogleCalendar:', error);
    return false;
  }
}; 