import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import lumoraLogo from "@/assets/lumora-logo.png";

interface LandingProps {
  onEnter: (initialMessage?: string) => void;
}

const Landing = ({ onEnter }: LandingProps) => {
  const [isExiting, setIsExiting] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const handleTryClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 500);
  };

  const handleAskSubmit = () => {
    if (inputValue.trim()) {
      setIsExiting(true);
      setTimeout(() => {
        onEnter(inputValue.trim());
      }, 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskSubmit();
    }
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  const navLinks = [
    "Research",
    "Safety",
    "For Business",
    "For Developers",
    "Lumora AI",
    "Stories",
    "Company",
    "News",
  ];

  return (
    <div
      className={`min-h-screen bg-black text-white transition-all duration-500 ${
        isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={lumoraLogo} alt="Lumora" className="h-8 w-8" />
          <span className="text-xl font-semibold tracking-tight">Lumora</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleLogin}
            variant="secondary"
            className="bg-white text-black hover:bg-white/90 rounded-full px-6"
          >
            Log in
          </Button>
        </div>
      </header>

      {/* Left Navigation */}
      <nav className="fixed left-0 top-20 bottom-0 w-48 px-6 py-8 hidden md:block">
        <ul className="space-y-4">
          {navLinks.map((link) => (
            <li key={link}>
              <a
                href="#"
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm text-white/60 mb-4">
            January 4, 2026 &nbsp;&nbsp; Product
          </p>
          
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-8">
            Introducing Lumora
          </h1>

          <div className="flex items-center justify-center gap-4 mb-16">
            <Button
              onClick={handleTryClick}
              className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-base font-medium"
            >
              Try Lumora ↗
            </Button>
            <Button
              onClick={handleLogin}
              variant="ghost"
              className="text-white hover:text-white hover:bg-white/10 rounded-full px-6 py-6 text-base"
            >
              Try Lumora for Work →
            </Button>
          </div>

          <div className="text-left max-w-2xl mx-auto space-y-6 text-white/80 text-base leading-relaxed">
            <p>
              We've trained a model called Lumora which interacts in a
              conversational way. The dialogue format makes it possible for
              Lumora to answer followup questions, admit its mistakes,
              challenge incorrect premises, and reject inappropriate requests.
            </p>
            <p>
              Lumora is a sibling model to InstructGPT, which is trained to
              follow an instruction in a prompt and provide a detailed response.
            </p>
            <p>
              We are excited to introduce Lumora to get users' feedback and
              learn about its strengths and weaknesses. During the research
              preview, usage of Lumora is free. Try it now.
            </p>
          </div>
        </div>

        {/* Bottom Chat Input */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-4">
          <div className="bg-zinc-900 rounded-full flex items-center px-6 py-4 border border-white/10">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Lumora"
              className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none"
            />
            <button
              onClick={handleAskSubmit}
              disabled={!inputValue.trim()}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 disabled:opacity-50 rounded-full flex items-center justify-center transition-colors"
            >
              <ArrowUp className="h-4 w-4 text-white/60" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
