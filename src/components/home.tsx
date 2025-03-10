import React, { useState } from "react";
import Header from "./Header";
import CalendarWidget from "./CalendarWidget";
import BirthdayDetails from "./BirthdayDetails";
import AddBirthdayForm from "./AddBirthdayForm";
import BottomTabBar from "./BottomTabBar";
import { ButtonKwity } from "./ui/button-kwity";
import { PlusCircle } from "lucide-react";

interface Birthday {
  id: string;
  name: string;
  date: Date;
  relation: string;
  hasReminder: boolean;
  reminderDays?: number;
  googleCalendarLinked?: boolean;
  notes?: string;
}

const Home = () => {
  const [selectedBirthday, setSelectedBirthday] = useState<Birthday | null>(
    null,
  );
  const [showBirthdayDetails, setShowBirthdayDetails] = useState(false);
  const [showAddBirthdayForm, setShowAddBirthdayForm] = useState(false);

  // Sample birthdays data
  const [birthdays, setBirthdays] = useState<Birthday[]>([
    {
      id: "1",
      name: "Emma Thompson",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
      relation: "Friend",
      hasReminder: true,
      reminderDays: 7,
      googleCalendarLinked: true,
      notes: "Loves chocolate cake and fantasy novels.",
    },
    {
      id: "2",
      name: "Michael Chen",
      date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 3),
      relation: "Family",
      hasReminder: true,
      reminderDays: 3,
      googleCalendarLinked: false,
    },
    {
      id: "3",
      name: "Sophia Rodriguez",
      date: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 5,
      ),
      relation: "Colleague",
      hasReminder: false,
      reminderDays: 1,
      googleCalendarLinked: false,
    },
  ]);

  const handleSelectBirthday = (birthday: Birthday) => {
    setSelectedBirthday(birthday);
    setShowBirthdayDetails(true);
  };

  const handleAddBirthday = () => {
    setShowAddBirthdayForm(true);
  };

  const handleBirthdaySubmit = (data: any) => {
    const newBirthday: Birthday = {
      id: Date.now().toString(),
      name: data.name,
      date: data.date,
      relation: data.relation,
      hasReminder: !!data.reminderDays,
      reminderDays: parseInt(data.reminderDays || "0"),
      googleCalendarLinked: data.useGoogleCalendar,
    };

    setBirthdays([...birthdays, newBirthday]);
    setShowAddBirthdayForm(false);
  };

  const handleDeleteBirthday = (id: string) => {
    setBirthdays(birthdays.filter((birthday) => birthday.id !== id));
    setShowBirthdayDetails(false);
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

        <div className="flex justify-center">
          <CalendarWidget
            birthdays={birthdays}
            onSelectBirthday={handleSelectBirthday}
            onAddBirthday={handleAddBirthday}
          />
        </div>
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
                date: selectedBirthday.date,
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
        onHomeClick={() => {}}
        onChatClick={() => (window.location.href = "/chat")}
        onProfileClick={() => (window.location.href = "/profile")}
      />
    </div>
  );
};

export default Home;
