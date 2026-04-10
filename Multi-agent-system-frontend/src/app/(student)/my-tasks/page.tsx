"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare,
  ChevronRight,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

const TASKS = [
  { id: 1, project: "МРТ мозга новорожденных", title: "Реализация ResNet50", status: "IN_PROGRESS", priority: "HIGH", deadline: "25 Мар" },
  { id: 2, project: "МРТ мозга новорожденных", title: "Интеграция с Yandex Cloud", status: "TODO", priority: "MEDIUM", deadline: "28 Мар" },
  { id: 3, project: "Детекция Spina Bifida", title: "Финальный отчет по точности", status: "DONE", priority: "LOW", deadline: "20 Мар" },
];

export default function StudentTasksPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Мои задачи</h1>
        <p className="text-muted-foreground">Все задачи, назначенные вам в текущих проектах</p>
      </div>

      <div className="space-y-4">
        {TASKS.map((task) => (
          <Card key={task.id} className="border-none shadow-sm hover:shadow-md transition-all group cursor-pointer overflow-hidden">
            <CardContent className="p-0">
               <div className="flex flex-col md:flex-row items-stretch md:items-center">
                  <div className={cn(
                    "w-1 md:w-2 shrink-0",
                    task.status === "DONE" ? "bg-green-500" : task.status === "IN_PROGRESS" ? "bg-blue-500" : "bg-slate-200"
                  )} />
                  
                  <div className="flex-1 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">{task.project}</span>
                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400">#{task.id}</span>
                      </div>
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{task.title}</h3>
                    </div>

                    <div className="flex items-center gap-8 w-full md:w-auto">
                      <div className="flex flex-col items-center md:items-end">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Дедлайн</p>
                        <div className="flex items-center gap-1.5 font-bold text-sm">
                          <Clock className="h-3.5 w-3.5 text-slate-300" /> {task.deadline}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant={task.status === "DONE" ? "success" : task.status === "IN_PROGRESS" ? "secondary" : "outline"} className="px-3">
                          {task.status === "DONE" ? "Готово" : task.status === "IN_PROGRESS" ? "В работе" : "Ожидает"}
                        </Badge>
                        <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
