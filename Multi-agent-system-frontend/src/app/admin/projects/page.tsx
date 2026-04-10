"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, Clock, CheckCircle2, AlertCircle, 
  FolderKanban, TrendingUp, Zap, ChevronRight, Brain, MapPin, Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const directionColors: Record<string, string> = {
  HEALTHCARE: "from-rose-500/20 to-rose-500/5",
  ECOLOGY:    "from-emerald-500/20 to-emerald-500/5",
  CULTURE:    "from-violet-500/20 to-violet-500/5",
  TRANSPORT:  "from-sky-500/20 to-sky-500/5",
};

const directionLabel: Record<string, string> = {
  HEALTHCARE: "Здравоохранение",
  ECOLOGY:    "Экология",
  CULTURE:    "Культура",
};

export default function AdminProjectsPage() {
  const [view, setView] = useState<"cards" | "kanban">("cards");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        toast.error('Ошибка загрузки проектов');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId: string) => {
    setSelectedProject(projectId);
    router.push(`/admin/projects/${projectId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center">
              <FolderKanban className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">Проекты</h1>
          </div>
          <p className="text-slate-500 text-sm pl-12">Управление активными проектами платформы</p>
        </div>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
          {(["cards", "kanban"] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className={cn(
              "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              view === v ? "bg-white shadow text-black" : "text-slate-400 hover:text-black"
            )}>
              {v === "cards" ? "Проекты" : "Kanban"}
            </button>
          ))}
        </div>
      </div>

      {view === "cards" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projects.map(p => (
            <div
              key={p.id}
              onClick={() => handleProjectClick(p.id)}
              className="bg-white rounded-[32px] p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.12)] transition-all cursor-pointer group border border-slate-50 hover:border-slate-100"
            >
              <div className={cn("h-2 rounded-full mb-6 bg-gradient-to-r", directionColors[p.application?.direction] || "from-slate-100 to-slate-50")} />

              <div className="flex justify-between items-start mb-4">
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 px-2 py-0.5 rounded-full">
                  {directionLabel[p.application?.direction] || p.application?.direction}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-black italic text-primary">{p.application?.score?.totalScore || 0}</span>
                  <Brain className="h-3.5 w-3.5 text-primary" />
                </div>
              </div>

              <h3 className="font-black italic text-base uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors mb-2">
                {p.name}
              </h3>
              
              <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold mb-4">
                <MapPin className="h-3 w-3" />{p.application?.geography || 'Не указано'}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <span>Прогресс</span><span className="text-black">{Math.round((p.tasks?.filter((t: any) => t.status === 'DONE').length / (p.tasks?.length || 1)) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-black rounded-full transition-all" style={{ width: `${Math.round((p.tasks?.filter((t: any) => t.status === 'DONE').length / (p.tasks?.length || 1)) * 100)}%` }} />
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                <div className="flex items-center gap-3 text-[9px] text-slate-400 font-bold">
                  <span><Users className="h-3 w-3 inline mr-1" />{p.members?.length || 0} чел.</span>
                  <span><CheckCircle2 className="h-3 w-3 inline mr-1 text-green-400" />{p.tasks?.filter((t: any) => t.status === 'DONE').length}/{p.tasks?.length || 0}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-black group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Project Selector */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {projects.map(p => (
              <button key={p.id} onClick={() => setSelectedProject(p.id)} className={cn(
                "flex-shrink-0 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border",
                selectedProject === p.id ? "bg-black text-white border-black" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-black"
              )}>
                {p.name.slice(0, 24)}…
              </button>
            ))}
          </div>

          {/* Project Stats */}
          {selectedProject && (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Задач в работе", value: projects.find(p => p.id === selectedProject)?.tasks?.filter((t: any) => t.status === "IN_PROGRESS").length || 0, icon: AlertCircle, color: "text-yellow-500" },
                { label: "Выполнено",       value: projects.find(p => p.id === selectedProject)?.tasks?.filter((t: any) => t.status === "DONE").length || 0,         icon: CheckCircle2, color: "text-green-500" },
                { label: "В очереди",       value: projects.find(p => p.id === selectedProject)?.tasks?.filter((t: any) => t.status === "TODO").length || 0,         icon: Clock,        color: "text-slate-400" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-[24px] p-5 border border-slate-50">
                  <s.icon className={cn("h-5 w-5 mb-3", s.color)} />
                  <div className="text-3xl font-black italic">{s.value}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Kanban Board */}
          {selectedProject && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { key: "TODO",        label: "Очередь",    color: "border-slate-200  bg-slate-50" },
                { key: "IN_PROGRESS", label: "В работе",   color: "border-yellow-200 bg-yellow-50/50" },
                { key: "DONE",        label: "Готово",     color: "border-green-200  bg-green-50/50" },
              ].map(col => (
                <div key={col.key} className={cn("rounded-[28px] border p-5 space-y-3", col.color)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{col.label}</span>
                    <span className="text-xs font-black bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                      {projects.find(p => p.id === selectedProject)?.tasks?.filter((t: any) => t.status === col.key).length || 0}
                    </span>
                  </div>

                  {projects.find(p => p.id === selectedProject)?.tasks?.filter((t: any) => t.status === col.key).map((task: any) => (
                    <div key={task.id} className="bg-white rounded-2xl p-4 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)] space-y-3 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)] transition-all cursor-pointer group">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold leading-snug group-hover:text-primary transition-colors">{task.title}</p>
                        <div className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-1",
                          task.priority === 'CRITICAL' ? 'bg-red-500' :
                          task.priority === 'HIGH' ? 'bg-orange-400' :
                          task.priority === 'MEDIUM' ? 'bg-yellow-400' : 'bg-slate-300'
                        )} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">{task.priority}</span>
                        {task.assignee ? (
                          <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400">
                            <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center font-black text-[7px]">
                              {task.assignee.user?.name?.[0] || '?'}
                            </div>
                            {task.assignee.user?.name || 'Не назначен'}
                          </div>
                        ) : (
                          <span className="text-[8px] font-bold text-slate-200 italic">Не назначен</span>
                        )}
                      </div>
                    </div>
                  ))}

                  <button className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-300 hover:border-slate-300 hover:text-slate-400 transition-all">
                    + Добавить задачу
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
