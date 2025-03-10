import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Facebook, Apple, Mail, ArrowLeft } from "lucide-react";

interface RegisterProps {
  onRegister?: (name: string, email: string, password: string) => void;
  onBackToLogin?: () => void;
}

const Register = ({
  onRegister = () => {},
  onBackToLogin = () => {},
}: RegisterProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(name, email, password);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-8 pb-12 relative">
        <button
          onClick={onBackToLogin}
          className="absolute top-4 left-4 text-purple-600 hover:text-purple-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-purple-600 font-semibold text-2xl">W</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-2">
          Create Account
        </h1>
        <p className="text-center text-purple-600 mb-6">
          Join WishOne and never miss a special day
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
              required
            />
          </div>

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
            <Label htmlFor="password" className="text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
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
            Sign Up
          </Button>
        </form>
      </div>

      <div className="p-8 pt-6">
        <div className="flex items-center gap-4 mb-6">
          <Separator className="flex-grow" />
          <span className="text-gray-500 text-sm">OR SIGN UP WITH</span>
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

        <p className="text-center text-gray-600 text-sm">
          By signing up, you agree to our{" "}
          <a href="#" className="text-purple-600 hover:text-purple-800">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-purple-600 hover:text-purple-800">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
