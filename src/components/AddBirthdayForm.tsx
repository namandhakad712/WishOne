import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, PlusCircle, User, Tag, Bell } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  date: z.date({
    required_error: "Birthday date is required.",
  }),
  relation: z.string({
    required_error: "Please select a relation.",
  }),
  reminderDays: z.string().optional(),
  useGoogleCalendar: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface AddBirthdayFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: FormValues) => void;
}

const AddBirthdayForm = ({
  open = true,
  onOpenChange,
  onSubmit,
}: AddBirthdayFormProps) => {
  const [date, setDate] = useState<Date>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      relation: "",
      reminderDays: "7",
      useGoogleCalendar: false,
    },
  });

  const handleSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    if (onSubmit) {
      onSubmit(data);
    }
    // Reset form after submission
    form.reset();
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-purple-700">
            Add New Birthday
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Fill in the details to add a new birthday reminder.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
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
                    >
                      <FormControl>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select relation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="colleague">Colleague</SelectItem>
                        <SelectItem value="partner">Partner</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                      checked={field.value}
                      onCheckedChange={field.onChange}
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
