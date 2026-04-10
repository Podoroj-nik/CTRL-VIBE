"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  FolderRoot, 
  LayoutDashboard, 
  ClipboardList, 
  User, 
  Settings, 
  LogOut,
  Sparkles,
  Zap,
  ChevronRight,
  TrendingUp
} from "lucide-react"

interface SidebarItemProps {
  href: string
  icon: any
  label: string
  active?: boolean
}

function SidebarItem({ href, icon: Icon, label, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
        active 
          ? "bg-black text-white shadow-xl shadow-black/10" 
          : "text-slate-500 hover:bg-slate-50 hover:text-black"
      )}
    >
      <Icon className={cn("h-5 w-5", active ? "text-primary" : "group-hover:text-primary transition-colors")} />
      <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
      {active && <ChevronRight className="ml-auto h-4 w-4 text-primary" />}
    </Link>
  )
}

export default function StudentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Sidebar */}
      <aside className="w-80 border-r bg-white flex flex-col p-6 sticky top-0 h-screen overflow-y-auto">
        <div className="mb-10 px-4">
          <Link href="/" className="flex flex-col group">
            <div className="text-xl font-black italic tracking-tighter text-black uppercase leading-none">
              Центр технологий<br />
              <span className="text-primary">для общества</span>
            </div>
            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">
              место вашим проектам
            </p>
          </Link>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 px-4">Меню студента</p>
          <SidebarItem 
            href="/student/projects" 
            icon={LayoutDashboard} 
            label="Маркетплейс" 
            active={pathname === "/student/projects"} 
          />
          <SidebarItem 
            href="/student/my-tasks" 
            icon={ClipboardList} 
            label="Мои задачи" 
            active={pathname === "/student/my-tasks"} 
          />
          <SidebarItem 
            href="/student/profile" 
            icon={User} 
            label="Профиль AI" 
            active={pathname === "/student/profile"} 
          />
        </nav>

        {/* AI Profile Score Card */}
        <div className="mt-8 p-6 bg-black rounded-[32px] text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 blur-sm group-hover:blur-0 transition-all">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Profile Score</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black italic tracking-tighter text-primary">84</span>
              <span className="text-xs font-bold text-slate-500">/100</span>
            </div>
            <div className="space-y-1.5 pt-2">
               <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-500">
                  <span>Progress</span>
                  <span className="text-primary">+12%</span>
               </div>
               <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[84%] rounded-full" />
               </div>
            </div>
            <p className="text-[8px] font-medium text-slate-400 leading-normal pt-2">
              Ваш профиль технического специалиста оценен алгоритмом на 84 балла. Заполните навыки, чтобы повысить шанс участия.
            </p>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t space-y-2">
           <SidebarItem 
            href="#" 
            icon={Settings} 
            label="Настройки" 
          />
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold uppercase tracking-widest text-sm">
            <LogOut className="h-5 w-5" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
            <div>
               <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Личный кабинет</h2>
               <div className="h-1 w-8 bg-black rounded-full" />
            </div>
            <div className="flex items-center gap-4">
               <div className="flex flex-col items-end">
                  <span className="text-sm font-black italic tracking-tighter">Студент-разработчик</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Status: Ready to work</span>
               </div>
               <div className="w-12 h-12 rounded-2xl bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky" alt="avatar" />
               </div>
            </div>
        </header>
        {children}
      </main>
    </div>
  )
}
