import React, { useState, useEffect } from "react";
import AIChatbot from "./AIChatbot";
import BottomTabBar from "./BottomTabBar";
import { generateResponse, analyzeImage, generateBirthdayWish } from "@/lib/gemini";

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
  
  // Check for birthdays on component mount
  useEffect(() => {
    checkBirthdays();
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
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm feeling a bit disconnected right now. Can we try again in a moment?",
        sender: "ai",
        timestamp: new Date(),
      };
      
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
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I wish I could see what you're sharing. My vision seems a bit cloudy right now.",
        sender: "ai",
        timestamp: new Date(),
      };
      
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
    <div className="min-h-screen bg-[#e8eeeb] flex flex-col items-center justify-center pb-20">
      <div className="w-full max-w-md px-4 py-4 flex-1 flex items-center justify-center">
        <AIChatbot
          messages={messages}
          onSendMessage={handleSendMessage}
          onUploadMedia={handleUploadMedia}
          onReplyTo={handleReplyTo}
          replyingTo={replyingTo ? messages.find(m => m.id === replyingTo) : undefined}
        />
      </div>

      <BottomTabBar
        activeTab="chat"
        onHomeClick={() => (window.location.href = "/")}
        onChatClick={() => {}}
        onProfileClick={() => (window.location.href = "/profile")}
      />
    </div>
  );
};

export default ChatPage;
