"use client"

import { useState } from "react"
import type { Task } from "../hooks/useTasks"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CheckCircle2, Clock, MoreVertical, Edit, Trash2, Calendar } from "lucide-react"
import { format } from "date-fns"

interface TaskCardProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

export function TaskCard({ task, onUpdate, onDelete, onEdit }: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false)

  const handleToggleComplete = async () => {
    setIsCompleting(true)
    try {
      await onUpdate(task.id, {
        status: task.status === "completed" ? "pending" : "completed",
      })
    } finally {
      setIsCompleting(false)
    }
  }

  const handleDefer = () => {
    onUpdate(task.id, { status: "deferred" })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-accent text-accent-foreground"
      case "low":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed"

  return (
    <Card
      className={`transition-all duration-200 ${task.status === "completed" ? "opacity-75" : ""} ${isOverdue ? "border-destructive" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              className={`p-0 h-6 w-6 rounded-full ${task.status === "completed" ? "text-green-600" : "text-muted-foreground"}`}
              onClick={handleToggleComplete}
              disabled={isCompleting}
            >
              <CheckCircle2 className={`h-5 w-5 ${task.status === "completed" ? "fill-current" : ""}`} />
            </Button>

            <div className="flex-1 min-w-0">
              <h3
                className={`font-medium text-sm leading-tight ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
              >
                {task.title}
              </h3>

              {task.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
              )}

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="secondary" className={`text-xs ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </Badge>

                {task.dueDate && (
                  <div
                    className={`flex items-center gap-1 text-xs ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    <Calendar className="h-3 w-3" />
                    {format(new Date(task.dueDate), "MMM d")}
                  </div>
                )}

                {task.status === "deferred" && (
                  <div className="flex items-center gap-1 text-xs text-warning">
                    <Clock className="h-3 w-3" />
                    Deferred
                  </div>
                )}
              </div>

              {task.categories.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {task.categories.map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {task.status !== "deferred" && (
                <DropdownMenuItem onClick={handleDefer}>
                  <Clock className="h-4 w-4 mr-2" />
                  Defer
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
