import React from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Check, ExternalLink, Play, ArrowRight, BookOpen, ShieldCheck, ShoppingCart, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

/**
 * Interface for a Template example.
 */
interface Template {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "Security" | "Commerce" | "Forms" | "Navigation";
  steps: string[];
  selectors: string;
}

const TEMPLATES: Template[] = [
  {
    id: "login-auth",
    title: "Secure Login Workflow",
    description: "Standard authentication test covering valid credentials and dashboard redirection.",
    icon: <ShieldCheck className="text-emerald-500" />,
    category: "Security",
    steps: [
      "Navigate to /login",
      "Enter valid username and password",
      "Click the 'Sign In' button",
      "Verify the 'Dashboard' header is visible",
      "Verify the URL contains '/dashboard'"
    ],
    selectors: JSON.stringify({
      userInput: "#username",
      passInput: "#password",
      submitBtn: "button[type='submit']",
      header: "h1.dashboard-title"
    }, null, 2)
  },
  {
    id: "ecom-cart",
    title: "Add to Cart & Checkout",
    description: "Complex flow involving product selection, cart updates, and navigation to checkout.",
    icon: <ShoppingCart className="text-blue-500" />,
    category: "Commerce",
    steps: [
      "Search for 'Premium Headphones'",
      "Select the first product result",
      "Click 'Add to Cart'",
      "Open the cart drawer",
      "Verify product price and quantity",
      "Click 'Proceed to Checkout'"
    ],
    selectors: JSON.stringify({
      searchBar: "input[name='q']",
      firstProduct: ".product-card:first-child",
      addBtn: ".add-to-cart-action",
      cartIcon: "#mini-cart-trigger"
    }, null, 2)
  },
  {
    id: "user-profile",
    title: "Profile Information Update",
    description: "Testing form data persistence after editing user profile details.",
    icon: <UserCircle className="text-amber-500" />,
    category: "Forms",
    steps: [
      "Navigate to /settings/profile",
      "Update display name and bio",
      "Upload a new profile picture placeholder",
      "Save changes",
      "Refresh page and verify updated data"
    ],
    selectors: JSON.stringify({
      nameField: "#display-name",
      bioField: "textarea#bio",
      uploadInput: "input[type='file']",
      saveBtn: ".btn-save-settings"
    }, null, 2)
  }
];

/**
 * Templates Page component.
 * Displays common automation scenarios that users can copy or use as inspiration.
 */
export default function Templates() {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyTemplateSteps = (template: Template) => {
    const text = `Scenario: ${template.title}\nSteps:\n${template.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopiedId(template.id);
    toast({
      title: "Steps Copied",
      description: "You can now paste these into the Automation Wizard Step 3.",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="container py-12 md:py-20 space-y-12">
        <div className="max-w-3xl space-y-4">
          <Badge variant="outline" className="px-3 py-1 text-primary border-primary/20 bg-primary/5">
            Test Library
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900 dark:text-slate-50">
            Common Automation <span className="text-primary">Templates</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Quickly jumpstart your test prompts with these production-ready scenarios. 
            Copy the steps and paste them directly into the wizard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATES.map((tpl) => (
            <Card key={tpl.id} className="border-none shadow-lg bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {tpl.icon}
                  </div>
                  <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-widest">
                    {tpl.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{tpl.title}</CardTitle>
                <CardDescription className="line-clamp-2">{tpl.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Flow Steps</span>
                    <ul className="space-y-2">
                      {tpl.steps.slice(0, 3).map((step, i) => (
                        <li key={i} className="text-sm flex items-start gap-2 text-slate-600 dark:text-slate-400">
                          <div className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[8px] flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          {step}
                        </li>
                      ))}
                      {tpl.steps.length > 3 && (
                        <li className="text-xs text-muted-foreground italic font-medium pl-6">
                          + {tpl.steps.length - 3} more steps...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 flex gap-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 gap-2 rounded-lg"
                  onClick={() => copyTemplateSteps(tpl)}
                >
                  {copiedId === tpl.id ? <Check size={14} /> : <Copy size={14} />}
                  Copy Steps
                </Button>
                <Link to="/" className="shrink-0">
                  <Button size="sm" className="gap-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border-none shadow-none">
                    <ArrowRight size={14} />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <section className="mt-20 p-8 md:p-12 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold backdrop-blur-md">
                <BookOpen size={14} /> Documentation
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Don't see your use case? 
                <br />
                <span className="text-primary">Customize your own.</span>
              </h2>
              <p className="text-slate-400 text-lg">
                The Automation Wizard is designed to be highly flexible. You can input any custom selector maps, 
                dynamic data, and multi-step workflows.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/">
                  <Button className="rounded-full px-8 h-12 gap-2 text-lg">
                    Back to Generator <ArrowRight size={18} />
                  </Button>
                </Link>
                <Button variant="outline" className="rounded-full px-8 h-12 gap-2 border-white/20 hover:bg-white/10">
                   Browse All Docs
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                   <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                   </div>
                   <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Example Config</span>
                </div>
                <pre className="text-sm font-mono text-primary/80">
                  <code>{`{
  "scenario": "Login",
  "priority": "P0",
  "tags": ["smoke", "auth"],
  "data": {
    "retry": 3,
    "timeout": 5000
  }
}`}</code>
                </pre>
              </div>
            </div>
          </div>
          {/* Background decoration for the banner */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] -z-0" />
        </section>
      </main>
      
      <footer className="pt-12 pb-8 border-t text-center space-y-4 bg-white dark:bg-slate-950">
        <p className="text-xs text-muted-foreground opacity-60">
          © {new Date().getFullYear()} AutoPrompt. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
