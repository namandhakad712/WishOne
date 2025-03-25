import React, { useState, useRef, useEffect } from "react";
import BottomTabBar from "./BottomTabBar";
import SettingsDialog from "./SettingsDialog";
import { ProfileEditForm } from "./ProfileEditForm";
import { ButtonKwity } from "./ui/button-kwity";
import { Settings, User, LogOut, Edit, Camera } from "lucide-react";
import { useSupabase } from "@/contexts/SupabaseContext";
import { signOut } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { gsap } from "gsap";
import AnimatedElement from "./AnimatedElement";
import { useGSAPAnimation } from "@/hooks/useGSAPAnimation";

const ProfilePage = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { user, refreshUser } = useSupabase();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Refs for animation elements
  const pageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const emailRef = useRef<HTMLParagraphElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const bgElementsRef = useRef<HTMLDivElement>(null);
  
  // Initialize animations when the component mounts
  useEffect(() => {
    if (!pageRef.current || !cardRef.current) return;
    
    const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    // Background elements animation
    if (bgElementsRef.current) {
      const bgElements = bgElementsRef.current.children;
      gsap.set(bgElements, { opacity: 0, scale: 0.8 });
      timeline.to(bgElements, {
        opacity: 0.8,
        scale: 1,
        duration: 1.5,
        stagger: 0.3,
        ease: 'power1.out'
      }, 0);
    }
    
    // Card animation
    timeline.fromTo(
      cardRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      0.3
    );
    
    // Avatar animation - only applies the entrance effect, no continuous pulsing
    if (avatarRef.current) {
      timeline.fromTo(
        avatarRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        0.7
      );
    }
    
    // Text animations
    if (nameRef.current && emailRef.current) {
      timeline.fromTo(
        [nameRef.current, emailRef.current],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, duration: 0.5 },
        1
      );
    }
    
    // Button animations
    if (buttonRefs.current.length > 0) {
      timeline.fromTo(
        buttonRefs.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.5 },
        1.3
      );
      
      // Add hover animations to buttons
      buttonRefs.current.forEach(button => {
        if (!button) return;
        
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.03,
            duration: 0.3,
            ease: 'power1.out'
          });
        });
        
        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: 'power1.out'
          });
        });
        
        button.addEventListener('mousedown', () => {
          gsap.to(button, {
            scale: 0.97,
            duration: 0.1
          });
        });
        
        button.addEventListener('mouseup', () => {
          gsap.to(button, {
            scale: 1.03,
            duration: 0.2
          });
        });
      });
    }
    
    return () => {
      timeline.kill();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      // Animation before sign out
      if (cardRef.current) {
        await gsap.to(cardRef.current, {
          opacity: 0,
          y: -30,
          duration: 0.4,
          ease: 'power2.in'
        });
      }
      
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      refreshUser();
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Get user's full name from metadata or use email username as fallback
  const fullName = user?.user_metadata?.full_name || 
    (user?.email ? user.email.split('@')[0] : 'Your Profile');
  
  // Get user's avatar URL from metadata
  const avatarUrl = user?.user_metadata?.avatar_url;
  
  console.log("User data in ProfilePage:", user);
  console.log("Avatar URL from metadata:", avatarUrl);
  
  // If no avatar URL is found, generate one on the fly
  const generateFallbackAvatarUrl = () => {
    if (user?.id) {
      return `https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=${user.id}`;
    }
    return undefined;
  };
  
  const effectiveAvatarUrl = avatarUrl || generateFallbackAvatarUrl();

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-white relative overflow-hidden">
      {/* Glassmorphic background elements */}
      <div ref={bgElementsRef} className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-64 -right-64 w-[500px] h-[500px] rounded-full bg-purple-300/20 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-300/20 blur-3xl"></div>
        <div className="absolute -bottom-64 -left-64 w-[500px] h-[500px] rounded-full bg-green-300/20 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center pb-20 px-4">
        <div className="w-full max-w-md py-8">
          <div ref={cardRef} className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-6 mb-6">
            <div className="flex flex-col items-center">
              <div ref={avatarRef} className="relative mb-4">
                <Avatar className="h-24 w-24 border-4 border-white/80 shadow-lg">
                  {effectiveAvatarUrl ? (
                    <AvatarImage src={effectiveAvatarUrl} alt={fullName} />
                  ) : (
                    <AvatarFallback className="bg-purple-100">
                      <User className="h-12 w-12 text-purple-600" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <AnimatedElement type="pulse" duration={1.5} repeat={-1} yoyo={true}>
                  <button 
                    onClick={() => setShowEditProfile(true)}
                    className="absolute bottom-0 right-0 bg-purple-600/90 text-white p-1.5 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
                    aria-label="Edit profile picture"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </AnimatedElement>
              </div>
              
              <h2 ref={nameRef} className="text-2xl font-bold text-purple-800 mb-1">
                {fullName}
              </h2>
              <p ref={emailRef} className="text-gray-600 mb-6">
                {user?.email || 'Manage your account settings'}
              </p>

              <ButtonKwity
                ref={el => buttonRefs.current[0] = el}
                onClick={() => setShowEditProfile(true)}
                variant="emerald"
                className="w-full mb-3 bg-purple-600/90 hover:bg-purple-700 text-white"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </ButtonKwity>

              <ButtonKwity
                ref={el => buttonRefs.current[1] = el}
                onClick={() => setShowSettings(true)}
                variant="secondary"
                className="w-full mb-3 bg-white/80 hover:bg-white/90 text-purple-700 border border-white/40"
              >
                <Settings className="mr-2 h-4 w-4" />
                Open Settings
              </ButtonKwity>

              <ButtonKwity
                ref={el => buttonRefs.current[2] = el}
                onClick={handleSignOut}
                variant="outline"
                className="w-full border border-purple-200 text-purple-700 hover:bg-purple-50/50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </ButtonKwity>
            </div>
          </div>
        </div>

        <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
        <ProfileEditForm open={showEditProfile} onOpenChange={setShowEditProfile} />

        <BottomTabBar
          activeTab="profile"
          onHomeClick={() => (window.location.href = "/")}
          onChatClick={() => (window.location.href = "/chat")}
          onProfileClick={() => {}}
        />
      </div>
    </div>
  );
};

export default ProfilePage;

