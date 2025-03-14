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
import { cn } from "@/lib/utils";

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

interface AddBirthdayFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: FormValues) => void;
}

const AddBirthdayForm: React.FC<AddBirthdayFormProps> = ({
  open = true,
  onOpenChange,
  onSubmit,
}) => {
  const [addToGoogleCalendar, setAddToGoogleCalendar] = useState(false);

  // Initialize form with React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      relation: "",
      reminderDays: "7",
      useGoogleCalendar: false,
      notes: "",
    },
  });

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
      <DialogContent className="sm:max-w-[500px] bg-white/80 backdrop-blur-md rounded-xl border border-white/40 shadow-lg relative overflow-hidden max-h-[90vh] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {/* Glassmorphic background elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-purple-300/20 blur-2xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-green-300/20 blur-2xl"></div>
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl font-semibold text-purple-700">
            Add New Birthday
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Fill in the details to add a new birthday reminder.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6 relative z-10"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-700">Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-purple-500" />
                      <Input
                        placeholder="Enter name"
                        className="pl-10 bg-white/50 backdrop-blur-sm border-white/40 focus:border-purple-300 focus:ring-purple-300"
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
                  <FormLabel className="text-purple-700">Birthday Date</FormLabel>
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-white/50 backdrop-blur-sm border-white/40 hover:bg-white/60",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-purple-500" />
                            {field.value ? (
                              format(field.value, "MMMM d, yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white/90 backdrop-blur-md border border-white/40" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="rounded-md border-none"
                          classNames={{
                            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                            month: "space-y-4",
                            caption: "flex justify-center pt-1 relative items-center text-purple-900",
                            caption_label: "text-sm font-medium",
                            nav: "space-x-1 flex items-center",
                            nav_button: cn(
                              "h-7 w-7 bg-white/50 backdrop-blur-sm border border-white/40 rounded-full p-0 opacity-80 hover:opacity-100 hover:bg-purple-100 text-purple-600",
                            ),
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
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
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
                    <Tag className="absolute left-3 top-2.5 h-4 w-4 text-purple-500" />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="pl-10 bg-white/50 backdrop-blur-sm border-white/40">
                          <SelectValue placeholder="Select relation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white/90 backdrop-blur-md border border-white/40">
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
                      className="resize-none bg-white/50 backdrop-blur-sm border-white/40 focus:border-purple-300 focus:ring-purple-300"
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
                    <Bell className="absolute left-3 top-2.5 h-4 w-4 text-purple-500" />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="pl-10 bg-white/50 backdrop-blur-sm border-white/40">
                          <SelectValue placeholder="Set reminder days" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white/90 backdrop-blur-md border border-white/40">
                        <SelectItem value="1">1 day before</SelectItem>
                        <SelectItem value="3">3 days before</SelectItem>
                        <SelectItem value="7">1 week before</SelectItem>
                        <SelectItem value="14">2 weeks before</SelectItem>
                        <SelectItem value="30">1 month before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormDescription className="text-xs text-gray-600">
                    When should we remind you about this birthday?
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="useGoogleCalendar"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-purple-700">
                      Google Calendar Integration
                    </FormLabel>
                    <FormDescription className="text-xs text-gray-600">
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

            <DialogFooter className="relative z-10">
              <Button
                type="submit"
                className="bg-purple-600/90 hover:bg-purple-700 backdrop-blur-sm rounded-full px-6"
              >
                Save Birthday
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBirthdayForm;
