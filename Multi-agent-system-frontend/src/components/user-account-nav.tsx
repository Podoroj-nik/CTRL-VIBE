"use client"

import { useState } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { 
  User, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  ChevronDown,
  Sparkles,
  ShieldCheck
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface UserAccountNavProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string | null
    image?: string | null
  }
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const dashboardHref = user.role === 'ADMIN' ? '/admin/applications' : '/student/projects'

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-slate-100 group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-yellow-300 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
           {user.image ? (
             <img src={user.image} alt={user.name || "avatar"} className="w-full h-full object-cover" />
           ) : (
             <span className="font-black italic text-black">{user.name?.[0] || "U"}</span>
           )}
        </div>
        <div className="hidden lg:flex flex-col items-start leading-tight">
          <span className="text-[10px] font-black uppercase tracking-tighter">{user.name}</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-64 bg-white rounded-[32px] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] z-50 p-3 animate-in fade-in zoom-in duration-200">
             <div className="p-4 mb-2 bg-slate-50/50 rounded-2xl border border-slate-50">
                <div className="flex items-center gap-3 mb-2">
                   <div className="text-[8px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5 rounded-full">Active Session</div>
                   {user.role === 'ADMIN' && <ShieldCheck className="h-4 w-4 text-primary" />}
                </div>
                <p className="text-[10px] font-bold text-slate-400 truncate">{user.email}</p>
             </div>

             <nav className="space-y-1">
                <Link 
                  href={dashboardHref}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-black rounded-xl transition-all group"
                >
                  <LayoutDashboard className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                  Панель управления
                </Link>
                <Link 
                  href="/student/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-black rounded-xl transition-all group"
                >
                  <User className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                  Мой профиль
                </Link>
                <Link 
                  href="#"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-black rounded-xl transition-all group"
                >
                  <Settings className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                  Настройки
                </Link>
             </nav>

             <div className="h-px bg-slate-100 my-2" />

             <button 
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all group"
             >
                <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                Выйти из системы
             </button>
          </div>
        </>
      )}
    </div>
  )
}
