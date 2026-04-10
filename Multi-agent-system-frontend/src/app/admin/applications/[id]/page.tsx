"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useNexusStore } from "@/store/useNexusStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, 
  Send, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  ChevronRight,
  Loader2,
  Sparkles,
  Search,
  AlertCircle,
  Users,
  Cpu,
  Mail,
  Calendar,
  MapPin
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function ApplicationDetailPage() {
  const { id } = useParams()
  const store = useNexusStore()
  const [activeTab, setActiveTab] = useState("data")
  const [showDetailsExpanded, setShowDetailsExpanded] = useState(false)

  // Mock application data for display
  const application = {
    id: id,
    projectName: "МРТ мозга новорожденных",
    direction: "HEALTHCARE",
    geography: "Москва и МО",
    description: "Наш проект направлен на автоматизацию анализа МРТ снимков головного мозга новорожденных для раннего выявления патологий развития. Мы используем сверточные нейронные сети (CNN), обученные на уникальном датасете из 5000+ размеченных снимков.",
    taskDescription: "Снижение времени анализа одного снимка с 40 минут до 2 минут при сохранении точности не менее 95%.",
    currentStage: "Прототип (v0.8)",
    dataAvailable: "Собственный датасет, методика разметки НИИ Педиатрии",
    teamDescription: "2 ML инженера, 1 радиолог, 1 backend разработчик.",
    status: "PENDING",
    contactName: "Александр Соколов",
    contactEmail: "a.sokolov@example.com",
    submittedDate: "20 марта, 2024"
  }

  const runAnalysis = async () => {
    store.setProjectDescription(application.description)
    toast.promise(store.runStep(), {
      loading: 'Запуск AI-анализа...',
      success: 'Шаг Scorer завершен!',
      error: 'Ошибка при анализе'
    })
  }

  const handleNextStep = () => {
    store.nextStep()
    toast.promise(store.runStep(), {
      loading: `Запуск следующего агента (Шаг ${store.stepIndex + 1})...`,
      success: 'Анализ обновлен',
      error: 'Ошибка'
    })
  }

  const directionColor = {
    HEALTHCARE: "bg-rose-50 border-rose-200 text-rose-700",
    ECOLOGY: "bg-emerald-50 border-emerald-200 text-emerald-700",
    EDUCATION: "bg-amber-50 border-amber-200 text-amber-700",
    CULTURE: "bg-purple-50 border-purple-200 text-purple-700"
  }

  const statusColor = {
    PENDING: "bg-blue-50 border-blue-200 text-blue-700",
    IN_REVIEW: "bg-amber-50 border-amber-200 text-amber-700",
    APPROVED: "bg-emerald-50 border-emerald-200 text-emerald-700",
    REJECTED: "bg-red-50 border-red-200 text-red-700"
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
      {/* Header with breadcrumb */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm mb-3">
            <Link href="/admin/applications" className="text-gray-500 hover:text-gray-700 transition-colors">
              📥 Заявки
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-300" />
            <span className="text-gray-700 font-medium">{id}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-black text-2xl mb-2" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                {application.projectName}
              </h1>
              <div className="flex gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                    directionColor[application.direction] || "bg-gray-50 border-gray-200 text-gray-700"
                  }`}
                >
                  🏥 Здравоохранение
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                    statusColor[application.status] || "bg-blue-50 border-blue-200 text-blue-700"
                  }`}
                >
                  На рассмотрении
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                className="inline-flex items-center gap-2 px-4 py-2 border-1.5 border-gray-200 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors"
                style={{ color: "#2E2E2E" }}
              >
                <MessageSquare className="h-4 w-4" />
                Написать
              </button>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-white transition-all hover:shadow-md"
                style={{ background: "#0A0A0A" }}
              >
                <CheckCircle className="h-4 w-4" />
                Принять
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Data & AI */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs Navigation - NEXUS style */}
            <div className="flex gap-0 border-b-2" style={{ borderColor: "#E8E8E8" }}>
              <button
                onClick={() => setActiveTab("data")}
                className={`px-5 py-3 font-semibold text-sm transition-all relative ${
                  activeTab === "data"
                    ? "text-black border-b-2"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={{
                  borderColor: activeTab === "data" ? "#FFDB4D" : "transparent",
                  marginBottom: "-2px"
                }}
              >
                📋 Данные заявки
              </button>
              <button
                onClick={() => setActiveTab("ai")}
                className={`px-5 py-3 font-semibold text-sm transition-all flex items-center gap-2 relative ${
                  activeTab === "ai"
                    ? "text-black border-b-2"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={{
                  borderColor: activeTab === "ai" ? "#FFDB4D" : "transparent",
                  marginBottom: "-2px"
                }}
              >
                <Brain className="h-4 w-4" /> AI Анализ
                {Object.keys(store.results).length > 0 && (
                  <span className="inline-flex h-2 w-2 rounded-full" style={{ background: "#FFDB4D" }} />
                )}
              </button>
            </div>

            {/* Content */}
            <div className="mt-6 space-y-6">
              {activeTab === "data" && (
                <>
                  <div
                    className="border rounded-2xl p-6 bg-white"
                    style={{ borderColor: "#E8E8E8" }}
                  >
                    <h3 className="font-bold text-lg mb-4">📝 Описание проекта</h3>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      <p style={{ fontSize: "0.95rem" }}>{application.description}</p>
                      <div className="pt-4 border-t" style={{ borderColor: "#E8E8E8" }}>
                        <h4 className="font-bold text-sm mb-2" style={{ color: "#0A0A0A" }}>Задача:</h4>
                        <p style={{ fontSize: "0.95rem" }}>{application.taskDescription}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className="border rounded-2xl p-4 bg-white"
                      style={{ borderColor: "#E8E8E8" }}
                    >
                      <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B6B6B", fontWeight: "600", marginBottom: "8px" }}>
                        Этап реализации
                      </div>
                      <p className="font-semibold text-black text-sm">{application.currentStage}</p>
                    </div>
                    <div
                      className="border rounded-2xl p-4 bg-white"
                      style={{ borderColor: "#E8E8E8" }}
                    >
                      <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B6B6B", fontWeight: "600", marginBottom: "8px" }}>
                        Данные
                      </div>
                      <p className="font-semibold text-black text-sm">{application.dataAvailable}</p>
                    </div>
                  </div>

                  <div
                    className="border rounded-2xl p-6 bg-white"
                    style={{ borderColor: "#E8E8E8" }}
                  >
                    <h3 className="font-bold text-lg mb-3">👥 Команда</h3>
                    <p style={{ fontSize: "0.95rem", color: "#4A4A4A" }}>{application.teamDescription}</p>
                  </div>
                </>
              )}

              {activeTab === "ai" && (
                <>
                  {!Object.keys(store.results).length && !store.isLoading && (
                    <div
                      className="text-center py-20 rounded-2xl border-2 border-dashed bg-white"
                      style={{ borderColor: "#E8E8E8" }}
                    >
                      <Brain className="h-12 w-12 mx-auto mb-4" style={{ color: "#D0D0D0" }} />
                      <h3 className="text-lg font-bold mb-2">🤖 AI Анализ не запущен</h3>
                      <p style={{ color: "#6B6B6B", marginBottom: "24px", maxWidth: "400px", margin: "0 auto 24px" }}>
                        Запустите пайплайн агентов для оценки проекта и генерации исследовательской базы.
                      </p>
                      <button
                        onClick={runAnalysis}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-md text-sm font-semibold text-black transition-all hover:shadow-md"
                        style={{ background: "#FFDB4D" }}
                      >
                        <Sparkles className="h-4 w-4" /> Запустить анализ
                      </button>
                    </div>
                  )}

                  {(store.isLoading || Object.keys(store.results).length > 0) && (
                    <div className="space-y-6">
                      {/* Pipeline Stepper */}
                      <div className="flex items-center justify-between px-4">
                        {[0, 1, 2, 3, 4, 5].map((s) => (
                          <div key={s} className="flex flex-col items-center gap-2">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                                store.stepIndex === s
                                  ? "scale-110 shadow-lg"
                                  : store.results[s]
                                  ? "bg-emerald-50 border-emerald-500 text-emerald-600"
                                  : ""
                              )}
                              style={{
                                borderColor: store.stepIndex === s ? "#FFDB4D" : store.results[s] ? "#22C55E" : "#D0D0D0",
                                background: store.stepIndex === s ? "#FFDB4D" : store.results[s] ? "#DCFCE7" : "white",
                                color: store.stepIndex === s ? "#0A0A0A" : "inherit"
                              }}
                            >
                              {s === 0 && <AlertCircle className="h-4 w-4" />}
                              {s === 1 && <Search className="h-4 w-4" />}
                              {s === 2 && <Users className="h-4 w-4" />}
                              {s === 3 && <Cpu className="h-4 w-4" />}
                              {s === 4 && <CheckCircle className="h-4 w-4" />}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Current Agent Result */}
                      {store.results[store.stepIndex] && (
                        <div
                          className="border rounded-2xl p-6 bg-white"
                          style={{ borderColor: "#FFDB4D" }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-black text-lg" style={{ color: "#0A0A0A" }}>
                                {store.stepIndex === 0 && "🔍 Агент: СКОРЕР"}
                                {store.stepIndex === 1 && "🔎 Агент: ИССЛЕДОВАТЕЛЬ"}
                                {store.stepIndex === 2 && "👥 Агент: АДМИНИСТРАТОР"}
                                {store.stepIndex === 3 && "👤 Агент: HR"}
                                {store.stepIndex === 4 && "⚙️ Агент: DEVOPS"}
                                {store.stepIndex === 5 && "📝 Агент: СЕКРЕТАРЬ"}
                              </h3>
                              <p style={{ color: "#6B6B6B", fontSize: "0.85rem", marginTop: "2px" }}>
                                Результат обработки текущего шага
                              </p>
                            </div>
                            <Brain className="h-6 w-6" style={{ color: "#FFDB4D" }} />
                          </div>
                          <div className="whitespace-pre-wrap font-medium text-gray-800 text-sm leading-relaxed mb-6 pb-6 border-t" style={{ borderColor: "#E8E8E8", color: "#2E2E2E" }}>
                            {store.results[store.stepIndex]}
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={handleNextStep}
                              disabled={store.stepIndex === 5 || store.isLoading}
                              className="inline-flex items-center px-6 py-2 rounded-md text-sm font-semibold text-white transition-all hover:shadow-md disabled:opacity-50"
                              style={{ background: "#0A0A0A" }}
                            >
                              Одобрить и далее
                            </button>
                            <button
                              onClick={() => store.runStep("Уточни детали реализации...")}
                              disabled={store.isLoading}
                              className="inline-flex items-center px-6 py-2 rounded-md text-sm font-semibold border-1.5 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                              Запросить правки
                            </button>
                          </div>
                        </div>
                      )}

                      {store.isLoading && (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#FFDB4D" }} />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Actions & Log */}
          <div className="space-y-6">
            {/* Contacts */}
            <div
              className="border rounded-2xl p-6 bg-white"
              style={{ borderColor: "#E8E8E8" }}
            >
              <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B6B6B", fontWeight: "600", marginBottom: "16px" }}>
                Контакт заявителя
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg"
                  style={{ background: "#FFDB4D", color: "#0A0A0A" }}
                >
                  {application.contactName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-black">{application.contactName}</p>
                  <p className="text-sm" style={{ color: "#6B6B6B" }}>{application.contactEmail}</p>
                </div>
              </div>
              <button
                className="w-full px-4 py-2 rounded-md text-sm font-semibold border-1.5 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="h-4 w-4" /> Написать
              </button>
            </div>

            {/* Timeline */}
            <div
              className="border rounded-2xl p-6 bg-white"
              style={{ borderColor: "#E8E8E8" }}
            >
              <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B6B6B", fontWeight: "600", marginBottom: "16px" }}>
                История
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: "#22C55E" }}
                    />
                    <div
                      className="w-0.5 h-8 mt-2"
                      style={{ background: "#E8E8E8" }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-black">Заявка получена</p>
                    <p className="text-xs" style={{ color: "#6B6B6B" }}>
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {application.submittedDate}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: "#3B82F6" }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-black">На рассмотрении</p>
                    <p className="text-xs" style={{ color: "#6B6B6B" }}>Ожидание AI-анализа</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <button
                className="w-full px-4 py-3 rounded-md text-sm font-semibold text-white transition-all hover:shadow-md"
                style={{ background: "#0A0A0A" }}
              >
                ✅ Принять в работу
              </button>
              <button
                className="w-full px-4 py-3 rounded-md text-sm font-semibold border-1.5 border-red-200 text-red-700 hover:bg-red-50 transition-colors"
              >
                ❌ Отклонить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

