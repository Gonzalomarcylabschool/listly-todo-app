# Project Rules & Development Guidelines

## Code Quality & Standards

### General Principles
- **Mobile-First**: All components must be designed for mobile devices first, then enhanced for desktop
- **Performance**: Target <1.5s page load times on mobile 4G connections
- **Simplicity**: Prioritize ease of use over feature complexity
- **Accessibility**: Follow WCAG 2.1 AA guidelines for inclusive design

### Tech Stack Compliance
- **Frontend**: React with Vite bundler only
- **Backend**: Node.js with Express.js only
- **Database**: PostgreSQL with proper migrations
- **Styling**: Tailwind CSS + shadcn/ui components only
- **Authentication**: Email/password only (NO OAuth/third-party login)
- **Password Security**: bcrypt for hashing (minimum 12 rounds)

### Code Organization
- Use TypeScript for type safety
- Implement proper error boundaries in React
- Follow RESTful API design patterns
- Use environment variables for all configuration
- Implement proper logging for debugging

## UI/UX Requirements

### Design Principles
- **Clean & Minimal**: Remove visual clutter, focus on core actions
- **Fast Task Creation**: Users must be able to add tasks in <10 seconds
- **Visual Feedback**: Clear states for pending, completed, and overdue tasks
- **Motivational**: Positive reinforcement for task completion

### Component Standards
- All forms must have proper validation and error messages
- Loading states required for all async operations
- Consistent spacing using Tailwind's spacing scale
- Responsive breakpoints: mobile (default), tablet (768px+), desktop (1024px+)

### Color & Theme Guidelines
- Support light/dark mode toggle (Nice to Have feature)
- Use semantic colors (success, warning, error, info)
- Maintain high contrast ratios for accessibility
- Priority colors: High (red), Medium (yellow), Low (green)

## Database & Security Rules

### Data Modeling
- Use enums for priority levels: 'low', 'medium', 'high'
- Use enums for task status: 'pending', 'completed', 'deferred'
- Store deadlines in UTC with timezone support
- Implement soft deletes for tasks (don't hard delete user data)

### Security Requirements
- All passwords must be hashed with bcrypt
- Session management via secure HTTP-only cookies OR JWT tokens
- Input validation on both client and server
- Rate limiting on authentication endpoints
- HTTPS in production (redirect HTTP to HTTPS)

### API Design
- RESTful endpoints with proper HTTP status codes
- Consistent JSON response format
- Proper error handling with user-friendly messages
- API versioning (start with v1)

## Testing Requirements

### Coverage Standards
- Unit tests for all utility functions
- Integration tests for API endpoints
- Component testing for React components
- E2E tests for critical user journeys (signup, login, task CRUD)

### Testing Strategy
- Test mobile-first responsive design
- Test authentication flows thoroughly
- Test task operations (create, read, update, delete, defer)
- Test edge cases (network failures, validation errors)

## Performance Guidelines

### Frontend Performance
- Lazy load non-critical components
- Optimize images and assets
- Minimize bundle size
- Use React.memo for expensive components
- Implement proper caching strategies

### Backend Performance
- Database query optimization
- Proper indexing on frequently queried fields
- Connection pooling for database
- Caching for repeated queries
- Monitor and log slow queries

## Development Workflow

### Feature Development
1. Start with "Must Have" features only
2. Complete full feature (frontend + backend + tests) before moving to next
3. Mobile testing required before marking feature complete
4. User acceptance testing against PRD criteria

### Code Review Requirements
- All code must be reviewed before merging
- Check compliance with these project rules
- Verify mobile-first implementation
- Confirm security best practices
- Test performance on mobile devices

### Release Criteria
- All "Must Have" features implemented and tested
- Performance targets met (<1.5s load time)
- Security audit passed
- Mobile usability testing completed
- Accessibility requirements verified

## Prohibited Practices

### What NOT to Use
- ❌ Third-party authentication (OAuth, social login)
- ❌ Complex UI libraries outside of shadcn/ui
- ❌ CSS frameworks other than Tailwind
- ❌ Non-PostgreSQL databases
- ❌ Client-side routing libraries other than React Router
- ❌ State management libraries until proven necessary

### Anti-Patterns to Avoid
- ❌ Feature creep beyond PRD scope
- ❌ Complex animations that hurt performance
- ❌ Desktop-first design approaches
- ❌ Storing sensitive data in localStorage
- ❌ Hard-coded configuration values
- ❌ Blocking UI operations without loading states 