import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { format, isToday } from 'date-fns';
import { Plus, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { gsap } from 'gsap';

// Components
import CalendarWidget from '@/components/CalendarWidget';
import BirthdayDetails from '@/components/BirthdayDetails';
import AddBirthdayForm from '@/components/AddBirthdayForm';
import EditBirthdayForm from '@/components/EditBirthdayForm';
import UpcomingBirthdays from '@/components/UpcomingBirthdays';
import BirthdayPartyLauncher from '@/components/BirthdayPartyLauncher';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

// Types
// This interface matches the one in CalendarWidget
interface Birthday {
  id: string;
  name: string;
  date: Date | string;
  relation: string;
  hasReminder: boolean;
}

// This interface represents the data from Supabase
interface BirthdayRecord {
  id: string;
  name: string;
  date: Date | string;
  relation: string;
  reminder_days: number;
  google_calendar_linked: boolean;
  notes?: string;
  user_id: string;
}

const CalendarPage: React.FC = () => {
  const [birthdayRecords, setBirthdayRecords] = useState<BirthdayRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBirthday, setSelectedBirthday] = useState<BirthdayRecord | null>(null);
  const [showBirthdayDetails, setShowBirthdayDetails] = useState(false);
  const [showAddBirthdayForm, setShowAddBirthdayForm] = useState(false);
  const [showEditBirthdayForm, setShowEditBirthdayForm] = useState(false);
  const [birthdayToEdit, setBirthdayToEdit] = useState<BirthdayRecord | null>(null);
  const [todaysBirthday, setTodaysBirthday] = useState<BirthdayRecord | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Refs for animations
  const pageRef = useRef<HTMLDivElement>(null);
  const bgElementsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const upcomingContainerRef = useRef<HTMLDivElement>(null);

  // Initialize animations when the component mounts
  useEffect(() => {
    if (!pageRef.current) return;
    
    const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    // Animate background elements
    if (bgElementsRef.current) {
      const bgElements = bgElementsRef.current.children;
      gsap.set(bgElements, { opacity: 0, scale: 0.8 });
      timeline.to(bgElements, {
        opacity: 0.8,
        scale: 1,
        duration: 1.5,
        stagger: 0.3,
        ease: 'power1.out'
      }, 0);
    }
    
    // Animate header elements
    if (headerRef.current) {
      gsap.set(headerRef.current, { y: -20, opacity: 0 });
      timeline.to(headerRef.current, { 
        y: 0, 
        opacity: 1, 
        duration: 0.6,
        ease: 'back.out(1.7)' 
      }, 0.3);
    }
    
    // Animate title
    if (titleRef.current) {
      gsap.set(titleRef.current, { scale: 0.9, opacity: 0 });
      timeline.to(titleRef.current, { 
        scale: 1, 
        opacity: 1, 
        duration: 0.6,
        ease: 'back.out(1.7)' 
      }, 0.5);
    }
    
    // Animate add button
    if (addButtonRef.current) {
      gsap.set(addButtonRef.current, { scale: 0, opacity: 0 });
      timeline.to(addButtonRef.current, { 
        scale: 1, 
        opacity: 1, 
        duration: 0.5,
        ease: 'back.out(1.7)' 
      }, 0.7);
      
      // Add hover animation for the add button
      addButtonRef.current.addEventListener('mouseenter', () => {
        gsap.to(addButtonRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power1.out'
        });
      });
      
      addButtonRef.current.addEventListener('mouseleave', () => {
        gsap.to(addButtonRef.current, {
          scale: 1,
          duration: 0.3,
          ease: 'power1.out'
        });
      });
    }
    
    // Animate calendar container (conditional on loading state)
    if (!loading && calendarContainerRef.current) {
      gsap.set(calendarContainerRef.current, { y: 30, opacity: 0 });
      timeline.to(calendarContainerRef.current, { 
        y: 0, 
        opacity: 1, 
        duration: 0.7,
        ease: 'power2.out' 
      }, 0.8);
    }
    
    // Animate upcoming birthdays container
    if (!loading && upcomingContainerRef.current) {
      gsap.set(upcomingContainerRef.current, { y: 30, opacity: 0 });
      timeline.to(upcomingContainerRef.current, { 
        y: 0, 
        opacity: 1, 
        duration: 0.7,
        ease: 'power2.out' 
      }, 1.0);
    }
    
    return () => {
      timeline.kill();
    };
  }, [loading]); // Re-run when loading state changes

  // Fetch birthdays from Supabase
  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/');
          return;
        }

        const { data: birthdayData, error: birthdayError } = await supabase
          .from('birthdays')
          .select('*')
          .eq('user_id', session.user.id);

        if (birthdayError) {
          throw birthdayError;
        }

        if (!birthdayData) {
          console.log("No birthdays found");
          setBirthdayRecords([]);
          return;
        }

        // Format the birthday dates
        const formattedBirthdays = birthdayData.map(birthday => ({
          ...birthday,
          date: new Date(birthday.date)
        }));

        console.log("Fetched birthdays:", formattedBirthdays);
        setBirthdayRecords(formattedBirthdays);
        
        // Check if any birthdays are today
        const today = new Date();
        const birthdayToday = formattedBirthdays.find(birthday => {
          const birthDate = new Date(birthday.date);
          return birthDate.getMonth() === today.getMonth() && 
                 birthDate.getDate() === today.getDate();
        });
        
        if (birthdayToday) {
          setTodaysBirthday(birthdayToday);
          // Small delay before showing celebration
          setTimeout(() => setShowCelebration(true), 1000);
        }
        
      } catch (error) {
        console.error('Error fetching birthdays:', error);
        toast({
          title: 'Error',
          description: 'Failed to load birthdays. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBirthdays();
  }, [navigate, toast]);

  // Convert BirthdayRecord to Birthday format for CalendarWidget
  const convertToBirthdayFormat = (records: BirthdayRecord[]): Birthday[] => {
    return records.map(record => ({
      id: record.id,
      name: record.name,
      date: record.date,
      relation: record.relation,
      hasReminder: record.reminder_days > 0
    }));
  };

  // Handle selecting a birthday
  const handleSelectBirthday = (birthday: Birthday) => {
    // Find the full record for the selected birthday
    const record = birthdayRecords.find(r => r.id === birthday.id);
    if (record) {
      setSelectedBirthday(record);
      setShowBirthdayDetails(true);
    }
  };

  // Handle adding a new birthday
  const handleAddBirthday = () => {
    setShowAddBirthdayForm(true);
  };

  // Handle form submission
  const handleSubmitBirthday = async (formData: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      // Format the date for Supabase
      const formattedDate = format(formData.date, 'yyyy-MM-dd');
      
      // Prepare birthday data
      const birthdayData = {
        user_id: session.user.id,
        name: formData.name,
        date: formattedDate,
        relation: formData.relation,
        reminder_days: parseInt(formData.reminderDays),
        google_calendar_linked: formData.useGoogleCalendar,
        notes: formData.notes || null
      };
      
      console.log("Submitting birthday data:", birthdayData);
      
      // Insert the new birthday
      const { data, error } = await supabase
        .from('birthdays')
        .insert(birthdayData)
        .select()
        .single();
        
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      // Add the new birthday to the state
      setBirthdayRecords(prev => [...prev, { ...data, date: new Date(data.date) }]);
      
      // Close the form
      setShowAddBirthdayForm(false);
      
      // Show success toast
      toast({
        title: 'Birthday Added',
        description: `${formData.name}'s birthday has been added to your calendar.`,
      });
    } catch (error) {
      console.error('Error adding birthday:', error);
      toast({
        title: 'Error',
        description: 'Failed to add birthday. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle editing a birthday
  const handleEditBirthday = (id: string) => {
    // Find the birthday to edit
    const birthdayToEdit = birthdayRecords.find(b => b.id === id);
    if (birthdayToEdit) {
      setBirthdayToEdit(birthdayToEdit);
      setShowEditBirthdayForm(true);
    }
    setShowBirthdayDetails(false);
  };

  // Handle updating a birthday
  const handleUpdateBirthday = async (formData: any) => {
    try {
      if (!birthdayToEdit) {
        throw new Error('No birthday selected for editing');
      }

      // Format the date for Supabase
      const formattedDate = format(formData.date, 'yyyy-MM-dd');
      
      // Prepare birthday data
      const birthdayData = {
        name: formData.name,
        date: formattedDate,
        relation: formData.relation,
        reminder_days: parseInt(formData.reminderDays),
        google_calendar_linked: formData.useGoogleCalendar,
        notes: formData.notes || null
      };
      
      console.log("Updating birthday data:", birthdayData);
      
      // Update the birthday in Supabase
      const { data, error } = await supabase
        .from('birthdays')
        .update(birthdayData)
        .eq('id', birthdayToEdit.id)
        .select()
        .single();
        
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      // Update the birthday in the state
      setBirthdayRecords(prev => 
        prev.map(b => b.id === birthdayToEdit.id 
          ? { ...data, date: new Date(data.date) } 
          : b
        )
      );
      
      // Close the form
      setShowEditBirthdayForm(false);
      setBirthdayToEdit(null);
      
      // Show success toast
      toast({
        title: 'Birthday Updated',
        description: `${formData.name}'s birthday has been updated.`,
      });
    } catch (error) {
      console.error('Error updating birthday:', error);
      toast({
        title: 'Error',
        description: 'Failed to update birthday. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle deleting a birthday
  const handleDeleteBirthday = async (id: string) => {
    try {
      const { error } = await supabase
        .from('birthdays')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Remove the deleted birthday from the state
      setBirthdayRecords(prev => prev.filter(b => b.id !== id));
      
      // Close the details dialog
      setShowBirthdayDetails(false);
      
      // Show success toast
      toast({
        title: 'Birthday Deleted',
        description: 'The birthday has been removed from your calendar.',
      });
    } catch (error) {
      console.error('Error deleting birthday:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete birthday. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Calculate age for today's birthday
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    
    // Check if birthday has occurred this year
    if (today.getMonth() < birthDate.getMonth() || 
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-white p-4 md:p-8 relative overflow-hidden">
      {/* Glassmorphic background elements */}
      <div ref={bgElementsRef} className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-64 -right-64 w-[500px] h-[500px] rounded-full bg-purple-300/20 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-300/20 blur-3xl"></div>
        <div className="absolute -bottom-64 -left-64 w-[500px] h-[500px] rounded-full bg-green-300/20 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={headerRef} className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                // Animation before navigation
                gsap.to(pageRef.current, {
                  opacity: 0,
                  y: -20,
                  duration: 0.4,
                  ease: 'power2.in',
                  onComplete: () => navigate('/')
                });
              }}
              className="rounded-full hover:bg-purple-100/50 bg-white/30 backdrop-blur-sm border border-white/40"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-5 w-5 text-purple-700" />
            </Button>
            <h1 ref={titleRef} className="text-3xl font-bold text-purple-800 flex items-center gap-2 px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full border border-white/40">
              <CalendarIcon className="h-8 w-8" />
              Birthday Calendar
            </h1>
          </div>
          <Button 
            ref={addButtonRef}
            onClick={handleAddBirthday}
            className="bg-purple-600/90 hover:bg-purple-700 backdrop-blur-sm rounded-full px-4"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Birthday
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-12 bg-white/30 backdrop-blur-md rounded-xl border border-white/40 shadow-lg">
            <p className="text-gray-500">Loading your birthdays...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div ref={calendarContainerRef} className="lg:col-span-2">
              <CalendarWidget 
                birthdays={birthdayRecords.map(record => ({
                  id: record.id,
                  name: record.name,
                  date: record.date,
                  relation: record.relation,
                  hasReminder: record.reminder_days > 0
                }))}
                onSelectBirthday={(birthday) => {
                  const fullRecord = birthdayRecords.find(r => r.id === birthday.id);
                  if (fullRecord) {
                    setSelectedBirthday(fullRecord);
                    setShowBirthdayDetails(true);
                  }
                }}
                onAddBirthday={handleAddBirthday}
              />
            </div>
            <div ref={upcomingContainerRef}>
              <UpcomingBirthdays 
                birthdays={birthdayRecords} 
                onSelectBirthday={(birthday) => {
                  setSelectedBirthday(birthday as BirthdayRecord);
                  setShowBirthdayDetails(true);
                }}
                onEditBirthday={handleEditBirthday}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Birthday Details Dialog */}
      <Dialog 
        open={showBirthdayDetails} 
        onOpenChange={(open) => {
          if (!open) {
            // Animation before closing
            gsap.to(selectedBirthday ? `.birthday-details-${selectedBirthday.id}` : '.birthday-details', {
              scale: 0.95,
              opacity: 0,
              duration: 0.2,
              onComplete: () => setShowBirthdayDetails(false)
            });
          } else {
            setShowBirthdayDetails(open);
          }
        }}
      >
        {selectedBirthday && (
          <BirthdayDetails
            isOpen={showBirthdayDetails}
            onOpenChange={setShowBirthdayDetails}
            birthdayData={{
              id: selectedBirthday.id,
              name: selectedBirthday.name,
              date: new Date(selectedBirthday.date),
              relation: selectedBirthday.relation,
              reminderDays: selectedBirthday.reminder_days,
              googleCalendarLinked: selectedBirthday.google_calendar_linked,
              notes: selectedBirthday.notes
            }}
            onEdit={handleEditBirthday}
            onDelete={handleDeleteBirthday}
          />
        )}
      </Dialog>
      
      {/* Add Birthday Form Dialog */}
      <Dialog 
        open={showAddBirthdayForm} 
        onOpenChange={(open) => {
          if (!open) {
            // Animation before closing
            gsap.to('.add-birthday-form', {
              scale: 0.95,
              opacity: 0,
              duration: 0.2,
              onComplete: () => setShowAddBirthdayForm(false)
            });
          } else {
            setShowAddBirthdayForm(open);
          }
        }}
      >
        <AddBirthdayForm
          open={showAddBirthdayForm}
          onOpenChange={setShowAddBirthdayForm}
          onSubmit={handleSubmitBirthday}
        />
      </Dialog>

      {/* Edit Birthday Form Dialog */}
      <Dialog 
        open={showEditBirthdayForm} 
        onOpenChange={(open) => {
          if (!open) {
            // Animation before closing
            gsap.to('.edit-birthday-form', {
              scale: 0.95,
              opacity: 0,
              duration: 0.2,
              onComplete: () => setShowEditBirthdayForm(false)
            });
          } else {
            setShowEditBirthdayForm(open);
          }
        }}
      >
        {birthdayToEdit && (
          <EditBirthdayForm
            open={showEditBirthdayForm}
            onOpenChange={setShowEditBirthdayForm}
            onSubmit={handleUpdateBirthday}
            birthdayData={{
              id: birthdayToEdit.id,
              name: birthdayToEdit.name,
              date: new Date(birthdayToEdit.date),
              relation: birthdayToEdit.relation,
              reminderDays: birthdayToEdit.reminder_days,
              googleCalendarLinked: birthdayToEdit.google_calendar_linked,
              notes: birthdayToEdit.notes
            }}
          />
        )}
      </Dialog>
      
      {/* Birthday Celebration */}
      {todaysBirthday && showCelebration && (
        <BirthdayPartyLauncher
          personName={todaysBirthday.name}
          age={calculateAge(todaysBirthday.date)}
          onClose={() => setShowCelebration(false)}
        />
      )}
    </div>
  );
};

export default CalendarPage; 