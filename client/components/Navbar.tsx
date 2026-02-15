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
        <Link to="/" className="flex items-center gap-2 group transition-all">
          <div className="relative w-12 h-12 flex items-center justify-center transition-all">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F45fc8b145c8c4f1f8f8dc09089e84ecd%2F639baa98c2974995863e87502945121e?format=webp&width=120&height=120"
              alt="ArchiTest Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-primary dark:from-white dark:to-primary">
            ArchiTest<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Main Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Generator</Link>
          <Link to="/templates" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Templates</Link>
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
