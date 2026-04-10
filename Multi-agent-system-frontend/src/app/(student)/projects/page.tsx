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
  Zap
} from "lucide-react"

const PROJECTS = [
  { 
    id: 1, 
    name: "МРТ мозга новорожденных", 
    direction: "HEALTHCARE", 
    desc: "Разработка ИИ для автоматической сегментации снимков мозга новорожденных.",
    members: 3, 
    needed: 5, 
    duration: "3-6 мес",
    skills: ["Python", "PyTorch", "ML"]
  },
  { 
    id: 2, 
    name: "Мониторинг борщевика", 
    direction: "ECOLOGY", 
    desc: "Анализ спутниковых снимков для детекции очагов распространения борщевика Сосновского.",
    members: 1, 
    needed: 4, 
    duration: "1-3 мес",
    skills: ["CV", "GIS", "Python"]
  },
  { 
    id: 3, 
    name: "Цифровой архив культуры", 
    direction: "CULTURE", 
    desc: "Система распознавания рукописей 19 века с использованием OCR и NLP.",
    members: 2, 
    needed: 3, 
    duration: "6-12 мес",
    skills: ["NLP", "OCR", "React"]
  },
];

export default function StudentBrowseProjects() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Проекты для участия</h1>
          <p className="text-muted-foreground">Найдите проект по вашим интересам и навыкам</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Поиск по названию или навыкам..." className="pl-10 h-10 border-none bg-white shadow-sm rounded-xl" />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 border-none bg-white shadow-sm rounded-xl">
             <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS.map((project) => (
          <Card key={project.id} className="border-none shadow-sm hover:shadow-xl transition-all group flex flex-col h-full rounded-2xl overflow-hidden">
             <div className="h-4 w-full bg-primary/20 group-hover:bg-primary transition-colors" />
             <CardHeader className="flex-1 pb-4">
               <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className="text-[10px] tracking-widest uppercase border-slate-200">{project.direction}</Badge>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    <Clock className="h-3 w-3" /> {project.duration}
                  </div>
               </div>
               <CardTitle className="text-xl group-hover:text-primary transition-colors leading-tight">
                 {project.name}
               </CardTitle>
               <p className="text-sm text-muted-foreground mt-4 line-clamp-3 leading-relaxed">
                 {project.desc}
               </p>
             </CardHeader>
             <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1.5 ">
                  {project.skills.map(s => (
                    <Badge key={s} variant="secondary" className="bg-slate-100 text-slate-600 border-none px-2 py-0 h-5 text-[10px]">{s}</Badge>
                  ))}
                  <div className="flex items-center gap-1 text-primary ml-auto">
                     <Sparkles className="h-3 w-3" />
                     <span className="text-[10px] font-bold uppercase tracking-tighter">Recommended</span>
                  </div>
                </div>
             </CardContent>
             <CardFooter className="bg-slate-50/50 p-6 border-t flex flex-col items-stretch gap-4">
                <div className="flex justify-between items-center text-xs">
                   <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="font-bold">{project.members} / {project.needed}</span>
                      <span className="text-slate-400">участников</span>
                   </div>
                   <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                      ))}
                   </div>
                </div>
                <Button className="w-full bg-white text-black border shadow-sm hover:bg-black hover:text-white transition-all rounded-xl font-bold gap-2">
                   Подробнее <ChevronRight className="h-4 w-4" />
                </Button>
             </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
