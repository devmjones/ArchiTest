import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, ChevronLeft, Plus, Trash2, Copy, Check, Terminal, Layout, ListChecks, Settings2, FileUp, Database, Upload, Sparkles, Wand2, Monitor, Globe, Signal, MessageSquareText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Available Automation Frameworks and Languages supported by the wizard.
 */
type Framework =
  | "Selenium Java"
  | "Selenide Java"
  | "Selenium Python"
  | "Playwright Python"
  | "Playwright Java"
  | "Playwright JavaScript"
  | "Selenium JavaScript"
  | "Selenium C#"
  | "Cypress JavaScript";

/**
 * Structure for a single test step in the scenario builder.
 */
interface TestStep {
  id: string;
  action: string;
  expected: string;
}

/**
 * Structure for a single element selector in the mapping table.
 */
interface Selector {
  id: string;
  name: string;
  selector: string;
}

/**
 * Pre-configured example scenarios for each framework option.
 * These are used to populate the wizard with a "finished" example.
 */
const DEMO_SCENARIOS: Record<Framework, any> = {
  "Playwright JavaScript": {
    url: "https://demo.playwright.dev/todomvc",
    testName: "Standard Todo Management",
    description: "Verify that a user can add, toggle, and clear todos from the list.",
    steps: [
      { id: "1", action: "Navigate to the TodoMVC page", expected: "Header 'todos' is visible" },
      { id: "2", action: "Add 'Buy Milk' to the list", expected: "List contains 1 item" },
      { id: "3", action: "Toggle the checkbox for 'Buy Milk'", expected: "Item is marked as completed" }
    ],
    selectors: [
      { id: "s1", name: "newTodo", selector: ".new-todo" },
      { id: "s2", name: "todoItems", selector: ".todo-list li" }
    ],
    codingStandards: "Use modern async/await and Playwright's expect assertions with locators."
  },
  "Playwright Python": {
    url: "https://saucedemo.com",
    testName: "End-to-End E-commerce Checkout",
    description: "Login as a standard user, add a product to the cart, and complete the checkout process.",
    steps: [
      { id: "1", action: "Login with 'standard_user' and 'secret_sauce'", expected: "Product page is visible" },
      { id: "2", action: "Add 'Sauce Labs Backpack' to the cart", expected: "Cart badge shows '1'" },
      { id: "3", action: "Go to checkout and finish order", expected: "Thank you message is displayed" }
    ],
    selectors: [
      { id: "s1", name: "userField", selector: "#user-name" },
      { id: "s2", name: "passField", selector: "#password" },
      { id: "s3", name: "loginBtn", selector: "#login-button" }
    ],
    codingStandards: "Follow PEP 8, use the Page Object Model, and utilize Playwright's built-in auto-waiting."
  },
  "Playwright Java": {
    url: "https://github.com/login",
    testName: "GitHub Login Validation",
    description: "Verify that the login form handles invalid credentials correctly.",
    steps: [
      { id: "1", action: "Navigate to login page", expected: "Sign in form is present" },
      { id: "2", action: "Enter invalid email and password", expected: "Error message 'Incorrect username or password' appears" }
    ],
    selectors: [
      { id: "s1", name: "loginInput", selector: "#login_field" },
      { id: "s2", name: "passwordInput", selector: "#password" },
      { id: "s3", name: "errorFlash", selector: ".flash-error" }
    ],
    codingStandards: "Use JUnit 5, follow Java naming conventions, and implement a robust Page Object Model."
  },
  "Cypress JavaScript": {
    url: "https://example.cypress.io/commands/actions",
    testName: "UI Actions & Interactions",
    description: "Test various user actions like typing, clearing, and submitting a form.",
    steps: [
      { id: "1", action: "Type 'Hello World' into the email input", expected: "Input value matches 'Hello World'" },
      { id: "2", action: "Clear the input field", expected: "Input is empty" },
      { id: "3", action: "Click the action button", expected: "Verification message appears" }
    ],
    selectors: [
      { id: "s1", name: "emailField", selector: ".action-email" },
      { id: "s2", name: "actionBtn", selector: ".action-btn" }
    ],
    codingStandards: "Use Cypress custom commands where applicable and prioritize data-cy selectors."
  },
  "Selenium JavaScript": {
    url: "https://www.google.com",
    testName: "Google Search Functionality",
    description: "Perform a search query and verify that results are displayed.",
    steps: [
      { id: "1", action: "Accept cookie consent if visible", expected: "Consent dialog is gone" },
      { id: "2", action: "Type 'ArchiTest' into the search bar", expected: "Search suggestions appear" },
      { id: "3", action: "Press Enter", expected: "Results page contains 'ArchiTest'" }
    ],
    selectors: [
      { id: "s1", name: "searchBar", selector: "textarea[name='q']" },
      { id: "s2", name: "resultsContainer", selector: "#search" }
    ],
    codingStandards: "Use Selenium WebDriver with async/await and the official javascript bindings."
  },
  "Selenium Python": {
    url: "https://the-internet.herokuapp.com/login",
    testName: "Form Authentication Test",
    description: "Standard login test using a secure demo application.",
    steps: [
      { id: "1", action: "Enter 'tomsmith' as username", expected: "Username field contains text" },
      { id: "2", action: "Enter 'SuperSecretPassword!' as password", expected: "Password field contains text" },
      { id: "3", action: "Click Login button", expected: "Flash message 'You logged into a secure area!' is visible" }
    ],
    selectors: [
      { id: "s1", name: "username", selector: "#username" },
      { id: "s2", name: "password", selector: "#password" },
      { id: "s3", name: "loginBtn", selector: "button[type='submit']" }
    ],
    codingStandards: "Use pytest framework, webdriver_manager for driver setup, and explicit waits."
  },
  "Selenium C#": {
    url: "https://demoqa.com/text-box",
    testName: "Text Box Form Submission",
    description: "Verify that a complex form can be filled and submitted correctly.",
    steps: [
      { id: "1", action: "Enter Full Name, Email, and Address", expected: "Fields are populated" },
      { id: "2", action: "Click Submit", expected: "Output area displays the submitted data" }
    ],
    selectors: [
      { id: "s1", name: "fullName", selector: "#userName" },
      { id: "s2", name: "submitBtn", selector: "#submit" },
      { id: "s3", name: "output", selector: "#output" }
    ],
    codingStandards: "Use NUnit or xUnit, follow C# PascalCase naming conventions, and implement POM."
  },
  "Selenium Java": {
    url: "https://opensource-demo.orangehrmlive.com/",
    testName: "Admin Dashboard Navigation",
    description: "Login and navigate through the admin panel of an HRM system.",
    steps: [
      { id: "1", action: "Login with admin credentials", expected: "Dashboard is shown" },
      { id: "2", action: "Click on 'Admin' tab", expected: "User Management header is visible" },
      { id: "3", action: "Search for a specific user", expected: "Search result matches query" }
    ],
    selectors: [
      { id: "s1", name: "username", selector: "input[name='username']" },
      { id: "s2", name: "adminTab", selector: ".oxd-main-menu-item:contains('Admin')" }
    ],
    codingStandards: "Use TestNG or JUnit 5, Maven/Gradle for dependencies, and Selenium 4 features."
  },
  "Selenide Java": {
    url: "https://duckduckgo.com",
    testName: "Privacy-Focused Search Test",
    description: "Verify search results on DuckDuckGo using Selenide's concise syntax.",
    steps: [
      { id: "1", action: "Type 'Selenide vs Selenium' in search input", expected: "Input field is not empty" },
      { id: "2", action: "Click search icon", expected: "First result title contains 'Selenide'" }
    ],
    selectors: [
      { id: "s1", name: "searchBox", selector: "#searchbox_input" },
      { id: "s2", name: "searchBtn", selector: "button[type='submit']" }
    ],
    codingStandards: "Leverage Selenide's concise API ($ instead of findElement) and automatic waiting."
  }
};

export function PromptWizard() {
  // Wizard flow state
  const [step, setStep] = useState(1);

  // Core test configuration state
  const [framework, setFramework] = useState<Framework>("Playwright Python");
  const [url, setUrl] = useState("");
  const [testName, setTestName] = useState("");
  const [description, setDescription] = useState("");

  // Test scenario steps state
  const [testSteps, setTestSteps] = useState<TestStep[]>([
    { id: "1", action: "Navigate to the home page", expected: "" },
  ]);

  // Environment & Browser state
  const [browser, setBrowser] = useState("Chromium");
  const [viewport, setViewport] = useState("Desktop (1280x720)");
  const [network, setNetwork] = useState("No Throttling");

  // Advanced configuration state
  const [usePageObjects, setUsePageObjects] = useState(true);
  const [isBDD, setIsBDD] = useState(false);
  const [testRunner, setTestRunner] = useState("JUnit 5");
  const [codingStandards, setCodingStandards] = useState("Use descriptive variable names and clear assertions.");
  const [selectors, setSelectors] = useState<Selector[]>([
    { id: "1", name: "loginBtn", selector: "#login-button" },
  ]);
  const [testData, setTestData] = useState("");

  // UI state
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  /**
   * Generates synthetic test data based on the requested type.
   * Appends the result to the existing testData state.
   */
  const generateRandomData = (type: string) => {
    const firstNames = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];
    const domains = ["example.com", "testmail.org", "demo.io", "automation.net"];
    const streets = ["Maple Ave", "Oak St", "Washington Blvd", "Lakeview Dr", "Parkway Dr"];
    const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];

    let result = "";
    switch (type) {
      case "name":
        result = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        break;
      case "email":
        const fn = firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase();
        const ln = lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase();
        result = `${fn}.${ln}@${domains[Math.floor(Math.random() * domains.length)]}`;
        break;
      case "phone":
        result = `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
        break;
      case "address":
        result = `${Math.floor(Math.random() * 9000) + 100} ${streets[Math.floor(Math.random() * streets.length)]}, ${cities[Math.floor(Math.random() * cities.length)]}, USA`;
        break;
      case "date":
        const date = new Date();
        date.setDate(date.getDate() + Math.floor(Math.random() * 365));
        result = date.toISOString().split('T')[0];
        break;
    }

    setTestData(prev => prev ? `${prev}\n${result}` : result);
    toast({
      title: "Data Generated",
      description: `Added a random ${type} to test data.`,
    });
  };

  const addStep = () => {
    setTestSteps([...testSteps, { id: Math.random().toString(36).substr(2, 9), action: "", expected: "" }]);
  };

  const removeStep = (id: string) => {
    if (testSteps.length > 1) {
      setTestSteps(testSteps.filter((s) => s.id !== id));
    }
  };

  const updateStep = (id: string, field: keyof TestStep, value: string) => {
    setTestSteps(testSteps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const addSelector = () => {
    setSelectors([...selectors, { id: Math.random().toString(36).substr(2, 9), name: "", selector: "" }]);
  };

  const removeSelector = (id: string) => {
    if (selectors.length > 0) {
      setSelectors(selectors.filter((s) => s.id !== id));
    }
  };

  const updateSelector = (id: string, field: keyof Selector, value: string) => {
    setSelectors(selectors.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  /**
   * Compiles all user inputs into a structured Markdown prompt for an LLM.
   */
  const generatePrompt = () => {
    return `Generate a precise automated web UI test using ${framework}.

## Project Context
- **Base URL**: ${url || "N/A"}
- **Test Name**: ${testName || "Automated Test"}
- **Page Object Model**: ${usePageObjects ? "Yes, please follow POM pattern" : "No, keep it simple"}
- **BDD/Gherkin Support**: ${isBDD ? "Yes, generate a Gherkin .feature file and step definitions" : "No"}
${framework.includes("Java") ? `- **Test Runner**: ${testRunner}` : ""}
- **Coding Standards**: ${codingStandards}

## Environment & Browser Configuration
- **Browser**: ${browser}
- **Viewport**: ${viewport}
- **Network Profile**: ${network}

## Test Scenario
${description ? `**Description**: ${description}` : ""}

### Steps to Automate:
${testSteps.map((s, idx) => `${idx + 1}. ${s.action}${s.expected ? ` (Assertion: ${s.expected})` : ""}`).join("\n")}

${selectors.length > 0 ? `### Element Selectors Reference:
| Element Name | Selector |
|--------------|----------|
${selectors.map(s => `| ${s.name || "N/A"} | ${s.selector || "N/A"} |`).join("\n")}
` : ""}

${testData ? `### Test Data:
\`\`\`
${testData}
\`\`\`
` : ""}

## Requirements:
1. Use reliable selectors (prioritize ID, Name, Data-Test-ID, then CSS/XPath).
2. Include necessary imports and setup.
3. ${framework.includes("Java") ? "Ensure thread-safety and proper teardown." :
     framework.includes("Cypress") ? "Use Cypress best practices and custom commands if needed." :
     framework.includes("C#") ? "Follow C# coding conventions and use NUnit or xUnit assertions." :
     "Use async/await where applicable."}
4. Provide clean, well-commented code.
${framework.includes("Playwright") ? "5. Utilize built-in auto-waiting features." : ""}
${framework.includes("Cypress") ? "5. Utilize Cypress's built-in assertions and auto-retry logic." : ""}
`;
  };

  /**
   * Copies the generated prompt to the user's clipboard and shows a toast notification.
   */
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatePrompt());
    setIsCopied(true);
    toast({
      title: "Prompt Copied!",
      description: "The LLM prompt has been copied to your clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const resetWizard = () => {
    setUrl("");
    setTestName("");
    setDescription("");
    setTestSteps([{ id: "1", action: "Navigate to the home page", expected: "" }]);
    setSelectors([{ id: "1", name: "loginBtn", selector: "#login-button" }]);
    setTestData("");
    setBrowser("Chromium");
    setViewport("Desktop (1280x720)");
    setNetwork("No Throttling");
    setIsBDD(false);
    setUsePageObjects(true);
    setTestRunner("JUnit 5");
    setCodingStandards("Use descriptive variable names and clear assertions.");
    setStep(1);
    toast({
      title: "Wizard Reset",
      description: "All inputs have been cleared.",
    });
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 6));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  /**
   * Loads a complete demo scenario based on the selected framework.
   */
  const loadDemo = (f: Framework) => {
    const demo = DEMO_SCENARIOS[f];
    if (demo) {
      setFramework(f);
      setUrl(demo.url);
      setTestName(demo.testName);
      setDescription(demo.description);
      setTestSteps(demo.steps);
      setSelectors(demo.selectors);
      setCodingStandards(demo.codingStandards);

      toast({
        title: "Demo Scenario Loaded",
        description: `Successfully loaded a finished example for ${f}.`,
      });
    }
  };

  /**
   * Handles file uploads for selectors and test data by reading the file as text.
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "selectors" | "data") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (type === "selectors") {
        try {
          // Try to parse as JSON if it's a selector upload
          const parsed = JSON.parse(content);
          if (typeof parsed === 'object' && !Array.isArray(parsed)) {
            const newSelectors = Object.entries(parsed).map(([name, selector]) => ({
              id: Math.random().toString(36).substr(2, 9),
              name: String(name),
              selector: String(selector)
            }));
            setSelectors(newSelectors);
          } else if (Array.isArray(parsed)) {
            setSelectors(parsed.map(s => ({
              id: s.id || Math.random().toString(36).substr(2, 9),
              name: s.name || "",
              selector: s.selector || ""
            })));
          }
        } catch (e) {
          // If not JSON, just add a blank row (manual fallback)
          toast({
            title: "Format Error",
            description: "Could not parse selector file as JSON. Switching to manual input.",
            variant: "destructive"
          });
        }
      } else {
        setTestData(content);
      }
      toast({
        title: "File Uploaded",
        description: `${file.name} has been processed successfully.`,
      });
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <Badge variant="outline" className="px-3 py-1 text-primary border-primary/20 bg-primary/5">
          ArchiTest Wizard
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900 dark:text-slate-50">
          Construct Precise <span className="text-primary">Test Generation Prompts</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Generate high-quality prompts for Selenium, Playwright, Cypress, and Selenide tests in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Wizard Steps */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
            <div className="flex border-b">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 transition-colors duration-300 ${
                    i <= step ? "bg-primary" : "bg-slate-100 dark:bg-slate-800"
                  }`}
                />
              ))}
            </div>

            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-primary mb-2">
                {step === 1 && <Terminal size={20} />}
                {step === 2 && <Layout size={20} />}
                {step === 3 && <Monitor size={20} />}
                {step === 4 && <ListChecks size={20} />}
                {step === 5 && <Database size={20} />}
                {step === 6 && <Settings2 size={20} />}
                <span className="text-sm font-bold uppercase tracking-wider">Step {step} of 6</span>
              </div>
              <CardTitle className="text-2xl">
                {step === 1 && "Select Framework"}
                {step === 2 && "Test Details"}
                {step === 3 && "Environment & Browser"}
                {step === 4 && "Automation Steps"}
                {step === 5 && "Selectors & Data"}
                {step === 6 && "Configurations"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Choose the technology stack for your automation test."}
                {step === 2 && "Provide the core information about the test case."}
                {step === 3 && "Define where and how the test should be executed."}
                {step === 4 && "List the specific actions and assertions to be performed."}
                {step === 5 && "Upload or paste element selectors and test data."}
                {step === 6 && "Fine-tune the output with coding standards and patterns."}
              </CardDescription>
            </CardHeader>

            <CardContent className="min-h-[400px]">
              {step === 1 && (
                <div className="space-y-4 pt-4">
                  <Label>Automation Framework & Language</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Playwright JavaScript",
                      "Playwright Python",
                      "Playwright Java",
                      "Cypress JavaScript",
                      "Selenium JavaScript",
                      "Selenium Python",
                      "Selenium C#",
                      "Selenium Java",
                      "Selenide Java",
                    ].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFramework(f as Framework)}
                        className={`p-4 rounded-xl border-2 text-left transition-all hover:border-primary/50 group ${
                          framework === f 
                            ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                            : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900"
                        }`}
                      >
                        <div className="font-semibold text-lg mb-1 flex items-center justify-between">
                          {f}
                          {framework === f && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {f.includes("Playwright") ? "Modern, fast, and reliable end-to-end testing." :
                           f.includes("Cypress") ? "Developer-friendly, all-in-one testing framework." :
                           f.includes("C#") ? "Enterprise-grade automation for the .NET ecosystem." :
                           "The industry standard for web automation."}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            loadDemo(f as Framework);
                          }}
                          className="w-full h-8 text-[10px] uppercase font-bold tracking-widest gap-1.5 border-primary/20 hover:bg-primary/10 hover:text-primary rounded-lg transition-all"
                        >
                          <Sparkles size={12} /> Load Demo Prompt
                        </Button>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="url">Base URL</Label>
                    <Input 
                      id="url" 
                      placeholder="https://example.com/login" 
                      value={url} 
                      onChange={(e) => setUrl(e.target.value)}
                      className="rounded-lg h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testName">Test Case Name</Label>
                    <Input 
                      id="testName" 
                      placeholder="User Login Workflow" 
                      value={testName} 
                      onChange={(e) => setTestName(e.target.value)}
                      className="rounded-lg h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Short Description (Optional)</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Briefly explain what this test intends to cover..." 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[120px] rounded-lg resize-none"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                      <Globe size={16} className="text-primary" /> Target Browser
                    </Label>
                    <Select value={browser} onValueChange={setBrowser}>
                      <SelectTrigger className="h-12 rounded-lg">
                        <SelectValue placeholder="Select Browser" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chromium">Chromium (Chrome/Edge)</SelectItem>
                        <SelectItem value="Firefox">Firefox</SelectItem>
                        <SelectItem value="WebKit">WebKit (Safari)</SelectItem>
                        <SelectItem value="Cross-Browser">Cross-Browser (All)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                      <Monitor size={16} className="text-primary" /> Viewport / Device
                    </Label>
                    <Select value={viewport} onValueChange={setViewport}>
                      <SelectTrigger className="h-12 rounded-lg">
                        <SelectValue placeholder="Select Viewport" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Desktop (1280x720)">Desktop (1280x720)</SelectItem>
                        <SelectItem value="Desktop (1920x1080)">Desktop (1920x1080)</SelectItem>
                        <SelectItem value="iPhone 13 (Mobile)">iPhone 13 (Mobile)</SelectItem>
                        <SelectItem value="iPad Air (Tablet)">iPad Air (Tablet)</SelectItem>
                        <SelectItem value="Responsive (Custom)">Responsive (Custom)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                      <Signal size={16} className="text-primary" /> Network Profile
                    </Label>
                    <Select value={network} onValueChange={setNetwork}>
                      <SelectTrigger className="h-12 rounded-lg">
                        <SelectValue placeholder="Select Network Speed" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No Throttling">No Throttling (Fast)</SelectItem>
                        <SelectItem value="Fast 3G">Fast 3G</SelectItem>
                        <SelectItem value="Slow 3G">Slow 3G</SelectItem>
                        <SelectItem value="Offline">Offline Mode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Test Steps & Assertions</Label>
                    <Button variant="outline" size="sm" onClick={addStep} className="h-8 gap-1 rounded-full px-3">
                      <Plus size={14} /> Add Step
                    </Button>
                  </div>
                  <ScrollArea className="h-[350px] pr-4">
                    <div className="space-y-4 pb-4">
                      {testSteps.map((s, idx) => (
                        <div key={s.id} className="relative p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 group">
                          <div className="absolute -left-3 top-4 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </div>
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold text-muted-foreground">Action</span>
                              <Input
                                placeholder="e.g. Click on 'Login' button"
                                value={s.action}
                                onChange={(e) => updateStep(s.id, "action", e.target.value)}
                                className="border-none bg-slate-50 dark:bg-slate-800/50 focus-visible:ring-1 h-9"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold text-muted-foreground text-primary">Assertion (Optional)</span>
                              <Input
                                placeholder="e.g. Assert 'Dashboard' is visible"
                                value={s.expected || ""}
                                onChange={(e) => updateStep(s.id, "expected", e.target.value)}
                                className="border-none bg-primary/5 focus-visible:ring-1 h-9"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => removeStep(s.id)}
                            className="absolute -right-2 -top-2 p-1.5 rounded-full bg-white dark:bg-slate-900 border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6 pt-4">
                  <Tabs defaultValue="selectors" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="selectors" className="gap-2">
                        <FileUp size={16} /> Selectors
                      </TabsTrigger>
                      <TabsTrigger value="data" className="gap-2">
                        <Database size={16} /> Test Data
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="selectors" className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="selectors">Element Selector Map</Label>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={addSelector} className="h-8 gap-1 rounded-full px-3">
                            <Plus size={14} /> Add Selector
                          </Button>
                          <div className="relative">
                            <input
                              type="file"
                              id="selector-upload"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, "selectors")}
                              accept=".json,.txt,.csv"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-2 rounded-full"
                              onClick={() => document.getElementById('selector-upload')?.click()}
                            >
                              <Upload size={14} /> Upload JSON
                            </Button>
                          </div>
                        </div>
                      </div>

                      <ScrollArea className="h-[250px] pr-4">
                        <div className="space-y-3 pb-4">
                          <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-bold text-muted-foreground px-4">
                            <div className="col-span-4">Element Name</div>
                            <div className="col-span-7">Selector (CSS/XPath)</div>
                            <div className="col-span-1"></div>
                          </div>
                          {selectors.map((s) => (
                            <div key={s.id} className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 group">
                              <div className="col-span-4">
                                <Input
                                  placeholder="loginBtn"
                                  value={s.name}
                                  onChange={(e) => updateSelector(s.id, "name", e.target.value)}
                                  className="border-none bg-slate-50 dark:bg-slate-800/50 focus-visible:ring-1 h-8 text-xs"
                                />
                              </div>
                              <div className="col-span-7">
                                <Input
                                  placeholder="#login"
                                  value={s.selector}
                                  onChange={(e) => updateSelector(s.id, "selector", e.target.value)}
                                  className="border-none bg-primary/5 focus-visible:ring-1 h-8 text-xs font-mono"
                                />
                              </div>
                              <div className="col-span-1 flex justify-end">
                                <button
                                  onClick={() => removeSelector(s.id)}
                                  className="p-1 rounded-full text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                          {selectors.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground text-xs italic">
                              No selectors added. Click "Add Selector" or upload a JSON file.
                            </div>
                          )}
                        </div>
                      </ScrollArea>

                      <p className="text-[10px] text-muted-foreground italic">
                        Tip: Map descriptive names to their technical selectors. These will be used by the AI to write more accurate tests.
                      </p>
                    </TabsContent>
                    <TabsContent value="data" className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="testData">Test Data (CSV/JSON/Text)</Label>
                        <div className="flex gap-2">
                          <Select onValueChange={generateRandomData}>
                            <SelectTrigger className="h-8 w-[140px] rounded-full text-xs gap-2">
                              <Wand2 size={12} className="text-primary" />
                              <SelectValue placeholder="Generate Random" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="name">Full Name</SelectItem>
                              <SelectItem value="email">Email Address</SelectItem>
                              <SelectItem value="phone">Phone Number</SelectItem>
                              <SelectItem value="address">Postal Address</SelectItem>
                              <SelectItem value="date">Random Date</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="relative">
                            <input
                              type="file"
                              id="data-upload"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, "data")}
                              accept=".json,.txt,.csv"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-2 rounded-full"
                              onClick={() => document.getElementById('data-upload')?.click()}
                            >
                              <Upload size={14} /> Upload File
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Textarea
                        id="testData"
                        placeholder="user1, pass123&#10;user2, pass456"
                        value={testData}
                        onChange={(e) => setTestData(e.target.value)}
                        className="min-h-[250px] font-mono text-sm rounded-lg resize-none bg-slate-50/50 dark:bg-slate-900"
                      />
                      <p className="text-[10px] text-muted-foreground italic">
                        Tip: Provide rows of data for parameterized tests or complex objects.
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 rounded-xl border bg-slate-50/50 dark:bg-slate-900">
                      <Checkbox
                        id="pom"
                        checked={usePageObjects}
                        onCheckedChange={(checked) => setUsePageObjects(checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="pom"
                          className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Use Page Object Model (POM)
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Encourage the AI to generate structured, reusable page classes.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 rounded-xl border bg-primary/5 border-primary/10">
                      <Checkbox
                        id="bdd"
                        checked={isBDD}
                        onCheckedChange={(checked) => setIsBDD(checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="bdd"
                          className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                        >
                          <MessageSquareText size={14} className="text-primary" /> BDD / Gherkin Support
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Generate .feature files and step definitions for Cucumber integration.
                        </p>
                      </div>
                    </div>

                    {framework.includes("Java") && (
                      <div className="space-y-4 p-4 rounded-xl border bg-slate-50/50 dark:bg-slate-900">
                        <Label className="flex items-center gap-2">
                          <Settings2 size={16} className="text-primary" /> Java Test Runner
                        </Label>
                        <Select value={testRunner} onValueChange={setTestRunner}>
                          <SelectTrigger className="h-10 rounded-lg">
                            <SelectValue placeholder="Select Test Runner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="JUnit 5">JUnit 5</SelectItem>
                            <SelectItem value="TestNG">TestNG</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Choose the test execution framework for your Java project.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="standards">Custom Coding Standards</Label>
                    <Textarea
                      id="standards"
                      placeholder="e.g. Use CSS selectors over XPath, include Javadoc..."
                      value={codingStandards}
                      onChange={(e) => setCodingStandards(e.target.value)}
                      className="min-h-[150px] rounded-lg resize-none"
                    />
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between border-t bg-slate-50/50 dark:bg-slate-900/50 p-6">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={step === 1}
                className="gap-2 rounded-lg"
              >
                <ChevronLeft size={18} /> Previous
              </Button>
              <div className="flex gap-2">
                {step > 1 && (
                  <Button variant="outline" onClick={resetWizard} className="rounded-lg">
                    Reset
                  </Button>
                )}
                <Button
                  onClick={step === 6 ? copyToClipboard : nextStep}
                  className="gap-2 rounded-lg px-8 shadow-lg shadow-primary/20"
                >
                  {step === 6 ? (
                    <> {isCopied ? <Check size={18} /> : <Copy size={18} />} Copy Prompt </>
                  ) : (
                    <> Next Step <ChevronRight size={18} /> </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Prompt Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Prompt Preview</h3>
            <Badge variant="secondary" className="font-mono text-[10px]">PREVIEW MODE</Badge>
          </div>
          <Card className="border-none shadow-xl bg-[#1e293b] text-slate-300 overflow-hidden font-mono text-sm h-[calc(100%-2rem)] min-h-[500px]">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-[#0f172a] border-b border-slate-800">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
              <span className="ml-2 text-[10px] text-slate-500 font-sans font-bold">llm-prompt.md</span>
            </div>
            <ScrollArea className="h-[550px]">
              <div className="p-6 whitespace-pre-wrap">
                {generatePrompt().split('\n').map((line, i) => (
                  <div key={i} className="mb-1">
                    {line.startsWith('##') || line.startsWith('#') ? (
                      <span className="text-primary font-bold">{line}</span>
                    ) : line.startsWith('**') ? (
                      <span className="text-white font-semibold">{line}</span>
                    ) : line.startsWith('-') || line.match(/^\d\./) ? (
                      <span className="text-slate-400">{line}</span>
                    ) : (
                      line
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="absolute bottom-4 right-4">
               <Button 
                size="sm" 
                onClick={copyToClipboard}
                className="rounded-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 gap-2"
              >
                {isCopied ? <Check size={14} /> : <Copy size={14} />} 
                {isCopied ? "Copied" : "Copy"}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
        <div className="space-y-3 p-6 rounded-2xl bg-white dark:bg-slate-900 border shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Layout size={20} />
          </div>
          <h4 className="font-bold text-lg">Framework Specific</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Tailored instructions for Java, Python, JavaScript, C#, and modern tools like Playwright, Cypress, or Selenide.
          </p>
        </div>
        <div className="space-y-3 p-6 rounded-2xl bg-white dark:bg-slate-900 border shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <ListChecks size={20} />
          </div>
          <h4 className="font-bold text-lg">POM Integration</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Automatically includes instructions to follow the Page Object Model design pattern.
          </p>
        </div>
        <div className="space-y-3 p-6 rounded-2xl bg-white dark:bg-slate-900 border shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Terminal size={20} />
          </div>
          <h4 className="font-bold text-lg">Clean Code</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Enforces coding standards, reliable selectors, and best practices in the output.
          </p>
        </div>
      </div>

      <footer className="pt-12 pb-8 border-t text-center space-y-4">
        <div className="flex items-center justify-center gap-6">
          <a href="#" className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">Documentation</a>
          <a href="#" className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">Support</a>
          <a href="#" className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
        </div>
        <p className="text-xs text-muted-foreground opacity-60">
          © {new Date().getFullYear()} ArchiTest. Engineered for QA Professionals.
        </p>
      </footer>
    </div>
  );
}
