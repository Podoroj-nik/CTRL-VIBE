"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { 
  User, 
  Code, 
  Github, 
  MapPin, 
  Save, 
  Plus, 
  X,
  Target
} from "lucide-react"
import { toast } from "sonner"

const INITIAL_SKILLS = [
  { name: "Python", level: 8 },
  { name: "Machine Learning", level: 7 },
  { name: "React", level: 6 },
  { name: "TypeScript", level: 5 },
];

export default function ProfilePage() {
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill && !skills.find(s => s.name === newSkill)) {
      setSkills([...skills, { name: newSkill, level: 5 }]);
      setNewSkill("");
    }
  };

  const removeSkill = (name: string) => {
    setSkills(skills.filter(s => s.name !== name));
  };

  const updateLevel = (name: string, level: number[]) => {
    setSkills(skills.map(s => s.name === name ? { ...s, level: level[0] } : s));
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold">Мой профиль</h1>
        <p className="text-muted-foreground">Настройте свои навыки для лучшего соответствия проектам</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Main Info */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Личная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ФИО</Label>
                  <Input defaultValue="Иван Иванов" />
                </div>
                <div className="space-y-2">
                  <Label>Университет</Label>
                  <Input defaultValue="МФТИ" />
                </div>
                <div className="space-y-2">
                  <Label>Курс</Label>
                  <Input type="number" defaultValue="4" />
                </div>
                <div className="space-y-2">
                  <Label>Telegram ID</Label>
                  <Input defaultValue="@ivan_mfti" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>О себе</Label>
                <Textarea className="min-h-[100px]" defaultValue="ML-энтузиаст, интересуюсь применением ИИ в медицине и экологии. Свободно владею Python и библиотеками анализа данных." />
              </div>
            </CardContent>
          </Card>

          {/* Skills Editor */}
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Навыки и компетенции</CardTitle>
                <CardDescription>Укажите уровень владения технологиями (1-10)</CardDescription>
              </div>
              <Target className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-6">
                {skills.map((skill) => (
                  <div key={skill.name} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{skill.name}</span>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none">{skill.level}/10</Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-300 hover:text-destructive" onClick={() => removeSkill(skill.name)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Slider 
                      value={[skill.level]} 
                      max={10} 
                      step={1} 
                      onValueChange={(val) => updateLevel(skill.name, val)} 
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                 <Input 
                   placeholder="Новый навык (напр: Docker)" 
                   value={newSkill}
                   onChange={(e) => setNewSkill(e.target.value)}
                   className="flex-1"
                 />
                 <Button onClick={addSkill} variant="outline" className="gap-2">
                   <Plus className="h-4 w-4" /> Добавить
                 </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Links & Stats */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-black text-white">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-widest text-slate-400">Ссылки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                 <Github className="h-5 w-5" />
                 <Input defaultValue="github.com/ivan-dev" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="flex items-center gap-3">
                 <Code className="h-5 w-5" />
                 <Input defaultValue="ivan-ivanov.dev" className="bg-white/5 border-white/10 text-white" />
              </div>
            </CardContent>
            <CardFooter>
               <Button className="w-full bg-primary text-black font-bold">Обновить портфолио</Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Мои достижения</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <div className="text-xs">
                     <p className="font-bold">Топ-3 на хакатоне Яндекса</p>
                     <p className="text-slate-400">Декабрь 2023</p>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="fixed bottom-8 right-8">
         <Button className="bg-primary text-black h-14 px-8 rounded-full shadow-2xl shadow-primary/40 font-black italic tracking-tighter text-lg gap-3" onClick={() => toast.success("Профиль успешно сохранен")}>
            <Save className="h-5 w-5" /> СОХРАНИТЬ ИЗМЕНЕНИЯ
         </Button>
      </div>
    </div>
  )
}
