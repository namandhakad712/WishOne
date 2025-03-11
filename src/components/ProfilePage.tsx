import React, { useState } from "react";
import BottomTabBar from "./BottomTabBar";
import SettingsDialog from "./SettingsDialog";
import { ButtonKwity } from "./ui/button-kwity";
import { Settings, User } from "lucide-react";

const ProfilePage = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-[#e8eeeb] flex flex-col items-center justify-center pb-20">
      <div className="w-full max-w-md px-4 py-8">
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-primary-mint flex items-center justify-center mb-4 border-4 border-white shadow-md">
              <User className="h-12 w-12 text-primary-emerald" />
            </div>
            <h2 className="text-2xl font-serif text-primary-emerald mb-1">
              Your Profile
            </h2>
            <p className="text-gray-500 mb-6">Manage your account settings</p>

            <ButtonKwity
              onClick={() => setShowSettings(true)}
              variant="emerald"
              className="w-full"
            >
              <Settings className="mr-2 h-4 w-4" />
              Open Settings
            </ButtonKwity>
          </div>
        </div>
      </div>

      <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />

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
