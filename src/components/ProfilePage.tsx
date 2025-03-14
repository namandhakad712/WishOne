import React, { useState } from "react";
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

const ProfilePage = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { user, refreshUser } = useSupabase();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
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
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-white relative overflow-hidden">
      {/* Glassmorphic background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-64 -right-64 w-[500px] h-[500px] rounded-full bg-purple-300/20 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-300/20 blur-3xl"></div>
        <div className="absolute -bottom-64 -left-64 w-[500px] h-[500px] rounded-full bg-green-300/20 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center pb-20 px-4">
        <div className="w-full max-w-md py-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24 border-4 border-white/80 shadow-lg">
                  {effectiveAvatarUrl ? (
                    <AvatarImage src={effectiveAvatarUrl} alt={fullName} />
                  ) : (
                    <AvatarFallback className="bg-purple-100">
                      <User className="h-12 w-12 text-purple-600" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <button 
                  onClick={() => setShowEditProfile(true)}
                  className="absolute bottom-0 right-0 bg-purple-600/90 text-white p-1.5 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
                  aria-label="Edit profile picture"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <h2 className="text-2xl font-bold text-purple-800 mb-1">
                {fullName}
              </h2>
              <p className="text-gray-600 mb-6">
                {user?.email || 'Manage your account settings'}
              </p>

              <ButtonKwity
                onClick={() => setShowEditProfile(true)}
                variant="emerald"
                className="w-full mb-3 bg-purple-600/90 hover:bg-purple-700 text-white"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </ButtonKwity>

              <ButtonKwity
                onClick={() => setShowSettings(true)}
                variant="secondary"
                className="w-full mb-3 bg-white/80 hover:bg-white/90 text-purple-700 border border-white/40"
              >
                <Settings className="mr-2 h-4 w-4" />
                Open Settings
              </ButtonKwity>

              <ButtonKwity
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

