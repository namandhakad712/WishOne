import React, { useState, useEffect } from 'react';

const AIGreeting: React.FC = () => {
  const [greeting, setGreeting] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    // Get user's name from localStorage or use a default
    const userName = localStorage.getItem('user_name') || 'Peter';
    setName(userName);

    // Generate a random greeting
    generateGreeting(userName);
  }, []);

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
    ];

    // Pick a random greeting
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(randomGreeting);
  };

  const getTimeOfDay = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900">{greeting}</h1>
      <p className="text-xl text-gray-700 mt-2">How can I help you today?</p>
    </div>
  );
};

export default AIGreeting; 