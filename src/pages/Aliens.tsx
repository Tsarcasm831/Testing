import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Users } from "lucide-react";

interface Troop {
  name: string;
  version: string;
}

interface Alien {
  name: string;
  data: {
    troops?: Troop[];
    [key: string]: unknown;
  };
}

const alienFiles = [
  "anthromorph",
  "avianos",
  "behemoth",
  "chiropteran",
  "dengar",
  "kilrathi",
  "mutants",
  "shalrah_p",
  "t_ana_rhe",
  "tal_ehn",
  "talorian",
  "vyraxus",
  "xithrian",
];

export const Aliens = () => {
  const [aliens, setAliens] = useState<Alien[]>([]);
  const [selectedAlien, setSelectedAlien] = useState<Alien | null>(null);
  const [imageMap, setImageMap] = useState<Record<string, string[]>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, "_");

  const filteredAliens = aliens.filter(alien =>
    alien.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const loadJson = async (url: string) => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch ${url}: ${res.status}`);
        }
        return await res.json();
      } catch (err) {
        console.warn(`Failed to load ${url}`, err);
        return null;
      }
    };

    Promise.all(
      alienFiles.map(name =>
        loadJson(`/json/Game/${name}.json`).then(data =>
          data ? { name, data } : null
        )
      )
    )
      .then(alienData => {
        setAliens(
          (alienData as (Alien | null)[]).filter(
            (a): a is Alien => a !== null
          )
        );
      })
      .catch(err => console.error("Failed to load alien data", err));

    loadJson("/images.json").then(imageUrls => {
      const urls = Array.isArray(imageUrls) ? (imageUrls as string[]) : [];
      const map: Record<string, string[]> = {};
      urls.forEach(url => {
        const alienMatch = url.match(/aliens\/([^/]+)/);
        if (alienMatch) {
          let key = alienMatch[1];
          if (key === "anthromorphs") key = "anthromorph";
          (map[key] ||= []).push(url);
        } else if (url.includes("/mutants/new/")) {
          (map["mutants"] ||= []).push(url);
        }
      });
      setImageMap(map);
      if ("caches" in window) {
        caches.open("alien-images").then(cache => {
          urls.forEach(url => {
            const req = new Request(url, { mode: "no-cors" });
            cache.add(req).catch(() => {});
          });
        });
      }
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="title-text text-4xl md:text-6xl font-black glow-text text-center">
          ALIENS
        </h1>
        <p className="text-center text-xl text-muted-foreground">
          A catalog of otherworldly species encountered across the wasteland.
        </p>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search alien species..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 cyber-border bg-card/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span className="terminal-text text-sm">
            {filteredAliens.length} of {aliens.length} species
          </span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAliens.map(alien => (
          <Card
            key={alien.name}
            onClick={() => setSelectedAlien(alien)}
            className="cursor-pointer cyber-border bg-card/50 backdrop-blur-sm holo-hover"
          >
            <img
              src={imageMap[alien.name]?.[0] || "/placeholder.svg"}
              alt={alien.name}
              className="w-full h-32 object-cover border-b border-primary/20"
            />
            <CardHeader>
              <CardTitle className="terminal-text text-center text-lg">
                {alien.name.toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-center">
                <Badge variant="secondary" className="text-xs">
                  {alien.data.troops?.length || 0} variants
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedAlien && (
        <Dialog
          open={!!selectedAlien}
          onOpenChange={open => !open && setSelectedAlien(null)}
        >
          <DialogContent
            aria-describedby={undefined}
            className="w-4/5 max-w-4xl"
          >
            <DialogHeader>
              <DialogTitle className="terminal-text text-lg glow-text flex items-center gap-2">
                <Users className="h-5 w-5" />
                {selectedAlien.name.toUpperCase()}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-sm">
                  {selectedAlien.data.troops?.length || 0} Known Variants
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Species Classification: {selectedAlien.name}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-auto p-2">
                {selectedAlien.data.troops?.map(troop => {
                  const imgs = imageMap[selectedAlien.name] || [];
                  const search = `${normalize(troop.name)}_${normalize(troop.version)}`;
                  const img = imgs.find(u => u.toLowerCase().includes(search));
                  return (
                    <Card key={`${troop.name}-${troop.version}`} className="cyber-border bg-card/30">
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`${troop.name} ${troop.version}`}
                        className="w-full h-32 object-contain border-b border-primary/20"
                      />
                      <CardContent className="p-3 text-center">
                        <h4 className="terminal-text text-sm font-bold">{troop.name}</h4>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {troop.version}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Aliens;

