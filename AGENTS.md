# Edumate Web - Agent Instructions

This document provides instructions for AI coding agents and assistants working on the `edumate-web` repository.

## 1. Technology Stack

- **Core Environment**: Node.js, `pnpm`
- **Framework**: React 19, TypeScript, Vite
- **Routing**: `@tanstack/react-router`
- **Data Fetching / State Management**: `@tanstack/react-query`
- **Styling**: TailwindCSS v4
- **Backend API Tools**: `axios`, `zod`
- **Authentication & Backend Basics**: Firebase

## 2. Project Architecture

- **`src/api/`**: Contains Axios client configuration, `zod` validation schemas, and TypeScript interfaces (`types.ts`). Endpoints are strictly grouped by feature under `src/api/endpoints/`.
- **`src/hooks/api/`**: Custom TanStack Query hooks corresponding to the endpoints. Always use these hooks in components instead of calling the API directly.
- **`src/routes/`**: Route definitions following TanStack Router standards.
- **`src/components/`**: Standard, reusable UI components and layouts.
- **`src/lib/`**: Helper functions and utilities.
- **`src/firebase.ts`**: Global Firebase configuration module (e.g., `auth`).

## 3. Communication Guidelines

- Backend responses strictly follow an envelope format:
  `{ "success": boolean, "data": any, "error": string }`
- The Axios setup in `src/api/client.ts` automatically unwraps this payload. Therefore, hooks should only handle the `data` field.
- Request authentication relies on `auth.currentUser.getIdToken()` configured implicitly via Firebase.
- Do not make HTTP calls using generic `fetch()`. Always use the Axios instance defined in `src/api/client.ts`.

## 4. Coding & Formatting Rules

- **Package Manager**: NEVER use `npm` or `yarn`. Use only `pnpm` for installing dependencies.
- **TypeScript & Zod**: Provide strict typings for any new payload shapes. Define the Zod schema first, then export its inferred type:
  `export type X = z.infer<typeof XSchema>`
- Avoid inline styles or string-based `style` manipulation if a Tailwind class is available.
- Run `pnpm run format` and `pnpm run lint` after major changes to ensure project conventions are followed. All PRs are checked by GitHub Actions for linting and type validation (including Trivy scan during build).

## 5. Build Commands

- `pnpm run dev`: Start local development server.
- `pnpm run build`: Build production bundle.
- `pnpm run lint`: Check code style.
- `pnpm run format`: Format code.
- `pnpm run preview`: Preview production build locally.
