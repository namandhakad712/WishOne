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
    // Try to parse as ISO string first
    const parsedDate = parseISO(date);
    if (!isNaN(parsedDate.getTime())) {
      console.log(`Successfully parsed as ISO date: ${parsedDate}`);
      return parsedDate;
    }
    
    // If that fails, try regular Date constructor
    const dateObj = new Date(date);
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
  birthdays = [
    {
      id: "1",
      name: "Emma Thompson",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
      relation: "Friend",
      hasReminder: true,
    },
    {
      id: "2",
      name: "Michael Chen",
      date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 3),
      relation: "Family",
      hasReminder: true,
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
    },
  ],
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
      backgroundColor: "rgba(147, 51, 234, 0.1)",
      borderRadius: "100%",
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
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-[700px] h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-purple-800">
          Birthday Calendar
        </h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
            className="rounded-full hover:bg-purple-100"
          >
            <ChevronLeft className="h-5 w-5 text-purple-600" />
          </Button>
          <span className="text-lg font-medium text-gray-700 flex items-center">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="rounded-full hover:bg-purple-100"
          >
            <ChevronRight className="h-5 w-5 text-purple-600" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 flex-grow">
        <div className="md:col-span-3 bg-purple-50 rounded-xl p-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            month={currentMonth}
            className="border-none bg-purple-50"
            classNames={{
              day_selected:
                "bg-purple-600 text-white hover:bg-purple-700 hover:text-white",
              day_today: "bg-purple-200 text-purple-900",
            }}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
          />
        </div>

        <div className="md:col-span-2">
          <Card className="h-full border-purple-100 bg-purple-50">
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
