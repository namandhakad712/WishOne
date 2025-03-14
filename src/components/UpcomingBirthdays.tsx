import React, { useEffect } from 'react';
import { format, addDays, isBefore, isAfter } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Calendar, Bell, ExternalLink, Edit, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Birthday {
  id: string;
  name: string;
  date: Date | string;
  relation: string;
  reminder_days?: number;
  google_calendar_linked?: boolean;
  notes?: string;
}

interface UpcomingBirthdaysProps {
  birthdays: Birthday[];
  onSelectBirthday?: (birthday: Birthday) => void;
  onEditBirthday?: (id: string) => void;
  daysAhead?: number;
}

const UpcomingBirthdays: React.FC<UpcomingBirthdaysProps> = ({
  birthdays = [],
  onSelectBirthday = () => {},
  onEditBirthday,
  daysAhead = 30
}) => {
  // Add debugging effect to log birthdays
  useEffect(() => {
    console.log("UpcomingBirthdays received:", birthdays);
  }, [birthdays]);

  // Helper function to ensure we're working with Date objects
  const ensureDate = (date: Date | string): Date => {
    if (typeof date === 'string') {
      return new Date(date);
    }
    return date;
  };

  // Helper function to check if a birthday is upcoming or in current month
  const isUpcomingBirthday = (birthdayDate: Date): boolean => {
    const today = new Date();
    const threeMonthsFromNow = addDays(today, 90); // approximately 3 months
    
    // Create a copy of the birthday date with the current year
    const thisYearBirthday = new Date(today.getFullYear(), birthdayDate.getMonth(), birthdayDate.getDate());
    
    // If the birthday has already passed this year and it's not in the current month,
    // check for next year's date
    if (isBefore(thisYearBirthday, today) && thisYearBirthday.getMonth() !== today.getMonth()) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    // Debug log
    console.log(`Checking birthday: ${format(birthdayDate, 'yyyy-MM-dd')}`);
    console.log(`This year's date: ${format(thisYearBirthday, 'yyyy-MM-dd')}`);
    console.log(`Today: ${format(today, 'yyyy-MM-dd')}, End date: ${format(threeMonthsFromNow, 'yyyy-MM-dd')}`);
    
    // Check if:
    // 1. The birthday is in the current month (regardless of whether it has passed)
    // 2. OR if it falls within the next 3 months
    const isInCurrentMonth = thisYearBirthday.getMonth() === today.getMonth();
    const isInNext3Months = !isBefore(thisYearBirthday, today) && !isAfter(thisYearBirthday, threeMonthsFromNow);
    
    const shouldShow = isInCurrentMonth || isInNext3Months;
    console.log(`Is in current month: ${isInCurrentMonth}, Is in next 3 months: ${isInNext3Months}`);
    console.log(`Should show: ${shouldShow}`);
    
    return shouldShow;
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

  // Get upcoming birthdays
  const upcomingBirthdays = birthdays
    .filter(birthday => {
      try {
        const birthdayDate = ensureDate(birthday.date);
        return isUpcomingBirthday(birthdayDate);
      } catch (error) {
        console.error("Error filtering birthday:", birthday, error);
        return false;
      }
    })
    .sort((a, b) => {
      try {
        const dateA = ensureDate(a.date);
        const dateB = ensureDate(b.date);
        const today = new Date();
        
        // Create this year's versions of the birthdays
        const thisYearA = new Date(today.getFullYear(), dateA.getMonth(), dateA.getDate());
        const thisYearB = new Date(today.getFullYear(), dateB.getMonth(), dateB.getDate());
        
        // If the birthday has already passed this year and it's not in the current month,
        // use next year's date
        if (isBefore(thisYearA, today) && thisYearA.getMonth() !== today.getMonth()) {
          thisYearA.setFullYear(today.getFullYear() + 1);
        }
        if (isBefore(thisYearB, today) && thisYearB.getMonth() !== today.getMonth()) {
          thisYearB.setFullYear(today.getFullYear() + 1);
        }
        
        // Sort by date
        return thisYearA.getTime() - thisYearB.getTime();
      } catch (error) {
        console.error("Error sorting birthdays:", error);
        return 0;
      }
    });
  
  // Group birthdays by month
  const groupedBirthdays = upcomingBirthdays.reduce((groups, birthday) => {
    const date = ensureDate(birthday.date);
    const today = new Date();
    const thisYearDate = new Date(today.getFullYear(), date.getMonth(), date.getDate());
    
    // If the birthday has already passed this year and it's not in the current month,
    // use next year's date
    if (isBefore(thisYearDate, today) && thisYearDate.getMonth() !== today.getMonth()) {
      thisYearDate.setFullYear(today.getFullYear() + 1);
    }
    
    const monthKey = format(thisYearDate, 'yyyy-MM');
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(birthday);
    return groups;
  }, {} as Record<string, Birthday[]>);

  // Sort the months chronologically
  const sortedMonths = Object.keys(groupedBirthdays).sort();

  // Debug log the filtered birthdays
  useEffect(() => {
    console.log("Filtered upcoming birthdays:", upcomingBirthdays);
  }, [upcomingBirthdays]);

  return (
    <Card className="w-full border-white/40 bg-white/30 backdrop-blur-md shadow-lg relative overflow-hidden">
      {/* Glassmorphic background elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-purple-300/20 blur-2xl"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-green-300/20 blur-2xl"></div>
      
      <CardHeader className="bg-white/40 backdrop-blur-sm rounded-t-lg border-b border-white/40 relative z-10">
        <CardTitle className="text-purple-800 flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Upcoming Birthdays
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 relative z-10">
        {upcomingBirthdays.length > 0 ? (
          <div className="space-y-6">
            {sortedMonths.map(monthKey => (
              <div key={monthKey} className="space-y-3">
                <h3 className="font-medium text-purple-800 mb-2 px-3 py-1 bg-white/50 backdrop-blur-sm rounded-full inline-block border border-white/40">
                  {format(new Date(monthKey), 'MMMM yyyy')}
                </h3>
                {groupedBirthdays[monthKey].map((birthday) => (
                  <div
                    key={birthday.id}
                    className="p-3 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-shadow border border-white/40"
                  >
                    <div className="flex justify-between items-start">
                      <div className="cursor-pointer" onClick={() => onSelectBirthday(birthday)}>
                        <h3 className="font-medium text-gray-800">
                          {birthday.name}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatBirthdayDate(birthday.date)}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge
                            variant="secondary"
                            className="bg-purple-100/70 text-purple-700 hover:bg-purple-200/70 backdrop-blur-sm"
                          >
                            {birthday.relation}
                          </Badge>
                          
                          {birthday.reminder_days && birthday.reminder_days > 0 && (
                            <Badge
                              variant="outline"
                              className="text-blue-600 border-blue-200/70 bg-blue-50/50 backdrop-blur-sm"
                            >
                              <Bell className="h-3 w-3 mr-1" />
                              Reminder
                            </Badge>
                          )}
                          
                          {birthday.google_calendar_linked && (
                            <Badge
                              variant="outline"
                              className="text-green-600 border-green-200/70 bg-green-50/50 backdrop-blur-sm"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Google
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-purple-100/50 bg-white/50 backdrop-blur-sm"
                          onClick={() => onSelectBirthday(birthday)}
                          aria-label="View details"
                        >
                          <Info className="h-4 w-4 text-purple-600" />
                        </Button>
                        {onEditBirthday && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-purple-100/50 bg-white/50 backdrop-blur-sm"
                            onClick={() => onEditBirthday(birthday.id)}
                            aria-label="Edit birthday"
                          >
                            <Edit className="h-4 w-4 text-purple-600" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No upcoming birthdays found.</p>
            <p className="text-sm text-gray-400 mt-2">Add birthdays to see them here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingBirthdays; 