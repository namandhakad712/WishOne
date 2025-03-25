import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, User, Tag, Bell } from "lucide-react";
import { Switch } from '@/components/ui/switch';
import { cn } from "@/lib/utils";
import { gsap } from "gsap";

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

  // Refs for animations
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

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

  // Initialize animations when the component mounts or dialog opens
  useEffect(() => {
    if (!open || !dialogRef.current) return;
    
    const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    // Animate dialog entrance
    gsap.set(dialogRef.current, { opacity: 0, scale: 0.9, y: 20 });
    timeline.to(dialogRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.4,
      ease: 'back.out(1.7)'
    });
    
    // Animate header
    if (headerRef.current) {
      const headerElements = headerRef.current.querySelectorAll('.text-purple-700, .text-gray-600');
      gsap.set(headerElements, { opacity: 0, y: -15 });
      timeline.to(headerElements, {
        opacity: 1,
        y: 0, 
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out'
      }, 0.2);
    }
    
    // Animate form fields with staggered effect
    if (fieldsRef.current) {
      const formFields = fieldsRef.current.querySelectorAll('div[class*="FormItem"]');
      gsap.set(formFields, { opacity: 0, y: 20 });
      timeline.to(formFields, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out'
      }, 0.3);
    }
    
    // Animate submit button
    if (submitBtnRef.current) {
      gsap.set(submitBtnRef.current, { opacity: 0, scale: 0.8 });
      timeline.to(submitBtnRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(2)'
      }, 0.6);
      
      // Add hover effect to submit button
      submitBtnRef.current.addEventListener('mouseenter', () => {
        gsap.to(submitBtnRef.current, {
          scale: 1.05,
          duration: 0.2,
          ease: 'power1.out'
        });
      });
      
      submitBtnRef.current.addEventListener('mouseleave', () => {
        gsap.to(submitBtnRef.current, {
          scale: 1,
          duration: 0.2,
          ease: 'power1.out'
        });
      });
      
      submitBtnRef.current.addEventListener('mousedown', () => {
        gsap.to(submitBtnRef.current, {
          scale: 0.95,
          duration: 0.1,
          ease: 'power1.in'
        });
      });
      
      submitBtnRef.current.addEventListener('mouseup', () => {
        gsap.to(submitBtnRef.current, {
          scale: 1.05,
          duration: 0.2,
          ease: 'back.out(1.5)'
        });
      });
    }
    
    // Add hover effects to interactive elements
    const setupInteractiveElements = () => {
      // Add animations to buttons, inputs and selects
      const buttons = formRef.current?.querySelectorAll('button:not([type="submit"])');
      const inputs = formRef.current?.querySelectorAll('input, textarea, .select-trigger');
      
      if (buttons) {
        buttons.forEach(button => {
          button.addEventListener('mouseenter', () => {
            gsap.to(button, {
              scale: 1.02,
              duration: 0.2,
              ease: 'power1.out'
            });
          });
          
          button.addEventListener('mouseleave', () => {
            gsap.to(button, {
              scale: 1,
              duration: 0.2,
              ease: 'power1.out'
            });
          });
        });
      }
      
      if (inputs) {
        inputs.forEach(input => {
          input.addEventListener('focus', () => {
            gsap.to(input, {
              boxShadow: '0 0 0 3px rgba(168, 85, 247, 0.15)',
              duration: 0.3
            });
          });
          
          input.addEventListener('blur', () => {
            gsap.to(input, {
              boxShadow: 'none',
              duration: 0.3
            });
          });
        });
      }
    };
    
    // Setup interactive animations with a small delay to ensure DOM is ready
    setTimeout(setupInteractiveElements, 500);
    
    return () => {
      timeline.kill();
    };
  }, [open]);

  // Handle form submission with animation
  const handleFormSubmit = (values: FormValues) => {
    if (dialogRef.current) {
      gsap.to(dialogRef.current, {
        opacity: 0,
        scale: 0.9,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          if (onSubmit) {
            onSubmit(values);
          }
        }
      });
    } else if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="edit-birthday-form sm:max-w-[500px] bg-white/95 rounded-xl border border-white/40 shadow-lg relative overflow-hidden max-h-[90vh] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div ref={dialogRef} className="w-full h-full">
          {/* Glassmorphic background elements - keep blur effects on decorative elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-purple-300/20 blur-2xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-green-300/20 blur-2xl"></div>
          
          <div ref={headerRef}>
            <DialogHeader className="relative z-10">
              <DialogTitle className="text-2xl font-semibold text-purple-700">
                Edit Birthday
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Update the birthday details below.
              </DialogDescription>
            </DialogHeader>
          </div>

          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6 relative z-10"
            >
              <div ref={fieldsRef}>
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
                            className="pl-10 bg-white/80 border-white/40 focus:border-purple-300 focus:ring-purple-300"
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
                                  "w-full pl-3 text-left font-normal bg-white/80 border-white/40 hover:bg-white/90",
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
                          <PopoverContent className="w-auto p-0 bg-white/95 border border-white/40" align="start">
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
                                  "h-7 w-7 bg-white/80 border border-white/40 rounded-full p-0 opacity-80 hover:opacity-100 hover:bg-purple-100 text-purple-600",
                                ),
                                nav_button_previous: "absolute left-1",
                                nav_button_next: "absolute right-1",
                                table: "w-full border-collapse space-y-1",
                                head_row: "flex",
                                head_cell: "text-purple-800 rounded-md w-9 font-medium text-[0.8rem]",
                                row: "flex w-full mt-2",
                                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-purple-100/80 [&:has([aria-selected])]:rounded-full",
                                day: "h-9 w-9 p-0 font-normal rounded-full hover:bg-purple-100/70 aria-selected:opacity-100 transition-all duration-200",
                                day_selected: "bg-purple-600 text-white hover:bg-purple-700 hover:text-white focus:bg-purple-600 focus:text-white",
                                day_today: "bg-purple-200 text-purple-900 font-semibold",
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
                            <SelectTrigger className="pl-10 bg-white/80 border-white/40 select-trigger">
                              <SelectValue placeholder="Select relation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white/95 border border-white/40">
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
                          className="resize-none bg-white/80 border-white/40 focus:border-purple-300 focus:ring-purple-300"
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
                            <SelectTrigger className="pl-10 bg-white/80 border-white/40 select-trigger">
                              <SelectValue placeholder="Set reminder days" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white/95 border border-white/40">
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg bg-white/80 border border-white/40 p-4 shadow-sm">
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
              </div>

              <DialogFooter className="relative z-10">
                <Button
                  ref={submitBtnRef}
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 rounded-full px-6"
                >
                  Update Birthday
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditBirthdayForm; 