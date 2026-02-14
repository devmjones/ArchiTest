# AutoPrompt. - Automation Wizard

Construct precise LLM prompts for generating automated web UI tests in Selenium, Playwright, Selenide, and more.

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PNPM](https://pnpm.io/) (Recommended) or NPM

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

Start the development server (client + server):
```bash
pnpm dev
```
The app will be available at `http://localhost:8080`.

### Production

1. Build the application:
   ```bash
   pnpm build
   ```
2. Start the production server:
   ```bash
   pnpm start
   ```

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS 3
- **Backend**: Express.js
- **UI Components**: Radix UI (via shadcn/ui), Lucide Icons
- **State Management**: React Hooks, TanStack Query
- **Testing**: Vitest

## 📖 Key Features

- **Multi-Framework Support**: Generate prompts for Java and Python across major automation tools.
- **Selector Management**: Upload or paste JSON/Text element maps for context-aware code generation.
- **Random Data Generator**: Quickly generate synthetic test data (names, emails, addresses, etc.).
- **Page Object Model (POM)**: Enforce structured design patterns in the generated output.
- **Live Preview**: Real-time markdown preview of the prompt before copying.

## 🧪 Testing & Linting

- Run tests: `pnpm test`
- Type checking: `pnpm typecheck`
- Format code: `pnpm format.fix`

## 📁 Project Structure

```
client/           # React SPA frontend
  ├── components/ # UI and Logic components
  ├── pages/      # Route components (Index.tsx)
  └── global.css  # Tailwind styles
server/           # Express API backend
  └── index.ts    # Main server setup
shared/           # Shared types and utilities
```
