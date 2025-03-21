import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  isSameDay,
  isBefore,
  addDays,
  parseISO,
  getMonth,
  getDate,
  setMonth,
  setDate,
  isAfter,
  isSameMonth,
} from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Phone,
  MessageSquare,
  Edit,
  Trash2,
} from "lucide-react";

interface Birthday {
  id: string;
  name: string;
  date: Date | string;
  relation: string;
  hasReminder: boolean;
}

interface CalendarWidgetProps {
  birthdays?: Birthday[];
  onSelectBirthday?: (birthday: Birthday) => void;
  onAddBirthday?: () => void;
}

// Helper function to ensure we're working with Date objects
const ensureDate = (date: Date | string): Date => {
  console.log(`ensureDate called with:`, date, `type: ${typeof date}`);
  
  if (date instanceof Date) {
    if (isNaN(date.getTime())) {
      console.error("Invalid Date object received:", date);
      return new Date(); // Return current date as fallback
    }
    return date;
  }
  
  try {
    // Handle YYYY-MM-DD format (which is how dates are stored in the database)
    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      console.log(`Parsing date in YYYY-MM-DD format: ${date}`);
      const [year, month, day] = date.split('-').map(Number);
      // Note: month is 0-indexed in JavaScript Date
      const parsedDate = new Date(year, month - 1, day);
      
      if (!isNaN(parsedDate.getTime())) {
        console.log(`Successfully parsed YYYY-MM-DD date: ${parsedDate}`);
        return parsedDate;
      }
    }
    
    // Try to parse as ISO string
    const parsedDate = parseISO(String(date));
    if (!isNaN(parsedDate.getTime())) {
      console.log(`Successfully parsed as ISO date: ${parsedDate}`);
      return parsedDate;
    }
    
    // If that fails, try regular Date constructor
    const dateObj = new Date(String(date));
    if (!isNaN(dateObj.getTime())) {
      console.log(`Successfully created date with constructor: ${dateObj}`);
      return dateObj;
    }
    
    // If all parsing fails
    console.error("Failed to parse date:", date);
    return new Date(); // Return current date as fallback
  } catch (error) {
    console.error("Error parsing date:", error, date);
    return new Date(); // Fallback to current date
  }
};

// Helper function to check if a birthday is upcoming in the next N days
const isUpcomingBirthday = (birthdayDate: Date, daysAhead: number = 30): boolean => {
  const today = new Date();
  const endDate = addDays(today, daysAhead);
  
  // Create a copy of the birthday date with the current year
  const thisYearBirthday = new Date(today.getFullYear(), birthdayDate.getMonth(), birthdayDate.getDate());
  
  console.log(`Checking if birthday is upcoming: ${format(birthdayDate, "yyyy-MM-dd")}`);
  console.log(`Original date: ${birthdayDate}, This year's date: ${thisYearBirthday}`);
  
  // If the birthday has already passed this year, check for next year
  if (isBefore(thisYearBirthday, today)) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1);
    console.log(`Birthday already passed this year, using next year's date: ${thisYearBirthday}`);
  }
  
  // Check if the birthday falls within our range
  const isUpcoming = !isBefore(thisYearBirthday, today) && !isAfter(thisYearBirthday, endDate);
  console.log(`Is upcoming: ${isUpcoming}, Today: ${today}, End date: ${endDate}`);
  
  return isUpcoming;
};

const CalendarWidget = ({
  birthdays = [],
  onSelectBirthday = () => {},
  onAddBirthday = () => {},
}: CalendarWidgetProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  const handlePreviousMonth = () => {
    setCurrentMonth((prevMonth) => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    const birthdayOnDate = birthdays.find(
      (birthday) => date && isSameDay(ensureDate(birthday.date), date),
    );
    if (birthdayOnDate) {
      onSelectBirthday(birthdayOnDate);
    }
  };

  // Get upcoming birthdays (next 30 days)
  const upcomingBirthdays = birthdays
    .filter((birthday) => {
      const birthdayDate = ensureDate(birthday.date);
      return isUpcomingBirthday(birthdayDate, 30);
    })
    .sort((a, b) => {
      const dateA = ensureDate(a.date);
      const dateB = ensureDate(b.date);
      
      // Create this year's versions of the birthdays for comparison
      const today = new Date();
      const thisYearA = new Date(today.getFullYear(), dateA.getMonth(), dateA.getDate());
      const thisYearB = new Date(today.getFullYear(), dateB.getMonth(), dateB.getDate());
      
      // If the birthday has already passed this year, use next year's date
      if (isBefore(thisYearA, today)) thisYearA.setFullYear(today.getFullYear() + 1);
      if (isBefore(thisYearB, today)) thisYearB.setFullYear(today.getFullYear() + 1);
      
      return thisYearA.getTime() - thisYearB.getTime();
    });

  // Function to determine if a date has a birthday
  const hasBirthday = (date: Date | undefined) => {
    if (!date) return false;
    return birthdays.some((birthday) => {
      try {
        const birthdayDate = ensureDate(birthday.date);
        return (
          date.getDate() === birthdayDate.getDate() && 
          date.getMonth() === birthdayDate.getMonth()
        );
      } catch (error) {
        console.error("Error comparing dates:", error);
        return false;
      }
    });
  };

  // Modified approach - we'll use modifiers instead of custom day rendering
  const modifiersStyles = {
    birthday: {
      color: "#6b21a8",
      fontWeight: "bold",
      position: "relative" as const,
      backgroundColor: "rgba(147, 51, 234, 0.2)",
      borderRadius: "80%",
      boxShadow: "0 0 0 2px rgba(147, 51, 234, 0.3)",
    },
  };

  // Create modifiers for days with birthdays
  const modifiers = {
    birthday: (date: Date) => hasBirthday(date),
  };

  // Helper function to format the birthday date for display
  const formatBirthdayDate = (date: Date | string): string => {
    const birthdayDate = ensureDate(date);
    const today = new Date();
    const thisYearBirthday = new Date(today.getFullYear(), birthdayDate.getMonth(), birthdayDate.getDate());
    
    // If the birthday has already passed this year, show next year's date
    if (isBefore(thisYearBirthday, today)) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    // Calculate days until birthday
    const daysUntil = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil === 0) {
      return "Today!";
    } else if (daysUntil === 1) {
      return "Tomorrow!";
    } else {
      return `${format(birthdayDate, "MMMM d")} (in ${daysUntil} days)`;
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg p-6 w-full max-w-[700px] h-auto flex flex-col border border-white/40 relative overflow-hidden">
      {/* Glassmorphic background elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-purple-300/20 blur-2xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-green-300/20 blur-2xl"></div>
      
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h2 className="text-2xl font-semibold text-purple-800">
          Birthday Calendar
        </h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
            className="rounded-full hover:bg-purple-100 border-white/40 bg-white/50 backdrop-blur-sm"
          >
            <ChevronLeft className="h-5 w-5 text-purple-600" />
          </Button>
          <span className="text-lg font-medium text-gray-700 flex items-center px-3 py-1 bg-white/50 backdrop-blur-sm rounded-full border border-white/40">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="rounded-full hover:bg-purple-100 border-white/40 bg-white/50 backdrop-blur-sm"
          >
            <ChevronRight className="h-5 w-5 text-purple-600" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 flex-1 relative z-10">
        <div className="md:col-span-3 bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-sm">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            month={currentMonth}
            className="border-none bg-transparent"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium text-purple-800",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-white/50 backdrop-blur-sm border border-white/40 rounded-full p-0 opacity-80 hover:opacity-100 hover:bg-purple-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-purple-800 rounded-md w-9 font-medium text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-purple-100/50 [&:has([aria-selected])]:backdrop-blur-sm [&:has([aria-selected])]:rounded-full",
              day: "h-9 w-9 p-0 font-normal rounded-full hover:bg-purple-100/50 aria-selected:opacity-100 transition-all duration-200",
              day_selected: "bg-purple-600/90 text-white hover:bg-purple-700 hover:text-white focus:bg-purple-600 focus:text-white",
              day_today: "bg-purple-200/70 text-purple-900 font-semibold",
              day_outside: "text-gray-400 opacity-50",
              day_disabled: "text-gray-300 opacity-50",
              day_hidden: "invisible",
            }}
            modifiers={modifiers}
            modifiersStyles={{
              birthday: {
                color: "#6b21a8",
                fontWeight: "bold",
                position: "relative" as const,
                backgroundColor: "rgba(147, 51, 234, 0.2)",
                borderRadius: "100%",
                boxShadow: "0 0 0 2px rgba(147, 51, 234, 0.3)",
              },
            }}
          />
        </div>

        <div className="md:col-span-2">
          <Card className="h-full border-white/40 bg-white/40 backdrop-blur-sm shadow-sm">
            <CardHeader>
              <CardTitle className="text-purple-800 flex justify-between items-center">
                <span>Upcoming Birthdays</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto max-h-[300px]">
              {upcomingBirthdays.length > 0 ? (
                <div className="space-y-3">
                  {upcomingBirthdays.map((birthday) => (
                    <div
                      key={birthday.id}
                      className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onSelectBirthday(birthday)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {birthday.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatBirthdayDate(birthday.date)}
                          </p>
                          <Badge
                            variant="secondary"
                            className="mt-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                          >
                            {birthday.relation}
                          </Badge>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No upcoming birthdays</p>
                  <p className="text-sm mt-1">
                    Add some birthdays to see them here
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t border-purple-100 pt-3">
              {/* Removed Add Birthday button from footer */}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
