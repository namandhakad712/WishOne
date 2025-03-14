import React, { useState, useEffect } from "react";
import AIChatbot from "./AIChatbot";
import BottomTabBar from "./BottomTabBar";
import ApiKeyMissing from "./ApiKeyMissing";
import { generateResponse, analyzeImage, generateBirthdayWish } from "@/lib/gemini";

// Check if API key is available
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

// Utility function to check if the API key is valid (not just present)
const isValidApiKey = (key: string) => {
  // Google API keys typically start with "AIza" and are 39 characters long
  return key.startsWith("AIza") && key.length >= 39;
};

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  replyTo?: string; // ID of the message being replied to
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi there! I'm your WishOne companion. I'm here to chat, help with birthdays, or just be a friendly presence. How are you feeling today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [apiKeyValid, setApiKeyValid] = useState(isValidApiKey(apiKey));
  
  // Check for birthdays on component mount
  useEffect(() => {
    checkBirthdays();
    
    // Validate API key on mount
    setApiKeyValid(isValidApiKey(apiKey));
  }, []);
  
  const checkBirthdays = async () => {
    // Mock function to check birthdays - in a real app, this would query your database
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}`;
    
    // Mock data - replace with actual birthday data from your database
    const todaysBirthdays = [
      // { name: "Sarah", relation: "Friend" }
    ];
    
    if (todaysBirthdays.length > 0) {
      const birthdayNames = todaysBirthdays.map(b => b.name).join(", ");
      const birthdayMessage: Message = {
        id: Date.now().toString(),
        content: `I just remembered something special! Today is ${birthdayNames}'s birthday! Would you like me to help you write a heartfelt wish?`,
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, birthdayMessage]);
    }
  };

  const handleSendMessage = async (message: string, replyToId?: string) => {
    // Add user message to the chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
      replyTo: replyToId || replyingTo || undefined,
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setReplyingTo(null); // Clear reply state after sending
    
    try {
      // Check if message is about birthdays or wishes
      const isBirthdayRelated = message.toLowerCase().includes("birthday") || 
                               message.toLowerCase().includes("wish");
      
      // Check if user is asking to generate a birthday wish
      const isWishRequest = message.toLowerCase().includes("write a wish") || 
                           message.toLowerCase().includes("create a wish") ||
                           message.toLowerCase().includes("birthday message") ||
                           (message.toLowerCase().includes("wish") && message.toLowerCase().includes("for"));
      
      // Detect emotional content or questions about feelings
      const isEmotionalContent = message.toLowerCase().includes("feel") || 
                                message.toLowerCase().includes("sad") ||
                                message.toLowerCase().includes("happy") ||
                                message.toLowerCase().includes("angry") ||
                                message.toLowerCase().includes("love") ||
                                message.toLowerCase().includes("miss");
      
      if (isWishRequest) {
        // Extract name and relation from the message if possible
        let name = "friend";
        let relation = "friend";
        
        // Simple extraction logic - can be improved
        if (message.toLowerCase().includes("for my")) {
          const parts = message.split("for my");
          if (parts.length > 1) {
            relation = parts[1].trim().split(" ")[0];
          }
        }
        
        if (message.toLowerCase().includes("named")) {
          const parts = message.split("named");
          if (parts.length > 1) {
            name = parts[1].trim().split(" ")[0];
          }
        }
        
        // Generate the birthday wish
        const wish = await generateBirthdayWish(name, relation);
        
        // Add AI response to the chat
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: wish,
          sender: "ai",
          timestamp: new Date(),
        };
        
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else {
        // Generate regular AI response using Gemini API
        let prompt = `User message: ${message}`;
        
        // Add context about what message is being replied to
        if (replyToId || replyingTo) {
          const repliedMessage = messages.find(m => m.id === (replyToId || replyingTo));
          if (repliedMessage) {
            prompt += `\nThis message is replying to: "${repliedMessage.content}"`;
          }
        }
        
        // Add special instructions for birthday-related queries
        if (isBirthdayRelated) {
          prompt += "\nThis message is about birthdays or wishes. Respond with enthusiasm and offer to help write a personalized birthday message.";
        }
        
        // Add special instructions for emotional content
        if (isEmotionalContent) {
          prompt += "\nThis message contains emotional content. Respond with empathy, validation, and emotional intelligence.";
        }
        
        const response = await generateResponse(prompt);
        
        // Add AI response to the chat
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          sender: "ai",
          timestamp: new Date(),
        };
        
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      }
    } catch (error) {
      console.error("Error generating response:", error);
      
      // Add error message with emotional tone
      let errorMessage: Message;
      
      if (error instanceof Error) {
        let errorContent = "I'm feeling a bit disconnected right now. Can we try again in a moment?";
        
        if (error.message.includes("API key")) {
          errorContent = "I'm having trouble connecting to my thoughts right now. There might be an issue with my connection to the AI service.";
        } else if (error.message.includes("network") || error.message.includes("timeout")) {
          errorContent = "I'm feeling a bit disconnected right now. Could we try again when the connection is better?";
        } else if (error.message.includes("rate limit") || error.message.includes("quota")) {
          errorContent = "I've been thinking a lot today and need a short break to recharge. Could we try again in a few minutes?";
        }
        
        errorMessage = {
          id: (Date.now() + 1).toString(),
          content: errorContent,
          sender: "ai",
          timestamp: new Date(),
        };
      } else {
        errorMessage = {
          id: (Date.now() + 1).toString(),
          content: "I'm feeling a bit disconnected right now. Can we try again in a moment?",
          sender: "ai",
          timestamp: new Date(),
        };
      }
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplyTo = (messageId: string) => {
    setReplyingTo(messageId);
  };

  const handleUploadMedia = async (file: File) => {
    setIsLoading(true);
    
    try {
      // Convert file to base64
      const base64data = await fileToBase64(file);
      
      // Add user's image message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: "[Image shared]",
        sender: "user",
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      
      // Add a temporary processing message
      const processingId = Date.now() + 1;
      const processingMessage: Message = {
        id: processingId.toString(),
        content: "I'm looking at your image with interest...",
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, processingMessage]);
      
      // Analyze image using Gemini API
      const prompt = "What do you see in this image? Respond with emotional depth.";
      const response = await analyzeImage(base64data, prompt);
      
      // Replace the processing message with the actual response
      setMessages((prevMessages) => 
        prevMessages.map(msg => 
          msg.id === processingId.toString() 
            ? { ...msg, content: response } 
            : msg
        )
      );
    } catch (error) {
      console.error("Error analyzing image:", error);
      
      // Add error message with emotional tone
      let errorMessage: Message;
      
      if (error instanceof Error) {
        let errorContent = "I wish I could see what you're sharing. My vision seems a bit cloudy right now.";
        
        if (error.message.includes("API key")) {
          errorContent = "I'd love to see your image, but I'm having trouble with my vision capabilities right now. There might be an issue with my connection to the AI service.";
        } else if (error.message.includes("network") || error.message.includes("timeout")) {
          errorContent = "I'm having trouble processing your image due to a connection issue. Could we try again when the connection is better?";
        } else if (error.message.includes("file") || error.message.includes("format")) {
          errorContent = "This image format is a bit challenging for me to understand. Could you try sharing a different image?";
        }
        
        errorMessage = {
          id: (Date.now() + 1).toString(),
          content: errorContent,
          sender: "ai",
          timestamp: new Date(),
        };
      } else {
        errorMessage = {
          id: (Date.now() + 1).toString(),
          content: "I wish I could see what you're sharing. My vision seems a bit cloudy right now.",
          sender: "ai",
          timestamp: new Date(),
        };
      }
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-white relative overflow-hidden">
      {/* Glassmorphic background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-64 -right-64 w-[500px] h-[500px] rounded-full bg-purple-300/20 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-300/20 blur-3xl"></div>
        <div className="absolute -bottom-64 -left-64 w-[500px] h-[500px] rounded-full bg-green-300/20 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center pb-20 px-4 pt-6">
        <div className="w-full max-w-md flex-1 flex flex-col items-center justify-center">
          {!apiKeyValid ? (
            <ApiKeyMissing 
              service="Gemini AI" 
              envVarName="VITE_GEMINI_API_KEY" 
            />
          ) : (
            <AIChatbot
              messages={messages}
              onSendMessage={handleSendMessage}
              onUploadMedia={handleUploadMedia}
              onReplyTo={handleReplyTo}
              replyingTo={replyingTo ? messages.find(m => m.id === replyingTo) : undefined}
            />
          )}
        </div>

        <BottomTabBar
          activeTab="chat"
          onHomeClick={() => (window.location.href = "/")}
          onChatClick={() => {}}
          onProfileClick={() => (window.location.href = "/profile")}
        />
      </div>
    </div>
  );
};

export default ChatPage;
