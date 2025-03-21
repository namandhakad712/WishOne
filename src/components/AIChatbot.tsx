import React, { useState, useRef, useEffect } from "react";
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
  CornerUpLeft,
  X,
  Heart,
  MessageCircle,
  User,
} from "lucide-react";
import { generateResponse, analyzeImage } from "@/lib/gemini";
import { useSupabase } from "@/contexts/SupabaseContext";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  replyTo?: string;
}

interface AIChatbotProps {
  messages?: Message[];
  onSendMessage?: (message: string, replyToId?: string) => void;
  onUploadMedia?: (file: File) => void;
  onReplyTo?: (messageId: string) => void;
  replyingTo?: Message;
}

// Local state to manage messages when parent doesn't provide them
const defaultMessages: Message[] = [
  {
    id: "1",
    content:
      "Hi there! I'm your WishOne companion. I'm here to chat, help with birthdays, or just be a friendly presence. How are you feeling today?",
    sender: "ai",
    timestamp: new Date(Date.now() - 60000),
  },
];

const AIChatbot = ({
  messages = defaultMessages,
  onSendMessage = () => {},
  onUploadMedia = () => {},
  onReplyTo = () => {},
  replyingTo,
}: AIChatbotProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const [isLoading, setIsLoading] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useSupabase();

  // Use props messages if provided, otherwise use local state
  const displayMessages = messages.length > 0 ? messages : localMessages;

  // Get user's avatar URL from metadata
  const userAvatarUrl = user?.user_metadata?.avatar_url;
  
  console.log("User data in AIChatbot:", user);
  console.log("Avatar URL from metadata:", userAvatarUrl);
  
  // If no avatar URL is found, generate one on the fly
  const generateFallbackAvatarUrl = () => {
    if (user?.id) {
      return `https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=${user.id}`;
    }
    return undefined;
  };
  
  const effectiveUserAvatarUrl = userAvatarUrl || generateFallbackAvatarUrl();

  // Cute Avatar Sketch API URL for the chatbot with specific parameters
  // happy, generic-short-hair, mole-on-left-chin, none
  const chatbotAvatarUrl = "https://cute-avatar-sketch.yukilun.com/api/avatar/?facial-expression=happy&hairstyle=generic-short-hair&facial-feature=mole-on-left-chin&accessory=none";

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [displayMessages]);

  const scrollToBottom = () => {
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
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() || imageData) {
      setIsLoading(true);

      // Add user message to local state if not using parent state
      if (messages.length === 0) {
        const userMessage: Message = {
          id: Date.now().toString(),
          content: newMessage,
          sender: "user",
          timestamp: new Date(),
          replyTo: replyingTo?.id,
        };
        setLocalMessages((prev) => [...prev, userMessage]);
      }

      // Call the parent handler
      if (newMessage.trim()) {
        onSendMessage(newMessage, replyingTo?.id);
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

  // Find the message being replied to
  const findReplyMessage = (messageId?: string) => {
    if (!messageId) return null;
    return displayMessages.find(m => m.id === messageId);
  };

  // Format timestamp to a friendly format
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[500px] w-full sm:w-[400px] rounded-xl shadow-lg bg-white/60 backdrop-blur-sm border border-white/40 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/40 bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-t-xl">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white/80 shadow-sm">
            <AvatarImage
              src={chatbotAvatarUrl}
              alt="WishOne"
            />
            <AvatarFallback className="bg-gradient-to-r from-purple-200 to-blue-200 text-purple-700">
              WO
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-bold text-purple-800">WishOne Companion</h2>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <Heart className="h-3 w-3 text-purple-600 fill-purple-600" />
              <span>Your emotional support & birthday reminder</span>
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-white/30" ref={scrollAreaRef}>
        <div className="space-y-4">
          {displayMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex ${message.sender === "user" ? "flex-row-reverse" : "flex-row"} items-end gap-2 max-w-[80%] group`}
              >
                {message.sender === "ai" && (
                  <Avatar className="h-11 w-11 border-2 border-white/80 shadow-sm">
                    <AvatarImage
                      src={chatbotAvatarUrl}
                      alt="AI"
                    />
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      WO
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col">
                  <div 
                    className={`relative rounded-2xl px-4 py-2 text-sm ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-purple-600/90 to-purple-700/90 text-white rounded-br-none shadow-sm"
                        : "bg-white/70 backdrop-blur-sm text-gray-800 rounded-bl-none shadow-sm border border-white/40"
                    }`}
                    onDoubleClick={() => onReplyTo(message.id)}
                  >
                    {/* Reply indicator */}
                    {message.replyTo && (
                      <div className={`text-xs mb-1 pb-1 border-b ${
                        message.sender === "user" ? "border-purple-400" : "border-gray-300"
                      }`}>
                        <span className="flex items-center gap-1">
                          <CornerUpLeft className="h-3 w-3" />
                          <span className="truncate max-w-[180px]">
                            {findReplyMessage(message.replyTo)?.content.substring(0, 20)}
                            {(findReplyMessage(message.replyTo)?.content.length || 0) > 20 ? "..." : ""}
                          </span>
                        </span>
                      </div>
                    )}
                    
                    {message.content}
                    
                    {/* Reply button on hover - fixed positioning */}
                    <button 
                      className={`absolute ${
                        message.sender === "user" ? "right-full mr-2" : "left-full ml-2"
                      } top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity`}
                      onClick={() => onReplyTo(message.id)}
                    >
                      <CornerUpLeft className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 px-2">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                {message.sender === "user" && (
                  <Avatar className="h-11 w-11 border-2 border-white/80 shadow-sm">
                    {effectiveUserAvatarUrl ? (
                      <AvatarImage
                        src={effectiveUserAvatarUrl}
                        alt="User"
                      />
                    ) : (
                      <AvatarFallback className="bg-purple-100">
                        <User className="h-5 w-5 text-purple-600" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Reply indicator */}
      {replyingTo && (
        <div className="px-4 py-2 bg-purple-50/50 border-t border-white/40 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <CornerUpLeft className="h-3 w-3" />
            <span>Replying to: </span>
            <span className="font-medium truncate max-w-[200px]">{replyingTo.content}</span>
          </div>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={() => onReplyTo("")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t border-white/40 bg-white/50 backdrop-blur-sm rounded-b-xl">
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
            placeholder="Share your thoughts..."
            className="min-h-[60px] max-h-[120px] bg-white/70 rounded-xl resize-none border-white/40 focus:border-purple-300 focus:ring-purple-200"
          />
          <div className="flex flex-col gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="p-2 rounded-full bg-white/70 hover:bg-white/90 border border-white/40 transition-colors">
                      <ImageIcon className="h-5 w-5 text-purple-600" />
                    </div>
                  </label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share an image</p>
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
              className="rounded-full bg-purple-600/90 hover:bg-purple-700 shadow-sm"
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
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-purple-600" />
            <span>AI can make mistakes, Do consider double-checking.</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50/50">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span>Features</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Emotional support, birthday wishes, and more</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
