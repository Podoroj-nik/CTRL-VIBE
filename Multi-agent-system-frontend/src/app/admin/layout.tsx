"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Files, 
  FolderKanban, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const nav = [
    { name: "Очередь заявок", href: "/admin/applications", icon: Files },
    { name: "Проекты", href: "/admin/projects", icon: FolderKanban },
    { name: "Аналитика ORACLE", href: "/admin/analytics", icon: BarChart3 },
    { name: "Настройки", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-[280px] bg-black text-white flex flex-col shrink-0">
        <div className="p-8 pb-12">
          <Link href="/" className="flex flex-col group gap-1">
            <div className="text-sm font-black italic tracking-tighter text-white uppercase leading-none group-hover:text-primary transition-colors">
              Центр технологий<br />
              <span className="text-primary">для общества</span>
            </div>
            <p className="text-[6px] font-bold text-slate-500 uppercase tracking-widest leading-none opacity-60">
              место, где вашим проектам есть место
            </p>
          </Link>
          <div className="mt-8">
             <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black tracking-[0.2em] px-2 py-0.5">ADMIN PORTAL</Badge>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {nav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-4 h-12 px-4 rounded-xl transition-all",
                  isActive ? "bg-white/10 text-primary" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Link href={item.href}>
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-slate-500")} />
                  <span className="text-sm font-bold tracking-tight">{item.name}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
        
        <div className="p-6 mt-auto">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
             <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">System Status</span>
             </div>
             <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-primary" />
             </div>
             <p className="text-[9px] text-slate-500 font-bold">24 Projects Active</p>
          </div>
        </div>

        <div className="p-4 border-t border-white/5">
          <Button variant="ghost" className="w-full justify-start gap-4 text-slate-500 hover:text-white px-4 h-12">
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-bold">Выйти</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b px-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-lg w-full">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input 
                placeholder="Поиск по задачам и проектам..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="relative group bg-slate-50 rounded-xl h-11 w-11">
              <Bell className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>
            <div className="flex items-center gap-3">
               <div className="text-right">
                  <p className="text-xs font-black uppercase tracking-tighter">Admin User</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Senior Manager</p>
               </div>
               <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-yellow-300 border-2 border-white shadow-xl shadow-primary/10" />
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function Badge({ className, children }: { className?: string, children: React.ReactNode }) {
  return <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset", className)}>{children}</span>
}
