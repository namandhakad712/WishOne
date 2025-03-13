import { Suspense, useState, useEffect } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import ChatPage from "./components/ChatPage";
import ProfilePage from "./components/ProfilePage";
import WelcomeWindow from "./components/WelcomeWindow";
import LoginPage from "./pages/LoginPage";
import HelpPage from "./pages/HelpPage";
import CalendarPage from "./pages/CalendarPage";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";
import { SupabaseStatus } from "./components/SupabaseStatus";
import UserSynchronizer from "./components/UserSynchronizer";
import ConnectionStatus from "./components/ConnectionStatus";
import routes from "tempo-routes";
import { AuthCallback } from "./components/Auth/AuthCallback";
import { CalendarCallback } from "./components/Calendar/CalendarCallback";

function App() {
  const [showWelcome, setShowWelcome] = useState(false);
  
  useEffect(() => {
    // Check if this is the first time the user is visiting
    const hasVisitedBefore = localStorage.getItem('wishone_has_visited');
    
    if (!hasVisitedBefore) {
      // If this is the first visit, show the welcome window
      setShowWelcome(true);
      // Don't set localStorage here - we'll set it when they close the welcome window
    }
  }, []);
  
  const handleCloseWelcome = () => {
    console.log("Closing welcome window");
    setShowWelcome(false);
    // Save that the user has visited before
    localStorage.setItem('wishone_has_visited', 'true');
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        {showWelcome && <WelcomeWindow onClose={handleCloseWelcome} />}
        <UserSynchronizer />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<HomeScreen />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/calendar/callback" element={<CalendarCallback />} />
          </Route>
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Toaster />
        {/* Only show connection status in development */}
        {import.meta.env.DEV && <ConnectionStatus />}
      </>
    </Suspense>
  );
}

export default App;
