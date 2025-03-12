import React, { useEffect, useState } from 'react';
import { checkSupabaseHealth } from '../lib/supabaseClient';

type ConnectionStatus = {
  healthy: boolean;
  error?: string;
  timestamp: string;
  data?: any;
};

const ConnectionStatus: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

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
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg z-50">
        Checking connection...
      </div>
    );
  }

  if (!status) return null;

  return (
    <div 
      className={`fixed bottom-4 right-4 ${status.healthy ? 'bg-green-800' : 'bg-red-800'} text-white p-3 rounded-lg shadow-lg z-50 max-w-md`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${status.healthy ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span>Supabase: {status.healthy ? 'Connected' : 'Disconnected'}</span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={checkConnection} 
            className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
          >
            Refresh
          </button>
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
          >
            {expanded ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 text-sm">
          {status.error && (
            <div className="mb-2">
              <strong>Error:</strong> {status.error}
            </div>
          )}
          <div className="mb-2">
            <strong>Last checked:</strong> {new Date(status.timestamp).toLocaleTimeString()}
          </div>
          {status.data && (
            <div className="mb-2">
              <strong>Auth status:</strong>
              <pre className="bg-gray-900 p-2 rounded mt-1 overflow-x-auto">
                {JSON.stringify(status.data, null, 2)}
              </pre>
            </div>
          )}
          <div className="text-xs mt-3">
            <p>If you're experiencing connection issues:</p>
            <ol className="list-decimal pl-5 mt-1">
              <li>Check if the Supabase service is running</li>
              <li>Verify your network connection</li>
              <li>Try refreshing the page</li>
              <li>Check browser console for more detailed errors</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus; 