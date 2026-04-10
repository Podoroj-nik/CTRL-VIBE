"use client"

import { User, Mail, GraduationCap, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function StudentProfilePage() {
  return (
    <div className="space-y-12 max-w-4xl">
      <div className="flex items-center gap-8">
         <div className="w-32 h-32 rounded-[40px] bg-slate-200 border-4 border-white shadow-2xl overflow-hidden relative group">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky" alt="avatar" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
               <span className="text-[8px] font-black text-white uppercase tracking-widest">Change</span>
            </div>
         </div>
         <div className="space-y-2">
            <h1 className="text-5xl font-black italic tracking-tighter uppercase">Иван Иванов</h1>
            <div className="flex items-center gap-4">
               <Badge className="bg-primary/20 text-primary border-none">ML Engineer</Badge>
               <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">3 курс, МФТИ</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <Card className="bg-white border-none shadow-sm rounded-[40px] p-8 space-y-6">
            <CardHeader className="p-0">
               <CardTitle className="text-xl font-black italic uppercase tracking-tighter">О себе</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-sm text-slate-500 leading-relaxed">
               Увлекаюсь компьютерным зрением и анализом медицинских данных. Имею опыт работы с PyTorch и OpenCV. Ищу проект, где смогу применить свои знания для решения реальных социальных задач.
            </CardContent>
         </Card>

         <Card className="bg-white border-none shadow-sm rounded-[40px] p-8 space-y-6">
            <CardHeader className="p-0">
               <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Навыки</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-wrap gap-2">
               {["Python", "PyTorch", "OpenCV", "Machine Learning", "FastAPI", "Next.js"].map(s => (
                 <Badge key={s} variant="secondary" className="bg-slate-50 text-slate-600 px-4 py-1.5 rounded-full">{s}</Badge>
               ))}
            </CardContent>
         </Card>
      </div>

      <div className="bg-black rounded-[40px] p-10 text-white flex justify-between items-center relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl group-hover:blur-0 transition-all">
            <Sparkles className="h-40 w-40 text-primary" />
         </div>
         <div className="space-y-4 relative z-10">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">AI Рекомендация</h3>
            <p className="text-slate-400 text-sm max-w-md">
               На основе вашего профиля, проект «МРТ мозга новорожденных» подходит вам на **94%**. Рекомендуем подать заявку.
            </p>
         </div>
         <Button className="bg-primary text-black font-black italic uppercase tracking-tighter h-14 px-8 rounded-2xl relative z-10 hover:bg-yellow-400 transition-colors">
            СМОТРЕТЬ ПРОЕКТ
         </Button>
      </div>
    </div>
  )
}

function Badge({ className, children, variant }: { className?: string, children: React.ReactNode, variant?: any }) {
  return <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset", className)}>{children}</span>
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
