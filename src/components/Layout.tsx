import { ReactNode } from "react";
import { Navigation } from "./Navigation";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Scan lines overlay */}
      <div className="fixed inset-0 scan-lines pointer-events-none z-0" />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main content */}
      <main className="relative z-10 pt-16 md:pt-20">
        {children}
      </main>
      
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Ambient glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-accent/5 rounded-full blur-2xl" />
      </div>
    </div>
  );
};