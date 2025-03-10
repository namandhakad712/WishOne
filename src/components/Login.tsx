import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Facebook, Apple, Mail } from "lucide-react";

interface LoginProps {
  onLogin?: (email: string, password: string) => void;
  onRegister?: () => void;
}

const Login = ({ onLogin = () => {}, onRegister = () => {} }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-8 pb-12">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-purple-600 font-semibold text-2xl">W</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-2">
          WishOne
        </h1>
        <p className="text-center text-purple-600 mb-6">
          Remember every special moment
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <a
                href="#"
                className="text-sm text-purple-600 hover:text-purple-800"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium"
          >
            Log In
          </Button>
        </form>
      </div>

      <div className="p-8 pt-6">
        <div className="flex items-center gap-4 mb-6">
          <Separator className="flex-grow" />
          <span className="text-gray-500 text-sm">OR CONTINUE WITH</span>
          <Separator className="flex-grow" />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Button
            variant="outline"
            className="rounded-full border-gray-200 hover:bg-gray-50 hover:border-gray-300"
          >
            <Facebook className="h-5 w-5 text-blue-600" />
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-gray-200 hover:bg-gray-50 hover:border-gray-300"
          >
            <Apple className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-gray-200 hover:bg-gray-50 hover:border-gray-300"
          >
            <Mail className="h-5 w-5 text-red-500" />
          </Button>
        </div>

        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={onRegister}
            className="text-purple-600 font-medium hover:text-purple-800"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
