import { useState } from "react";
import { ChatContainer } from "@/components/chat/ChatContainer";
import Landing from "./Landing";

const Index = () => {
  const [showChat, setShowChat] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string | undefined>();

  const handleEnter = (message?: string) => {
    setInitialMessage(message);
    setShowChat(true);
  };

  if (!showChat) {
    return <Landing onEnter={handleEnter} />;
  }

  return (
    <div className="animate-fade-in">
      <ChatContainer initialMessage={initialMessage} />
    </div>
  );
};

export default Index;
