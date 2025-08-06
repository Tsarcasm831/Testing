import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Database, Users, Star, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Members = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="title-text text-4xl md:text-6xl font-black glow-text">
            MEMBER VAULT
          </h1>
          <p className="text-xl text-secondary-bright terminal-text">
            Welcome, {user.email} • Access Granted • Inner Circle
          </p>
        </div>

        {/* Access Granted Notice */}
        <Card className="cyber-border bg-card/50 backdrop-blur-sm max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="w-8 h-8 text-primary animate-glow-pulse" />
              <CardTitle className="terminal-text text-primary text-center">
                ACCESS GRANTED
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="text-muted-foreground leading-relaxed">
              <p>
                Welcome to the exclusive member vault! You now have access to early music previews
                and special member-only features.
              </p>
            </div>

            <div className="p-4 bg-background/50 rounded border border-primary/20">
              <div className="terminal-text text-primary text-sm mb-2">ACCESS_STATUS.LOG</div>
              <div className="text-muted-foreground text-sm">
                Authentication status: <span className="text-primary">VERIFIED</span><br/>
                Access level: <span className="text-primary">MEMBER</span><br/>
                Vault permissions: <span className="text-primary">FULL_ACCESS</span>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Preview of Member Benefits */}
      <div className="space-y-6">
        <h2 className="terminal-text text-2xl text-accent font-bold text-center">
          MEMBER VAULT PREVIEW
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="cyber-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="terminal-text text-primary flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Early Access</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-muted-foreground text-sm">
                • Unreleased track previews<br/>
                • Development builds
              </div>
              <div className="text-primary terminal-text text-xs">
                [ACTIVE]
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="terminal-text text-accent flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Exclusive Archives</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-muted-foreground text-sm">
                • Downloadable content packs<br/>
                • High-quality audio files<br/>
                • Concept art and assets<br/>
                • Extended lore documents
              </div>
              <div className="text-accent terminal-text text-xs">
                [LOCKED]
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="terminal-text text-secondary-bright flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Community</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-muted-foreground text-sm">
                • Join the community on <a href="https://discord.gg/qUVrPpNUNv" target="_blank" rel="noopener noreferrer" className="underline">Discord</a><br/>
                • Direct feedback channels<br/>
                • Collaborative projects<br/>
                • Faction alignment system
              </div>
              <div className="text-secondary-bright terminal-text text-xs">
                [CONNECTED]
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Future Features */}
      <Card className="cyber-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="terminal-text text-primary flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>PLANNED FEATURES</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="terminal-text text-accent font-bold">AI INTERACTIONS</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Chat with Lord Tsarcasm AI</li>
                <li>• Faction leader conversations</li>
                <li>• Character-driven storylines</li>
                <li>• Personalized music recommendations</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="terminal-text text-secondary-bright font-bold">GAMIFICATION</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Faction alignment rewards</li>
                <li>• Collectible digital assets</li>
                <li>• Cross-game inventory</li>
                <li>• Achievement systems</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-background/50 rounded border border-primary/20">
            <div className="terminal-text text-primary text-sm mb-2">DEVELOPMENT_NOTE.TXT</div>
            <div className="text-muted-foreground text-sm">
              "The member vault represents the next evolution of fan engagement—where exclusive 
              content meets interactive experiences in the post-apocalyptic digital realm."
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

