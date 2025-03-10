import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

interface AuthPageProps {
  onLogin?: (email: string, password: string) => void;
  onRegister?: (name: string, email: string, password: string) => void;
}

const AuthPage = ({
  onLogin = () => {},
  onRegister = () => {},
}: AuthPageProps) => {
  const [showLogin, setShowLogin] = useState(true);

  const handleLogin = (email: string, password: string) => {
    onLogin(email, password);
  };

  const handleRegister = (name: string, email: string, password: string) => {
    onRegister(name, email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
      {showLogin ? (
        <Login onLogin={handleLogin} onRegister={() => setShowLogin(false)} />
      ) : (
        <Register
          onRegister={handleRegister}
          onBackToLogin={() => setShowLogin(true)}
        />
      )}
    </div>
  );
};

export default AuthPage;
