import {
  createBirthday,
  updateBirthday,
  deleteBirthday,
  getBirthdays,
  getBirthday,
} from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { format, addDays, isBefore, isAfter } from "date-fns";

export interface BirthdayFormData {
  name: string;
  date: Date;
  relation: string;
  reminderDays: number;
  useGoogleCalendar: boolean;
  notes?: string;
}

export const addBirthday = async (birthdayData: BirthdayFormData) => {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const birthday = {
    user_id: userId,
    name: birthdayData.name,
    date: format(birthdayData.date, "yyyy-MM-dd"),
    relation: birthdayData.relation,
    reminder_days: birthdayData.reminderDays,
    google_calendar_linked: birthdayData.useGoogleCalendar,
    notes: birthdayData.notes || null,
  };

  return await createBirthday(birthday);
};

export const updateBirthdayRecord = async (
  id: string,
  birthdayData: Partial<BirthdayFormData>,
) => {
  const updateData: any = {};

  if (birthdayData.name) updateData.name = birthdayData.name;
  if (birthdayData.date)
    updateData.date = format(birthdayData.date, "yyyy-MM-dd");
  if (birthdayData.relation) updateData.relation = birthdayData.relation;
  if (birthdayData.reminderDays !== undefined)
    updateData.reminder_days = birthdayData.reminderDays;
  if (birthdayData.useGoogleCalendar !== undefined)
    updateData.google_calendar_linked = birthdayData.useGoogleCalendar;
  if (birthdayData.notes !== undefined)
    updateData.notes = birthdayData.notes || null;

  return await updateBirthday(id, updateData);
};

export const removeBirthday = async (id: string) => {
  return await deleteBirthday(id);
};

export const getUserBirthdays = async () => {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const birthdays = await getBirthdays(userId);

  // Convert string dates to Date objects
  return birthdays.map((birthday) => ({
    ...birthday,
    date: new Date(birthday.date),
  }));
};

export const getUpcomingBirthdays = async (days: number = 30) => {
  const allBirthdays = await getUserBirthdays();
  const today = new Date();
  const futureDate = addDays(today, days);

  // Filter birthdays that occur in the next 'days' days
  return allBirthdays
    .filter((birthday) => {
      const thisYearBirthday = new Date(birthday.date);
      thisYearBirthday.setFullYear(today.getFullYear());

      // If the birthday has already passed this year, check for next year
      if (isBefore(thisYearBirthday, today)) {
        thisYearBirthday.setFullYear(today.getFullYear() + 1);
      }

      return (
        isBefore(thisYearBirthday, futureDate) &&
        isAfter(thisYearBirthday, today)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
};

export const getBirthdayDetails = async (id: string) => {
  const birthday = await getBirthday(id);
  return {
    ...birthday,
    date: new Date(birthday.date),
  };
};
