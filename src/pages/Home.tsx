import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Terminal, Music, ChevronDown, Zap } from "lucide-react";

export const Home = () => {
  const [terminalText, setTerminalText] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  
  const fullText = "ACCESSING REMNANTS DATABASE...";
  
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < fullText.length) {
        setTerminalText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
        setTimeout(() => setShowPrompt(true), 500);
      }
    }, 100);

    return () => clearInterval(typing);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Terminal Header */}
          {!showPrompt && (
            <div className="cyber-border bg-card/50 p-6 rounded-lg backdrop-blur-sm">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Terminal className="w-6 h-6 text-primary animate-flicker" />
                <span className="terminal-text text-primary text-sm">BARD_TERMINAL_v2.7.3</span>
              </div>

              <div className="terminal-text text-left">
                <div className="text-terminal-green mb-2 w-[30ch] min-h-[1.25rem] whitespace-nowrap">
                  {terminalText}
                  <span className="animate-flicker">|</span>
                </div>

              </div>
            </div>
          )}

          {/* Main Title */}
          {showPrompt && (
            <div className="space-y-4 animate-fade-in">
              <h1 className="title-text text-4xl md:text-7xl font-black glow-text">
                LORD TSARCASM
              </h1>
              <div className="text-xl md:text-2xl text-secondary-bright terminal-text">
                Chronicler of Far Haven
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                In the ashes of the old world, stories survive. Music echoes through the ruins.
                Welcome to the digital grimoire of a post-apocalyptic bard.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {showPrompt && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Button
                asChild
                size="lg"
                className="
                  bg-primary/20 hover:bg-primary/30
                  text-primary border border-primary/50
                  holo-hover terminal-text font-bold
                  px-8 py-3
                "
              >
                <Link to="/music" className="flex items-center space-x-2">
                  <Music className="w-5 h-5" />
                  <span>Enter the Vault</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="
                  border-secondary/50 text-secondary-bright
                  hover:bg-secondary/10 hover:border-secondary
                  holo-hover terminal-text
                  px-8 py-3
                "
              >
                <Link to="/about" className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>About the Bard</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Status Bar */}
      <section className="py-8 border-t border-primary/20 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <Link to="/aliens" className="terminal-text text-primary text-lg font-bold hover:underline">
                ALIENS
              </Link>
              <div className="text-muted-foreground text-sm">Songs from the ruins</div>
            </div>
            
            <div className="space-y-2">
              <Link to="/core-rule-book" className="terminal-text text-accent text-lg font-bold hover:underline">
                CORE RULE BOOK
              </Link>
              <div className="text-muted-foreground text-sm">Building tomorrow</div>
            </div>
            
            <div className="space-y-2">
              <Link to="/lore" className="terminal-text text-secondary-bright text-lg font-bold hover:underline">
                REMNANTS LORE
              </Link>
              <div className="text-muted-foreground text-sm">Stories from the ashes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll indicator */}
      <div className="flex justify-center pb-8">
        <ChevronDown className="w-6 h-6 text-primary animate-bounce" />
      </div>
    </div>
  );
};
