"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Sparkles, Trophy, BookOpen, GraduationCap, CheckCircle2 } from "lucide-react"

const surveySchema = z.object({
  university: z.string().min(2, "Укажите ваш вуз"),
  course: z.string().min(1, "Укажите курс обучения"),
  bio: z.string().min(20, "Расскажите о себе чуть подробнее (хотя бы 20 символов)"),
  github: z.string().url("Неверный формат ссылки на GitHub").optional().or(z.string().length(0)),
})

type SurveyData = z.infer<typeof surveySchema>

export default function SurveyPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [pythonLevel, setPythonLevel] = useState([5])
  const [mlLevel, setMlLevel] = useState([5])
  const router = useRouter()
  
  const { register, handleSubmit, formState: { errors } } = useForm<SurveyData>({
    resolver: zodResolver(surveySchema),
  })

  const onSubmit = async (data: SurveyData) => {
    setIsLoading(true)
    try {
      // Logic to save profile data (we'd call an API here)
      // For this demo, we'll just simulate a successful save
      await new Promise(r => setTimeout(r, 1000))
      
      toast.success("Анкета заполнена! Добро пожаловать.")
      router.push("/student/dashboard")
    } catch (error) {
      toast.error("Произошла ошибка при сохранении анкеты")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white py-20 px-6 font-sans">
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-widest">
              <Trophy className="h-3 w-3" /> Step 2: Onboarding
           </div>
           <h1 className="text-4xl font-black italic tracking-tighter uppercase">Расскажите о себе</h1>
           <p className="text-sm text-slate-500 font-medium">Ваши данные помогут AI подобрать наиболее подходящие проекты.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <Card className="border-none shadow-none bg-slate-50 rounded-[40px] p-2">
            <CardContent className="p-8 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">ВУЗ*</Label>
                    <div className="relative">
                       <GraduationCap className="absolute left-4 top-3 h-4 w-4 text-slate-300" />
                       <Input {...register("university")} placeholder="МФТИ / ВШЭ / МГУ" className="h-10 pl-10 rounded-xl bg-white border-none shadow-sm" />
                    </div>
                    {errors.university && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.university.message}</p>}
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Курс*</Label>
                    <div className="relative">
                       <BookOpen className="absolute left-4 top-3 h-4 w-4 text-slate-300" />
                       <Input {...register("course")} placeholder="3 курс" className="h-10 pl-10 rounded-xl bg-white border-none shadow-sm" />
                    </div>
                    {errors.course && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.course.message}</p>}
                  </div>
               </div>

               <div className="space-y-6">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-4">Уровень навыков (1-10)</Label>
                  <div className="space-y-8 p-6 bg-white rounded-3xl shadow-sm">
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-xs font-bold">
                          <span>Python / Data Analysis</span>
                          <span className="text-primary">{pythonLevel[0]} / 10</span>
                       </div>
                       <Slider value={pythonLevel} max={10} step={1} onValueChange={setPythonLevel} />
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-xs font-bold">
                          <span>Machine Learning / AI</span>
                          <span className="text-primary">{mlLevel[0]} / 10</span>
                       </div>
                       <Slider value={mlLevel} max={10} step={1} onValueChange={setMlLevel} />
                    </div>
                  </div>
               </div>

               <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400">О себе в двух словах*</Label>
                  <Textarea {...register("bio")} placeholder="Чем занимаетесь, какие технологии интересны..." className="min-h-[120px] rounded-2xl bg-white border-none shadow-sm p-4" />
                  {errors.bio && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.bio.message}</p>}
               </div>
            </CardContent>
          </Card>

          <Button disabled={isLoading} className="w-full h-16 bg-black text-white hover:bg-slate-900 rounded-3xl font-black italic tracking-tighter text-xl shadow-2xl flex items-center justify-center gap-3">
             {isLoading ? "Сохранение..." : "ЗАВЕРШИТЬ РЕГИСТРАЦИЮ"}
             <CheckCircle2 className="h-6 w-6 text-primary" />
          </Button>
        </form>
      </div>
    </div>
  )
}
