import React, { useState, useEffect } from "react";
import Header from "./Header";
import CalendarWidget from "./CalendarWidget";
import BirthdayDetails from "./BirthdayDetails";
import AddBirthdayForm from "./AddBirthdayForm";
import BottomTabBar from "./BottomTabBar";
import { ButtonKwity } from "./ui/button-kwity";
import { PlusCircle, Loader2 } from "lucide-react";
import { addBirthday, getBirthdays, deleteBirthday, updateBirthday } from "@/lib/supabaseClient";
import { useSupabase } from "@/contexts/SupabaseContext";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Birthday {
  id: string;
  name: string;
  date: Date | string;
  relation: string;
  hasReminder: boolean;
  reminderDays?: number;
  googleCalendarLinked?: boolean;
  notes?: string;
}

const Home = () => {
  const [selectedBirthday, setSelectedBirthday] = useState<Birthday | null>(null);
  const [showBirthdayDetails, setShowBirthdayDetails] = useState(false);
  const [showAddBirthdayForm, setShowAddBirthdayForm] = useState(false);
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load birthdays from Supabase when component mounts or user changes
  useEffect(() => {
    const loadBirthdays = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const birthdaysData = await getBirthdays();
        
        console.log("Raw birthdays data from Supabase:", birthdaysData);
        
        // Transform the data to match our Birthday interface
        const formattedBirthdays = birthdaysData.map((bd: any) => {
          console.log(`Processing birthday: ${bd.name}, date: ${bd.date}, type: ${typeof bd.date}`);
          
          const dateObj = new Date(bd.date);
          console.log(`Converted date object: ${dateObj}, valid: ${!isNaN(dateObj.getTime())}`);
          
          return {
            id: bd.id,
            name: bd.name,
            date: dateObj,
            relation: bd.relation,
            hasReminder: bd.reminder_days > 0,
            reminderDays: bd.reminder_days,
            googleCalendarLinked: bd.google_calendar_linked || false,
            notes: bd.notes || "",
          };
        });
        
        console.log("Formatted birthdays:", formattedBirthdays);
        
        setBirthdays(formattedBirthdays);
      } catch (error) {
        console.error("Error loading birthdays:", error);
        toast({
          title: "Error loading birthdays",
          description: "Could not load your birthdays. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadBirthdays();
  }, [isAuthenticated, user, toast]);

  const handleSelectBirthday = (birthday: Birthday) => {
    setSelectedBirthday(birthday);
    setShowBirthdayDetails(true);
  };

  const handleAddBirthday = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add birthdays.",
        variant: "destructive",
      });
      return;
    }
    setShowAddBirthdayForm(true);
  };

  const handleBirthdaySubmit = async (data: any) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add birthdays.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      console.log("Form data received:", data);
      
      // Format the date as a string (YYYY-MM-DD)
      let formattedDate;
      if (data.date instanceof Date) {
        formattedDate = format(data.date, "yyyy-MM-dd");
      } else {
        // If it's already a string, ensure it's in the correct format
        try {
          const dateObj = new Date(data.date);
          formattedDate = format(dateObj, "yyyy-MM-dd");
        } catch (error) {
          console.error("Error formatting date:", error);
          formattedDate = data.date; // Use as is if parsing fails
        }
      }
      
      console.log("Formatted date:", formattedDate);
      
      // Create the birthday object for Supabase
      const birthdayData = {
        name: data.name,
        date: formattedDate,
        relation: data.relation,
        reminder_days: parseInt(data.reminderDays || "0"),
        google_calendar_linked: data.useGoogleCalendar || false,
        notes: data.notes || "",
      };
      
      console.log("Birthday data to save:", birthdayData);
      
      // Save to Supabase
      const newBirthday = await addBirthday(birthdayData);
      
      console.log("Birthday saved, response:", newBirthday);
      
      // Transform the returned data to match our Birthday interface
      const formattedBirthday: Birthday = {
        id: newBirthday.id,
        name: newBirthday.name,
        date: new Date(newBirthday.date),
        relation: newBirthday.relation,
        hasReminder: newBirthday.reminder_days > 0,
        reminderDays: newBirthday.reminder_days,
        googleCalendarLinked: newBirthday.google_calendar_linked || false,
        notes: newBirthday.notes || "",
      };
      
      // Update local state
      setBirthdays([...birthdays, formattedBirthday]);
      
      toast({
        title: "Birthday added",
        description: `${data.name}'s birthday has been added successfully.`,
      });
    } catch (error) {
      console.error("Error adding birthday:", error);
      toast({
        title: "Error adding birthday",
        description: "Could not add the birthday. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowAddBirthdayForm(false);
    }
  };

  const handleDeleteBirthday = async (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to delete birthdays.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Delete from Supabase
      await deleteBirthday(id);
      
      // Update local state
      setBirthdays(birthdays.filter((birthday) => birthday.id !== id));
      
      toast({
        title: "Birthday deleted",
        description: "The birthday has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting birthday:", error);
      toast({
        title: "Error deleting birthday",
        description: "Could not delete the birthday. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowBirthdayDetails(false);
    }
  };

  const handleEditBirthday = (id: string) => {
    // In a real app, this would open the edit form
    console.log(`Edit birthday with id: ${id}`);
    setShowBirthdayDetails(false);
  };

  const handleSendMessage = (message: string) => {
    // In a real app, this would send the message to the AI service
    console.log(`Message sent: ${message}`);
    // The AIChatbot component now handles the UI updates internally
  };

  const handleUploadMedia = (file: File) => {
    // In a real app, this would upload the file to a service
    console.log(`File uploaded: ${file.name}`);
  };

  return (
    <div className="min-h-screen bg-[#e8eeeb] pb-20">
      <Header />

      <main className="container mx-auto px-4 py-4">
        <div className="flex justify-center mb-6">
          <ButtonKwity
            onClick={handleAddBirthday}
            className="shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.8)] bg-[#e8eeeb] hover:bg-[#e8eeeb] text-primary-emerald border-none"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Birthday
          </ButtonKwity>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-emerald" />
            <span className="ml-2 text-primary-emerald">Loading birthdays...</span>
          </div>
        ) : birthdays.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No birthdays added yet.</p>
            <p className="text-gray-500 mt-2">Click "Add Birthday" to get started!</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <CalendarWidget
              birthdays={birthdays}
              onSelectBirthday={handleSelectBirthday}
              onAddBirthday={handleAddBirthday}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <BirthdayDetails
        isOpen={showBirthdayDetails}
        onOpenChange={setShowBirthdayDetails}
        birthdayData={
          selectedBirthday
            ? {
                id: selectedBirthday.id,
                name: selectedBirthday.name,
                date: selectedBirthday.date instanceof Date ? selectedBirthday.date : new Date(selectedBirthday.date),
                relation: selectedBirthday.relation,
                reminderDays: selectedBirthday.reminderDays || 0,
                googleCalendarLinked:
                  selectedBirthday.googleCalendarLinked || false,
                notes: selectedBirthday.notes,
              }
            : undefined
        }
        onEdit={handleEditBirthday}
        onDelete={handleDeleteBirthday}
        onSendMessage={(id) => console.log(`Send message to ${id}`)}
        onCall={(id) => console.log(`Call ${id}`)}
      />

      <AddBirthdayForm
        open={showAddBirthdayForm}
        onOpenChange={setShowAddBirthdayForm}
        onSubmit={handleBirthdaySubmit}
      />

      <BottomTabBar
        activeTab="home"
        onHomeClick={() => navigate("/")}
        onChatClick={() => navigate("/chat")}
        onGoalsClick={() => navigate("/goals")}
        onProfileClick={() => navigate("/profile")}
      />
    </div>
  );
};

export default Home;
