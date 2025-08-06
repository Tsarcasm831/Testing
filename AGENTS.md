# Repository Guide

This project is a Vite + React + TypeScript web application with Tailwind CSS and shadcn-ui components. It also includes a Supabase backend integration.

## Structure Overview

- **src/** – Application source code
  - **components/** – React components (Layout, Navigation, RequireAuth and many reusable `ui` components)
  - **hooks/** – Custom React hooks (`useAuth`, `use-toast`, `use-mobile`)
  - **integrations/** – Currently contains Supabase client and types
  - **lib/** – Utility helpers
  - **pages/** – Route components such as Home, Music, About, Projects, Members, Auth and NotFound
  - **index.css** – Tailwind design system and global styles
  - **main.tsx** – Application entry
- **public/** – Static assets (favicon, robots.txt etc.)
- **supabase/** – Supabase configuration and SQL migrations
- **tailwind.config.ts** – Tailwind configuration
- **vite.config.ts** – Vite build configuration

## Development

Install dependencies with `npm install`.

Useful npm scripts:

- `npm run dev` – Start development server
- `npm run build` – Production build
- `npm run build:dev` – Build using development mode (useful for checking compilation)
- `npm run lint` – Run ESLint
- `npm run preview` – Preview production build

## Coding Style

- TypeScript (`.ts`/`.tsx`) is used throughout
- Two spaces for indentation
- End every file with a newline
- Reusable components live in `src/components` and follow existing patterns
- Use the helper `cn` from `src/lib/utils.ts` for class merging

## Programmatic Checks

Before committing, run:

```sh
npm run lint
npm run build:dev
```

Both commands must succeed with no errors.

## Pull Requests

Include a concise summary of what changed and mention if lint/build commands were executed successfully. Do not open new branches; commit directly to main.
