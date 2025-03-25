import React, { useState, useEffect, useRef } from "react";
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
import { Bell, Calendar, Moon, User, Shield, Loader2, Palette, Snowflake, HelpCircle } from "lucide-react";
import { saveUserSettings, getUserSettings } from "@/lib/supabaseClient";
import { useSupabase } from "@/contexts/SupabaseContext";
import { useToast } from "@/components/ui/use-toast";
import { useRetroMode } from "@/contexts/RetroModeContext";
import gradientData from "@/lib/gradients.json";
import { gsap } from "gsap";
import AnimatedElement from "./AnimatedElement";

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
    preview: "linear-gradient(90deg, #ff9a9e 0%, #fad0c4 25%, #a18cd1 50%, #fbc2eb 75%, #f6d365 100%)"
  },
  {
    id: "malibu-beach",
    name: "Warm Flame",
    colors: ["255, 154, 158", "250, 208, 196"],
    preview: "linear-gradient(135deg, rgb(255, 154, 158) 0%, rgb(250, 208, 196) 100%)"
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
    retroMode: boolean; // Add retro mode for black and white outlined UI
    backgroundGradient: string; // ID of the selected gradient
    frostBg: boolean; // Add frost glass effect to background
  };
  calendar: {
    googleCalendar: boolean;
    defaultReminder: string;
    weekStart: string;
  };
  account: {
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
    retroMode: false, // Default to modern UI
    backgroundGradient: "mint-gold", // Default gradient
    frostBg: false, // Default to no frost effect
  },
  calendar: {
    googleCalendar: false,
    defaultReminder: "7",
    weekStart: "monday",
  },
  account: {
  },
};

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  // State to track settings
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSupabase();
  const { toast } = useToast();
  const { setIsRetroMode } = useRetroMode();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("appearance");
  
  // Animation refs
  const dialogRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const settingsItemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Configure animations when the dialog opens
  useEffect(() => {
    if (!open || !dialogRef.current) return;

    // Initial animation timeline
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    // Animate header elements
    if (headerRef.current) {
      tl.fromTo(
        headerRef.current.children,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.4 },
        0.2
      );
    }
    
    // Animate tabs list
    if (tabsListRef.current) {
      tl.fromTo(
        tabsListRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4 },
        0.4
      );
    }
    
    // Animate footer
    if (footerRef.current) {
      tl.fromTo(
        footerRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.4 },
        0.5
      );
    }
    
    // Return cleanup function
    return () => {
      tl.kill();
    };
  }, [open]);
  
  // Animate tab content when tab changes
  useEffect(() => {
    if (!tabContentRef.current) return;
    
    // Get all setting items for the active tab
    const settingItems = Object.values(settingsItemRefs.current).filter(
      item => item?.dataset.tab === activeTab
    );
    
    if (settingItems.length > 0) {
      gsap.fromTo(
        settingItems,
        { y: 15, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.08, 
          duration: 0.4,
          ease: 'power2.out',
          clearProps: 'transform'
        }
      );
    }
  }, [activeTab]);
  
  // Add hover animation to gradient options
  const animateGradientHover = (element: HTMLElement, isEnter: boolean) => {
    gsap.to(element, {
      scale: isEnter ? 1.05 : 1,
      boxShadow: isEnter ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 6px rgba(0,0,0,0.1)',
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  // Load settings from Supabase or localStorage on component mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const userSettings = await getUserSettings();
        if (userSettings) {
          setSettings(userSettings);
          // Update retro mode when settings are loaded
          setIsRetroMode(userSettings.appearance.retroMode || false);
          
          // If no background gradient is set, generate a random one
          if (!userSettings.appearance?.backgroundGradient) {
            const randomGradientId = gradientOptions[Math.floor(Math.random() * gradientOptions.length)].id;
            setSettings(prev => ({
              ...prev,
              appearance: {
                ...prev.appearance,
                backgroundGradient: randomGradientId
              }
            }));
          }
        } else {
          // Apply defaults and save
          await saveUserSettings(defaultSettings);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        // Fallback to localStorage
        const savedSettings = localStorage.getItem("wishone_settings");
        if (savedSettings) {
          try {
            const parsedSettings = JSON.parse(savedSettings);
            setSettings(parsedSettings);
            // Update retro mode from localStorage
            setIsRetroMode(parsedSettings.appearance.retroMode || false);
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
  }, [open, setIsRetroMode]);

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

    // Update retro mode immediately when changed
    if (category === "appearance" && setting === "retroMode") {
      setIsRetroMode(value);
    }
  };

  // Save settings to Supabase and localStorage
  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Add animation for saving state
      if (footerRef.current) {
        gsap.to(footerRef.current.querySelector('.save-button'), {
          scale: 0.95,
          duration: 0.2,
          repeat: 2,
          yoyo: true
        });
      }
      
      await saveUserSettings(settings);
      
      // Success animation
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated.",
      });
      
      // Add a little animation to celebrate saving
      if (dialogRef.current) {
        gsap.fromTo(
          dialogRef.current,
          { y: 0 },
          { 
            y: -5, 
            duration: 0.1, 
            repeat: 1, 
            yoyo: true,
            ease: 'power2.out' 
          }
        );
      }
      
      setTimeout(() => {
      onOpenChange(false);
      }, 500);
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Add a ref to a setting item
  const addSettingItemRef = (element: HTMLDivElement | null, key: string, tab: string) => {
    if (element) {
      element.dataset.tab = tab;
      settingsItemRefs.current[key] = element;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        ref={dialogRef}
        className="w-full max-w-lg sm:max-w-2xl sm:w-[min(100vw-2rem,700px)] max-h-[90vh] overflow-y-auto px-2 sm:px-6 py-4 sm:py-8 rounded-xl sm:rounded-2xl"
      >
        <div ref={headerRef}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
            <DialogDescription>
              Customize your experience and manage your account preferences.
          </DialogDescription>
        </DialogHeader>
          </div>

        <div className="mt-6 space-y-6">
          <div ref={tabsListRef}>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 w-full">
                <AnimatedElement type="fadeIn" delay={0.2} duration={0.4}>
                  <TabsTrigger value="appearance" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <span className="hidden sm:inline">Appearance</span>
                </TabsTrigger>
                </AnimatedElement>
                
                <AnimatedElement type="fadeIn" delay={0.3} duration={0.4}>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                </AnimatedElement>
                
                <AnimatedElement type="fadeIn" delay={0.4} duration={0.4}>
                  <TabsTrigger value="calendar" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">Calendar</span>
                </TabsTrigger>
                </AnimatedElement>
                
                <AnimatedElement type="fadeIn" delay={0.5} duration={0.4}>
                  <TabsTrigger value="account" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Account</span>
                </TabsTrigger>
                </AnimatedElement>
              </TabsList>

              <div ref={tabContentRef}>
                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-6">
                  {/* Dark Mode */}
                  <div 
                    ref={(el) => addSettingItemRef(el, 'darkMode', 'appearance')} 
                    className="flex justify-between items-center"
                  >
                    <div>
                      <Label className="text-base flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark Mode
                      </Label>
                      <p className="text-sm text-gray-500">
                        Switch to a darker color theme.
                      </p>
                    </div>
                      <Switch 
                        checked={settings.appearance.darkMode}
                        onCheckedChange={(checked) => 
                          updateSetting("appearance", "darkMode", checked)
                        }
                      />
                    </div>

                  {/* Retro Mode */}
                  <div 
                    ref={(el) => addSettingItemRef(el, 'retroMode', 'appearance')} 
                    className="flex justify-between items-center"
                  >
                    <div>
                      <Label className="text-base flex items-center gap-2">
                        <Snowflake className="h-4 w-4" />
                          Retro Mode
                      </Label>
                      <p className="text-sm text-gray-500">
                        Enable a vintage-inspired interface.
                      </p>
                    </div>
                      <Switch 
                        checked={settings.appearance.retroMode}
                        onCheckedChange={(checked) => 
                          updateSetting("appearance", "retroMode", checked)
                        }
                      />
                    </div>

                  {/* Frost Glass Effect */}
                  <div 
                    ref={(el) => addSettingItemRef(el, 'frostBg', 'appearance')} 
                    className="flex justify-between items-center"
                      >
                    <div>
                      <Label className="text-base flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        Frost Glass Effect
                      </Label>
                      <p className="text-sm text-gray-500">
                        Add a frosted glass overlay to backgrounds.
                      </p>
                    </div>
                      <Switch 
                        checked={settings.appearance.frostBg}
                        onCheckedChange={(checked) => 
                          updateSetting("appearance", "frostBg", checked)
                        }
                      />
                    </div>

                    {/* Background Gradient Selection */}
                  <div 
                    ref={(el) => addSettingItemRef(el, 'backgroundGradient', 'appearance')} 
                    className="space-y-3"
                  >
                    <Label className="text-base block mb-1">Background Gradient</Label>
                    <p className="text-sm text-gray-500 mb-4">
                      Choose a color theme for your backgrounds.
                    </p>
                      
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {gradientOptions.map((gradient) => (
                            <div 
                              key={gradient.id}
                          className={`rounded-lg overflow-hidden border-2 cursor-pointer transition-shadow duration-300 ${
                            settings.appearance.backgroundGradient === gradient.id
                              ? "border-purple-500 shadow-md"
                              : "border-transparent"
                          }`}
                          onClick={() =>
                            updateSetting(
                              "appearance",
                              "backgroundGradient",
                              gradient.id
                            )
                          }
                          onMouseEnter={(e) => animateGradientHover(e.currentTarget, true)}
                          onMouseLeave={(e) => animateGradientHover(e.currentTarget, false)}
                            >
                              <div 
                            className="h-20 w-full"
                            style={{ background: gradient.preview }}
                          ></div>
                          <div className="p-2 bg-white text-center text-xs font-medium">
                                {gradient.name}
                              </div>
                            </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                  {/* Push Notifications */}
                  <div 
                    ref={(el) => addSettingItemRef(el, 'pushNotifications', 'notifications')} 
                    className="flex justify-between items-center"
                  >
                    <div>
                      <Label className="text-base">Push Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive notifications for important events.
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(checked) =>
                        updateSetting("notifications", "pushNotifications", checked)
                      }
                    />
                  </div>

                  {/* Email Notifications */}
                  <div 
                    ref={(el) => addSettingItemRef(el, 'emailNotifications', 'notifications')} 
                    className="flex justify-between items-center"
                  >
                    <div>
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Get updates and reminders via email.
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        updateSetting("notifications", "emailNotifications", checked)
                      }
                    />
                  </div>

                  {/* Sound Notifications */}
                  <div 
                    ref={(el) => addSettingItemRef(el, 'soundNotifications', 'notifications')} 
                    className="flex justify-between items-center"
                  >
                    <div>
                      <Label className="text-base">Sound Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Play a sound for incoming notifications.
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.soundNotifications}
                      onCheckedChange={(checked) =>
                        updateSetting("notifications", "soundNotifications", checked)
                      }
                    />
                  </div>
                </TabsContent>

                {/* Calendar Tab */}
                <TabsContent value="calendar" className="space-y-6">
                  {/* Google Calendar Integration */}
                  <div 
                    ref={(el) => addSettingItemRef(el, 'googleCalendar', 'calendar')} 
                    className="flex justify-between items-center"
                  >
                    <div>
                      <Label className="text-base">Google Calendar Integration</Label>
                      <p className="text-sm text-gray-500">
                        Sync birthdays with your Google Calendar.
                      </p>
                    </div>
                      <Switch 
                        checked={settings.calendar.googleCalendar}
                        onCheckedChange={(checked) => 
                          updateSetting("calendar", "googleCalendar", checked)
                        }
                      />
                    </div>

                  {/* Default Reminder */}
                  <div 
                    ref={(el) => addSettingItemRef(el, 'defaultReminder', 'calendar')} 
                    className="space-y-3"
                      >
                    <Label className="text-base block">Default Reminder Time</Label>
                    <p className="text-sm text-gray-500">
                      When to remind you of upcoming birthdays.
                    </p>
                      <select 
                        value={settings.calendar.defaultReminder}
                      onChange={(e) =>
                        updateSetting("calendar", "defaultReminder", e.target.value)
                      }
                      className="w-full p-2 rounded-md border bg-white/90 text-sm"
                      >
                      <option value="same-day">Same day</option>
                      <option value="1-day">1 day before</option>
                      <option value="3-days">3 days before</option>
                      <option value="1-week">1 week before</option>
                      <option value="2-weeks">2 weeks before</option>
                      </select>
                    </div>

                  {/* Week Start */}
                  <div 
                    ref={(el) => addSettingItemRef(el, 'weekStart', 'calendar')} 
                    className="space-y-3"
                  >
                    <Label className="text-base block">Week Start</Label>
                    <p className="text-sm text-gray-500">
                      Choose the first day of the week.
                    </p>
                      <select 
                        value={settings.calendar.weekStart}
                      onChange={(e) =>
                        updateSetting("calendar", "weekStart", e.target.value)
                      }
                      className="w-full p-2 rounded-md border bg-white/90 text-sm"
                      >
                      <option value="monday">Monday</option>
                        <option value="sunday">Sunday</option>
                      <option value="saturday">Saturday</option>
                      </select>
                  </div>
                </TabsContent>

                {/* Account Tab */}
                <TabsContent value="account" className="space-y-6">
                  <div 
                    ref={(el) => addSettingItemRef(el, 'accountInfo', 'account')} 
                    className="space-y-3"
                  >
                    <Label className="text-base block">Account Information</Label>
                    <p className="text-sm text-gray-500">
                      Manage your account settings and preferences.
                    </p>
                    <div className="p-4 bg-gray-50 rounded-lg overflow-x-auto">
                      <p className="text-sm mb-2">
                        <strong>Email:</strong> {user?.email}
                      </p>
                      <p className="text-sm mb-2">
                        <strong>Account created:</strong>{" "}
                        {user?.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : "Unknown"}
                      </p>
                      <Button
                        variant="outline"
                        className="mt-2 text-sm"
                        onClick={() => onOpenChange(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                    </div>
                  
                  <div 
                    ref={(el) => addSettingItemRef(el, 'privacy', 'account')} 
                    className="space-y-3"
                  >
                    <Label className="text-base block flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Privacy & Security
                    </Label>
                    <p className="text-sm text-gray-500">
                      Manage your data and privacy settings.
                    </p>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm">
                        Your data is stored securely and never shared with third parties
                        without your consent.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        <DialogFooter ref={footerRef} className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center mt-6">
          <AnimatedElement type="fadeIn" delay={0.6} duration={0.4}>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
          </AnimatedElement>
          
          <AnimatedElement type="fadeIn" delay={0.7} duration={0.4}>
            <button
              type="button"
                onClick={saveSettings}
              disabled={isSaving}
              className="group relative bg-neutral-800 h-12 w-48 border text-left px-4 py-2 text-gray-50 text-base font-bold rounded-lg overflow-hidden underline underline-offset-2 duration-500 before:absolute before:w-8 before:h-8 before:content-[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg after:absolute after:z-10 after:w-14 after:h-14 after:content-[''] after:bg-rose-400 after:bg-opacity-80 after:right-6 after:top-2 after:rounded-full after:blur-lg group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_12px_12px_12px_18px_#a21caf] hover:duration-500 hover:after:-right-6 hover:before:right-8 hover:before:-bottom-4 hover:before:blur hover:underline hover:underline-offset-4 origin-left hover:decoration-2 hover:text-white"
              style={{ minWidth: '8rem', minHeight: '2.5rem', maxWidth: '100%', width: '12rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.3s', }}
              >
              {isSaving ? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block align-middle" />
                  <span className="align-middle">Saving...</span>
                  </>
                ) : (
                <span className="transition-all group-hover:text-white group-hover:[text-shadow:0_0_8px_#fff,0_0_16px_#a21caf,0_0_24px_#a21caf]">Save Changes</span>
                )}
            </button>
          </AnimatedElement>
            </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
