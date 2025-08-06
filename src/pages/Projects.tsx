import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ExternalLink, Github, Play, Globe, Gamepad2, Music, BookOpen, Brain } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: "Game" | "Music" | "AI" | "Worldbuilding" | "Web" | "Experiment";
  tags: string[];
  status: "Active" | "Beta" | "Completed" | "Concept";
  links: {
    demo?: string;
    github?: string;
    download?: string;
    external?: string;
  };
  featured: boolean;
}

const projects: Project[] = [
  {
    id: "remnants",
    title: "Remnants of Destruction",
    description: "A comprehensive post-apocalyptic universe spanning games, music, and interactive fiction.",
    longDescription: "The flagship worldbuilding project that encompasses the entire Lord Tsarcasm mythos. A living, breathing universe where every song, story, and game connects to form an epic narrative of survival, rebellion, and rebirth.",
    category: "Worldbuilding",
    tags: ["Lore", "Interactive", "Cross-Media", "Community"],
    status: "Active",
    links: {
      demo: "#",
      external: "#"
    },
    featured: true
  },
  {
    id: "far-haven-map",
    title: "3D Overworld",
    description: "Explore the ruined megacity through an interactive, lore-rich digital map.",
    longDescription: "Navigate the districts of Far Haven, from the gleaming Corporate Spires to the shadowy Undercity. Each location contains hidden stories, faction territories, and secrets waiting to be discovered.",
    category: "Web",
    tags: ["React", "WebGL", "Interactive", "Lore"],
    status: "Beta",
    links: {
      demo: "#",
      github: "#"
    },
    featured: true
  },
];

const categoryIcons = {
  Game: Gamepad2,
  Music: Music,
  AI: Brain,
  Worldbuilding: BookOpen,
  Web: Globe,
  Experiment: Play
};

const statusColors = {
  Active: "text-primary border-primary/50",
  Beta: "text-accent border-accent/50", 
  Completed: "text-secondary-bright border-secondary/50",
  Concept: "text-muted-foreground border-muted/50"
};

export const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];
  
  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  const featuredProjects = filteredProjects.filter(p => p.featured);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="title-text text-4xl md:text-6xl font-black glow-text">
          PROJECTS
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Building the future from the fragments of tomorrow
        </p>
      </div>

      {/* Category Filter */}
      <div className="cyber-border bg-card/50 p-6 rounded-lg backdrop-blur-sm">
        <div className="space-y-3">
          <h3 className="terminal-text text-primary font-bold">Project Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`
                  terminal-text text-xs
                  ${selectedCategory === category 
                    ? "bg-primary/20 text-primary border-primary/50" 
                    : "border-muted hover:border-primary/50 hover:text-primary"
                  }
                `}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <div className="space-y-6">
          <h2 className="terminal-text text-2xl text-accent font-bold">FEATURED PROJECTS</h2>
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {featuredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                featured
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>
      )}


      {/* No Results */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="terminal-text text-muted-foreground text-lg">
            No projects found in this category...
          </div>
          <Button
            onClick={() => setSelectedCategory("All")}
            variant="outline"
            className="mt-4 terminal-text"
          >
            View All Projects
          </Button>
        </div>
      )}

      {selectedProject && (
        <Dialog
          open={!!selectedProject}
          onOpenChange={open => {
            if (!open) setSelectedProject(null);
          }}
        >
          <DialogContent className="max-w-xl">
            <ProjectDetails project={selectedProject} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
  onClick?: () => void;
}

const ProjectCard = ({ project, featured, onClick }: ProjectCardProps) => {
  const Icon = categoryIcons[project.category];

  return (
    <Card
      onClick={onClick}
      className={`
      holo-hover cyber-border bg-card/50 backdrop-blur-sm overflow-hidden h-full flex flex-col cursor-pointer
      ${featured ? "border-accent/50" : "border-primary/20"}
    `}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5 text-accent" />
            <Badge 
              variant="outline" 
              className={`terminal-text text-xs ${statusColors[project.status]}`}
            >
              {project.status}
            </Badge>
          </div>
          {featured && (
            <Badge className="terminal-text text-xs bg-accent/20 text-accent border-accent/50">
              FEATURED
            </Badge>
          )}
        </div>
        
        <CardTitle className="terminal-text text-lg glow-text">
          {project.title}
        </CardTitle>
        
        <p className="text-muted-foreground text-sm leading-relaxed">
          {project.description}
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {project.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs terminal-text">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Long Description */}
        <div className="text-muted-foreground text-sm leading-relaxed flex-1">
          {project.longDescription}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/20">
          {project.links.github && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="terminal-text text-xs hover:border-accent/50 hover:text-accent"
              onClick={e => e.stopPropagation()}
            >
              <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                <Github className="w-3 h-3 mr-1" />
                Code
              </a>
            </Button>
          )}
        </div>
    </CardContent>
  </Card>
);
};

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails = ({ project }: ProjectDetailsProps) => {
  const Icon = categoryIcons[project.category];

  return (
    <div className="space-y-4">
      <DialogHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5 text-accent" />
            <Badge
              variant="outline"
              className={`terminal-text text-xs ${statusColors[project.status]}`}
            >
              {project.status}
            </Badge>
          </div>
        </div>
        <DialogTitle className="terminal-text text-lg glow-text">
          {project.title}
        </DialogTitle>
        <DialogDescription className="text-muted-foreground text-sm">
          {project.description}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-wrap gap-1">
        {project.tags.map(tag => (
          <Badge key={tag} variant="secondary" className="text-xs terminal-text">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="text-muted-foreground text-sm leading-relaxed">
        {project.longDescription}
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/20">
        {project.links.demo && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="terminal-text text-xs hover:border-primary/50 hover:text-primary"
          >
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Play className="w-3 h-3 mr-1" />
              Demo
            </a>
          </Button>
        )}

        {project.links.github && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="terminal-text text-xs hover:border-accent/50 hover:text-accent"
          >
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-3 h-3 mr-1" />
              Code
            </a>
          </Button>
        )}

        {project.links.external && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="terminal-text text-xs hover:border-secondary/50 hover:text-secondary-bright"
          >
            <a
              href={project.links.external}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              View
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};
