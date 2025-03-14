import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { format } from 'date-fns';
import { Plus, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';

// Components
import CalendarWidget from '@/components/CalendarWidget';
import BirthdayDetails from '@/components/BirthdayDetails';
import AddBirthdayForm from '@/components/AddBirthdayForm';
import EditBirthdayForm from '@/components/EditBirthdayForm';
import UpcomingBirthdays from '@/components/UpcomingBirthdays';
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
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="rounded-full hover:bg-purple-100"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-5 w-5 text-purple-700" />
            </Button>
            <h1 className="text-3xl font-bold text-purple-800 flex items-center gap-2">
              <CalendarIcon className="h-8 w-8" />
              Birthday Calendar
            </h1>
          </div>
          <Button 
            onClick={handleAddBirthday}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Birthday
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading your birthdays...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
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
            <div>
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
      <Dialog open={showBirthdayDetails} onOpenChange={setShowBirthdayDetails}>
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
      <Dialog open={showAddBirthdayForm} onOpenChange={setShowAddBirthdayForm}>
        <AddBirthdayForm
          open={showAddBirthdayForm}
          onOpenChange={setShowAddBirthdayForm}
          onSubmit={handleSubmitBirthday}
        />
      </Dialog>

      {/* Edit Birthday Form Dialog */}
      <Dialog open={showEditBirthdayForm} onOpenChange={setShowEditBirthdayForm}>
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
    </div>
  );
};

export default CalendarPage; 