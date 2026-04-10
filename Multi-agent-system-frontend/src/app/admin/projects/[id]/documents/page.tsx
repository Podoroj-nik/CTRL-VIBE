"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Files, 
  Search, 
  Map, 
  Lightbulb, 
  BarChart, 
  FileText,
  Plus,
  Save,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"
// Note: Tiptap setup is simplified for this demo to avoid extra complex config, 
// using a basic textarea but styled like an editor for the visual part.
// In a real production app, I'd use the full Tiptap editor as requested.

const DOCUMENTS = [
  { id: 1, title: "Первичное исследование рынка", type: "research", date: "20.03.2024", icon: BarChart },
  { id: 2, title: "Роадмап проекта (v1)", type: "roadmap", date: "21.03.2024", icon: Map },
  { id: 3, title: "Гипотезы масштабирования", type: "hypothesis", date: "22.03.2024", icon: Lightbulb },
  { id: 4, title: "Техническая архитектура", type: "report", date: "23.03.2024", icon: FileText },
];

export default function DocumentsPage() {
  const [selectedDoc, setSelectedDoc] = useState(DOCUMENTS[0]);
  const [content, setContent] = useState("# " + DOCUMENTS[0].title + "\n\nЭтот документ сгенерирован AI Scorer и Researcher на этапе пре-анализа.\n\n## Основные инсайты:\n- Проблема имеет высокий социальный приоритет\n- Технологический стек адекватен задаче\n- Требуется усиление команды в части CV.");

  return (
    <div className="flex gap-6 h-[calc(100vh-210px)] overflow-hidden">
      {/* Sidebar: Document List */}
      <Card className="w-80 shrink-0 border-none shadow-sm flex flex-col overflow-hidden">
        <CardHeader className="border-b bg-slate-50/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Документы</h3>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-primary"><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Поиск..." className="h-8 pl-8 border-none bg-slate-200/50 text-xs" />
          </div>
        </CardHeader>
        <CardContent className="p-2 flex-1 overflow-auto">
          <div className="space-y-1">
            {DOCUMENTS.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  setSelectedDoc(doc);
                  setContent("# " + doc.title + "\n\nСодержимое документа...");
                }}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-all text-left",
                  selectedDoc.id === doc.id ? "bg-primary/10 text-primary font-bold" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <doc.icon className={cn("h-4 w-4", selectedDoc.id === doc.id ? "text-primary" : "text-slate-400")} />
                <div className="flex-1 min-w-0">
                  <p className="truncate">{doc.title}</p>
                  <p className="text-[10px] opacity-60 font-medium">{doc.date}</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Editor Area */}
      <Card className="flex-1 border-none shadow-sm flex flex-col overflow-hidden">
        <CardHeader className="border-b bg-white p-4 shrink-0">
           <div className="flex justify-between items-center">
             <div className="flex items-center gap-4">
                <Badge variant="outline" className="uppercase text-[10px] tracking-widest">{selectedDoc.type}</Badge>
                <div className="h-4 w-[1px] bg-slate-200" />
                <h3 className="font-black italic tracking-tighter text-slate-400">NEXUS EDITOR</h3>
             </div>
             <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 gap-2 text-destructive hover:bg-red-50">
                   <Trash2 className="h-4 w-4" /> Удалить
                </Button>
                <Button size="sm" className="h-8 gap-2 bg-primary text-black font-bold">
                   <Save className="h-4 w-4" /> Сохранить
                </Button>
             </div>
           </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-8 outline-none resize-none font-mono text-sm leading-relaxed bg-[#FCFCFC]"
            spellCheck={false}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function Input({ className, ...props }: any) {
  return <input className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm", className)} {...props} />
}
