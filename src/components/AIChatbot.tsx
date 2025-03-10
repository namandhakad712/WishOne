import React, { useState, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  ImageIcon,
  SendIcon,
  PlusCircleIcon,
  SmileIcon,
  Loader2,
} from "lucide-react";
import { generateResponse, analyzeImage } from "@/lib/gemini";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AIChatbotProps {
  messages?: Message[];
  onSendMessage?: (message: string) => void;
  onUploadMedia?: (file: File) => void;
}

// Local state to manage messages when parent doesn't provide them
const defaultMessages: Message[] = [
  {
    id: "1",
    content:
      "Hello! I'm your WishOne assistant. I can help you remember birthdays and provide emotional support. How can I help you today?",
    sender: "ai",
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: "2",
    content: "I need to remember my mom's birthday next month.",
    sender: "user",
    timestamp: new Date(Date.now() - 30000),
  },
  {
    id: "3",
    content:
      "I'd be happy to help you remember your mom's birthday! Could you tell me the exact date of her birthday so I can add it to your calendar?",
    sender: "ai",
    timestamp: new Date(),
  },
];

const AIChatbot = ({
  messages = defaultMessages,
  onSendMessage = () => {},
  onUploadMedia = () => {},
}: AIChatbotProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const [isLoading, setIsLoading] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Use props messages if provided, otherwise use local state
  const displayMessages = messages.length > 0 ? messages : localMessages;

  const handleSendMessage = async () => {
    if (newMessage.trim() || imageData) {
      setIsLoading(true);

      // Call the parent handler
      if (newMessage.trim()) {
        onSendMessage(newMessage);
      }

      // If we have an image, handle that separately
      if (imageData) {
        // Convert base64 to file object
        const fetchResponse = await fetch(imageData);
        const blob = await fetchResponse.blob();
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });
        onUploadMedia(file);

        // Clear the image data after sending
        setImageData(null);
      }

      // Clear the input
      setNewMessage("");
      setIsLoading(false);

      // Scroll to bottom after new messages
      setTimeout(() => {
        if (scrollAreaRef.current) {
          const scrollContainer = scrollAreaRef.current.querySelector(
            "[data-radix-scroll-area-viewport]",
          );
          if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
          }
        }
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Call the parent handler
      onUploadMedia(file);

      // Convert the image to base64 for the Gemini API
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        setImageData(base64data);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-[400px] rounded-xl shadow-lg bg-white border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-green-50 rounded-t-xl">
        <h2 className="text-lg font-semibold text-purple-700">AI Companion</h2>
        <p className="text-xs text-gray-500">
          Your emotional support and birthday reminder assistant
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {displayMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex ${message.sender === "user" ? "flex-row-reverse" : "flex-row"} items-end gap-2 max-w-[80%]`}
              >
                {message.sender === "ai" && (
                  <Avatar className="h-8 w-8 border-2 border-green-100">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=wishone"
                      alt="AI"
                    />
                    <AvatarFallback className="bg-green-100 text-green-700">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 text-sm ${
                    message.sender === "user"
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {message.content}
                </div>
                {message.sender === "user" && (
                  <Avatar className="h-8 w-8 border-2 border-purple-100">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                      alt="User"
                    />
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      You
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        {imageData && (
          <div className="mb-2 relative">
            <img
              src={imageData}
              alt="Uploaded image"
              className="h-20 rounded-md object-cover"
            />
            <button
              onClick={() => setImageData(null)}
              className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 rounded-full p-1 text-white"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[60px] max-h-[120px] bg-white rounded-xl resize-none"
          />
          <div className="flex flex-col gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                      <ImageIcon className="h-5 w-5 text-gray-700" />
                    </div>
                  </label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="rounded-full bg-purple-600 hover:bg-purple-700"
              disabled={(!newMessage.trim() && !imageData) || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <SendIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <SmileIcon className="h-4 w-4" />
            <span>Emotionally intelligent responses</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  <PlusCircleIcon className="h-4 w-4 mr-1" />
                  <span>Features</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Media analysis, emotional support, and more</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
