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
  Pencil,
  Check,
  CheckCheck,
  ChevronDown,
  Menu,
  Settings,
  History,
  Clock,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateResponse, analyzeImage } from "@/lib/gemini";
import { useSupabase } from "@/contexts/SupabaseContext";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  replyTo?: string;
  status: "sent" | "delivered" | "read";
  isEditing?: boolean;
  editedAt?: Date;
  personality?: "formal" | "casual" | "friendly" | "professional";
}

interface AIChatbotProps {
  messages?: Message[];
  onSendMessage?: (message: string, replyToId?: string) => void;
  onUploadMedia?: (file: File) => void;
  onReplyTo?: (messageId: string) => void;
  replyingTo?: Message;
  onPersonalityChange?: (personality: "formal" | "casual" | "friendly" | "professional") => void;
  currentPersonality?: "formal" | "casual" | "friendly" | "professional";
  onClearHistory?: () => void;
}

// Local state to manage messages when parent doesn't provide them
const defaultMessages: Message[] = [
  {
    id: "1",
    content:
      "Hi there! I'm your WishOne companion. I'm here to chat, help with birthdays, or just be a friendly presence. How are you feeling today?",
    sender: "ai",
    timestamp: new Date(Date.now() - 60000),
    status: "read",
    personality: "friendly",
  },
];

const AIChatbot = ({
  messages = defaultMessages,
  onSendMessage = () => {},
  onUploadMedia = () => {},
  onReplyTo = () => {},
  replyingTo,
  onPersonalityChange = () => {},
  currentPersonality = "friendly",
  onClearHistory = () => {},
}: AIChatbotProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const [isLoading, setIsLoading] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [aiPersonality, setAiPersonality] = useState<"formal" | "casual" | "friendly" | "professional">("friendly");
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useSupabase();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ date: string; messages: Message[] }[]>([]);

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

  // Track scroll position
  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector("[data-radix-scroll-area-viewport]");
    if (scrollContainer) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButton(!isNearBottom);
      };
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Auto scroll to bottom for new messages
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Generate smart suggestions based on context
  useEffect(() => {
    if (messages.length > 0) {
      generateSmartSuggestions();
    }
  }, [messages, aiPersonality]);

  const generateSmartSuggestions = () => {
    const lastMessages = messages.slice(-3);
    const context = lastMessages.map(m => m.content).join(" ");
    
    // Simple suggestion generation based on context
    const suggestions: string[] = [];
    if (context.toLowerCase().includes("birthday")) {
      suggestions.push("Would you like me to help write a birthday message?");
      suggestions.push("Shall we plan a birthday celebration?");
    }
    if (context.toLowerCase().includes("feel")) {
      suggestions.push("Tell me more about how you're feeling");
      suggestions.push("Would you like to talk about it?");
    }
    if (context.toLowerCase().includes("help")) {
      suggestions.push("I'm here to help! What do you need?");
      suggestions.push("Let me know what I can do for you");
    }
    
    setSmartSuggestions(suggestions);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [displayMessages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() || imageData) {
      setIsLoading(true);
      setIsTyping(true);

      // If editing a message
      if (editingMessageId) {
        setLocalMessages((prev: Message[]) =>
          prev.map((msg) =>
            msg.id === editingMessageId
              ? {
                  ...msg,
                  content: newMessage,
                  editedAt: new Date(),
                  isEditing: false,
                }
              : msg
          )
        );
        setEditingMessageId(null);
        setNewMessage("");
        setIsLoading(false);
        setIsTyping(false);
        return;
      }

      // Add user message to local state if not using parent state
      if (messages.length === 0) {
        const userMessage: Message = {
          id: Date.now().toString(),
          content: newMessage,
          sender: "user",
          timestamp: new Date(),
          replyTo: replyingTo?.id,
          status: "sent",
        };
        setLocalMessages((prev) => [...prev, userMessage]);
      }

      // Call the parent handler
      if (newMessage.trim()) {
        onSendMessage(newMessage, replyingTo?.id);
      }

      // Handle image upload
      if (imageData) {
        const fetchResponse = await fetch(imageData);
        const blob = await fetchResponse.blob();
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });
        onUploadMedia(file);
        setImageData(null);
      }

      // Clear the input and reset states
      setNewMessage("");
      setIsLoading(false);
      setIsTyping(false);

      // Update message status after a delay
      setTimeout(() => {
        setLocalMessages((prev) =>
          prev.map((msg) =>
            msg.sender === "user" && msg.status === "sent"
              ? { ...msg, status: "delivered" }
              : msg
          )
        );
      }, 1000);

      setTimeout(() => {
        setLocalMessages((prev) =>
          prev.map((msg) =>
            msg.sender === "user" && msg.status === "delivered"
              ? { ...msg, status: "read" }
              : msg
          )
        );
      }, 2000);
    }
  };

  const handleEditMessage = (messageId: string) => {
    const messageToEdit = messages.find((msg) => msg.id === messageId);
    if (messageToEdit && messageToEdit.sender === "user") {
      setEditingMessageId(messageId);
      setNewMessage(messageToEdit.content);
      setLocalMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isEditing: true } : msg
        )
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setNewMessage("");
    setLocalMessages((prev) =>
      prev.map((msg) =>
        msg.id === editingMessageId ? { ...msg, isEditing: false } : msg
      )
    );
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

  // Group messages by date for history
  useEffect(() => {
    const groupedMessages = messages.reduce((acc, message) => {
      const date = message.timestamp.toLocaleDateString();
      const existingGroup = acc.find(group => group.date === date);
      if (existingGroup) {
        existingGroup.messages.push(message);
      } else {
        acc.push({ date, messages: [message] });
      }
      return acc;
    }, [] as { date: string; messages: Message[] }[]);
    
    setChatHistory(groupedMessages);
  }, [messages]);

  return (
    <div className="flex h-[600px] w-full sm:w-[500px] rounded-xl shadow-lg bg-white/60 backdrop-blur-sm border border-white/40 overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-[300px] h-full bg-white/80 backdrop-blur-md border-r border-white/40 flex flex-col"
          >
            <div className="p-4 border-b border-white/40">
              <h2 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </h2>
            </div>

            {/* Personality Selector */}
            <div className="p-4 border-b border-white/40">
              <h3 className="text-sm font-medium text-gray-700 mb-2">AI Personality</h3>
              <select
                value={currentPersonality}
                onChange={(e) => {
                  setAiPersonality(e.target.value as any);
                  onPersonalityChange(e.target.value as any);
                }}
                className="w-full bg-white/70 border border-white/40 rounded-md px-3 py-2 text-sm"
              >
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="professional">Professional</option>
              </select>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-hidden">
              <div className="p-4 border-b border-white/40">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Chat History
                </h3>
              </div>
              <ScrollArea className="h-full p-4">
                {chatHistory.map((group, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-500">{group.date}</span>
                    </div>
                    {group.messages.map((msg, msgIndex) => (
                      <div
                        key={msgIndex}
                        className="mb-2 p-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors cursor-pointer text-sm text-gray-700 truncate"
                      >
                        {msg.content}
                      </div>
                    ))}
                  </div>
                ))}
              </ScrollArea>
            </div>

            {/* Clear History Button */}
            <div className="p-4 border-t border-white/40">
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to clear chat history?")) {
                    if (messages === localMessages) {
                      setLocalMessages([defaultMessages[0]]);
                    } else {
                      onClearHistory();
                    }
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear History</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
        <div className="p-4 border-b border-white/40 bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-t-xl flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors mr-2"
          >
            <Menu className="h-5 w-5 text-purple-800" />
          </button>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white/80 shadow-sm">
              <AvatarImage src={chatbotAvatarUrl} alt="WishOne" />
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
        <ScrollArea className="flex-1 p-2 bg-white/30 w-full overflow-x-hidden" ref={scrollAreaRef}>
          <div className="space-y-3 px-2 w-full">
          {displayMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } w-full`}
            >
              <div
                className={`flex ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                } items-end gap-1.5 w-full max-w-[80%]`}
              >
                {message.sender === "ai" && (
                  <Avatar className="h-8 w-8 border-2 border-white/80 shadow-sm flex-shrink-0">
                    <AvatarImage
                      src={chatbotAvatarUrl}
                      alt="AI"
                    />
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      WO
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col flex-1 min-w-0 max-w-full overflow-hidden">
                  <div 
                    className={`relative rounded-2xl px-3 py-2 text-sm ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-purple-600/90 to-purple-700/90 text-white rounded-br-none shadow-sm"
                        : "bg-white/70 backdrop-blur-sm text-gray-800 rounded-bl-none shadow-sm border border-white/40"
                    }`}
                  >
                    {/* Reply indicator */}
                    {message.replyTo && (
                      <div className={`text-xs mb-1 pb-1 border-b ${
                        message.sender === "user" ? "border-purple-400" : "border-gray-300"
                      }`}>
                        <span className="flex items-center gap-1">
                          <CornerUpLeft className="h-3 w-3" />
                            <span className="truncate max-w-[160px]">
                            {findReplyMessage(message.replyTo)?.content.substring(0, 20)}
                            {(findReplyMessage(message.replyTo)?.content.length || 0) > 20 ? "..." : ""}
                          </span>
                        </span>
                      </div>
                    )}
                    
                      <div 
                        className="break-all break-words whitespace-pre-wrap w-full" 
                        style={{ 
                          overflowWrap: 'break-word', 
                          wordBreak: 'break-word',
                          maxWidth: '100%',
                          display: 'inline-block',
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word'
                        }}
                      >
                        {message.content}
                      </div>
                      {message.editedAt && (
                        <span className="text-xs opacity-70 ml-2 inline-block">(edited)</span>
                      )}
                  </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 px-1">
                      <span>{formatTime(message.timestamp)}</span>
                      {message.sender === "user" && (
                        <span className="flex items-center gap-1">
                          {message.status === "sent" && (
                            <Check className="h-3 w-3" />
                          )}
                          {message.status === "delivered" && (
                            <CheckCheck className="h-3 w-3" />
                          )}
                          {message.status === "read" && (
                            <CheckCheck className="h-3 w-3 text-purple-600" />
                          )}
                  </span>
                      )}
                    </div>
                </div>
                {message.sender === "user" && (
                    <Avatar className="h-8 w-8 border-2 border-white/80 shadow-sm flex-shrink-0">
                    {effectiveUserAvatarUrl ? (
                      <AvatarImage
                        src={effectiveUserAvatarUrl}
                        alt="User"
                      />
                    ) : (
                      <AvatarFallback className="bg-purple-100">
                          <User className="h-4 w-4 text-purple-600" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                )}
              </div>
            </div>
          ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-sm">WishOne is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
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

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-24 right-4 p-2 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition-colors"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        )}

        {/* Smart Suggestions with Animation */}
        <AnimatePresence>
          {smartSuggestions.length > 0 && !editingMessageId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="px-4 py-2 bg-white/50 border-t border-white/40"
            >
              <div className="flex gap-2 overflow-x-auto pb-2">
                {smartSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30, delay: index * 0.1 }}
                    onClick={() => setNewMessage(suggestion)}
                    className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm whitespace-nowrap hover:bg-purple-200 transition-colors"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
