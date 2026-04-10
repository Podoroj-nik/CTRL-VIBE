"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home,
  Briefcase, 
  CheckSquare, 
  UserCircle,
  LogOut,
  Bell,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const nav = [
    { name: "Дашборд", href: "/student/dashboard", icon: Home },
    { name: "Все проекты", href: "/student/projects", icon: Briefcase },
    { name: "Мои задачи", href: "/student/my-tasks", icon: CheckSquare },
    { name: "Профиль", href: "/student/profile", icon: UserCircle },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-[300px] bg-white border-r flex flex-col shrink-0">
        <div className="p-10 pb-12">
          <Link href="/" className="flex flex-col group">
            <div className="text-sm font-black italic tracking-tighter text-black uppercase leading-none group-hover:text-primary transition-colors">
              Центр технологий<br />
              <span className="text-primary">для общества</span>
            </div>
            <p className="text-[6px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1 opacity-60">
              место, где вашим проектам есть место
            </p>
          </Link>
        </div>
        
        <nav className="flex-1 px-6 space-y-2">
          {nav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-4 h-12 px-4 rounded-2xl transition-all",
                  isActive ? "bg-black text-white hover:bg-black/90 shadow-xl shadow-black/10" : "text-slate-500 hover:text-black hover:bg-slate-50"
                )}
              >
                <Link href={item.href}>
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-slate-400")} />
                  <span className="text-sm font-bold tracking-tight">{item.name}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
        
        <div className="p-8 mt-auto">
           <div className="p-5 bg-black rounded-3xl space-y-4">
              <div className="flex items-center gap-2">
                 <Sparkles className="h-4 w-4 text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">AI Profile Score</span>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-2xl font-black italic text-white">84%</span>
                 <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest text-right">Very Strong<br />Matches</div>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full w-4/5 bg-primary" />
              </div>
           </div>
        </div>

        <div className="p-6 border-t border-slate-100">
          <Button variant="ghost" className="w-full justify-start gap-4 text-slate-500 hover:text-black px-4 h-12 rounded-2xl">
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-bold">Выйти</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b px-10 flex items-center justify-between shrink-0">
          <div className="flex-1" />
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="relative group rounded-2xl h-12 w-12 bg-slate-50 border border-slate-100">
              <Bell className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
              <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
            </Button>
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-black uppercase tracking-tighter">Студент</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">МФТИ / Магистратура</p>
               </div>
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 border-2 border-white shadow-xl shadow-black/5" />
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-12">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
