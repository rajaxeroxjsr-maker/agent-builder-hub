import { useState } from "react";
import { ChatContainer } from "@/components/chat/ChatContainer";
import Landing from "./Landing";

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  if (!showChat) {
    return <Landing onEnter={() => setShowChat(true)} />;
  }

  return (
    <div className="animate-fade-in">
      <ChatContainer />
    </div>
  );
};

export default Index;
