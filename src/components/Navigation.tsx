import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  Terminal,
  Music,
  User,
  Folder,
  Lock,
  LogOut,
  Satellite,
  BookOpen,
  Scroll,
  Gamepad,
  Map,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { href: "/", label: "Terminal", icon: Terminal },
    { href: "/music", label: "Music Vault", icon: Music },
    { href: "/about", label: "About", icon: User },
    { href: "/members", label: "Members", icon: Lock, auth: true },
  ];

  const gameItems = [
    { href: "/aliens", label: "Aliens", icon: Satellite },
    { href: "/core-rule-book", label: "Core Rule Book", icon: BookOpen },
    { href: "/lore", label: "Lore", icon: Scroll },
  ];

  const memberItems = [
    { href: "/members", label: "Member Vault", icon: Lock },
    { href: "/projects", label: "Projects", icon: Folder },
    { href: "/Game", label: "Game", icon: Gamepad },
    { href: "/OverworldGame", label: "OverworldGame", icon: Map },
    { href: "/concerts", label: "Concerts", icon: Music },
  ];

  const visibleNavItems = navItems.filter((item) => !item.auth || user);

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="terminal-text text-xl font-bold glow-text flicker">
                LORD<span className="text-secondary-bright">TSARCASM</span>
              </div>
              <div className="w-2 h-2 bg-primary rounded-full animate-glow-pulse"></div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                if (item.href === "/members") {
                  return (
                    <DropdownMenu key={item.href}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant={
                            isActive(item.href) ||
                            memberItems.some((i) => isActive(i.href))
                              ? "default"
                              : "ghost"
                          }
                          className={`holo-hover terminal-text ${
                            isActive(item.href) ||
                            memberItems.some((i) => isActive(i.href))
                              ? "bg-primary/20 text-primary border border-primary/50"
                              : "hover:bg-primary/10 hover:text-primary"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="terminal-text">
                        {memberItems.map((sub) => {
                          const SubIcon = sub.icon;
                          return (
                            <DropdownMenuItem
                              asChild
                              key={sub.href}
                              className="flex items-center space-x-2"
                            >
                              <Link to={sub.href}>
                                <SubIcon className="w-4 h-4" />
                                <span>{sub.label}</span>
                              </Link>
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }
                return (
                  <Button
                    key={item.href}
                    variant={isActive(item.href) ? "default" : "ghost"}
                    asChild
                    className={`
                      holo-hover terminal-text
                      ${isActive(item.href)
                        ? "bg-primary/20 text-primary border border-primary/50"
                        : "hover:bg-primary/10 hover:text-primary"}
                    `}
                  >
                    <Link to={item.href} className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                );
              })}

              {/* Game Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={gameItems.some((i) => isActive(i.href)) ? "default" : "ghost"}
                    className={`holo-hover terminal-text ${
                      gameItems.some((i) => isActive(i.href))
                        ? "bg-primary/20 text-primary border border-primary/50"
                        : "hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <Gamepad className="w-4 h-4" />
                    <span>Game</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="terminal-text">
                  {gameItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem asChild key={item.href} className="flex items-center space-x-2">
                        <Link to={item.href}>
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Auth Button */}
              {user ? (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={signOut}
                  className="terminal-text border-destructive/50 hover:border-destructive hover:text-destructive ml-2"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  asChild
                  className="terminal-text border-primary/50 hover:border-primary hover:text-primary ml-2"
                >
                  <Link to="/auth" className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-primary/20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="terminal-text font-bold glow-text">
              LORD<span className="text-secondary-bright">TSARCASM</span>
            </Link>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary hover:bg-primary/10"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="mt-4 py-4 border-t border-primary/20">
              <div className="flex flex-col space-y-2">
                {visibleNavItems.map((item) => {
                  const Icon = item.icon;
                  if (item.href === "/members") {
                    return (
                      <div key="members-menu">
                        <Button
                          variant={
                            membersOpen || memberItems.some((i) => isActive(i.href))
                              ? "default"
                              : "ghost"
                          }
                          onClick={() => setMembersOpen(!membersOpen)}
                          className="justify-start terminal-text hover:bg-primary/10 hover:text-primary"
                        >
                          <Icon className="w-4 h-4" />
                          <span>Members</span>
                          <ChevronDown
                            className={`w-4 h-4 transform transition-transform ${membersOpen ? "rotate-180" : "rotate-0"}`}
                          />
                        </Button>
                        {membersOpen && (
                          <div className="pl-4 space-y-1">
                            {memberItems.map((sub) => {
                              const SubIcon = sub.icon;
                              return (
                                <Button
                                  key={sub.href}
                                  variant={isActive(sub.href) ? "default" : "ghost"}
                                  asChild
                                  className={`justify-start terminal-text ${
                                    isActive(sub.href)
                                      ? "bg-primary/20 text-primary"
                                      : "hover:bg-primary/10 hover:text-primary"
                                  }`}
                                  onClick={() => {
                                    setIsOpen(false);
                                    setMembersOpen(false);
                                  }}
                                >
                                  <Link to={sub.href} className="flex items-center space-x-2">
                                    <SubIcon className="w-4 h-4" />
                                    <span>{sub.label}</span>
                                  </Link>
                                </Button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <Button
                      key={item.href}
                      variant={isActive(item.href) ? "default" : "ghost"}
                      asChild
                      className={`
                        justify-start terminal-text
                        ${isActive(item.href)
                          ? "bg-primary/20 text-primary"
                          : "hover:bg-primary/10 hover:text-primary"
                        }
                      `}
                      onClick={() => setIsOpen(false)}
                    >
                      <Link to={item.href} className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    </Button>
                  );
                })}

                {/* Game collapsible */}
                <Button
                  variant={gameOpen ? "default" : "ghost"}
                  onClick={() => setGameOpen(!gameOpen)}
                  className="justify-start terminal-text hover:bg-primary/10 hover:text-primary"
                >
                  <Gamepad className="w-4 h-4" />
                  <span>Game</span>
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform ${gameOpen ? "rotate-180" : "rotate-0"}`}
                  />
                </Button>
                {gameOpen && (
                  <div className="pl-4 space-y-1">
                    {gameItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.href}
                          variant={isActive(item.href) ? "default" : "ghost"}
                          asChild
                          className={`justify-start terminal-text ${
                            isActive(item.href)
                              ? "bg-primary/20 text-primary"
                              : "hover:bg-primary/10 hover:text-primary"
                          }`}
                          onClick={() => {
                            setIsOpen(false);
                            setGameOpen(false);
                          }}
                        >
                          <Link to={item.href} className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                )}
                
                {/* Mobile Auth Button */}
                {user ? (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="terminal-text border-destructive/50 hover:border-destructive hover:text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    asChild
                    className="justify-start terminal-text border-primary/50 hover:border-primary hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/auth" className="flex items-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>Sign In</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};