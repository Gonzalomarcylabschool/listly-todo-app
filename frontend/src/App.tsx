"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { Landing } from "./pages/Landing"
import { Login } from "./pages/Login"
import { Signup } from "./pages/Signup"
import { Dashboard } from "./pages/Dashboard"
import { Nav } from "./components/Nav"
import { useTasks } from "./hooks/useTasks"

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// Auth Route Component (redirects authenticated users)
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

// Dashboard Layout Component
function DashboardLayout() {
  const [currentView, setCurrentView] = useState<"dashboard" | "categories" | "settings">("dashboard")
  const [darkMode, setDarkMode] = useState(false)
  const { tasks } = useTasks()

  // Initialize dark mode from system preference
  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setDarkMode(isDark)
  }, [])

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const taskCounts = {
    pending: tasks.filter((t) => t.status === "pending").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    deferred: tasks.filter((t) => t.status === "deferred").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Nav
          currentView={currentView}
          onViewChange={setCurrentView}
          onAddTask={() => {}} // TODO: Implement task form
          taskCounts={taskCounts}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {currentView === "dashboard" && <Dashboard />}
            {currentView === "categories" && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Categories</h2>
                <p className="text-muted-foreground">Category management coming soon!</p>
              </div>
            )}
            {currentView === "settings" && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                <p className="text-muted-foreground">Settings panel coming soon!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

// Landing Page Component with Navigation
function LandingPage() {
  const navigate = useNavigate()
  
  const handleNavigateToSignup = () => {
    navigate('/signup')
  }
  
  const handleNavigateToLogin = () => {
    navigate('/login')
  }
  
  return (
    <Landing 
      onNavigateToSignup={handleNavigateToSignup}
      onNavigateToLogin={handleNavigateToLogin}
    />
  )
}

// Login Page Component with Navigation
function LoginPage() {
  const navigate = useNavigate()
  
  const handleSwitchToSignup = () => {
    navigate('/signup')
  }
  
  return <Login onSwitchToSignup={handleSwitchToSignup} />
}

// Signup Page Component with Navigation
function SignupPage() {
  const navigate = useNavigate()
  
  const handleSwitchToLogin = () => {
    navigate('/login')
  }
  
  return <Signup onSwitchToLogin={handleSwitchToLogin} />
}

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Landing page - accessible to everyone */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth pages - redirect authenticated users */}
        <Route path="/login" element={
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        } />
        <Route path="/signup" element={
          <AuthRoute>
            <SignupPage />
          </AuthRoute>
        } />
        
        {/* Protected dashboard - redirect unauthenticated users */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } />
        
        {/* Redirect any other routes to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
