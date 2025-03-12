import React, { useState, useEffect } from 'react';
import { Loader2, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
            error: 'Missing Supabase credentials. Check your environment variables.'
          });
          return;
        }
        
        // Use a simple health check endpoint
        const healthUrl = `${supabaseUrl}/rest/v1/`;
        
        console.log('Checking Supabase status at:', healthUrl);
        
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
          const errorText = await response.text();
          let errorMessage = `Status ${response.status}`;
          
          try {
            // Try to parse the error as JSON
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorJson.error || errorText;
          } catch (e) {
            // If not JSON, use the text as is
            errorMessage = errorText;
          }
          
          setConnectionStatus({
            status: 'offline',
            error: errorMessage
          });
        }
      } catch (error) {
        console.error('Error checking Supabase connection:', error);
        setConnectionStatus({
          status: 'offline',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };
    
    checkStatus();
    
    // Check status every 5 minutes
    const interval = setInterval(checkStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="fixed bottom-0 right-0 p-2 m-2 bg-white/80 backdrop-blur-sm rounded-md shadow-sm flex items-center text-xs cursor-help">
            <span className="mr-1 text-gray-600">Status:</span>
            {connectionStatus.status === 'loading' && (
              <span className="flex items-center text-gray-500">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Checking...
              </span>
            )}
            {connectionStatus.status === 'online' && (
              <span className="flex items-center text-green-600">
                <Wifi className="h-3 w-3 mr-1" />
                Online
              </span>
            )}
            {connectionStatus.status === 'offline' && (
              <span className="flex items-center text-red-600">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
                {connectionStatus.error && (
                  <AlertCircle className="h-3 w-3 ml-1" />
                )}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {connectionStatus.status === 'loading' && (
            <p>Checking database connection...</p>
          )}
          {connectionStatus.status === 'online' && (
            <p>Database connection is working properly.</p>
          )}
          {connectionStatus.status === 'offline' && (
            <div>
              <p className="font-semibold text-red-600">Database connection error:</p>
              <p className="mt-1">{connectionStatus.error || 'Could not connect to database'}</p>
              <p className="mt-2 text-xs">
                Check your environment variables and database configuration.
              </p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 