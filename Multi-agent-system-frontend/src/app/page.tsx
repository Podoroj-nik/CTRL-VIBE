"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  HeartPulse, 
  Leaf, 
  Palette, 
  Users, 
  Cpu, 
  FlaskConical, 
  Clock, 
  Expand,
  ArrowRight,
  CheckCircle2,
  Rocket,
  Sparkles,
  Zap,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

export default function LandingPage() {
  const { status } = useSession();

  const directions = [
    { title: "Образование", icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50/50" },
    { title: "Здравоохранение", icon: HeartPulse, color: "text-red-600", bg: "bg-red-50/50" },
    { title: "Экология", icon: Leaf, color: "text-green-600", bg: "bg-green-50/50" },
    { title: "Культура", icon: Palette, color: "text-purple-600", bg: "bg-purple-50/50" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[100px] translate-y-1/2" />
        
        <div className="container px-6 md:px-12 max-w-7xl mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Yandex Center for Technology for Society
            </div>
            
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black tracking-tight text-black leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                Центр технологий<br />
                <span className="text-primary italic">для общества</span>
              </h1>
              <p className="text-sm md:text-base font-medium text-slate-400 uppercase tracking-[0.3em] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
                место, где вашим проектам есть место
              </p>
            </div>

            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              Мы превращаем идеи ученых и НКО в высокотехнологичные решения мирового уровня, используя экосистему Яндекса.
            </p>

            {status !== "authenticated" && (
              <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600">
                <Button asChild size="lg" className="h-16 px-10 text-lg font-black bg-black text-white hover:bg-slate-900 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95">
                  <Link href="/submit">Подать свой проект</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-16 px-10 text-lg font-bold rounded-2xl border-2 border-slate-200 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95">
                  <Link href="/login">Войти</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats / Numbers Section */}
      <section className="py-20 border-y border-slate-100 bg-slate-50/50">
         <div className="container px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
               {[
                 { val: "24", label: "Проекта в работе" },
                 { val: "150+", label: "Студентов-волонтеров" },
                 { val: "500k", label: "Часов GPU выделено" },
                 { val: "12", label: "НКО-партнеров" },
               ].map((stat, i) => (
                 <div key={i} className="space-y-1">
                    <p className="text-4xl md:text-5xl font-black italic tracking-tighter text-black">{stat.val}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Grid Features */}
      <section className="py-32">
        <div className="container px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase">Наши<br />направления</h2>
              <div className="h-2 w-24 bg-primary" />
            </div>
            <p className="max-w-md text-slate-500 font-medium">
              Мы фокусируемся на областях, где применение больших данных и искусственного интеллекта дает максимальный общественный резонанс.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {directions.map((dir, i) => (
              <Card key={i} className={cn("border-none shadow-none group cursor-pointer overflow-hidden rounded-3xl transition-all", dir.bg)}>
                <CardHeader className="p-8">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:shadow-lg", dir.color, "bg-white shadow-sm")}>
                    <dir.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-2xl font-black italic tracking-tight uppercase">{dir.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                   <Button variant="ghost" className="p-0 h-auto font-bold text-slate-400 group-hover:text-black transition-colors">
                     Смотреть проекты <ArrowRight className="ml-2 h-4 w-4" />
                   </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-32 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="container px-6 max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-12">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none">
                  Почему<br />мы?
                </h2>
                <div className="space-y-8">
                   {[
                     { icon: Zap, t: "Технологии Яндекса", d: "Прямой доступ к Yandex Cloud, ML-платформам и экспертизе лучших инженеров." },
                     { icon: ShieldCheck, t: "Прозрачность", d: "Все результаты проектов публикуются под открытыми лицензиями для масштабирования." },
                     { icon: Users, t: "Сообщество", d: "Более 1000 участников, объединенных целью менять мир к лучшему." },
                   ].map((item, i) => (
                     <div key={i} className="flex gap-6">
                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                           <item.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-xl font-bold italic tracking-tight">{item.t}</h4>
                           <p className="text-slate-400 leading-relaxed text-sm">{item.d}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="relative">
                <div className="aspect-square bg-white/5 rounded-[40px] border border-white/10 p-4 relative overflow-hidden group">
                   <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                   <div className="h-full w-full bg-slate-900 rounded-[32px] p-8 flex flex-col justify-between">
                      <Sparkles className="h-12 w-12 text-primary animate-bounce" />
                      <div className="space-y-4">
                         <p className="text-xs font-black italic text-primary uppercase tracking-[0.2em]">Live Status</p>
                         <p className="text-3xl font-bold tracking-tight">Новый проект: "ИИ для спасения лесов Карелии" прошел стадию скоринга.</p>
                         <div className="flex gap-2">
                            <Badge className="bg-primary/20 text-primary border-none">ACTIVE</Badge>
                            <Badge className="bg-white/10 text-white border-none">HEALTHCARE</Badge>
                         </div>
                      </div>
                   </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
             </div>
          </div>
        </div>
      </section>

      {/* Timeline with Slogan Style */}
      <section className="py-32 bg-white">
        <div className="container px-6 max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-4">
             <h2 className="text-4xl font-black italic uppercase tracking-tighter">Механика процесса</h2>
             <p className="text-slate-400 font-medium uppercase tracking-[0.4em] text-[10px]">место, где вашим проектам есть место</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {["Заявка", "Скоринг", "Команда", "Dev", "Launch"].map((step, i) => (
              <div key={i} className="p-8 border-2 border-slate-50 rounded-[32px] hover:border-primary/50 transition-all group">
                <span className="text-6xl font-black text-slate-100 group-hover:text-primary/20 transition-colors block mb-4 italic">0{i+1}</span>
                <h4 className="font-black uppercase italic tracking-tight text-lg">{step}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container px-6 max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="space-y-4 text-center md:text-left">
                <div className="text-2xl font-black italic tracking-tighter text-black uppercase">
                   Центр<br />технологий<br />для общества
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  место, где вашим проектам есть место
                </p>
              </div>
              
              <div className="flex flex-col gap-6 items-center md:items-end">
                <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-slate-500">
                  <Link href="#" className="hover:text-black">Проекты</Link>
                  <Link href="#" className="hover:text-black">Участие</Link>
                  <Link href="#" className="hover:text-black">Право</Link>
                  <Link href="#" className="hover:text-black">Контакты</Link>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2026 Yandex for society</p>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}
