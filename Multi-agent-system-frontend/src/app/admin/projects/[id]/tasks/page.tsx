"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { TaskManager } from "@/components/task-manager"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function TasksPage() {
  const { id } = useParams()
  const [tasks, setTasks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/projects/${id}/tasks`)
        if (response.ok) {
          const data = await response.json()
          setTasks(data)
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error)
        toast.error("Ошибка загрузки задач")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [id])

  const handleTaskUpdate = async (taskId: string, updates: any) => {
    try {
      const response = await fetch(`/api/projects/${id}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(prev =>
          prev.map(t => t.id === taskId ? updatedTask : t)
        )
        toast.success("Задача обновлена")
      }
    } catch (error) {
        console.error("Failed to update task:", error)
        toast.error("Ошибка обновления задачи")
      }
    }

    const handleTaskCreate = async (task: any) => {
      try {
        const response = await fetch(`/api/projects/${id}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        })

        if (response.ok) {
          const newTask = await response.json()
          setTasks(prev => [...prev, newTask])
          toast.success("Задача создана")
        }
      } catch (error) {
        console.error("Failed to create task:", error)
        toast.error("Ошибка создания задачи")
      }
    }

    const handleTaskDelete = async (taskId: string) => {
      try {
        const response = await fetch(`/api/projects/${id}/tasks/${taskId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setTasks(prev => prev.filter(t => t.id !== taskId))
          toast.success("Задача удалена")
        }
      } catch (error) {
        console.error("Failed to delete task:", error)
        toast.error("Ошибка удаления задачи")
      }
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    }

    return (
      <TaskManager
        projectId={id as string}
        tasks={tasks}
        onTaskUpdate={handleTaskUpdate}
        onTaskCreate={handleTaskCreate}
        onTaskDelete={handleTaskDelete}
        isLoading={isLoading}
      />
    )
  }
