"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Filter, 
  Users, 
  Clock, 
  ChevronRight,
  Sparkles,
  Zap,
  Target,
  FlaskConical,
  Brain
} from "lucide-react"

const PROJECTS = [
  { 
    id: 1, 
    name: "МРТ мозга новорожденных", 
    direction: "HEALTHCARE", 
    desc: "Разработка ИИ для автоматической сегментации снимков мозга новорожденных в реальном времени.",
    members: 3, 
    needed: 5, 
    duration: "3-6 мес",
    skills: ["Python", "PyTorch", "Medical Imaging"],
    impact: 4.9
  },
  { 
    id: 2, 
    name: "Мониторинг борщевика", 
    direction: "ECOLOGY", 
    desc: "Использование компьютерного зрения для детекции очагов распространения борщевика Сосновского на спутниковых снимках.",
    members: 1, 
    needed: 4, 
    duration: "1-3 мес",
    skills: ["Computer Vision", "GIS", "Python"],
    impact: 4.2
  },
  { 
    id: 3, 
    name: "Цифровой архив культуры", 
    direction: "CULTURE", 
    desc: "Создание интеллектуальной системы распознавания и каталогизации рукописей 19 века.",
    members: 2, 
    needed: 3, 
    duration: "6-12 мес",
    skills: ["NLP", "OCR", "Typescript"],
    impact: 3.8
  },
];

export default function StudentMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b pb-10">
        <div className="space-y-2">
          <Badge className="bg-primary/20 text-primary border-primary/30 uppercase text-[10px] tracking-widest font-black">Marketplace</Badge>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase">Витрина проектов</h1>
          <p className="text-slate-500 font-medium">Выберите социально-значимый проект, где ваши навыки принесут максимум пользы.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Поиск по технологиям..." 
              className="h-14 pl-12 rounded-2xl border-none bg-white shadow-xl shadow-black/5" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-14 w-14 rounded-2xl border-none bg-white shadow-xl shadow-black/5">
             <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {PROJECTS.map((project) => (
          <Card key={project.id} className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] hover:shadow-[0_48px_80px_-16px_rgba(0,0,0,0.1)] transition-all group rounded-[40px] overflow-hidden bg-white">
             <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-1/3 p-8 bg-black text-white flex flex-col justify-between items-start relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Target className="h-24 w-24" />
                   </div>
                   <Badge className="bg-primary text-black border-none uppercase text-[8px] font-black tracking-widest px-3 py-1 mb-6 rounded-full">{project.direction}</Badge>
                   <div className="space-y-4 relative z-10 w-full">
                      <div className="space-y-1">
                         <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Impact Score</p>
                         <div className="flex items-center gap-2">
                            <span className="text-3xl font-black text-primary italic">{project.impact}</span>
                            <Brain className="h-5 w-5 text-primary" />
                         </div>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Timeline</p>
                         <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span className="text-xs font-bold">{project.duration}</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="flex-1 p-8 flex flex-col">
                   <CardHeader className="p-0 mb-6">
                     <CardTitle className="text-2xl font-black italic tracking-tighter group-hover:text-primary transition-colors leading-none uppercase mb-4">
                       {project.name}
                     </CardTitle>
                     <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                       {project.desc}
                     </p>
                   </CardHeader>

                   <CardContent className="p-0 mb-8 flex-1">
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map(s => (
                          <Badge key={s} variant="secondary" className="bg-slate-50 text-slate-400 border border-slate-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                             {s}
                          </Badge>
                        ))}
                      </div>
                   </CardContent>

                   <CardFooter className="p-0 pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="flex -space-x-3">
                            {[1,2,3].map(i => (
                              <div key={i} className="w-8 h-8 rounded-xl border-4 border-white bg-slate-100 shadow-sm" />
                            ))}
                         </div>
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{project.members} / {project.needed} мест</span>
                      </div>
                      <Button className="bg-black text-white hover:bg-slate-800 rounded-2xl h-12 px-6 font-black italic tracking-tighter group shadow-lg shadow-black/10">
                         ПОДАТЬ ЗАЯВКУ
                         <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                   </CardFooter>
                </div>
             </div>
          </Card>
        ))}
      </div>
      
      {/* Featured Suggestion Section */}
      <div className="mt-20 p-12 bg-primary rounded-[50px] relative overflow-hidden group">
         <div className="absolute -right-20 -bottom-20 p-20 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <Sparkles className="h-80 w-80 text-black" />
         </div>
         <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/10 rounded-full">
               <Zap className="h-4 w-4 text-black" />
               <span className="text-[10px] font-black uppercase tracking-widest">AI Matching Engine</span>
            </div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-[0.9]">
               Не нашли подходящий проект? <br />
               <span className="text-black/60">Доверьте поиск нашему ИИ.</span>
            </h2>
            <p className="text-black/70 font-bold leading-relaxed">
               Алгоритм проанализирует ваш профиль, GitHub и предпочтения, чтобы подобрать проект, в котором вы сможете вырасти как профессионал.
            </p>
            <Button className="bg-black text-white hover:bg-slate-900 rounded-[24px] h-14 px-10 font-black italic tracking-tighter text-lg shadow-2xl">
               ЗАПУСТИТЬ AI MATCHING
            </Button>
         </div>
      </div>
    </div>
  )
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
