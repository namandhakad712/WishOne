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
import { Bell, Calendar, Moon, User, Shield, Loader2, Palette } from "lucide-react";
import { saveUserSettings, getUserSettings } from "@/lib/supabaseClient";
import { useSupabase } from "@/contexts/SupabaseContext";
import { useToast } from "@/components/ui/use-toast";
import gradientData from "@/lib/gradients.json";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define gradient options
export interface GradientOption {
  id: string;
  name: string;
  colors: [string, string]; // [startColor, endColor]
  preview: string; // CSS gradient for preview
}

// Predefined gradient options
export const gradientOptions: GradientOption[] = [
  {
    id: "mint-gold",
    name: "Mint & Gold",
    colors: ["173, 216, 200", "240, 219, 165"],
    preview: "linear-gradient(135deg, rgb(173, 216, 200) 0%, rgb(240, 219, 165) 100%)"
  },
  {
    id: "lavender-blue",
    name: "Lavender & Blue",
    colors: ["187, 143, 206", "126, 171, 223"],
    preview: "linear-gradient(135deg, rgb(187, 143, 206) 0%, rgb(126, 171, 223) 100%)"
  },
  {
    id: "peach-pink",
    name: "Peach & Pink",
    colors: ["255, 184, 140", "255, 140, 184"],
    preview: "linear-gradient(135deg, rgb(255, 184, 140) 0%, rgb(255, 140, 184) 100%)"
  },
  {
    id: "teal-lime",
    name: "Teal & Lime",
    colors: ["100, 204, 197", "188, 226, 158"],
    preview: "linear-gradient(135deg, rgb(100, 204, 197) 0%, rgb(188, 226, 158) 100%)"
  },
  {
    id: "blue-purple",
    name: "Blue & Purple",
    colors: ["116, 166, 236", "181, 134, 218"],
    preview: "linear-gradient(135deg, rgb(116, 166, 236) 0%, rgb(181, 134, 218) 100%)"
  },
  {
    id: "sunset",
    name: "Sunset",
    colors: ["255, 153, 102", "255, 94, 98"],
    preview: "linear-gradient(135deg, rgb(255, 153, 102) 0%, rgb(255, 94, 98) 100%)"
  },
  {
    id: "ocean-depths",
    name: "Ocean Depths",
    colors: ["0, 119, 182", "0, 180, 216"],
    preview: "linear-gradient(135deg, rgb(0, 119, 182) 0%, rgb(0, 180, 216) 100%)"
  },
  {
    id: "forest-moss",
    name: "Forest Moss",
    colors: ["76, 149, 80", "161, 196, 106"],
    preview: "linear-gradient(135deg, rgb(76, 149, 80) 0%, rgb(161, 196, 106) 100%)"
  },
  {
    id: "random",
    name: "Random",
    colors: ["128, 128, 128", "128, 128, 128"], // Placeholder, will be generated dynamically
    preview: "linear-gradient(135deg, rgb(128, 128, 128) 0%, rgb(128, 128, 128) 100%)"
  }
];

// Helper function to generate random RGB color
export const generateRandomColor = (): string => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `${r}, ${g}, ${b}`;
};

// Helper function to convert hex to RGB
const hexToRgb = (hex: string): string => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
};

// Generate a random gradient from the JSON file
export const generateRandomGradient = (): [string, string] => {
  const gradients = gradientData.gradients;
  const randomIndex = Math.floor(Math.random() * gradients.length);
  const selectedGradient = gradients[randomIndex];
  
  // Make sure we have at least 2 colors
  if (selectedGradient.colors.length >= 2) {
    return [
      hexToRgb(selectedGradient.colors[0]), 
      hexToRgb(selectedGradient.colors[1])
    ];
  }
  
  // Fallback to a default gradient if something goes wrong
  return ["173, 216, 200", "240, 219, 165"];
};

// Legacy function for truly random colors (not used by default anymore)
export const generateTrulyRandomGradient = (): [string, string] => {
  return [generateRandomColor(), generateRandomColor()];
};

// Utility function to determine if text should be white based on background color brightness
export const shouldUseWhiteText = (rgbColor: string): boolean => {
  // Parse RGB values
  const [r, g, b] = rgbColor.split(',').map(c => parseInt(c.trim(), 10));
  
  // Calculate relative luminance using the formula for perceived brightness
  // https://www.w3.org/TR/WCAG20-TECHS/G18.html
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return true (use white text) if the background is dark (luminance < 0.5)
  return luminance < 0.5;
};

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
    backgroundGradient: string; // ID of the selected gradient
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
    backgroundGradient: "mint-gold", // Default gradient
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
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSupabase();
  const { toast } = useToast();

  // Load settings from Supabase or localStorage on component mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const userSettings = await getUserSettings();
        if (userSettings) {
          setSettings(userSettings);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        // Fallback to localStorage
        const savedSettings = localStorage.getItem("wishone_settings");
        if (savedSettings) {
          try {
            setSettings(JSON.parse(savedSettings));
          } catch (parseError) {
            console.error("Error parsing saved settings:", parseError);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      loadSettings();
    }
  }, [open]);

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

  // Save settings to Supabase and localStorage
  const saveSettings = async () => {
    setIsLoading(true);
    try {
      if (user) {
        // If user is logged in, save to Supabase
        await saveUserSettings(settings);
      } else {
        // Otherwise just save to localStorage
        localStorage.setItem("wishone_settings", JSON.stringify(settings));
      }
      
      setHasChanges(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            {user ? " (synced across devices)" : " (stored on this device only)"}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-emerald" />
          </div>
        ) : (
          <>
            <Tabs defaultValue="notifications" className="mt-4">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="notifications" className="flex flex-col items-center py-2">
                  <Bell className="h-5 w-5 mb-1" />
                  <span className="text-xs">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex flex-col items-center py-2">
                  <Moon className="h-5 w-5 mb-1" />
                  <span className="text-xs">Appearance</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex flex-col items-center py-2">
                  <Calendar className="h-5 w-5 mb-1" />
                  <span className="text-xs">Calendar</span>
                </TabsTrigger>
                <TabsTrigger value="account" className="flex flex-col items-center py-2">
                  <User className="h-5 w-5 mb-1" />
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
                    <Label
                      htmlFor="dark-mode"
                      className="flex flex-col space-y-1"
                    >
                      <span>Dark Mode</span>
                      <span className="font-normal text-xs text-gray-500">
                        Use dark theme for the app
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
                        Minimize animations throughout the app
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

                  {/* Background Gradient Selection */}
                  <div className="pt-4 border-t border-gray-100">
                    <Label className="flex items-center space-x-2 mb-3">
                      <Palette className="h-5 w-5 text-primary-emerald" />
                      <span>Background Gradient</span>
                    </Label>
                    
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {gradientOptions.map((gradient) => {
                        // Generate a random preview for the random option
                        let previewStyle = gradient.preview;
                        
                        if (gradient.id === 'random') {
                          // Show a random gradient from our JSON file
                          const randomGradient = generateRandomGradient();
                          previewStyle = `linear-gradient(135deg, rgb(${randomGradient[0]}) 0%, rgb(${randomGradient[1]}) 100%)`;
                        }
                        
                        return (
                          <div 
                            key={gradient.id}
                            className={`
                              cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                              ${settings.appearance.backgroundGradient === gradient.id 
                                ? 'border-primary-emerald scale-105 shadow-md' 
                                : 'border-transparent hover:border-gray-200'}
                            `}
                            onClick={() => updateSetting("appearance", "backgroundGradient", gradient.id)}
                          >
                            <div 
                              className="h-16 w-full" 
                              style={{ background: previewStyle }}
                            />
                            <div className="text-xs text-center py-1 px-1 truncate">
                              {gradient.name}
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
                        Sync birthdays with Google Calendar
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
                    <Label
                      htmlFor="week-start"
                      className="flex flex-col space-y-1"
                    >
                      <span>Week Starts On</span>
                      <span className="font-normal text-xs text-gray-500">
                        Set the first day of the week
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

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <ButtonKwity
                onClick={saveSettings}
                disabled={!hasChanges || isLoading}
                variant="emerald"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </ButtonKwity>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
