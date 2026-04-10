"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Send
} from "lucide-react"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  // Step 1
  projectName: z.string().min(2, "Название проекта должно содержать минимум 2 символа").max(200),
  direction: z.enum(["EDUCATION", "HEALTHCARE", "ECOLOGY", "CULTURE"]),
  geography: z.string().min(2, "Пожалуйста, укажите географию охвата проекта").max(300),
  
  // Step 2
  description: z.string().min(100, "Описание должно быть подробным (минимум 100 символов)").max(5000),
  taskDescription: z.string().min(50, "Опишите задачу более детально (минимум 50 символов)").max(2000),
  currentStage: z.string().min(1, "Поле обязательно для заполнения"),
  dataAvailable: z.string().min(1, "Пожалуйста, опишите наличие и тип данных"),
  
  // Step 3
  teamDescription: z.string().min(1, "Расскажите про вашу команду"),
  yandexTechs: z.string().optional(),
  openSource: z.string(),
  plannedDuration: z.string(),
  
  // Step 4
  contactName: z.string().min(1, "Как к вам обращаться?"),
  contactEmail: z.string().email("Введите корректный адрес электронной почты"),
  additionalContacts: z.string().optional(),
  consent: z.boolean().refine(v => v === true, "Для подачи заявки необходимо согласие на обработку данных"),
})

type FormData = z.infer<typeof formSchema>

export default function SubmitPage() {
  const [step, setStep] = useState(1)
  const router = useRouter()
  
  const { register, handleSubmit, formState: { errors }, trigger, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      direction: "EDUCATION",
      openSource: "true",
      plannedDuration: "3-6 мес",
      consent: false
    }
  })

  const progress = (step / 4) * 100

  const handleNext = async () => {
    // Validate only fields belonging to the current step
    let fieldsToValidate: (keyof FormData)[] = []
    
    if (step === 1) fieldsToValidate = ["projectName", "direction", "geography"]
    if (step === 2) fieldsToValidate = ["description", "taskDescription", "currentStage", "dataAvailable"]
    if (step === 3) fieldsToValidate = ["teamDescription", "openSource", "plannedDuration"]
    
    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setStep(s => Math.min(s + 1, 4))
    } else {
      toast.error("Пожалуйста, заполните все обязательные поля корректно")
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Ошибка сервера при сохранении заявки")
      
      const result = await response.json()
      toast.success("Ваша заявка успешно отправлена на скоринг! ID: " + result.id)
      router.push("/")
    } catch (error) {
      toast.error("Не удалось отправить заявку. Попробуйте позже.")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto mb-12 space-y-6 text-center">
        <div className="space-y-2">
           <h1 className="text-4xl font-black italic tracking-tighter uppercase">Подача проекта</h1>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Центр технологий для общества</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border space-y-4">
           <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
              <span className="text-primary">Шаг {step} из 4</span>
              <span className="text-slate-400">{Math.round(progress)}% завершено</span>
           </div>
           <Progress value={progress} className="h-2" />
        </div>
      </div>

      <Card className="max-w-3xl mx-auto border-none shadow-2xl rounded-[40px] overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="bg-black text-white p-10 space-y-2">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-black font-black text-sm">{step}</span>
               </div>
               <div className="h-px w-8 bg-white/20" />
               <Sparkles className="h-4 w-4 text-primary opacity-50" />
            </div>
            <CardTitle className="text-3xl font-black italic uppercase tracking-tight">
              {step === 1 && "Базовая информация"}
              {step === 2 && "Детали реализации"}
              {step === 3 && "Команда и Стек"}
              {step === 4 && "Контактные данные"}
            </CardTitle>
            <CardDescription className="text-slate-400 font-medium">
              {step === 1 && "Расскажите нам о названии и направлении вашей инициативы"}
              {step === 2 && "Опишите цели, текущий этап и наличие данных для AI"}
              {step === 3 && "Кто работает над проектом и какие технологии потребуются"}
              {step === 4 && "Мы свяжемся с вами после прохождения автоматического скоринга"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-10 space-y-8 bg-white">
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="projectName" className="text-sm font-black uppercase tracking-wider">Название проекта*</Label>
                  <Input 
                    id="projectName" 
                    {...register("projectName")} 
                    placeholder="Напр: ИИ для ранней детекции лесных пожаров" 
                    className="h-12 rounded-xl border-slate-200 focus:ring-primary"
                  />
                  {errors.projectName && <p className="text-xs font-bold text-red-500 uppercase tracking-tighter">{errors.projectName.message}</p>}
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-black uppercase tracking-wider">Направление работы*</Label>
                  <Select onValueChange={(v) => setValue("direction", v as any)}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200">
                      <SelectValue placeholder="Выберите направление" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EDUCATION">Образование</SelectItem>
                      <SelectItem value="HEALTHCARE">Здравоохранение</SelectItem>
                      <SelectItem value="ECOLOGY">Экология</SelectItem>
                      <SelectItem value="CULTURE">Культура</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.direction && <p className="text-xs font-bold text-red-500 uppercase tracking-tighter">{errors.direction.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="geography" className="text-sm font-black uppercase tracking-wider">География проекта*</Label>
                  <Input 
                    id="geography" 
                    {...register("geography")} 
                    placeholder="Напр: Республика Карелия, вся Россия" 
                    className="h-12 rounded-xl border-slate-200"
                  />
                  {errors.geography && <p className="text-xs font-bold text-red-500 uppercase tracking-tighter">{errors.geography.message}</p>}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm font-black uppercase tracking-wider">Суть проекта*</Label>
                  <Textarea 
                    id="description" 
                    {...register("description")} 
                    className="min-h-[180px] rounded-2xl border-slate-200" 
                    placeholder="Подробно опишите социальную значимость и предлагаемое технологическое решение..." 
                  />
                  {errors.description && <p className="text-xs font-bold text-red-500 uppercase tracking-tighter">{errors.description.message}</p>}
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="taskDescription" className="text-sm font-black uppercase tracking-wider">Техническая задача*</Label>
                  <Textarea 
                    id="taskDescription" 
                    {...register("taskDescription")} 
                    className="min-h-[120px] rounded-2xl border-slate-200"
                    placeholder="Какую конкретную задачу должен решить ИИ или облачный сервис?" 
                  />
                  {errors.taskDescription && <p className="text-xs font-bold text-red-500 uppercase tracking-tighter">{errors.taskDescription.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="currentStage" className="text-sm font-black uppercase tracking-wider">Текущий этап*</Label>
                    <Input id="currentStage" {...register("currentStage")} placeholder="Идея / Прототип / MVP" className="h-12 rounded-xl" />
                    {errors.currentStage && <p className="text-xs font-bold text-red-500 uppercase tracking-tighter">{errors.currentStage.message}</p>}
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="dataAvailable" className="text-sm font-black uppercase tracking-wider">Наличие данных*</Label>
                    <Input id="dataAvailable" {...register("dataAvailable")} placeholder="Датасет CSV / Видео / Снимки" className="h-12 rounded-xl" />
                    {errors.dataAvailable && <p className="text-xs font-bold text-red-500 uppercase tracking-tighter">{errors.dataAvailable.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="teamDescription" className="text-sm font-black uppercase tracking-wider">Состав команды*</Label>
                  <Textarea 
                    id="teamDescription" 
                    {...register("teamDescription")} 
                    className="min-h-[120px] rounded-2xl border-slate-200"
                    placeholder="Кто уже работает в проекте? Чья помощь необходима (ML-инженеры, Разработчики)?" 
                  />
                  {errors.teamDescription && <p className="text-xs font-bold text-red-500 uppercase tracking-tighter">{errors.teamDescription.message}</p>}
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="yandexTechs" className="text-sm font-black uppercase tracking-wider">Сервисы Яндекса</Label>
                  <Textarea 
                    id="yandexTechs" 
                    {...register("yandexTechs")} 
                    className="min-h-[100px] rounded-2xl border-slate-200"
                    placeholder="Yandex Cloud, Vision, Translate, SpeechKit..." 
                  />
                </div>

                <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                  <Label className="text-sm font-black uppercase tracking-wider">Модель распространения*</Label>
                  <RadioGroup defaultValue="true" onValueChange={(v) => setValue("openSource", v)}>
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-100">
                      <RadioGroupItem value="true" id="os-yes" />
                      <Label htmlFor="os-yes" className="font-bold">Open Source (рекомендуется)</Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-100">
                      <RadioGroupItem value="false" id="os-no" />
                      <Label htmlFor="os-no" className="font-bold">Закрытый проприетарный код</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="contactName" className="text-sm font-black uppercase tracking-wider">ФИО заявителя*</Label>
                    <Input id="contactName" {...register("contactName")} className="h-12 rounded-xl" />
                    {errors.contactName && <p className="text-xs font-bold text-red-500 uppercase tracking-tighter">{errors.contactName.message}</p>}
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="contactEmail" className="text-sm font-black uppercase tracking-wider">Email*</Label>
                    <Input id="contactEmail" {...register("contactEmail")} type="email" className="h-12 rounded-xl" />
                    {errors.contactEmail && <p className="text-xs font-bold text-red-500 uppercase tracking-tighter">{errors.contactEmail.message}</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="additionalContacts" className="text-sm font-black uppercase tracking-wider">Мессенджеры</Label>
                  <Input id="additionalContacts" {...register("additionalContacts")} placeholder="Telegram @username" className="h-12 rounded-xl" />
                </div>

                <div className="flex items-start space-x-4 p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 transition-colors hover:bg-slate-100">
                  <input type="checkbox" id="consent" className="mt-1 h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" {...register("consent")} />
                  <Label htmlFor="consent" className="text-sm font-medium leading-relaxed">
                    Я подтверждаю достоверность предоставленных данных и соглашаюсь на их обработку экспертами Центра технологий для общества Яндекса.
                  </Label>
                </div>
                {errors.consent && <p className="text-xs font-bold text-red-500 uppercase tracking-tighter text-center">{errors.consent.message}</p>}
              </div>
            )}
          </CardContent>

          <footer className="flex justify-between p-10 bg-slate-50 border-t border-slate-100 shrink-0">
            <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setStep(s => Math.max(s - 1, 1))} 
                disabled={step === 1}
                className="font-bold uppercase tracking-widest gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Назад
            </Button>
            
            {step < 4 ? (
              <Button type="button" onClick={handleNext} className="bg-black text-white hover:bg-slate-800 rounded-2xl h-14 px-10 font-black italic tracking-tighter gap-2 shadow-xl shadow-black/10">
                ДАЛЕЕ <ArrowRight className="h-5 w-5" />
              </Button>
            ) : (
              <Button type="submit" className="bg-primary text-black hover:bg-primary/90 rounded-2xl h-14 px-10 font-black italic tracking-tighter gap-2 shadow-xl shadow-primary/20">
                ОТПРАВИТЬ ЗАЯВКУ <Send className="h-5 w-5" />
              </Button>
            )}
          </footer>
        </form>
      </Card>
      
      <div className="mt-12 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">место, где вашим проектам есть место</p>
      </div>
    </div>
  )
}
