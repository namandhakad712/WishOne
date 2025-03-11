import React, { useState } from "react";
import KwityLogin from "./KwityLogin";
import ModernSignup from "./ModernSignup";

interface KwityAuthProps {
  onLogin?: (phoneNumber: string) => void;
  onSignup?: (name: string, email: string, password: string) => void;
  onSocialLogin?: (provider: string) => void;
  onSocialSignup?: (provider: string) => void;
}

const KwityAuth = ({
  onLogin = () => {},
  onSignup = () => {},
  onSocialLogin = () => {},
  onSocialSignup = () => {},
}: KwityAuthProps) => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleView = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {showLogin ? (
        <KwityLogin
          onLogin={onLogin}
          onSocialLogin={onSocialLogin}
          onSignup={toggleView}
        />
      ) : (
        <ModernSignup
          onSignup={onSignup}
          onSocialSignup={onSocialSignup}
          onBackToLogin={toggleView}
        />
      )}
    </div>
  );
};

export default KwityAuth; 