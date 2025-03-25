import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp, signInWithGoogle } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertCircle, Sparkles, Mail, Lock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { gsap } from "gsap";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Refs for animation
  const formRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const signInFormRef = useRef<HTMLFormElement>(null);
  const signUpFormRef = useRef<HTMLFormElement>(null);
  const bgElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Track previous active tab for animations
  const prevTabRef = useRef(activeTab);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    
    // Button loading animation
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.2,
        ease: "power1.out"
      });
    }

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        setErrorMessage(error.message);
        
        // Error shake animation
        if (formRef.current) {
          gsap.to(formRef.current, {
            x: 10,
            duration: 0.1,
            repeat: 3,
            yoyo: true,
            ease: "power1.inOut",
            onComplete: () => {
              gsap.to(formRef.current, { x: 0 });
            }
          });
        }
        
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Success animation
        if (formRef.current) {
          gsap.to(formRef.current, {
            y: -20,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
              toast({
                title: "Success!",
                description: "You have been signed in.",
              });
              navigate("/dashboard");
            }
          });
        } else {
          toast({
            title: "Success!",
            description: "You have been signed in.",
          });
          navigate("/dashboard");
        }
      }
    } catch (error) {
      // This will only catch unexpected errors not related to the API call
      const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred";
      setErrorMessage(errorMsg);
      toast({
        title: "Unexpected error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      // Reset button
      if (buttonRef.current) {
        gsap.to(buttonRef.current, {
          scale: 1,
          duration: 0.2,
          ease: "power1.out"
        });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        setErrorMessage(error.message);
        toast({
          title: "Error signing in with Google",
          description: error.message,
          variant: "destructive",
        });
      }
      // No need for success handling here as the user will be redirected to Google's auth page
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred";
      setErrorMessage(errorMsg);
      toast({
        title: "Unexpected error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    
    // Button loading animation
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.2,
        ease: "power1.out"
      });
    }

    try {
      const { data, error } = await signUp(email, password);
      
      console.log("Sign up response:", { data, error });
      
      // Check for various error conditions that might indicate a user already exists
      if (error) {
        const errorMsg = error.message.toLowerCase();
        
        // Check for different possible error messages related to existing users
        if (
          errorMsg.includes("user already registered") || 
          errorMsg.includes("already exists") ||
          errorMsg.includes("already taken") ||
          errorMsg.includes("already in use") ||
          (error.status === 400 && errorMsg.includes("email"))
        ) {
          setErrorMessage("An account with this email already exists. Please sign in instead.");
          
          // Animate tab switch
          gsap.to(cardRef.current, {
            y: 5,
            duration: 0.2,
            ease: "power1.out",
            onComplete: () => {
              // Switch to the sign-in tab
              setActiveTab("signin");
              
              // Bounce back
              gsap.to(cardRef.current, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
              });
            }
          });
          
          toast({
            title: "Account already exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "default",
          });
        } else {
          // Handle other errors
          setErrorMessage(error.message);
          
          // Error shake animation
          if (formRef.current) {
            gsap.to(formRef.current, {
              x: 10,
              duration: 0.1,
              repeat: 3,
              yoyo: true,
              ease: "power1.inOut",
              onComplete: () => {
                gsap.to(formRef.current, { x: 0 });
              }
            });
          }
          
          toast({
            title: "Error signing up",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        // Success case
        // Success animation
        if (formRef.current) {
          gsap.to(formRef.current, {
            y: -10,
            opacity: 0.8,
            duration: 0.3,
            ease: "power2.in",
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              toast({
                title: "Success!",
                description: "Check your email for the confirmation link.",
              });
            }
          });
        } else {
          toast({
            title: "Success!",
            description: "Check your email for the confirmation link.",
          });
        }
      }
    } catch (error) {
      // This will only catch unexpected errors not related to the API call
      const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred";
      setErrorMessage(errorMsg);
      toast({
        title: "Unexpected error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      // Reset button
      if (buttonRef.current) {
        gsap.to(buttonRef.current, {
          scale: 1,
          duration: 0.2,
          ease: "power1.out"
        });
      }
    }
  };
  
  // Initialize animations
  useEffect(() => {
    // Card entrance animation
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
    
    // Logo animation
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { y: -20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          delay: 0.3,
          ease: "back.out(1.7)" 
        }
      );
      
      // Continuous floating animation
      gsap.to(logoRef.current, {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
    
    // Background floating elements
    bgElementsRef.current.forEach((el, index) => {
      if (!el) return;
      
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.8,
          delay: 0.2 * index,
          ease: "power2.out"
        }
      );
      
      // Random movement
      gsap.to(el, {
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        rotation: (Math.random() - 0.5) * 10,
        duration: 5 + index * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
    
    // Input fields animation
    inputRefs.current.forEach((input, index) => {
      if (!input) return;
      
      gsap.fromTo(
        input,
        { opacity: 0, x: -20 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.5,
          delay: 0.3 + (index * 0.1),
          ease: "power2.out"
        }
      );
    });
    
    // Cleanup animations on unmount
    return () => {
      if (logoRef.current) gsap.killTweensOf(logoRef.current);
      if (cardRef.current) gsap.killTweensOf(cardRef.current);
      bgElementsRef.current.forEach(el => {
        if (el) gsap.killTweensOf(el);
      });
      inputRefs.current.forEach(input => {
        if (input) gsap.killTweensOf(input);
      });
    };
  }, []);
  
  // Handle tab changes with animations
  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      // Animate out current form
      const currentForm = prevTabRef.current === "signin" ? signInFormRef.current : signUpFormRef.current;
      const nextForm = activeTab === "signin" ? signInFormRef.current : signUpFormRef.current;
      
      if (currentForm && nextForm) {
        // First animate out
        gsap.to(currentForm, {
          opacity: 0,
          x: prevTabRef.current === "signin" ? -20 : 20,
          duration: 0.3,
          ease: "power1.in",
          onComplete: () => {
            // Then animate in
            gsap.fromTo(
              nextForm,
              { opacity: 0, x: activeTab === "signin" ? 20 : -20 },
              { 
                opacity: 1, 
                x: 0, 
                duration: 0.4,
                ease: "power2.out"
              }
            );
          }
        });
      }
      
      // Update ref for next time
      prevTabRef.current = activeTab;
    }
  }, [activeTab]);

  return (
    <Card ref={cardRef} className="w-full max-w-md mx-auto bg-white/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 pointer-events-none z-0"></div>
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          ref={el => bgElementsRef.current[0] = el}
          className="absolute w-20 h-20 rounded-full bg-purple-300/30 backdrop-blur-md"
          style={{ top: '15%', right: '10%' }}
        />
        <div 
          ref={el => bgElementsRef.current[1] = el}
          className="absolute w-16 h-16 rounded-full bg-pink-300/30 backdrop-blur-md"
          style={{ bottom: '20%', left: '10%' }}
        />
      </div>
      
      <Tabs ref={formRef} value={activeTab} onValueChange={setActiveTab} className="relative z-10">
        <CardHeader className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border-b border-white/30">
          <div className="flex justify-center mb-4">
            <div 
              ref={logoRef}
              className="h-16 w-16 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center border-2 border-white/70 shadow-lg"
            >
              <span className="text-purple-600 font-bold text-2xl flex items-center gap-1">
                W<Sparkles className="h-4 w-4 text-yellow-500" />
              </span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-gray-800 font-bold">WishOne</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Never forget a birthday again
          </CardDescription>
          <TabsList className="grid w-full grid-cols-2 mt-4 bg-white/50 backdrop-blur-md p-1 rounded-xl">
            <TabsTrigger value="signin" className="rounded-lg data-[state=active]:bg-white/80 data-[state=active]:backdrop-blur-md data-[state=active]:shadow-sm">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-white/80 data-[state=active]:backdrop-blur-md data-[state=active]:shadow-sm">Sign Up</TabsTrigger>
          </TabsList>
        </CardHeader>

        {errorMessage && (
          <div className="px-6">
            <Alert variant="destructive" className="bg-red-50/80 backdrop-blur-sm border border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </div>
        )}

        <TabsContent value="signin">
          <form ref={signInFormRef} onSubmit={handleSignIn}>
            <CardContent className="space-y-4 p-6 bg-gradient-to-b from-white/40 to-white/20 backdrop-blur-md">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-500" />
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="signin-email"
                    ref={el => inputRefs.current[0] = el}
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/60 backdrop-blur-md border-white/50 rounded-xl h-11 pl-4 focus-visible:ring-purple-500 focus-visible:border-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-gray-700 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-purple-500" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="signin-password"
                    ref={el => inputRefs.current[1] = el}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/60 backdrop-blur-md border-white/50 rounded-xl h-11 pl-4 focus-visible:ring-purple-500 focus-visible:border-purple-500"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-6 bg-white/30 backdrop-blur-md border-t border-white/30">
              <Button 
                ref={buttonRef}
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md rounded-xl h-11" 
                disabled={loading || googleLoading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              
              <div className="flex items-center w-full gap-2 my-2">
                <Separator className="flex-1 bg-white/50" />
                <span className="text-xs text-gray-600">OR</span>
                <Separator className="flex-1 bg-white/50" />
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 border-white/50 bg-white/60 backdrop-blur-md text-gray-700 hover:bg-white/70 rounded-xl h-11"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                  </>
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-purple-600 hover:text-purple-800 font-medium"
                  onClick={() => setActiveTab("signup")}
                >
                  Sign up
                </button>
              </div>
            </CardFooter>
          </form>
        </TabsContent>

        <TabsContent value="signup">
          <form ref={signUpFormRef} onSubmit={handleSignUp}>
            <CardContent className="space-y-4 p-6 bg-gradient-to-b from-white/40 to-white/20 backdrop-blur-md">
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-500" />
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="signup-email"
                    ref={el => inputRefs.current[2] = el}
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/60 backdrop-blur-md border-white/50 rounded-xl h-11 pl-4 focus-visible:ring-purple-500 focus-visible:border-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-gray-700 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-purple-500" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    ref={el => inputRefs.current[3] = el}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/60 backdrop-blur-md border-white/50 rounded-xl h-11 pl-4 focus-visible:ring-purple-500 focus-visible:border-purple-500"
                  />
                </div>
                <p className="text-xs text-gray-600 pl-6">
                  Password must be at least 6 characters long
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-6 bg-white/30 backdrop-blur-md border-t border-white/30">
              <Button 
                ref={buttonRef}
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md rounded-xl h-11" 
                disabled={loading || googleLoading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
              
              <div className="flex items-center w-full gap-2 my-2">
                <Separator className="flex-1 bg-white/50" />
                <span className="text-xs text-gray-600">OR</span>
                <Separator className="flex-1 bg-white/50" />
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 border-white/50 bg-white/60 backdrop-blur-md text-gray-700 hover:bg-white/70 rounded-xl h-11"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign up with Google
                  </>
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-purple-600 hover:text-purple-800 font-medium"
                  onClick={() => setActiveTab("signin")}
                >
                  Sign in
                </button>
              </div>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
} 