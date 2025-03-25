import React, { useState, useEffect, useRef } from "react";
import AIChatbot from "./AIChatbot";
import BottomTabBar from "./BottomTabBar";
import ApiKeyMissing from "./ApiKeyMissing";
import { generateResponse, analyzeImage, generateBirthdayWish } from "@/lib/gemini";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

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
  replyTo?: string;
  status: "sent" | "delivered" | "read";
  isEditing?: boolean;
  editedAt?: Date;
  personality?: "formal" | "casual" | "friendly" | "professional";
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi there! I'm your WishOne companion. I'm here to chat, help with birthdays, or just be a friendly presence. How are you feeling today?",
      sender: "ai",
      timestamp: new Date(),
      status: "read",
      personality: "friendly",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [apiKeyValid, setApiKeyValid] = useState(isValidApiKey(apiKey));
  const [currentPersonality, setCurrentPersonality] = useState<"formal" | "casual" | "friendly" | "professional">("friendly");
  const [messageContext, setMessageContext] = useState<string[]>([]);
  
  // Animation refs
  const pageRef = useRef<HTMLDivElement>(null);
  const chatbotContainerRef = useRef<HTMLDivElement>(null);
  const bgElementsRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  
  // Check for birthdays on component mount
  useEffect(() => {
    checkBirthdays();
    
    // Validate API key on mount
    setApiKeyValid(isValidApiKey(apiKey));
  }, []);
  
  // Initialize animations when component mounts
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
    
    // Animate chatbot container
    if (chatbotContainerRef.current) {
      timeline.fromTo(
        chatbotContainerRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.5
      );
    }
    
    return () => {
      timeline.kill();
    };
  }, []);
  
  // Animation when API key validity changes
  useEffect(() => {
    if (!chatbotContainerRef.current) return;
    
    gsap.fromTo(
      chatbotContainerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.2)" }
    );
  }, [apiKeyValid]);
  
  // Clear all chat history except the initial greeting
  const clearChatHistory = () => {
    // Add clearing animation
    if (chatbotContainerRef.current) {
      // Create a quick fade out and back in animation
      gsap.to(chatbotContainerRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          // Reset messages
          setMessages([{
            id: "1",
            content:
              "Hi there! I'm your WishOne companion. I'm here to chat, help with birthdays, or just be a friendly presence. How are you feeling today?",
            sender: "ai",
            timestamp: new Date(),
            status: "read",
            personality: "friendly",
          }]);
          setMessageContext([]);
          
          // Fade back in
          gsap.to(chatbotContainerRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            delay: 0.1
          });
        }
      });
    } else {
      // Fallback if ref isn't available
      setMessages([{
        id: "1",
        content:
          "Hi there! I'm your WishOne companion. I'm here to chat, help with birthdays, or just be a friendly presence. How are you feeling today?",
        sender: "ai",
        timestamp: new Date(),
        status: "read",
        personality: "friendly",
      }]);
      setMessageContext([]);
    }
  };

  // Update context when messages change
  useEffect(() => {
    const lastMessages = messages.slice(-5).map(m => m.content);
    setMessageContext(lastMessages);
  }, [messages]);
  
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
        status: "read",
        personality: "friendly",
      };
      
      setMessages(prev => [...prev, birthdayMessage]);
    }
  };

  const getPersonalityPrompt = (personality: string) => {
    switch (personality) {
      case "formal":
        return "Respond in a formal and professional manner, using proper language and maintaining a respectful tone.";
      case "casual":
        return "Respond in a casual and relaxed manner, using everyday language and a friendly tone.";
      case "friendly":
        return "Respond in a warm and empathetic manner, showing genuine care and understanding.";
      case "professional":
        return "Respond in a business-like manner, focusing on efficiency and clarity while maintaining professionalism.";
      default:
        return "";
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
      status: "sent",
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setReplyingTo(null);
    
    // Animate the chat container when sending a message
    if (chatbotContainerRef.current) {
      gsap.to(chatbotContainerRef.current, {
        y: -5,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut"
      });
    }
    
    try {
      // Build context-aware prompt
      const contextPrompt = messageContext.length > 0
        ? `Previous context:\n${messageContext.join("\n")}\n\n`
        : "";
      
      const personalityPrompt = getPersonalityPrompt(currentPersonality);
      
      // Detect message intent
      const isBirthdayRelated = message.toLowerCase().includes("birthday") || 
                               message.toLowerCase().includes("wish");
      
      const isWishRequest = message.toLowerCase().includes("write a wish") || 
                           message.toLowerCase().includes("create a wish") ||
                           message.toLowerCase().includes("birthday message");
      
      const isEmotionalContent = message.toLowerCase().includes("feel") || 
                                message.toLowerCase().includes("sad") ||
                                message.toLowerCase().includes("happy");

      if (isWishRequest) {
        // Handle birthday wish generation
        let name = "friend";
        let relation = "friend";
        
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
        
        const wish = await generateBirthdayWish(name, relation);
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: wish,
          sender: "ai",
          timestamp: new Date(),
          status: "read",
          personality: currentPersonality,
        };
        
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else {
        // Generate context-aware AI response
        let prompt = `${contextPrompt}${personalityPrompt}\n\nUser message: ${message}`;
        
        // Add special instructions based on content type
        if (isBirthdayRelated) {
          prompt = prompt + "\nThis message is about birthdays or wishes. Respond with enthusiasm and offer to help write a personalized birthday message.";
        }
        
        if (isEmotionalContent) {
          prompt = prompt + "\nThis message contains emotional content. Respond with empathy, validation, and emotional intelligence.";
        }
        
        const response = await generateResponse(prompt);
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          sender: "ai",
          timestamp: new Date(),
          status: "read",
          personality: currentPersonality,
        };
        
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      }
      
      // Add a subtle animation when the AI is thinking
      if (chatbotContainerRef.current) {
        gsap.to(chatbotContainerRef.current, {
          boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)",
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
      
      // Update message status
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id ? { ...msg, status: "delivered" } : msg
          )
        );
      }, 1000);

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id ? { ...msg, status: "read" } : msg
          )
        );
      }, 2000);
    } catch (error) {
      console.error("Error generating response:", error);
      
      // Stop the thinking animation on error
      if (chatbotContainerRef.current) {
        gsap.to(chatbotContainerRef.current, {
          boxShadow: "0 0 0px rgba(147, 51, 234, 0)",
          duration: 0.5
        });
      }
      
      // Show error shake animation
      if (chatbotContainerRef.current) {
        gsap.to(chatbotContainerRef.current, {
          x: 10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: "power1.inOut",
          onComplete: () => {
            gsap.to(chatbotContainerRef.current, { x: 0 });
          }
        });
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm feeling a bit disconnected right now. Can we try again in a moment?",
        sender: "ai",
        timestamp: new Date(),
        status: "read",
        personality: currentPersonality,
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplyTo = (messageId: string) => {
    setReplyingTo(messageId);
    
    // Highlight the message being replied to
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      gsap.fromTo(
        messageElement,
        { backgroundColor: "rgba(147, 51, 234, 0.2)" },
        { 
          backgroundColor: "rgba(147, 51, 234, 0)",
          duration: 1.5,
          ease: "power2.out"
        }
      );
    }
  };

  const handleUploadMedia = async (file: File) => {
    setIsLoading(true);
    
    // Animate the file upload progress
    if (chatbotContainerRef.current) {
      gsap.fromTo(
        chatbotContainerRef.current,
        { boxShadow: "0 0 0px rgba(147, 51, 234, 0)" },
        { 
          boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)", 
          duration: 0.5,
          yoyo: true,
          repeat: -1
        }
      );
    }
    
    try {
      // Convert file to base64
      const base64data = await fileToBase64(file);
      
      // Add user's image message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: "[Image shared]",
        sender: "user",
        timestamp: new Date(),
        status: "read",
        personality: "friendly",
      };
      
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      
      // Add a temporary processing message
      const processingId = Date.now() + 1;
      const processingMessage: Message = {
        id: processingId.toString(),
        content: "I'm looking at your image with interest...",
        sender: "ai",
        timestamp: new Date(),
        status: "read",
        personality: "friendly",
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
      
      // Stop the upload animation
      if (chatbotContainerRef.current) {
        gsap.to(chatbotContainerRef.current, {
          boxShadow: "0 0 0px rgba(147, 51, 234, 0)",
          duration: 0.5
        });
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      
      // Stop the upload animation
      if (chatbotContainerRef.current) {
        gsap.to(chatbotContainerRef.current, {
          boxShadow: "0 0 0px rgba(147, 51, 234, 0)",
          duration: 0.5
        });
      }
      
      // Show error shake animation
      if (chatbotContainerRef.current) {
        gsap.to(chatbotContainerRef.current, {
          x: 10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: "power1.inOut",
          onComplete: () => {
            gsap.to(chatbotContainerRef.current, { x: 0 });
          }
        });
      }
      
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
          status: "read",
          personality: "friendly",
        };
      } else {
        errorMessage = {
          id: (Date.now() + 1).toString(),
          content: "I wish I could see what you're sharing. My vision seems a bit cloudy right now.",
          sender: "ai",
          timestamp: new Date(),
          status: "read",
          personality: "friendly",
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

  const handlePersonalityChange = (personality: "formal" | "casual" | "friendly" | "professional") => {
    setCurrentPersonality(personality);
    
    // Add animation for personality change
    if (chatbotContainerRef.current) {
      // Create a flash effect with the personality color
      const personalityColors = {
        formal: "rgba(59, 130, 246, 0.2)",      // Blue for formal
        casual: "rgba(16, 185, 129, 0.2)",      // Green for casual
        friendly: "rgba(236, 72, 153, 0.2)",    // Pink for friendly
        professional: "rgba(124, 58, 237, 0.2)" // Purple for professional
      };
      
      // Create pulsing effect
      gsap.fromTo(
        chatbotContainerRef.current,
        { 
          boxShadow: `0 0 20px ${personalityColors[personality]}`,
          scale: 1
        },
        {
          boxShadow: "0 0 0px rgba(0, 0, 0, 0)",
          scale: 1.02,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            gsap.to(chatbotContainerRef.current, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        }
      );
    }
    
    // Add a message indicating the personality change
    const systemMessage: Message = {
      id: Date.now().toString(),
      content: `I'll now respond in a ${personality} manner.`,
      sender: "ai",
      timestamp: new Date(),
      status: "read",
      personality,
    };
    
    setMessages((prev) => [...prev, systemMessage]);
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-white relative overflow-hidden">
      {/* Glassmorphic background elements */}
      <div ref={bgElementsRef} className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-64 -right-64 w-[500px] h-[500px] rounded-full bg-purple-300/20 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-300/20 blur-3xl"></div>
        <div className="absolute -bottom-64 -left-64 w-[500px] h-[500px] rounded-full bg-green-300/20 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center pb-20 px-4 pt-6">
        <div ref={chatbotContainerRef} className="w-full max-w-md flex-1 flex flex-col items-center justify-center">
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
              onPersonalityChange={handlePersonalityChange}
              currentPersonality={currentPersonality}
              onClearHistory={clearChatHistory}
            />
          )}
        </div>

        <BottomTabBar
          activeTab="chat"
          onHomeClick={() => navigate("/")}
          onChatClick={() => navigate("/chat")}
          onGoalsClick={() => navigate("/goals")}
          onProfileClick={() => navigate("/profile")}
        />
      </div>
    </div>
  );
};

export default ChatPage;
