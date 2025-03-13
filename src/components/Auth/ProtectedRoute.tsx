import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSupabase } from "@/contexts/SupabaseContext";
import { Loader2 } from "lucide-react";

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useSupabase();
  const [offlineMode, setOfflineMode] = useState(false);
  const [offlineChecked, setOfflineChecked] = useState(false);

  // Check if we should use offline mode
  useEffect(() => {
    // If we're still loading, don't do anything yet
    if (isLoading) return;

    // If we're already authenticated, no need for offline mode
    if (isAuthenticated) {
      setOfflineChecked(true);
      return;
    }

    // Check if we have local settings that indicate the user was previously logged in
    const localSettings = localStorage.getItem('wishone_settings');
    const hasLocalData = !!localSettings;

    // If we have local data and authentication failed, we might be offline
    if (hasLocalData && !isAuthenticated) {
      console.log("Possible offline mode detected, checking connection...");
      
      // Try to ping a reliable service to check internet connection
      fetch('https://www.google.com', { mode: 'no-cors', cache: 'no-store' })
        .then(() => {
          // We have internet, but still not authenticated - likely a real auth issue
          console.log("Internet connection available, but not authenticated");
          setOfflineMode(false);
          setOfflineChecked(true);
        })
        .catch(error => {
          // No internet connection - enable offline mode
          console.log("No internet connection detected, enabling offline mode", error);
          setOfflineMode(true);
          setOfflineChecked(true);
        });
    } else {
      setOfflineChecked(true);
    }
  }, [isAuthenticated, isLoading]);

  // Show loading while checking authentication or offline status
  if (isLoading || !offlineChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Allow access if authenticated or in offline mode
  if (isAuthenticated || offlineMode) {
    return <Outlet />;
  }

  // Otherwise redirect to login
  return <Navigate to="/login" replace />;
}; 