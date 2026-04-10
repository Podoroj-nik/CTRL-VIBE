"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ProjectChat } from "@/components/project-chat"
import { Loader2 } from "lucide-react"

export default function ChatPage() {
  const { id } = useParams()
  const [messages, setMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [projectDescription, setProjectDescription] = useState("")

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/projects/${id}/chat`)
        if (response.ok) {
          const data = await response.json()
          setMessages(data)
        }

        // Получаем описание проекта
        const projectResponse = await fetch(`/api/projects/${id}`)
        if (projectResponse.ok) {
          const project = await projectResponse.json()
          setProjectDescription(project.application?.description || "")
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-300px)]">
      <ProjectChat
        projectId={id as string}
        messages={messages}
        onMessageSent={(message) => setMessages(prev => [...prev, message])}
        projectDescription={projectDescription}
      />
    </div>
  )
}

