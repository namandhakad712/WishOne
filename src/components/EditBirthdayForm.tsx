import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, User, Tag, Bell } from "lucide-react";
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  date: z.date({
    required_error: "Birthday date is required.",
  }),
  relation: z.string({
    required_error: "Please select a relation.",
  }),
  reminderDays: z.string().default("7"),
  useGoogleCalendar: z.boolean().default(false),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditBirthdayFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: FormValues) => void;
  birthdayData?: {
    id: string;
    name: string;
    date: Date;
    relation: string;
    reminderDays: number;
    googleCalendarLinked: boolean;
    notes?: string;
  };
}

const EditBirthdayForm: React.FC<EditBirthdayFormProps> = ({
  open = true,
  onOpenChange,
  onSubmit,
  birthdayData,
}) => {
  const [addToGoogleCalendar, setAddToGoogleCalendar] = useState(birthdayData?.googleCalendarLinked || false);

  // Initialize form with React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: birthdayData?.name || "",
      date: birthdayData?.date || new Date(),
      relation: birthdayData?.relation || "",
      reminderDays: birthdayData?.reminderDays?.toString() || "7",
      useGoogleCalendar: birthdayData?.googleCalendarLinked || false,
      notes: birthdayData?.notes || "",
    },
  });

  // Update form values when birthdayData changes
  useEffect(() => {
    if (birthdayData) {
      form.reset({
        name: birthdayData.name,
        date: birthdayData.date,
        relation: birthdayData.relation,
        reminderDays: birthdayData.reminderDays.toString(),
        useGoogleCalendar: birthdayData.googleCalendarLinked,
        notes: birthdayData.notes || "",
      });
      setAddToGoogleCalendar(birthdayData.googleCalendarLinked);
    }
  }, [birthdayData, form]);

  // Update the useGoogleCalendar field when the switch changes
  useEffect(() => {
    form.setValue("useGoogleCalendar", addToGoogleCalendar);
  }, [addToGoogleCalendar, form]);

  // Handle form submission
  const handleFormSubmit = (values: FormValues) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-purple-700">
            Edit Birthday
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Update the birthday details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-700">Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Enter name"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-purple-700">
                    Birthday Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={"w-full pl-3 text-left font-normal"}
                          type="button"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-gray-400">Select a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-700">Relation</FormLabel>
                  <div className="relative">
                    <Tag className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select relation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Friend">Friend</SelectItem>
                        <SelectItem value="Colleague">Colleague</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-700">Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about this birthday"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reminderDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-700">Reminder</FormLabel>
                  <div className="relative">
                    <Bell className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Set reminder days" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 day before</SelectItem>
                        <SelectItem value="3">3 days before</SelectItem>
                        <SelectItem value="7">1 week before</SelectItem>
                        <SelectItem value="14">2 weeks before</SelectItem>
                        <SelectItem value="30">1 month before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormDescription className="text-xs text-gray-500">
                    When should we remind you about this birthday?
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="useGoogleCalendar"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-purple-700">
                      Google Calendar Integration
                    </FormLabel>
                    <FormDescription className="text-xs text-gray-500">
                      Add this birthday to your Google Calendar
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={addToGoogleCalendar}
                      onCheckedChange={(checked) => {
                        setAddToGoogleCalendar(checked);
                        field.onChange(checked);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                className="bg-purple-500 hover:bg-purple-600"
              >
                Update Birthday
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBirthdayForm; 