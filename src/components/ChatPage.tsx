import React from "react";
import AIChatbot from "./AIChatbot";
import BottomTabBar from "./BottomTabBar";

const ChatPage = () => {
  const handleSendMessage = (message: string) => {
    console.log(`Message sent: ${message}`);
  };

  const handleUploadMedia = (file: File) => {
    console.log(`File uploaded: ${file.name}`);
  };

  return (
    <div className="min-h-screen bg-[#e8eeeb] flex flex-col items-center justify-center pb-20">
      <div className="w-full max-w-md px-4">
        <AIChatbot
          onSendMessage={handleSendMessage}
          onUploadMedia={handleUploadMedia}
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
