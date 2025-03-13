import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { AdaptiveText } from './ui/adaptive-text';

const AIGreeting: React.FC = () => {
  const [greeting, setGreeting] = useState('');
  const [secondaryMessage, setSecondaryMessage] = useState('');
  const [name, setName] = useState('');
  const { user } = useSupabase();

  useEffect(() => {
    // Get user's name from Supabase metadata, localStorage, or use a generic greeting
    let userName = '';
    
    if (user?.user_metadata?.full_name) {
      // First priority: Get name from Supabase user metadata
      userName = user.user_metadata.full_name;
    } else if (user?.email) {
      // Second priority: Use email username
      userName = user.email.split('@')[0];
    } else {
      // Third priority: Check localStorage
      userName = localStorage.getItem('user_name') || '';
    }
    
    // If we have a name, use it
    if (userName) {
      setName(userName);
      generateGreeting(userName);
    } else {
      // If no name is available, use a generic greeting
      generateGenericGreeting();
    }
    
    // Generate a secondary message
    generateSecondaryMessage();
  }, [user]);

  const generateGreeting = (userName: string) => {
    const timeOfDay = getTimeOfDay();
    const greetings = [
      `Hi ${userName}`,
      `Hello ${userName}`,
      `Hey ${userName}`,
      `Greetings ${userName}`,
      `Welcome ${userName}`,
      `Good ${timeOfDay} ${userName}`,
      `Lovely ${timeOfDay} ${userName}`,
      `Wonderful to see you ${userName}`,
      `Nice to see you ${userName}`,
      `Great to have you back ${userName}`,
      `Happy ${timeOfDay} ${userName}`,
      `Glad to see you ${userName}`,
      `Welcome back ${userName}`,
      `It's a beautiful ${timeOfDay} ${userName}`,
      `Hello there ${userName}`,
      `Howdy ${userName}`,
      `Cheers ${userName}`,
      `Exquisite ${timeOfDay} ${userName}`,
    ];

    // Pick a random greeting
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(randomGreeting);
  };

  const generateGenericGreeting = () => {
    const timeOfDay = getTimeOfDay();
    const greetings = [
      'Welcome',
      `Good ${timeOfDay}`,
      `Lovely ${timeOfDay}`,
      'Wonderful to see you',
      'Nice to see you',
      'Great to have you back',
      `Happy ${timeOfDay}`,
      'Glad you\'re here',
      'Welcome back',
      `It's a beautiful ${timeOfDay}`,
      'Hello there',
      'Howdy',
      'Cheers',
      'G\'day',
    ];

    // Pick a random greeting
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(randomGreeting);
  };

  const generateSecondaryMessage = () => {
    const messages = [
      "Wanna make someone's day great?",
      "Ready to brighten someone's special day?",
      "Who's birthday are we celebrating next?",
      "Never miss another birthday again!",
      "Who deserves a special wish today?",
      "Let's make some birthday magic happen!",
      "Time to plan the perfect birthday surprise?",
      "Looking for the perfect birthday message?",
      "Ready to create some birthday memories?",
      "Who's special day is coming up?",
      "Need help with birthday reminders?",
      "Let's make someone feel special today!",
      "Ready to spread some birthday joy?",
      "Any special celebrations coming up?",
      "Let's make birthdays unforgettable!",
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setSecondaryMessage(randomMessage);
  };

  const getTimeOfDay = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  return (
    <div className="text-center">
      <AdaptiveText as="h1" className="text-4xl font-bold">
        {greeting}
      </AdaptiveText>
      <AdaptiveText as="p" className="text-xl mt-2">
        {secondaryMessage}
      </AdaptiveText>
    </div>
  );
};

export default AIGreeting; 