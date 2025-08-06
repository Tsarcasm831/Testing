import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dice6, RotateCcw } from "lucide-react";

interface MutationColor {
  id: number;
  color: string;
}

interface MutationEffect {
  id: number;
  name: string;
  description: string;
}

export const CharacterCreator = () => {
  const [mutationColors, setMutationColors] = useState<MutationColor[]>([]);
  const [mutationEffects, setMutationEffects] = useState<MutationEffect[]>([]);
  const [selectedColor, setSelectedColor] = useState<MutationColor | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<MutationEffect | null>(null);

  useEffect(() => {
    const loadMutationData = async () => {
      try {
        const [colorsRes, effectsRes] = await Promise.all([
          fetch('/OverworldGame/json/character_creation/mutations_colors.json'),
          fetch('/OverworldGame/json/character_creation/mutations_effects.json')
        ]);

        if (colorsRes.ok) setMutationColors(await colorsRes.json());
        if (effectsRes.ok) setMutationEffects(await effectsRes.json());
      } catch (error) {
        console.warn('Failed to load mutation data:', error);
      }
    };

    loadMutationData();
  }, []);

  const rollRandomMutation = () => {
    if (mutationColors.length > 0 && mutationEffects.length > 0) {
      const randomColor = mutationColors[Math.floor(Math.random() * mutationColors.length)];
      const randomEffect = mutationEffects[Math.floor(Math.random() * mutationEffects.length)];
      setSelectedColor(randomColor);
      setSelectedEffect(randomEffect);
    }
  };

  const resetSelection = () => {
    setSelectedColor(null);
    setSelectedEffect(null);
  };

  return (
    <Card className="cyber-border bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="terminal-text text-primary flex items-center gap-2">
          <Dice6 className="h-5 w-5" />
          MUTATION GENERATOR
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Generate random mutations for your character in the post-apocalyptic world.
        </p>
        
        <div className="flex gap-2">
          <Button 
            onClick={rollRandomMutation} 
            className="flex items-center gap-2"
            disabled={mutationColors.length === 0 || mutationEffects.length === 0}
          >
            <Dice6 className="h-4 w-4" />
            Roll Mutation
          </Button>
          <Button 
            variant="outline" 
            onClick={resetSelection}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {(selectedColor || selectedEffect) && (
          <div className="space-y-4 mt-6 p-4 cyber-border bg-background/30 rounded-lg">
            <h3 className="terminal-text font-bold text-primary">Your Mutation Result:</h3>
            
            {selectedColor && (
              <div className="space-y-2">
                <Badge variant="secondary" className="text-xs">Physical Manifestation</Badge>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Color:</span>
                  <span className="text-sm text-primary">{selectedColor.color}</span>
                </div>
              </div>
            )}

            {selectedEffect && (
              <div className="space-y-2">
                <Badge variant="default" className="text-xs">Mutation Effect</Badge>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">{selectedEffect.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedEffect.description}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};