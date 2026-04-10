"use client"

import { useState, Suspense } from "react"
import { signIn, getSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { LogIn, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
})

type LoginData = z.infer<typeof loginSchema>

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (result?.error) {
        toast.error("Неверный email или пароль")
      } else {
        toast.success("Вы успешно вошли!")
        
        // Fetch session to determine role-based redirect
        const session = await getSession()
        const role = (session?.user as any)?.role
        const profileFilled = (session?.user as any)?.profileFilled

        if (callbackUrl && callbackUrl !== '/') {
          router.push(callbackUrl)
        } else if (role === 'ADMIN') {
          router.push('/admin/applications')
        } else if (role === 'STUDENT') {
          if (!profileFilled) {
             router.push('/register/survey')
          } else {
             router.push('/student/projects')
          }
        } else {
          router.push('/')
        }
        
        router.refresh()
      }
    } catch (error) {
      toast.error("Произошла ошибка при входе")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Email</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            <Input {...register("email")} type="email" placeholder="email@example.com" className="h-12 pl-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" />
          </div>
          {errors.email && <p className="text-xs font-bold text-red-500 uppercase tracking-tighter">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Пароль</Label>
            <Link href="#" className="text-[10px] font-bold text-slate-400 hover:text-black transition-colors uppercase tracking-widest">Забыли?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            <Input {...register("password")} type="password" placeholder="••••••••" className="h-12 pl-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" />
          </div>
          {errors.password && <p className="text-xs font-bold text-red-500 uppercase tracking-tighter">{errors.password.message}</p>}
        </div>
      </div>

      <div className="pt-4">
        <Button disabled={isLoading} className="w-full h-14 bg-black text-white hover:bg-slate-900 rounded-2xl font-black italic tracking-tighter text-lg shadow-xl shadow-black/10 group">
          {isLoading ? "Вход..." : "ВОЙТИ В СИСТЕМУ"}
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      <div className="text-center pt-4">
        <p className="text-sm text-slate-500 font-medium">
          Еще нет аккаунта?{" "}
          <Link href="/register" className="text-black font-black italic tracking-tighter hover:text-primary transition-colors uppercase">
            ЗАРЕГИСТРИРОВАТЬСЯ
          </Link>
        </p>
      </div>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      
      <div className="w-full max-w-lg space-y-10 relative z-10">
        <div className="text-center space-y-3">
           <Link href="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
              <div className="text-2xl font-black italic tracking-tighter text-black uppercase leading-[0.85]">
                 Центр технологий<br />
                 <span className="text-primary">для общества</span>
              </div>
           </Link>
           <div className="h-1 w-12 bg-primary mx-auto rounded-full" />
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none">вход в личный кабинет</p>
        </div>

        <Card className="border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[40px] overflow-hidden bg-white/80 backdrop-blur-xl">
          <CardHeader className="bg-black text-white p-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-20">
                <ShieldCheck className="h-32 w-32 text-primary" />
             </div>
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                   <LogIn className="h-6 w-6 text-primary" />
                </div>
                <div>
                   <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">Добро пожаловать</CardTitle>
                   <CardDescription className="text-slate-400 font-medium">Введите учетные данные</CardDescription>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-10">
            <Suspense fallback={<div className="h-40 flex items-center justify-center">Загрузка...</div>}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
