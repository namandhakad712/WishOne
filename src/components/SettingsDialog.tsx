import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ButtonKwity } from "./ui/button-kwity";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Bell, Calendar, Moon, User, Shield } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define the settings interface
interface Settings {
  notifications: {
    pushNotifications: boolean;
    emailNotifications: boolean;
    soundNotifications: boolean;
  };
  appearance: {
    darkMode: boolean;
    reduceMotion: boolean;
    highContrast: boolean;
  };
  calendar: {
    googleCalendar: boolean;
    defaultReminder: string;
    weekStart: string;
  };
  account: {
    privacyMode: boolean;
    dataCollection: boolean;
  };
}

// Default settings
const defaultSettings: Settings = {
  notifications: {
    pushNotifications: true,
    emailNotifications: true,
    soundNotifications: false,
  },
  appearance: {
    darkMode: false,
    reduceMotion: false,
    highContrast: false,
  },
  calendar: {
    googleCalendar: false,
    defaultReminder: "7",
    weekStart: "monday",
  },
  account: {
    privacyMode: false,
    dataCollection: true,
  },
};

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  // State to track settings
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("wishone_settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Error parsing saved settings:", error);
      }
    }
  }, []);

  // Update a specific setting
  const updateSetting = (
    category: keyof Settings,
    setting: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
    setHasChanges(true);
  };

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem("wishone_settings", JSON.stringify(settings));
    setHasChanges(false);
    onOpenChange(false);
    
    // Show a toast or notification that settings were saved
    console.log("Settings saved successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-primary-emerald">
            Settings
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Customize your WishOne experience
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="notifications" className="mt-4">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger
              value="notifications"
              className="flex flex-col items-center gap-1 py-2"
            >
              <Bell className="h-4 w-4" />
              <span className="text-xs">Notifications</span>
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="flex flex-col items-center gap-1 py-2"
            >
              <Moon className="h-4 w-4" />
              <span className="text-xs">Appearance</span>
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="flex flex-col items-center gap-1 py-2"
            >
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Calendar</span>
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="flex flex-col items-center gap-1 py-2"
            >
              <User className="h-4 w-4" />
              <span className="text-xs">Account</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="push-notifications"
                  className="flex flex-col space-y-1"
                >
                  <span>Push Notifications</span>
                  <span className="font-normal text-xs text-gray-500">
                    Receive notifications on your device
                  </span>
                </Label>
                <Switch 
                  id="push-notifications" 
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(checked) => 
                    updateSetting("notifications", "pushNotifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="email-notifications"
                  className="flex flex-col space-y-1"
                >
                  <span>Email Notifications</span>
                  <span className="font-normal text-xs text-gray-500">
                    Receive birthday reminders via email
                  </span>
                </Label>
                <Switch 
                  id="email-notifications" 
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) => 
                    updateSetting("notifications", "emailNotifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="sound-notifications"
                  className="flex flex-col space-y-1"
                >
                  <span>Sound Notifications</span>
                  <span className="font-normal text-xs text-gray-500">
                    Play sounds for notifications
                  </span>
                </Label>
                <Switch 
                  id="sound-notifications" 
                  checked={settings.notifications.soundNotifications}
                  onCheckedChange={(checked) => 
                    updateSetting("notifications", "soundNotifications", checked)
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                  <span>Dark Mode</span>
                  <span className="font-normal text-xs text-gray-500">
                    Use dark theme
                  </span>
                </Label>
                <Switch 
                  id="dark-mode" 
                  checked={settings.appearance.darkMode}
                  onCheckedChange={(checked) => 
                    updateSetting("appearance", "darkMode", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="reduce-motion"
                  className="flex flex-col space-y-1"
                >
                  <span>Reduce Motion</span>
                  <span className="font-normal text-xs text-gray-500">
                    Minimize animations
                  </span>
                </Label>
                <Switch 
                  id="reduce-motion" 
                  checked={settings.appearance.reduceMotion}
                  onCheckedChange={(checked) => 
                    updateSetting("appearance", "reduceMotion", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="high-contrast"
                  className="flex flex-col space-y-1"
                >
                  <span>High Contrast</span>
                  <span className="font-normal text-xs text-gray-500">
                    Increase contrast for better visibility
                  </span>
                </Label>
                <Switch 
                  id="high-contrast" 
                  checked={settings.appearance.highContrast}
                  onCheckedChange={(checked) => 
                    updateSetting("appearance", "highContrast", checked)
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="google-calendar"
                  className="flex flex-col space-y-1"
                >
                  <span>Google Calendar</span>
                  <span className="font-normal text-xs text-gray-500">
                    Sync with Google Calendar
                  </span>
                </Label>
                <Switch 
                  id="google-calendar" 
                  checked={settings.calendar.googleCalendar}
                  onCheckedChange={(checked) => 
                    updateSetting("calendar", "googleCalendar", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="default-reminder"
                  className="flex flex-col space-y-1"
                >
                  <span>Default Reminder</span>
                  <span className="font-normal text-xs text-gray-500">
                    Set default reminder days before birthdays
                  </span>
                </Label>
                <select 
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  value={settings.calendar.defaultReminder}
                  onChange={(e) => updateSetting("calendar", "defaultReminder", e.target.value)}
                >
                  <option value="1">1 day before</option>
                  <option value="3">3 days before</option>
                  <option value="7">1 week before</option>
                  <option value="14">2 weeks before</option>
                  <option value="30">1 month before</option>
                </select>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="week-start" className="flex flex-col space-y-1">
                  <span>Week Starts On</span>
                  <span className="font-normal text-xs text-gray-500">
                    Set first day of week
                  </span>
                </Label>
                <select 
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  value={settings.calendar.weekStart}
                  onChange={(e) => updateSetting("calendar", "weekStart", e.target.value)}
                >
                  <option value="sunday">Sunday</option>
                  <option value="monday">Monday</option>
                </select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="privacy" className="flex flex-col space-y-1">
                  <span>Privacy Mode</span>
                  <span className="font-normal text-xs text-gray-500">
                    Hide sensitive information
                  </span>
                </Label>
                <Switch 
                  id="privacy" 
                  checked={settings.account.privacyMode}
                  onCheckedChange={(checked) => 
                    updateSetting("account", "privacyMode", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="data-collection"
                  className="flex flex-col space-y-1"
                >
                  <span>Data Collection</span>
                  <span className="font-normal text-xs text-gray-500">
                    Allow anonymous usage data collection
                  </span>
                </Label>
                <Switch 
                  id="data-collection" 
                  checked={settings.account.dataCollection}
                  onCheckedChange={(checked) => 
                    updateSetting("account", "dataCollection", checked)
                  }
                />
              </div>

              <div className="mt-6">
                <ButtonKwity variant="emerald" className="w-full">
                  <Shield className="mr-2 h-4 w-4" />
                  Privacy Settings
                </ButtonKwity>
              </div>

              <div className="mt-2">
                <Button
                  variant="outline"
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <ButtonKwity 
            variant="secondary" 
            onClick={() => {
              // Discard changes and close
              const savedSettings = localStorage.getItem("wishone_settings");
              if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
              } else {
                setSettings(defaultSettings);
              }
              setHasChanges(false);
              onOpenChange(false);
            }}
          >
            Cancel
          </ButtonKwity>
          <ButtonKwity 
            onClick={saveSettings}
            disabled={!hasChanges}
          >
            Save Changes
          </ButtonKwity>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
