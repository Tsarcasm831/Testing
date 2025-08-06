import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dice6, Users, Zap, Cog } from "lucide-react";
import { CharacterCreator } from "@/components/CharacterCreator";

interface LoreEntry {
  title: string;
  description: string;
  to: string;
}

interface Archetype {
  name: string;
  attribute_modifiers: Record<string, number>;
  starting_skills: string[];
  special_abilities: string[];
}

interface Trait {
  name: string;
  category: string;
  cost?: number;
  bonus_points?: number;
  description: string;
}

interface PsionicPower {
  name: string;
  category: string;
  level: number;
  mana_cost: number;
  range: string;
  description: string;
}

interface GameMechanic {
  name: string;
  description: string;
  rules: string[];
}

const loreEntries: LoreEntry[] = [
  {
    title: "Trusty's Foreword",
    description: "Opening words from the creator of Remnants.",
    to: "/lore/trustys-foreword",
  },
  {
    title: "Core Rule Book",
    description: "Fundamental guide to surviving the Remnants.",
    to: "/core-rule-book",
  },
];

export const RemnantsLore: FC = () => {
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [traits, setTraits] = useState<Trait[]>([]);
  const [psionicPowers, setPsionicPowers] = useState<PsionicPower[]>([]);
  const [gameMechanics, setGameMechanics] = useState<GameMechanic[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [archetypesRes, traitsRes, psionicsRes, mechanicsRes] = await Promise.all([
          fetch('/OverworldGame/json/character_creation/archetypes.json'),
          fetch('/OverworldGame/json/character_creation/traits.json'),
          fetch('/OverworldGame/json/character_creation/psionics.json'),
          fetch('/OverworldGame/json/character_creation/game_mechanics.json')
        ]);

        if (archetypesRes.ok) setArchetypes(await archetypesRes.json());
        if (traitsRes.ok) setTraits(await traitsRes.json());
        if (psionicsRes.ok) setPsionicPowers(await psionicsRes.json());
        if (mechanicsRes.ok) setGameMechanics(await mechanicsRes.json());
      } catch (error) {
        console.warn('Failed to load character creation data:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4 text-center">
        <h1 className="title-text text-4xl md:text-6xl font-black glow-text">
          REMNANTS LORE
        </h1>
        <p className="text-xl text-muted-foreground">
          Tales and records from the ashes of civilization.
        </p>
      </div>

      {/* Main Lore Entries */}
      <div className="grid gap-6 md:grid-cols-2">
        {loreEntries.map(entry => (
          <Link
            key={entry.to}
            to={entry.to}
            className="block p-4 rounded-lg cyber-border hover:bg-card/50 holo-hover"
          >
            <h2 className="terminal-text text-primary text-lg font-bold">
              {entry.title}
            </h2>
            <p className="text-sm text-muted-foreground">{entry.description}</p>
          </Link>
        ))}
      </div>

      {/* Character Creator Tool */}
      <CharacterCreator />

      {/* Character Archetypes */}
      {archetypes.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="terminal-text text-2xl font-bold">CHARACTER ARCHETYPES</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {archetypes.map(archetype => (
              <Card key={archetype.name} className="cyber-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="terminal-text text-primary">{archetype.name.toUpperCase()}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">Starting Skills:</h4>
                    <div className="flex flex-wrap gap-1">
                      {archetype.starting_skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">Special Abilities:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {archetype.special_abilities.map((ability, idx) => (
                        <li key={idx}>• {ability}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Traits */}
      {traits.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Dice6 className="h-6 w-6 text-primary" />
            <h2 className="terminal-text text-2xl font-bold">CHARACTER TRAITS</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-bold text-primary mb-4">Advantages</h3>
              <div className="space-y-3">
                {traits.filter(trait => trait.category === 'Advantage').map(trait => (
                  <Card key={trait.name} className="cyber-border bg-card/30">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="terminal-text font-bold">{trait.name}</h4>
                        {trait.cost && (
                          <Badge variant="outline" className="text-xs">
                            Cost: {trait.cost}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{trait.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-destructive mb-4">Disadvantages</h3>
              <div className="space-y-3">
                {traits.filter(trait => trait.category === 'Disadvantage').map(trait => (
                  <Card key={trait.name} className="cyber-border bg-card/30">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="terminal-text font-bold">{trait.name}</h4>
                        {trait.bonus_points && (
                          <Badge variant="destructive" className="text-xs">
                            +{trait.bonus_points} pts
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{trait.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Psionic Powers */}
      {psionicPowers.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="terminal-text text-2xl font-bold">PSIONIC POWERS</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {psionicPowers.map(power => (
              <Card key={power.name} className="cyber-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="terminal-text text-primary text-lg">{power.name}</CardTitle>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className="text-xs">
                        Lvl {power.level}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {power.mana_cost} MP
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex gap-2 text-xs">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="text-foreground">{power.category}</span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="text-muted-foreground">Range:</span>
                    <span className="text-foreground">{power.range}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{power.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Game Mechanics */}
      {gameMechanics.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Cog className="h-6 w-6 text-primary" />
            <h2 className="terminal-text text-2xl font-bold">GAME MECHANICS</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {gameMechanics.map(mechanic => (
              <Card key={mechanic.name} className="cyber-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="terminal-text text-primary">{mechanic.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{mechanic.description}</p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">Rules:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {mechanic.rules.map((rule, idx) => (
                        <li key={idx}>• {rule}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RemnantsLore;
