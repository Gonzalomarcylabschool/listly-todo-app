# Listly Todo App - Frontend

A mobile-first todo application built with React, Vite, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Landing Page**: Compelling introduction explaining the app's value proposition
- **User Authentication**: Email/password signup and login
- **Task Management**: Create, edit, delete, and organize tasks
- **Mobile-First Design**: Optimized for mobile devices with responsive design
- **Dark Mode Support**: Toggle between light and dark themes
- **Real-time Updates**: Immediate UI feedback for all actions

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **Lucide React** for icons

## 📱 Pages & Routes

- `/` - Landing page (default route)
- `/login` - User login page
- `/signup` - User registration page
- `/dashboard` - Main application dashboard (protected)

## 🎯 Target Users

The app is designed for busy professionals who struggle with task management:

- **Freelancers** managing multiple clients and projects
- **Teachers** juggling lesson planning and administrative tasks
- **Busy Parents** balancing work and family responsibilities

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Backend Setup

Make sure the backend server is running on `http://localhost:3001` before testing authentication features.

## 🎨 Design Principles

- **Mobile-First**: All components designed for mobile devices first
- **Simplicity**: Clean, minimal interface with focus on core functionality
- **Speed**: Task creation in under 10 seconds
- **Motivation**: Positive feedback and gentle reminders

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (Auth, etc.)
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── pages/          # Page components
│   ├── Landing.tsx # Landing page
│   ├── Login.tsx   # Login page
│   ├── Signup.tsx  # Signup page
│   └── Dashboard.tsx # Main dashboard
└── App.tsx         # Main app component with routing
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

## 🧪 Testing

The app includes comprehensive testing for:
- Unit tests for utilities
- Component testing
- Integration tests for API calls
- E2E tests for critical user journeys

## 📱 Mobile Optimization

- Responsive design with mobile-first approach
- Touch-friendly interface elements
- Fast load times (<1.5s on mobile)
- Optimized for 4G connections

## 🔒 Security

- Secure authentication with JWT tokens
- Password hashing with bcrypt
- Input validation and sanitization
- Protected routes for authenticated users

## 🚀 Deployment

The app is optimized for production deployment with:
- Optimized bundle size
- Static asset optimization
- Environment variable configuration
- HTTPS support

---

Built with ❤️ for busy professionals who need better task management.
