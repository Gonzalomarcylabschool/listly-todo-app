import { useState, useMemo } from "react"
import { useTasks, type Task } from "../hooks/useTasks"
import { isToday } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Clock, CheckCircle2, List, LayoutGrid, Plus } from "lucide-react"
import { TaskCard } from "../components/TaskCard"
import { TaskForm } from "../components/TaskForm"

export function Dashboard() {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "category">("list")

  const taskStats = useMemo(() => {
    const pending = tasks.filter((t) => t.status === "pending")
    const completed = tasks.filter((t) => t.status === "completed")
    const deferred = tasks.filter((t) => t.status === "deferred")
    const dueToday = pending.filter((t) => t.dueDate && isToday(new Date(t.dueDate)))
    const overdue = pending.filter((t) => t.dueDate && new Date(t.dueDate) < new Date())

    return {
      pending: pending.length,
      completed: completed.length,
      deferred: deferred.length,
      dueToday: dueToday.length,
      overdue: overdue.length,
    }
  }, [tasks])

  const groupedTasks = useMemo(() => {
    if (viewMode === "list") {
      return {
        pending: tasks.filter((t) => t.status === "pending"),
        completed: tasks.filter((t) => t.status === "completed"),
        deferred: tasks.filter((t) => t.status === "deferred"),
      }
    } else {
      const categories = new Set(tasks.flatMap((t) => t.categories))
      const grouped: Record<string, Task[]> = {}

      categories.forEach((category) => {
        grouped[category] = tasks.filter((t) => t.categories.includes(category))
      })

      // Add uncategorized tasks
      const uncategorized = tasks.filter((t) => t.categories.length === 0)
      if (uncategorized.length > 0) {
        grouped["Uncategorized"] = uncategorized
      }

      return grouped
    }
  }, [tasks, viewMode])

  const handleTaskSubmit = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData)
      setEditingTask(null)
    } else {
      await createTask(taskData)
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-accent" />
              <div>
                <p className="text-2xl font-bold">{taskStats.dueToday}</p>
                <p className="text-xs text-muted-foreground">Due Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary" />
              <div>
                <p className="text-2xl font-bold">{taskStats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{taskStats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{taskStats.overdue}</p>
                <p className="text-xs text-muted-foreground">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle and Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
          <Button
            variant={viewMode === "category" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("category")}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Categories
          </Button>
        </div>

        <Button onClick={() => setShowTaskForm(true)} className="md:hidden">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Tasks Display */}
      {viewMode === "list" ? (
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              Pending
              {taskStats.pending > 0 && <Badge variant="secondary">{taskStats.pending}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              Completed
              {taskStats.completed > 0 && <Badge variant="secondary">{taskStats.completed}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="deferred" className="flex items-center gap-2">
              Deferred
              {taskStats.deferred > 0 && <Badge variant="secondary">{taskStats.deferred}</Badge>}
            </TabsTrigger>
          </TabsList>

          {(["pending", "completed", "deferred"] as const).map((status) => (
            <TabsContent key={status} value={status} className="space-y-3">
              {groupedTasks[status]?.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      {status === "pending" && "No pending tasks. You're all caught up! 🎉"}
                      {status === "completed" && "No completed tasks yet. Get started!"}
                      {status === "deferred" && "No deferred tasks."}
                    </p>
                    {status === "pending" && (
                      <Button onClick={() => setShowTaskForm(true)} className="mt-4" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Task
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                groupedTasks[status]?.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                    onEdit={handleEditTask}
                  />
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {category}
                  <Badge variant="outline">{categoryTasks.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoryTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                    onEdit={handleEditTask}
                  />
                ))}
              </CardContent>
            </Card>
          ))}

          {Object.keys(groupedTasks).length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No tasks yet. Create your first task to get started!</p>
                <Button onClick={() => setShowTaskForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Task
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Task Form Modal */}
      <TaskForm
        open={showTaskForm}
        onOpenChange={(open) => {
          setShowTaskForm(open)
          if (!open) setEditingTask(null)
        }}
        onSubmit={handleTaskSubmit}
        editingTask={editingTask}
      />
    </div>
  )
}
