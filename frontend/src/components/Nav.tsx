"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "../contexts/AuthContext"
import { Home, Plus, Tag, Settings, Menu, Moon, Sun, LogOut, CheckCircle2 } from "lucide-react"

interface NavProps {
  currentView: "dashboard" | "categories" | "settings"
  onViewChange: (view: "dashboard" | "categories" | "settings") => void
  onAddTask: () => void
  taskCounts: {
    pending: number
    completed: number
    deferred: number
  }
  darkMode: boolean
  onToggleDarkMode: () => void
}

export function Nav({ currentView, onViewChange, onAddTask, taskCounts, darkMode, onToggleDarkMode }: NavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  const navItems = [
    {
      id: "dashboard" as const,
      label: "Home",
      icon: Home,
      badge: taskCounts.pending > 0 ? taskCounts.pending : undefined,
    },
    {
      id: "categories" as const,
      label: "Categories",
      icon: Tag,
    },
    {
      id: "settings" as const,
      label: "Settings",
      icon: Settings,
    },
  ]

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-4 border-b">
        <CheckCircle2 className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg text-primary">Listly</span>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                onViewChange(item.id)
                setIsOpen(false)
              }}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        <div className="mt-6">
          <Button
            onClick={() => {
              onAddTask()
              setIsOpen(false)
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </nav>

      <div className="p-4 border-t space-y-2">
        <Button variant="ghost" className="w-full justify-start" onClick={onToggleDarkMode}>
          {darkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </Button>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{user?.email}</div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block w-64 border-r bg-card">
        <NavContent />
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="flex items-center justify-around p-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? "default" : "ghost"}
              size="sm"
              className="flex-col h-12 w-16 p-1"
              onClick={() => onViewChange(item.id)}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-xs mt-1">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
          <Button size="sm" className="flex-col h-12 w-16 p-1" onClick={onAddTask}>
            <Plus className="h-4 w-4" />
            <span className="text-xs mt-1">Add</span>
          </Button>
        </div>
      </div>
    </>
  )
}
