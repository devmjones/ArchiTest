import React from "react";
import { Navbar } from "@/components/Navbar";
import { PromptWizard } from "@/components/PromptWizard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";

/**
 * Home Page component.
 * Serves as the main entry point for the AutoPrompt application,
 * wrapping the wizard in a standard layout with background decorations.
 */
export default function Index() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="container py-10 md:py-20 space-y-24">
        <PromptWizard />

        {/* Use Cases Section */}
        <section className="py-12 border-t">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Common Use Cases</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Not sure where to start? Check out our pre-built templates for common automation scenarios.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Auth Workflows</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Generate prompts for login, signup, and multi-factor authentication tests with precise assertions.
              </p>
              <Link to="/templates">
                <Button variant="link" className="p-0 h-auto text-primary gap-1 group">
                  View Template <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Dynamic Forms</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Perfect for complex multi-step forms, date pickers, and dynamic input validation testing.
              </p>
              <Link to="/templates">
                <Button variant="link" className="p-0 h-auto text-primary gap-1 group">
                  View Template <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">E-commerce Flows</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Automate cart management, checkout processes, and payment gateway redirection prompts.
              </p>
              <Link to="/templates">
                <Button variant="link" className="p-0 h-auto text-primary gap-1 group">
                  View Template <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Decorative Background Elements (Orbs/Blurs) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>
    </div>
  );
}
