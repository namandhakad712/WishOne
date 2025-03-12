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

  return (
    <div className="min-h-screen bg-[#e8eeeb] flex flex-col items-center justify-center pb-20">
      <div className="w-full max-w-md px-4 py-8">
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={fullName} />
                ) : (
                  <AvatarFallback className="bg-primary-mint">
                    <User className="h-12 w-12 text-primary-emerald" />
                  </AvatarFallback>
                )}
              </Avatar>
              <button 
                onClick={() => setShowEditProfile(true)}
                className="absolute bottom-0 right-0 bg-primary-emerald text-white p-1 rounded-full shadow-md hover:bg-primary-emerald/90 transition-colors"
                aria-label="Edit profile picture"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <h2 className="text-2xl font-serif text-primary-emerald mb-1">
              {fullName}
            </h2>
            <p className="text-gray-500 mb-6">
              {user?.email || 'Manage your account settings'}
            </p>

            <ButtonKwity
              onClick={() => setShowEditProfile(true)}
              variant="emerald"
              className="w-full mb-3"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </ButtonKwity>

            <ButtonKwity
              onClick={() => setShowSettings(true)}
              variant="secondary"
              className="w-full mb-3"
            >
              <Settings className="mr-2 h-4 w-4" />
              Open Settings
            </ButtonKwity>

            <ButtonKwity
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
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
  );
};

export default ProfilePage;

