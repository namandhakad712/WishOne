import React from "react";
import { Calendar, Phone, Edit, Trash2, MessageSquare, X } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface BirthdayDetailsProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  birthdayData?: {
    id: string;
    name: string;
    date: Date;
    relation: string;
    reminderDays: number;
    googleCalendarLinked: boolean;
    notes?: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSendMessage?: (id: string) => void;
  onCall?: (id: string) => void;
}

const BirthdayDetails = ({
  isOpen = true,
  onOpenChange = () => {},
  birthdayData = {
    id: "1",
    name: "Emma Thompson",
    date: new Date(1995, 3, 15),
    relation: "Friend",
    reminderDays: 7,
    googleCalendarLinked: true,
    notes: "Loves chocolate cake and fantasy novels.",
  },
  onEdit = () => {},
  onDelete = () => {},
  onSendMessage = () => {},
  onCall = () => {},
}: BirthdayDetailsProps) => {
  const handleEdit = () => {
    onEdit(birthdayData.id);
  };

  const handleDelete = () => {
    onDelete(birthdayData.id);
  };

  const handleSendMessage = () => {
    onSendMessage(birthdayData.id);
  };

  const handleCall = () => {
    onCall(birthdayData.id);
  };

  const formattedDate = format(birthdayData.date, "MMMM do, yyyy");
  const age = new Date().getFullYear() - birthdayData.date.getFullYear();
  const nextBirthday = new Date(birthdayData.date);
  nextBirthday.setFullYear(new Date().getFullYear());
  if (nextBirthday < new Date()) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  }
  const daysUntilBirthday = Math.ceil(
    (nextBirthday.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/80 backdrop-blur-md rounded-xl border border-white/40 shadow-lg max-w-md w-full relative overflow-hidden max-h-[90vh] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {/* Glassmorphic background elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-purple-300/20 blur-2xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-green-300/20 blur-2xl"></div>
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl font-semibold text-purple-700">
            {birthdayData.name}
          </DialogTitle>
          <div className="flex items-center text-gray-600 mt-1">
            <Calendar className="h-4 w-4 mr-2 text-purple-500" />
            <span>{formattedDate}</span>
          </div>
        </DialogHeader>

        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg my-4 border border-white/40 shadow-sm relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Current Age</p>
              <p className="text-xl font-bold text-purple-800">{age} years</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Birthday</p>
              <p className="text-xl font-bold text-purple-800">
                {daysUntilBirthday} days
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <div className="flex items-center p-2 bg-white/40 backdrop-blur-sm rounded-lg border border-white/40">
            <span className="text-sm font-medium w-32 text-gray-600">
              Relation:
            </span>
            <span className="text-sm text-gray-800">
              {birthdayData.relation}
            </span>
          </div>
          <div className="flex items-center p-2 bg-white/40 backdrop-blur-sm rounded-lg border border-white/40">
            <span className="text-sm font-medium w-32 text-gray-600">
              Reminder:
            </span>
            <span className="text-sm text-gray-800">
              {birthdayData.reminderDays} days before
            </span>
          </div>
          <div className="flex items-center p-2 bg-white/40 backdrop-blur-sm rounded-lg border border-white/40">
            <span className="text-sm font-medium w-32 text-gray-600">
              Google Calendar:
            </span>
            <span className="text-sm text-gray-800">
              {birthdayData.googleCalendarLinked ? "Linked" : "Not linked"}
            </span>
          </div>
          {birthdayData.notes && (
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-600">Notes:</span>
              <p className="text-sm text-gray-800 mt-1 p-3 bg-white/40 backdrop-blur-sm rounded-lg border border-white/40">
                {birthdayData.notes}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-row justify-between items-center gap-2 mt-6 relative z-10">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCall}
              className="rounded-full bg-white/50 backdrop-blur-sm border-white/40 hover:bg-purple-100/50"
            >
              <Phone className="h-4 w-4 mr-2 text-purple-600" />
              Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendMessage}
              className="rounded-full bg-white/50 backdrop-blur-sm border-white/40 hover:bg-purple-100/50"
            >
              <MessageSquare className="h-4 w-4 mr-2 text-purple-600" />
              Message
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="rounded-full bg-white/50 backdrop-blur-sm border-white/40 hover:bg-purple-100/50"
            >
              <Edit className="h-4 w-4 mr-2 text-purple-600" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="rounded-full bg-white/50 backdrop-blur-sm border-white/40 hover:bg-red-100/50 text-red-600 border-red-200/40"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BirthdayDetails;
