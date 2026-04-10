"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Filter, Brain, CheckCircle2, XCircle, Clock, Eye, Settings2,
  ChevronRight, Users, MapPin, Zap, TrendingUp, AlertTriangle, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MOCK_APPLICATIONS = [
  { 
    id: "APP-401", name: "МРТ мозга новорожденных", direction: "HEALTHCARE", 
    geography: "Москва, Санкт-Петербург", date: "2026-04-01", status: "APPROVED", score: 4.8,
    team: "Команда МГТУ", contactName: "Иванов А.А."
  },
  { 
    id: "APP-402", name: "AI Экология Байкала", direction: "ECOLOGY", 
    geography: "Иркутская область", date: "2026-04-03", status: "IN_REVIEW", score: 4.2,
    team: "Лаборатория ВШЭ", contactName: "Смирнова К.П."
  },
  { 
    id: "APP-405", name: "Цифровой архив культуры РУ XIX в.", direction: "CULTURE", 
    geography: "Федеральный", date: "2026-04-05", status: "PENDING", score: null,
    team: "Архивный фонд России", contactName: "Петров Н.Н."
  },
  { 
    id: "APP-407", name: "Детекция дефектов инфраструктуры ЖД", direction: "TRANSPORT", 
    geography: "Вся Россия (РЖД)", date: "2026-04-06", status: "REJECTED", score: 2.1,
    team: "Стартап RailAI", contactName: "Козлов В.В."
  },
  { 
    id: "APP-410", name: "Система ранней диагностики диабета", direction: "HEALTHCARE", 
    geography: "Новосибирск, Омск", date: "2026-04-08", status: "IN_REVIEW", score: 4.5,
    team: "НГУ Medtech Lab", contactName: "Федорова И.С."
  },
  { 
    id: "APP-413", name: "Мониторинг борщевика Сосновского", direction: "ECOLOGY", 
    geography: "Центральный ФО", date: "2026-04-09", status: "PENDING", score: null,
    team: "Агроэкологи России", contactName: "Лебедев П.А."
  },
];

const directionLabels: Record<string, { label: string; color: string }> = {
  HEALTHCARE:  { label: "Здравоохранение", color: "bg-rose-50 text-rose-600 border-rose-100" },
  ECOLOGY:     { label: "Экология",        color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  CULTURE:     { label: "Культура",         color: "bg-violet-50 text-violet-600 border-violet-100" },
  TRANSPORT:   { label: "Транспорт",        color: "bg-sky-50 text-sky-600 border-sky-100" },
  EDUCATION:   { label: "Образование",      color: "bg-amber-50 text-amber-600 border-amber-100" },
  SECURITY:    { label: "Безопасность",     color: "bg-slate-50 text-slate-600 border-slate-100" },
};

const statusConfig: Record<string, { label: string; dot: string; Icon: any }> = {
  PENDING:   { label: "Новая",      dot: "bg-slate-300",   Icon: Clock },
  IN_REVIEW: { label: "На ревью",   dot: "bg-yellow-400",  Icon: Eye },
  APPROVED:  { label: "Одобрена",   dot: "bg-green-500",   Icon: CheckCircle2 },
  REJECTED:  { label: "Отклонена",  dot: "bg-red-400",     Icon: XCircle },
};

export default function AdminTracker() {
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState<string | null>(null);
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const router = useRouter();

  // Загружаем реальные приложения с сервера
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/applications');
        if (response.ok) {
          const data = await response.json();
          setApplications(data.map((app: any) => ({
            id: app.id,
            name: app.projectName,
            direction: app.direction,
            geography: app.geography,
            date: new Date(app.createdAt).toLocaleDateString('ru-RU'),
            status: app.status,
            score: app.score?.totalScore || null,
            team: app.contactName,
            contactName: app.contactName
          })));
        }
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        toast.error('Ошибка загрузки приложений');
      }
    };

    fetchApplications();
  }, []);

  const filtered = applications.filter(a => filter === "ALL" || a.status === filter);
  const selectedApp = applications.find(a => a.id === selected);

  const counts = Object.keys(statusConfig).reduce((acc, key) => {
    acc[key] = applications.filter(a => a.status === key).length;
    return acc;
  }, {} as Record<string, number>);

  const handleApproveApplication = async (appId: string) => {
    setIsApproving(appId);
    try {
      // Обновляем статус приложения
      const response = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });

      if (response.ok) {
        // Создаем проект из приложения
        const app = applications.find(a => a.id === appId);
        const projectResponse = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            applicationId: appId,
            name: app?.name,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          }),
        });

        if (projectResponse.ok) {
          const project = await projectResponse.json();
          toast.success('Приложение одобрено! Проект создан.');

          // Обновляем локальный список
          setApplications(prev =>
            prev.map(a => a.id === appId ? { ...a, status: 'APPROVED' } : a)
          );

          // Переходим на страницу проекта
          setTimeout(() => {
            router.push(`/admin/projects/${project.id}`);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Failed to approve application:', error);
      toast.error('Ошибка при одобрении приложения');
    } finally {
      setIsApproving(null);
    }
  };



  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center">
              <Settings2 className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">Трекер заявок</h1>
          </div>
          <p className="text-slate-500 text-sm pl-12">Управление входящими социально-технологическими инициативами</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-11 px-5 rounded-2xl border-slate-200 gap-2 font-bold">
            <Filter className="h-4 w-4" /> Фильтры
          </Button>
          <Button className="h-11 px-5 rounded-2xl bg-black text-white hover:bg-slate-800 font-black italic">
            + Новая заявка
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setFilter(filter === key ? "ALL" : key)}
            className={cn(
              "p-5 rounded-[28px] border-2 text-left transition-all duration-200 group",
              filter === key
                ? "bg-black border-black text-white"
                : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl mb-3 flex items-center justify-center",
              filter === key ? "bg-primary/20" : "bg-slate-50"
            )}>
              <val.Icon className={cn("h-5 w-5", filter === key ? "text-primary" : "text-slate-400")} />
            </div>
            <div className="text-3xl font-black italic">{counts[key]}</div>
            <div className={cn(
              "text-[10px] uppercase font-bold tracking-widest mt-0.5",
              filter === key ? "text-slate-400" : "text-slate-400"
            )}>{val.label}</div>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className={cn("flex gap-6 transition-all", selected ? "items-start" : "")}>

        {/* Table */}
        <div className={cn("bg-white rounded-[36px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.06)] overflow-hidden flex-1")}>
          <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              Найдено: {filtered.length} заявок
            </span>
            {filter !== "ALL" && (
              <button onClick={() => setFilter("ALL")} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors">
                Сбросить фильтр ×
              </button>
            )}
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-slate-50 h-14">
                <TableHead className="pl-8 font-black text-[9px] uppercase tracking-widest text-slate-400 w-28">ID</TableHead>
                <TableHead className="font-black text-[9px] uppercase tracking-widest text-slate-400">Проект / Команда</TableHead>
                <TableHead className="font-black text-[9px] uppercase tracking-widest text-slate-400">Регион</TableHead>
                <TableHead className="font-black text-[9px] uppercase tracking-widest text-slate-400">Направление</TableHead>
                <TableHead className="font-black text-[9px] uppercase tracking-widest text-slate-400">Статус</TableHead>
                <TableHead className="pr-8 text-right font-black text-[9px] uppercase tracking-widest text-slate-400">AI Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((app) => (
                <TableRow
                  key={app.id}
                  onClick={() => setSelected(selected === app.id ? null : app.id)}
                  className={cn(
                    "group h-20 border-slate-50 cursor-pointer transition-colors",
                    selected === app.id ? "bg-slate-900 text-white" : "hover:bg-slate-50/80"
                  )}
                >
                  <TableCell className="pl-8 font-mono text-[10px] font-bold text-slate-400">{app.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className={cn("font-black italic text-sm", selected === app.id ? "text-primary" : "group-hover:text-primary transition-colors")}>
                        {app.name}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{app.team}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-slate-300" />
                      <span className="text-[10px] font-bold text-slate-400 max-w-[100px] truncate">{app.geography}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {directionLabels[app.direction] ? (
                      <span className={cn("text-[9px] font-black uppercase tracking-tighter border px-2.5 py-1 rounded-full", directionLabels[app.direction].color)}>
                        {directionLabels[app.direction].label}
                      </span>
                    ) : <span className="text-slate-300">—</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full flex-shrink-0", statusConfig[app.status].dot)} />
                      <span className="text-xs font-bold uppercase tracking-tight">{statusConfig[app.status].label}</span>
                    </div>
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                    {app.score ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={cn(
                          "text-xl font-black italic",
                          app.score >= 4.5 ? "text-green-500" : app.score >= 3.5 ? "text-yellow-500" : "text-red-400"
                        )}>{app.score}</span>
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-300 italic">Не оценено</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Detail Panel */}
        {selectedApp && (
          <div className="w-96 flex-shrink-0 bg-black rounded-[36px] p-8 text-white space-y-6 sticky top-24 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-start">
              <div className={cn(
                "text-[8px] font-black uppercase tracking-widest border px-3 py-1 rounded-full",
                directionLabels[selectedApp.direction]?.color || "border-white/10 text-white"
              )}>
                {directionLabels[selectedApp.direction]?.label || selectedApp.direction}
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white text-xs">✕</button>
            </div>

            <div>
              <h2 className="text-xl font-black italic uppercase tracking-tighter leading-tight">
                {selectedApp.name}
              </h2>
              <p className="text-slate-500 text-xs mt-1">{selectedApp.id}</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 uppercase tracking-widest font-bold">AI Score</span>
                <span className={cn("font-black italic text-xl", selectedApp.score ? "text-primary" : "text-slate-500")}>
                  {selectedApp.score ?? "—"}
                </span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: selectedApp.score ? `${(selectedApp.score / 5) * 100}%` : "0%" }}
                />
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {[[Users, "Команда", selectedApp.team], [MapPin, "Регион", selectedApp.geography]].map(([Icon, label, value]: any) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">{label}</p>
                    <p className="font-semibold text-slate-200">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-3 border-t border-white/10">
               <Button
                 onClick={() => handleApproveApplication(selectedApp.id)}
                 disabled={isApproving === selectedApp.id}
                 className="w-full h-11 bg-primary text-black font-black italic rounded-2xl hover:bg-yellow-400"
               >
                 {isApproving === selectedApp.id ? (
                   <>
                     <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Обработка...
                   </>
                 ) : (
                   <>
                     <CheckCircle2 className="h-4 w-4 mr-2" /> Одобрить
                   </>
                 )}
               </Button>
               <Button variant="outline" className="w-full h-11 border-white/10 text-white hover:bg-white/5 font-bold rounded-2xl">
                 <Eye className="h-4 w-4 mr-2" /> Отправить на ревью
               </Button>
               <Button variant="ghost" className="w-full h-11 text-red-400 hover:bg-red-500/10 font-bold rounded-2xl">
                 <XCircle className="h-4 w-4 mr-2" /> Отклонить
               </Button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
