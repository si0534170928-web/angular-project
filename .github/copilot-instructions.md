# Copilot Instructions for TodoList Angular Project

## Project Overview
- **Purpose:** Team-based task management app (like ClickUp) with teams, projects, and Kanban-style tasks.
- **Stack:** Angular 21+, standalone components, signals, RxJS, modern DI, Node.js backend (external, not in this repo).
- **Structure:**
  - `src/app/features/auth/` — Authentication (login/register, JWT)
  - `src/app/features/teams/` — Teams (list, create, join)
  - `src/app/features/projects/` — Projects (per team)
  - `src/app/features/tasks/` — (To be implemented) Kanban board, CRUD
  - `src/app/core/services/` — API, Auth, Token services
  - `src/app/core/interceptors/` — JWT HTTP interceptor
  - `src/app/shared/` — Reusable UI components (buttons, dashboard)

## Key Patterns & Conventions
- **Signals** for state management in services and components (see `TeamsService`, `ProjectsService`).
- **Standalone Components**: Use `imports: []` in `@Component`.
- **API Layer:** All HTTP via `ApiService`, which is injected and uses the JWT interceptor.
- **DTOs:** All data models/types are in `DTOs/` folders per feature.
- **Routing:** Defined in `app.routes.ts`. Only auth routes are present; expand for teams, projects, tasks.
- **JWT Handling:**
  - Token stored in localStorage via `TokenService`.
  - `authInterceptor` adds `Authorization: Bearer <token>` to protected API calls.
- **UI/UX:**
  - Global header in `app.html` with navigation and (to be added) user menu.
  - Use `ActionButton` for consistent button styles.

## Developer Workflows
- **Start dev server:** `ng serve`
- **Build:** `ng build`
- **Unit tests:** `ng test` (uses Vitest)
- **Scaffold components:** `ng generate component <name>`

## Integration Points
- **Backend:** Expects Node.js API (see manager's instructions for endpoints).
- **Auth:** All protected endpoints require JWT; see `authInterceptor`.

## Project-Specific Advice
- **Follow the signals pattern** for all new stateful services.
- **Use DTOs** for all API data contracts.
- **Keep UI logic in components, business logic in services.**
- **When adding new features:**
  - Create a service in `core/services` or feature folder.
  - Add DTOs in `DTOs/`.
  - Use standalone components and import as needed.
- **For Kanban/tasks:** Follow the pattern in `ProjectsService` and `TeamsService` for state and API.

## Examples
- See `TeamsService` and `ProjectsService` for signals + API pattern.
- See `auth-form` for reactive forms and validation.
- See `app.html` for global layout and navigation.

---

**Update this file as new features and conventions are added.**
