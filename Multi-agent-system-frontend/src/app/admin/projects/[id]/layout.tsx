"use client"

import { useState } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  Files, 
  MessageSquare, 
  Cpu, 
  LayoutDashboard,
  CheckCircle2,
  Clock,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ProjectPage({ children }: { children: React.ReactNode }) {
  const { id } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const tabs = [
    { name: "Обзор", href: `/admin/projects/${id}`, icon: LayoutDashboard },
    { name: "Задачи", href: `/admin/projects/${id}/tasks`, icon: CheckCircle2 },
    { name: "Команда", href: `/admin/projects/${id}/team`, icon: Users },
    { name: "Чат", href: `/admin/projects/${id}/chat`, icon: MessageSquare },
    { name: "Документы", href: `/admin/projects/${id}/documents`, icon: Files },
    { name: "Инфраструктура", href: `/admin/projects/${id}/infra`, icon: Cpu },
  ]

  const stats = [
    { label: "Всего задач", value: 12, icon: Files },
    { label: "Завершено", value: 5, icon: CheckCircle2, color: "text-green-600" },
    { label: "В работе", value: 4, icon: Clock, color: "text-blue-600" },
    { label: "Просрочено", value: 1, icon: AlertCircle, color: "text-red-600" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/admin/applications" className="hover:text-primary">Проекты</Link>
            <span className="text-slate-300">/</span>
            <span>{id}</span>
          </div>
          <h1 className="text-3xl font-bold">МРТ мозга новорожденных</h1>
          <div className="flex items-center gap-3">
            <Badge variant="success">Активен</Badge>
            <span className="text-sm text-muted-foreground">Старт: 20 марта 2024</span>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="gap-2">
             <ExternalLink className="h-4 w-4" /> Перейти в Репозиторий
           </Button>
           <Button variant="outline" size="sm" className="gap-2">
             Экспорт отчета
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{s.label}</span>
              <s.icon className={cn("h-4 w-4", s.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <div className="border-b flex gap-6">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <button
                key={tab.href}
                onClick={() => router.push(tab.href)}
                className={cn(
                  "flex items-center gap-2 pb-3 text-sm font-medium transition-all relative",
                  isActive ? "text-primary" : "text-slate-500 hover:text-slate-900"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                )}
              </button>
            )
          })}
        </div>
        
        <div className="animate-in fade-in duration-500">
           {children}
        </div>
      </div>
    </div>
  )
}

function Link({ href, children, ...props }: any) {
  return <a href={href} {...props}>{children}</a>
}

function AlertCircle(props: any) { return <MessageSquare {...props} /> }
