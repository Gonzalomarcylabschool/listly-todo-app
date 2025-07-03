Todo App Project Requirements Document (PRD)

## 1. Project Vision & Scope
Build a mobile-first web todo app designed to support users who struggle to keep up with their tasks. The focus is on simplicity, ease of use, and motivational support to encourage consistent use. This app targets users like freelancers, teachers, and busy professionals who need to quickly add, organize, and complete tasks without overwhelm.

## 2. Success Metrics & Goals
- **User Engagement**: At least 60% of registered users actively use the app weekly.
- **Task Completion**: Average task completion rate of 75% for active users.
- **Signup Conversion**: At least 40% of visitors sign up with email/password.
- **Performance**: Pages load within 1.5 seconds on mobile devices with typical 4G connection.
- **User Satisfaction**: Gather qualitative feedback with average rating of 4+ (out of 5) on usability.

## 3. User Personas

### Persona 1: Jamal, 30 — Freelancer
- Manages multiple clients and projects.
- Needs flexible task categorization.
- Wants quick task creation, prioritization, and progress tracking.
- Prefers simple, clean UI without third-party login.

### Persona 2: Maya, 24 — First-Year Teacher
- Juggles lesson planning, grading, and school duties.
- Gets overwhelmed by many small tasks and deadlines.
- Wants to feel in control and remember follow-ups.
- Frustrated by complex existing tools that require setup and maintenance.

### Persona 3: Lisa, 45 — Busy Parent and Office Worker
- Balances work and family responsibilities.
- Needs reminders and encouragement to keep up with daily chores and errands.
- Prefers minimal setup, motivational nudges, and a simple, accessible interface.

## 4. Key User Journeys

### Signing Up and Logging In
- User registers with email and password.
- User receives confirmation and logs in securely.
- User can reset password if forgotten.

### Creating and Managing Tasks
- User quickly adds a new task with minimal input.
- User edits or deletes tasks as priorities change.
- User sets priority and deadline for tasks.
- User defers tasks and reschedules them.

### Tracking Progress and Staying Motivated
- User marks tasks complete and sees visual progress indicators.
- User receives positive feedback on completing tasks.
- User gets gentle reminders if tasks are postponed frequently.

## 5. Feature List with Prioritization and Acceptance Criteria

| Feature | Priority | Acceptance Criteria (Success Look Like) |
|---------|----------|----------------------------------------|
| Email/password signup and login | Must Have | User can create account and log in securely |
| Password reset functionality | Must Have | User can request and complete password reset |
| Secure session handling | Must Have | Sessions are secure and persist until logout |
| Quick task creation | Must Have | User can add a new task in under 10 seconds |
| Edit and delete tasks | Must Have | User can update or remove tasks easily |
| Set task priorities | Must Have | User can select low, medium, or high priority for tasks |
| Assign deadlines | Must Have | User can assign a due date and see it clearly |
| Mark tasks as completed | Must Have | User can mark tasks complete and see updated status |
| Defer/postpone tasks | Must Have | User can defer tasks and reschedule deadlines |
| Visual progress dashboard | Must Have | User sees count of pending/completed tasks on dashboard |
| Clean, mobile-first UI | Must Have | UI renders well on phones, easy navigation |
| Color themes | Nice to Have | User can toggle between light and dark modes |
| Positive feedback messages | Nice to Have | User receives encouraging messages after completing tasks |
| Gentle reminders | Nice to Have | App reminds user gently when tasks are frequently deferred |

## 6. Technical Constraints & Decisions
- **Tech Stack**: PERN (PostgreSQL, Express, React, Node.js) with Vite as bundler.
- **Styling**: Tailwind CSS with shadcn for UI components.
- **Authentication**: Email/password signup only; no OAuth or third-party login.
- **Password Security**: bcrypt for password hashing.
- **Sessions**: Managed via secure HTTP-only cookies or JWT tokens.
- **Enums**: Priority and status stored as constrained string values for simplicity.
- **Performance**: Prioritize fast load times on mobile devices. 