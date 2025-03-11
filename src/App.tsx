import { Suspense, useState, useEffect } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import ChatPage from "./components/ChatPage";
import ProfilePage from "./components/ProfilePage";
import WelcomeWindow from "./components/WelcomeWindow";
import routes from "tempo-routes";

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
