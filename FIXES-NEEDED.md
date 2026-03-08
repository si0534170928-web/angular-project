# Frontend – Remaining Fixes for New Developer

This document lists what is still broken or missing in the Angular frontend.
Each issue includes: what is wrong, which files to touch, and exactly what to do.

---

## FIX #1 – CRITICAL: Load Tasks Inside Project Details Page

### What is wrong
The page `/projects/:id` has a "Tasks" card but it always shows "No tasks yet"
even when there ARE tasks. The tasks for the project are never fetched.

### Why it happens
`TasksService.loadProjectTasks(projectId)` exists and is ready, but nobody calls it
from the `ProjectDetails` component.

### Files to change
- `src/app/features/projects/pages/project-details/project-details.component.ts`
- `src/app/features/projects/pages/project-details/project-details.component.html`
- `src/app/features/projects/pages/project-details/project-details.component.css`

### What to do

**component.ts:**
1. Inject `TasksService` (already exists at `src/app/features/tasks/tasks.service.ts`).
2. Create a local signal: `projectTasks = this.tasksService.tasks`.
3. Inside `loadProjectData()`, after setting `this.currentProject`,
   call `this.tasksService.loadProjectTasks(projectId)`.

**component.html:**
Replace the empty placeholder inside the Tasks card with a real list:
- Show a loading indicator while tasks load.
- Show the list of tasks when loaded. Each task row should show:
  - Task title
  - Priority badge (low / normal / high)
  - Status badge (todo / in_progress / done)
  - A "View" button that navigates to `/projects/:id/tasks/:taskId`
- If the list is empty AFTER loading, show:
  "No tasks yet. Click Add Task to create one."

**component.css:**
Add simple styles for the task rows inside the card.

---

## FIX #2 – CRITICAL: "Add Task" Button Must Open a Form

### What is wrong
The "Add Task" button on the Project Details page exists but only does `console.log()`.
Clicking it does nothing visible to the user.

### Files to change
- `src/app/features/projects/pages/project-details/project-details.component.ts`
- `src/app/features/projects/pages/project-details/project-details.component.html`
- Create new file: `src/app/features/tasks/components/create-task-modal/`
  - `create-task-modal.component.ts`
  - `create-task-modal.component.html`
  - `create-task-modal.component.css`

### What to do

**Create the modal component:**
A simple dialog/modal with a form containing these fields:
| Field | Type | Required |
|-------|------|----------|
| Title | text input | YES |
| Description | textarea | no |
| Priority | select: low / normal / high | no (default: normal) |
| Status | select: todo / in_progress / done | no (default: todo) |

On submit: call `TasksService.createTask({ projectId, title, description, priority, status })`.
On success: close the modal. The task list will update automatically via the signal.
On cancel: close the modal, do not save.

**In project-details.component.ts:**
- Add signal: `showCreateTaskModal = signal(false)`.
- Change `onAddTask()` from `console.log()` to `this.showCreateTaskModal.set(true)`.
- Add method `onTaskCreated()` that sets `showCreateTaskModal.set(false)`.

**In project-details.component.html:**
- Add `<app-create-task-modal>` below the tasks card.
- Pass `[isOpen]="showCreateTaskModal()"` and `[projectId]="projectId"`.
- Listen to `(close)="showCreateTaskModal.set(false)"`.

**API call to use:**
```
POST /api/tasks
Body: { projectId, title, description, status, priority }
```
This is already implemented in `TasksService.createTask()`.

---

## FIX #3 – Scroll to New Comment After Adding

### What is wrong
After the user submits a comment, the page does not scroll down to show the new comment.
The guideline requires: *"גלילה/פוקוס לתגובה חדשה"* (scroll/focus to new comment).

### Files to change
- `src/app/features/tasks/pages/task-detail/task-detail.component.ts`
- `src/app/features/tasks/pages/task-detail/task-detail.component.html`

### What to do

**component.html:**
Add a template reference at the bottom of the comments list:
```html
<div #commentsBottom></div>
```
Place it just below the `*ngFor` loop that renders comments.

**component.ts:**
1. Inject `ViewChild` and `ElementRef` from `@angular/core`.
2. Add: `@ViewChild('commentsBottom') commentsBottom!: ElementRef;`
3. In `onSubmitComment()`, after calling `addComment()`, add:
```typescript
setTimeout(() => {
  this.commentsBottom?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
}, 100);
```
The `setTimeout` is needed to wait for Angular to render the new comment first.

---

## FIX #4 – Add aria-label to Buttons and Fields

### What is wrong
The guidelines require basic accessibility:
*"נגישות בסיסית: aria-labels לכפתורים/שדות"*
Most buttons and form fields are missing `aria-label` attributes.

### Files to change
Any component that has buttons or inputs without descriptive text visible to screen readers.
Most important ones:
- `src/app/layout/header/user-menu.html`
- `src/app/features/projects/pages/project-details/project-details.component.html`
- `src/app/features/tasks/pages/task-detail/task-detail.component.html`
- `src/app/shared/components/notifications/notifications.html` ← already has it ✅

### What to do
Add `aria-label="..."` to every button that has only an icon or no visible text.

Examples:
```html
<!-- Before -->
<button mat-button (click)="goBack()">
  <mat-icon>arrow_back</mat-icon> Back
</button>

<!-- After -->
<button mat-button (click)="goBack()" aria-label="Go back to projects list">
  <mat-icon>arrow_back</mat-icon> Back
</button>
```

```html
<!-- Before -->
<button (click)="logout()">Logout</button>

<!-- After -->
<button (click)="logout()" aria-label="Log out of your account">Logout</button>
```

For form fields in Angular Material, add `aria-label` to `<mat-select>` and `<textarea>`:
```html
<mat-select aria-label="Change task status" ...>
<textarea aria-label="Write a comment" ...>
```

---

## FIX #5 – Minor: Redirect After Login Should Go to /projects

### What is wrong
After a successful login, the app navigates to `/dashboard` instead of `/projects`.
The guideline says: *"שמירת token → ניווט ל‑/projects"*

### File to change
- `src/app/features/auth/login/login.ts`

### What to do
Change line:
```typescript
this.router.navigate(['/dashboard']);
```
To:
```typescript
this.router.navigate(['/projects']);
```

---

## Summary Table

| # | Issue | Priority | Estimated Effort |
|---|-------|----------|-----------------|
| 1 | Tasks not loading in Project Details | 🔴 Critical | Medium |
| 2 | Add Task button does nothing | 🔴 Critical | Medium |
| 3 | No scroll to new comment | 🟡 Required | Small |
| 4 | Missing aria-labels | 🟡 Required | Small |
| 5 | Wrong redirect after login | 🟢 Minor | Trivial |

**Start with Fix #1 and Fix #2. They are the most important for the application to work correctly.**
