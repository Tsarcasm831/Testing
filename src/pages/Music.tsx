import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, ExternalLink, Download, Heart, Share2 } from "lucide-react";
import { SongCatalogSection } from "@/components/SongCatalogSection";
import "../music.css";

interface Track {
  id: string;
  title: string;
  album: string;
  year: number;
  duration: string;
  lore: string;
  tags: string[];
  waveform: string;
  streams: {
    spotify?: string;
    apple?: string;
    youtube?: string;
    bandcamp?: string;
  };
}

// Mock data for the music vault
const tracks: Track[] = [
  {
    id: "1",
    title: "Last Signal from Far Haven",
    album: "Remnants of Destruction",
    year: 2024,
    duration: "4:32",
    lore: "Recorded the night the Shal'Rah invaded Far Haven. This was the final transmission before the communication arrays went dark.",
    tags: ["Melancholic", "Far Haven", "Shal'Rah", "Electronic"],
    waveform: "████▄▄▄███▄▄▄████████▄▄▄███",
    streams: {
      spotify: "#",
      youtube: "#",
      bandcamp: "#"
    }
  },
  {
    id: "2", 
    title: "Echoes in the Undercity",
    album: "Tales from Below",
    year: 2023,
    duration: "3:47",
    lore: "Written while exploring the abandoned metro tunnels beneath New Carthage. The acoustics down there... haunting.",
    tags: ["Dark", "Underground", "Ambient", "New Carthage"],
    waveform: "▄▄▄████▄▄▄███████▄▄▄████▄▄▄█",
    streams: {
      spotify: "#",
      apple: "#",
      youtube: "#"
    }
  },
  {
    id: "3",
    title: "H.I.V.E. Anthem",
    album: "Faction Wars",
    year: 2024,
    duration: "5:12",
    lore: "A rallying cry for the Human Intelligence Verification Enclave. Born from late nights coding in bunker networks.",
    tags: ["Energetic", "H.I.V.E.", "Cyber", "Resistance"],
    waveform: "████████▄▄▄█████████▄▄▄█████",
    streams: {
      spotify: "#",
      bandcamp: "#"
    }
  }
];

export const Music = () => {
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags
  const allTags = Array.from(new Set(tracks.flatMap(track => track.tags)));

  // Filter tracks by selected tags
  const filteredTracks = selectedTags.length > 0 
    ? tracks.filter(track => selectedTags.every(tag => track.tags.includes(tag)))
    : tracks;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const togglePlay = (trackId: string) => {
    setPlayingTrack(playingTrack === trackId ? null : trackId);
  };

  return (
    <div className="music-page container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="title-text text-4xl md:text-6xl font-black glow-text">
          MUSIC VAULT
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Chronicles from the wasteland, transmitted through sound waves and digital echoes
        </p>
      </div>

      {/* Tag Filter */}
      <div className="cyber-border bg-card/50 p-6 rounded-lg backdrop-blur-sm">
        <div className="space-y-3">
          <h3 className="terminal-text text-primary font-bold">Filter by Tags</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTag(tag)}
                className={`
                  terminal-text text-xs
                  ${selectedTags.includes(tag) 
                    ? "bg-primary/20 text-primary border-primary/50" 
                    : "border-muted hover:border-primary/50 hover:text-primary"
                  }
                `}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Music Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTracks.map(track => (
          <Card
            key={track.id}
            className="holo-hover cyber-border bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col h-full"
          >
            <CardHeader className="pb-4 flex-none">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="terminal-text text-xl glow-text">
                    {track.title}
                  </CardTitle>
                  <div className="text-muted-foreground terminal-text text-sm">
                    {track.album} • {track.year}
                  </div>
                </div>
                <Badge variant="outline" className="terminal-text text-xs border-primary/50">
                  {track.duration}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-4">
                {/* Waveform */}
                <div className="bg-background/50 p-4 rounded border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePlay(track.id)}
                      className="text-primary hover:bg-primary/10"
                    >
                      {playingTrack === track.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>

                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="waveform terminal-text text-primary text-lg font-mono tracking-wider">
                    {track.waveform}
                  </div>
                </div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {track.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs terminal-text">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                {/* Lore */}
                <div className="space-y-2">
                  <h4 className="terminal-text text-sm text-accent font-bold">TRANSMISSION LOG:</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {track.lore}
                  </p>
                </div>

                {/* Streaming Links */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-primary/20 mt-auto">
                  {Object.entries(track.streams).map(([platform, url]) => (
                    <Button
                      key={platform}
                      variant="outline"
                      size="sm"
                      asChild
                      className="terminal-text text-xs hover:border-primary/50 hover:text-primary"
                    >
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        {platform}
                      </a>
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    className="terminal-text text-xs hover:border-secondary/50 hover:text-secondary-bright"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SongCatalogSection />

      {/* No Results */}
      {filteredTracks.length === 0 && (
        <div className="text-center py-12">
          <div className="terminal-text text-muted-foreground">
            No transmissions found matching your filters...
          </div>
          <Button
            onClick={() => setSelectedTags([])}
            variant="outline"
            className="mt-4 terminal-text"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};