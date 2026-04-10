"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts"
import { 
  TrendingUp, 
  Zap, 
  Target, 
  Users,
  Brain,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const BAR_DATA = [
  { name: "Окт", count: 12 },
  { name: "Ноя", count: 18 },
  { name: "Дек", count: 15 },
  { name: "Янв", count: 25 },
  { name: "Фев", count: 32 },
  { name: "Мар", count: 45 },
];

const PIE_DATA = [
  { name: "Здравоохранение", value: 35, color: "#EF4444" },
  { name: "Экология", value: 25, color: "#22C55E" },
  { name: "Образование", value: 25, color: "#3B82F6" },
  { name: "Культура", value: 15, color: "#A855F7" },
];

const PROJ_PREDICTIONS = [
  { id: 1, name: "МРТ мозга", prob: 94, trend: "up", risk: "LOW" },
  { id: 2, name: "Spina Bifida", prob: 88, trend: "up", risk: "LOW" },
  { id: 3, name: "Борщевик", prob: 72, trend: "down", risk: "MEDIUM" },
  { id: 4, name: "Байкал: Реки", prob: 65, trend: "stable", risk: "HIGH" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black italic tracking-tighter mb-2">ORACLE ANALYTICS</h1>
        <p className="text-muted-foreground">Предиктивная аналитика и мониторинг портфеля проектов</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Активных проектов", value: "24", icon: Target, trend: "+12%" },
          { label: "Средний прогресс", value: "68%", icon: Zap, trend: "+5%" },
          { label: "Проектов в срок", value: "92%", icon: TrendingUp, trend: "+2%" },
          { label: "Студентов", value: "156", icon: Users, trend: "+40%" },
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <kpi.icon className="h-16 w-16" />
             </div>
             <CardHeader className="pb-2">
               <CardDescription className="text-xs font-bold uppercase tracking-wider">{kpi.label}</CardDescription>
               <CardTitle className="text-3xl font-black">{kpi.value}</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="flex items-center gap-1 text-xs text-green-600 font-bold">
                  <ArrowUpRight className="h-3 w-3" /> {kpi.trend} за мес.
               </div>
             </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Submissions */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Динамика заявок</CardTitle>
            <CardDescription>Количество новых проектов по месяцам</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BAR_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#F1F5F9' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#FFCC00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 2: Directions */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Распределение по направлениям</CardTitle>
            <CardDescription>Доля проектов в портфеле</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Predictions Table */}
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" /> Вероятность успеха (AI Prediction)
            </CardTitle>
            <CardDescription>Прогноз ORACLE на основе текущего темпа и рисков</CardDescription>
          </div>
          <Badge className="bg-primary text-black">Updated 10m ago</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {PROJ_PREDICTIONS.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary/50 transition-all">
                <div className="flex flex-col">
                  <span className="font-bold text-sm tracking-tight">{p.name}</span>
                  <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest leading-none">ID: {p.id}</span>
                </div>
                
                <div className="flex items-center gap-12">
                   <div className="text-right">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Вероятность</p>
                     <p className={cn(
                       "text-xl font-black",
                       p.prob >= 80 ? "text-green-600" : p.prob >= 60 ? "text-yellow-600" : "text-red-600"
                     )}>{p.prob}%</p>
                   </div>
                   
                   <div className="w-16">
                     {p.trend === "up" && <ArrowUpRight className="h-6 w-6 text-green-500" />}
                     {p.trend === "down" && <ArrowDownRight className="h-6 w-6 text-red-500" />}
                     {p.trend === "stable" && <div className="h-1 w-6 bg-slate-300" />}
                   </div>

                   <Badge variant={p.risk === "LOW" ? "success" : p.risk === "MEDIUM" ? "secondary" : "destructive"}>
                     {p.risk} RISK
                   </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
