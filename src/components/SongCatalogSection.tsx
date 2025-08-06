import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface CatalogSong {
  song_title: string;
  spotify_url?: string;
  youtube_url?: string;
  apple_url?: string;
}

export const SongCatalogSection = () => {
  const [songs, setSongs] = useState<CatalogSong[]>([]);

  useEffect(() => {
    fetch("/json/songCatalog.json")
      .then(res => res.json())
      .then(setSongs)
      .catch(err => console.error("Failed to load song catalog", err));
  }, []);

  if (songs.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="terminal-text text-2xl text-accent font-bold">SONG CATALOG</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map(song => (
          <Card key={song.song_title} className="cyber-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="terminal-text text-lg glow-text">
                {song.song_title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {song.spotify_url && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="terminal-text text-xs hover:border-primary/50 hover:text-primary"
                >
                  <a href={song.spotify_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Spotify
                  </a>
                </Button>
              )}
              {song.youtube_url && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="terminal-text text-xs hover:border-primary/50 hover:text-primary"
                >
                  <a href={song.youtube_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    YouTube
                  </a>
                </Button>
              )}
              {song.apple_url && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="terminal-text text-xs hover:border-primary/50 hover:text-primary"
                >
                  <a href={song.apple_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Apple
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
