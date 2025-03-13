import React, { useEffect, useState } from 'react';
import { checkSupabaseHealth } from '../lib/supabaseClient';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

type ConnectionStatus = {
  healthy: boolean;
  error?: string;
  timestamp: string;
  data?: any;
};

const ConnectionStatus: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const checkConnection = async () => {
    setLoading(true);
    try {
      const result = await checkSupabaseHealth();
      setStatus(result);
    } catch (error) {
      setStatus({
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !status) {
    return (
      <div className="fixed bottom-3 right-3 backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/30 dark:border-gray-700/30 rounded-lg px-3 py-1.5 shadow-[0_4px_10px_rgba(0,0,0,0.05)] z-50 flex items-center">
        <Loader2 className="w-3 h-3 mr-1.5 text-gray-400 animate-spin" />
        <span className="text-xs text-gray-600 dark:text-gray-300">Status: checking...</span>
      </div>
    );
  }

  if (!status) return null;

  return (
    <div className="fixed bottom-3 right-3 backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/30 dark:border-gray-700/30 rounded-lg px-3 py-1.5 shadow-[0_4px_10px_rgba(0,0,0,0.05)] z-50 flex items-center">
      {status.healthy ? (
        <Wifi className="w-3 h-3 mr-1.5 text-green-500" />
      ) : (
        <WifiOff className="w-3 h-3 mr-1.5 text-red-500" />
      )}
      <span className="text-xs text-gray-600 dark:text-gray-300">
        Status: {status.healthy ? 'online' : 'offline'}
      </span>
    </div>
  );
};

export default ConnectionStatus; 