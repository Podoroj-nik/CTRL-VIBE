"use client"

import { ClipboardList, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MyTasksPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase">Мои задачи</h1>
        <p className="text-slate-500">Управление текущими задачами в проектах.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-none shadow-sm rounded-3xl p-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                 <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-slate-400">В работе</p>
                 <p className="text-2xl font-black italic">3</p>
              </div>
           </div>
        </Card>
        <Card className="bg-white border-none shadow-sm rounded-3xl p-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
                 <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-slate-400">Выполнено</p>
                 <p className="text-2xl font-black italic">12</p>
              </div>
           </div>
        </Card>
        <Card className="bg-white border-none shadow-sm rounded-3xl p-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                 <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-slate-400">Просрочено</p>
                 <p className="text-2xl font-black italic">0</p>
              </div>
           </div>
        </Card>
      </div>

      <div className="bg-white rounded-[40px] border-none shadow-sm p-12 text-center space-y-4">
         <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <ClipboardList className="h-10 w-10 text-slate-200" />
         </div>
         <h3 className="text-xl font-black italic tracking-tighter uppercase">Список задач пуст</h3>
         <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Вы еще не вступили ни в один проект. Перейдите в маркетплейс, чтобы найти интересную задачу.
         </p>
      </div>
    </div>
  )
}
