import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bug, Github, Command } from "lucide-react";

/**
 * Global Navigation Bar component.
 * Features a sticky header with a glassmorphism effect and branding.
 */
export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Brand/Logo Area */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Bug size={22} />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
            AutoPrompt<span className="text-primary">.</span>
          </span>
        </div>

        {/* Main Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Generator</Link>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Templates</a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Resources</a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Github size={20} />
          </Button>
          <Button className="rounded-full gap-2 hidden sm:flex shadow-md shadow-primary/10">
            <Command size={16} /> Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
