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
      <DialogContent className="bg-white rounded-xl border-none shadow-lg max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-purple-700">
            {birthdayData.name}
          </DialogTitle>
          <div className="flex items-center text-gray-600 mt-1">
            <Calendar className="h-4 w-4 mr-2 text-purple-500" />
            <span>{formattedDate}</span>
          </div>
        </DialogHeader>

        <div className="bg-purple-50 p-4 rounded-lg my-4">
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

        <div className="space-y-3">
          <div className="flex items-center">
            <span className="text-sm font-medium w-32 text-gray-600">
              Relation:
            </span>
            <span className="text-sm text-gray-800">
              {birthdayData.relation}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium w-32 text-gray-600">
              Reminder:
            </span>
            <span className="text-sm text-gray-800">
              {birthdayData.reminderDays} days before
            </span>
          </div>
          <div className="flex items-center">
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
              <p className="text-sm text-gray-800 mt-1 p-3 bg-gray-50 rounded-md">
                {birthdayData.notes}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-row justify-between items-center gap-2 mt-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-green-300 text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={handleSendMessage}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Message
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleCall}
            >
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BirthdayDetails;
