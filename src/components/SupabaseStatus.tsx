import React, { useState, useEffect } from 'react';
import { Loader2, Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatus {
  status: 'loading' | 'online' | 'offline';
  error: string | null;
}

export function SupabaseStatus() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'loading',
    error: null
  });
  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Get Supabase URL and key from environment variables
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
          setConnectionStatus({
            status: 'offline',
            error: 'Missing credentials'
          });
          return;
        }
        
        // Use a simple health check endpoint
        const healthUrl = `${supabaseUrl}/rest/v1/`;
        
        const response = await fetch(healthUrl, {
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });
        
        if (response.ok) {
          setConnectionStatus({
            status: 'online',
            error: null
          });
        } else {
          setConnectionStatus({
            status: 'offline',
            error: 'Connection failed'
          });
        }
      } catch (error) {
        setConnectionStatus({
          status: 'offline',
          error: 'Connection error'
        });
      }
    };
    
    checkStatus();
    
    // Check status every 5 minutes
    const interval = setInterval(checkStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={`fixed bottom-4 right-4 ${connectionStatus.status === 'online' ? 'bg-green-800' : connectionStatus.status === 'offline' ? 'bg-red-800' : 'bg-gray-800'} text-white p-3 rounded-lg shadow-lg z-50 max-w-md flex items-center`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${connectionStatus.status === 'online' ? 'bg-green-400' : connectionStatus.status === 'offline' ? 'bg-red-400' : 'bg-gray-400 animate-pulse'}`}></div>
      <span>
        {connectionStatus.status === 'loading' && 'Connecting...'}
        {connectionStatus.status === 'online' && 'Online'}
        {connectionStatus.status === 'offline' && 'Offline'}
      </span>
    </div>
  );
} 