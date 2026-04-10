"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Trash2, 
  UserPlus,
  ArrowRight,
  TrendingUp,
  Award
} from "lucide-react"

const TEAM = [
  { id: 1, name: "Александр Соколов", role: "Заявитель / PM", skills: ["Management", "Medicine"], avatar: "АС" },
  { id: 2, name: "Алексей Степанов", role: "ML Engineer", skills: ["Python", "PyTorch", "Computer Vision"], avatar: "АС" },
  { id: 3, name: "Мария Ковалева", role: "Fullstack Dev", skills: ["React", "Next.js", "Node.js"], avatar: "МК" },
];

const APPLICANTS = [
  { id: 101, name: "Иван Иванов", university: "МФТИ", course: 4, match: 92, skills: ["Python", "ML", "Statistics"] },
  { id: 102, name: "Елена Петрова", university: "ВШЭ", course: 3, match: 84, skills: ["Data Analysis", "Python"] },
];

export default function TeamPage() {
  return (
    <div className="space-y-8">
      {/* Current Team */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Текущая команда</h2>
          <Button size="sm" className="bg-primary text-black">+ Добавить участника</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEAM.map((member) => (
            <Card key={member.id} className="border-none shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full border-2 border-primary bg-slate-50 flex items-center justify-center font-black text-lg">
                    {member.avatar}
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-primary text-sm font-bold uppercase tracking-wider mb-4">{member.role}</p>
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map(s => (
                    <Badge key={s} variant="secondary" className="text-[10px] py-0">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Student Applications */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Отклики студентов</h2>
          <Badge className="bg-primary text-black">{APPLICANTS.length}</Badge>
        </div>
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="grid divide-y">
            {APPLICANTS.map((applicant) => (
              <div key={applicant.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                    {applicant.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold">{applicant.name}</h4>
                    <p className="text-sm text-muted-foreground">{applicant.university}, {applicant.course} курс</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 flex-1 max-w-xs">
                  {applicant.skills.map(s => (
                    <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                  ))}
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-green-600 font-black text-xl">
                      <TrendingUp className="h-4 w-4" /> {applicant.match}%
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">AI Match</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Профиль</Button>
                    <Button size="sm" className="bg-primary text-black">Принять</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
