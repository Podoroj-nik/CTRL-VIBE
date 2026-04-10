"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sparkles, ArrowRight, UserPlus, Lock, Mail, User } from "lucide-react"

const registerSchema = z.object({
  name: z.string().min(2, "ФИО должно быть полным"),
  email: z.string().email("Неверный формат email"),
  password: z.string().min(8, "Пароль должен быть не менее 8 символов"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
})

type RegisterData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Ошибка при регистрации")
      }
      
      toast.success("Аккаунт создан! Теперь заполните анкету.")
      router.push("/register/survey")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      
      <div className="w-full max-w-lg space-y-8 relative z-10">
        <div className="text-center space-y-2">
           <Link href="/" className="inline-block mb-4 transition-transform hover:scale-105">
              <div className="text-2xl font-black italic tracking-tighter text-black uppercase leading-[0.85]">
                 Центр технологий<br />
                 <span className="text-primary">для общества</span>
              </div>
           </Link>
           <h1 className="text-3xl font-black uppercase tracking-tight italic">Регистрация</h1>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">место, где вашим проектам есть место</p>
        </div>

        <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="bg-black text-white p-10">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                   <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">Студенческий аккаунт</CardTitle>
                  <CardDescription className="text-slate-400 font-medium font-sans">Присоединяйтесь к сообществу</CardDescription>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">ФИО*</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-300" />
                    <Input {...register("name")} placeholder="Иван Иванов" className="h-12 pl-12 rounded-xl border-slate-200 bg-slate-50" />
                  </div>
                  {errors.name && <p className="text-xs font-bold text-red-500 uppercase tracking-tighter">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Корпоративный Email*</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-300" />
                    <Input {...register("email")} type="email" placeholder="example@phystech.edu" className="h-12 pl-12 rounded-xl border-slate-200 bg-slate-50" />
                  </div>
                  {errors.email && <p className="text-xs font-bold text-red-500 uppercase tracking-tighter">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Пароль</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-300" />
                      <Input {...register("password")} type="password" placeholder="••••••••" className="h-12 pl-12 rounded-xl border-slate-200 bg-slate-50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Повтор</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-300" />
                      <Input {...register("confirmPassword")} type="password" placeholder="••••••••" className="h-12 pl-12 rounded-xl border-slate-200 bg-slate-50" />
                    </div>
                  </div>
                </div>
                {(errors.password || errors.confirmPassword) && (
                   <p className="text-xs font-bold text-red-500 uppercase tracking-tighter">
                     {errors.password?.message || errors.confirmPassword?.message}
                   </p>
                )}
              </div>

              <div className="pt-4">
                <Button disabled={isLoading} className="w-full h-14 bg-black text-white hover:bg-slate-900 rounded-2xl font-black italic tracking-tighter text-lg shadow-xl shadow-black/10 group">
                  {isLoading ? "Регистрация..." : "СОЗДАТЬ АККАУНТ"}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="text-center pt-2">
                <p className="text-sm text-slate-500 font-medium">
                  Уже есть аккаунт?{" "}
                  <Link href="/login" className="text-black font-black italic tracking-tighter hover:text-primary transition-colors">
                    ВОЙТИ
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
