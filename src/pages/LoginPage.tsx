import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/Auth/AuthForm";
import { useSupabase } from "@/contexts/SupabaseContext";

export default function LoginPage() {
  const { isAuthenticated } = useSupabase();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
} 