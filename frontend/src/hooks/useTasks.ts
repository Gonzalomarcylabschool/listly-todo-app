import { useState, useEffect } from "react"

export interface Task {
  id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  status: "pending" | "completed" | "deferred"
  dueDate?: string
  categories: string[]
  createdAt: string
  updatedAt: string
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      // ✅ Make sure the response is JSON before parsing
      const isJson = response.headers.get("content-type")?.includes("application/json")

      if (response.ok && isJson) {
        const data = await response.json()
        setTasks(data)
      } else {
        // Probably running in preview with no backend – just use an empty list
        console.warn("Received non-JSON response from /api/tasks. Using empty task list.")
        setTasks([])
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
      setTasks([]) // graceful fallback
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    try {
      // Optimistic update
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setTasks((prev) => [newTask, ...prev])

      const response = await fetch("http://localhost:3001/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(taskData),
      })

      const isJson = response.headers.get("content-type")?.includes("application/json")

      if (!response.ok) {
        // Revert optimistic update on failure
        setTasks((prev) => prev.filter((t) => t.id !== newTask.id))
        throw new Error("Failed to create task")
      }
    } catch (error) {
      console.error("Failed to create task:", error)
      throw error
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task)),
      )

      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updates),
      })

      const isJson = response.headers.get("content-type")?.includes("application/json")

      if (!response.ok) {
        // Revert on failure
        fetchTasks()
        throw new Error("Failed to update task")
      }
    } catch (error) {
      console.error("Failed to update task:", error)
      throw error
    }
  }

  const deleteTask = async (id: string) => {
    try {
      // Optimistic update
      const taskToDelete = tasks.find((t) => t.id === id)
      setTasks((prev) => prev.filter((task) => task.id !== id))

      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      const isJson = response.headers.get("content-type")?.includes("application/json")

      if (!response.ok) {
        // Revert on failure
        if (taskToDelete) {
          setTasks((prev) => [...prev, taskToDelete])
        }
        throw new Error("Failed to delete task")
      }
    } catch (error) {
      console.error("Failed to delete task:", error)
      throw error
    }
  }

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  }
}
