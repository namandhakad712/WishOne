import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  isSameDay,
  isBefore,
  addDays,
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
  date: Date;
  relation: string;
  hasReminder: boolean;
}

interface CalendarWidgetProps {
  birthdays?: Birthday[];
  onSelectBirthday?: (birthday: Birthday) => void;
  onAddBirthday?: () => void;
}

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
      (birthday) => date && isSameDay(birthday.date, date),
    );
    if (birthdayOnDate) {
      onSelectBirthday(birthdayOnDate);
    }
  };

  // Get upcoming birthdays (next 30 days)
  const upcomingBirthdays = birthdays
    .filter((birthday) => {
      const today = new Date();
      const thirtyDaysLater = addDays(today, 30);
      return (
        isBefore(birthday.date, thirtyDaysLater) &&
        !isBefore(birthday.date, today)
      );
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Function to determine if a date has a birthday
  const hasBirthday = (date: Date | undefined) => {
    if (!date) return false;
    return birthdays.some((birthday) => {
      try {
        return isSameDay(birthday.date, date);
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
      position: "relative",
      backgroundColor: "rgba(147, 51, 234, 0.1)",
      borderRadius: "100%",
    },
  };

  // Create modifiers for days with birthdays
  const modifiers = {
    birthday: (date: Date) => hasBirthday(date),
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
            // Removing custom day component to fix the error
            // Using default day rendering instead
          />
        </div>

        <div className="md:col-span-2">
          <Card className="h-full border-purple-100 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-800 flex justify-between items-center">
                <span>Upcoming Birthdays</span>
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 rounded-full h-8 w-8 p-0"
                  onClick={onAddBirthday}
                >
                  <Plus className="h-4 w-4" />
                </Button>
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
                            {format(birthday.date, "MMMM d")}
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
              <Button
                variant="link"
                className="text-purple-600 hover:text-purple-800"
                onClick={onAddBirthday}
              >
                Add a birthday
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
