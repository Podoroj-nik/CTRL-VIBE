"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  BarChart2
} from "lucide-react"
import { cn } from "@/lib/utils"

const INITIAL_MESSAGES = [
  { id: 1, author: "Алексей С.", content: "Привет! Залил архитектуру CNN в репозиторий. Проверьте плиз.", type: "USER", time: "10:30" },
  { id: 2, author: "Мария К.", content: "Ок, гляну через час. По фронту тоже есть апдейт.", type: "USER", time: "11:15" },
  { id: 3, author: "NEXUS AI", content: "📊 Саммери за последние сутки: Обсудили архитектуру CNN и интеграцию с бэкендом. Закрыто 2 тикета (infra, docs).", type: "AI_SUMMARY", time: "12:00" },
  { id: 4, author: "NEXUS AI", content: "Рекомендую обратить внимание на объем данных для обучения. Текущего датасета может быть недостаточно для точности >95%.", type: "AI", time: "12:01" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input) return;
    const newMessage = {
      id: messages.length + 1,
      author: "Admin",
      content: input,
      type: "USER",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInput("");

    // Simulate AI response
    if (input.toLowerCase().includes("ai") || input.toLowerCase().includes("ии")) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          author: "NEXUS AI",
          content: "Я проанализировал ваш запрос. Подготовка спецификации ресурсов для обучения займет около 10 минут. Вывести текущие затраты на инфраструктуру?",
          type: "AI",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    }
  };

  return (
    <div className="h-[calc(100vh-280px)] flex flex-col gap-4">
      <div className="flex-1 overflow-auto space-y-4 px-4">
        {messages.map((msg) => (
          <div key={msg.id} className={cn(
            "flex gap-3 max-w-[80%]",
            msg.type === "USER" ? "ml-auto flex-row-reverse" : ""
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.type === "USER" ? "bg-slate-200" : "bg-primary text-black"
            )}>
              {msg.type === "USER" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{msg.author}</span>
                 <span className="text-[10px] text-slate-400">{msg.time}</span>
              </div>
              <div className={cn(
                "p-3 rounded-2xl text-sm shadow-sm",
                msg.type === "USER" ? "bg-black text-white rounded-tr-none" : 
                msg.type === "AI_SUMMARY" ? "bg-blue-50 border border-blue-100 text-blue-900 font-medium" :
                "bg-white border text-slate-800 rounded-tl-none"
              )}>
                {msg.type === "AI_SUMMARY" && <BarChart2 className="h-4 w-4 mb-2 text-blue-600" />}
                {msg.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Card className="border-none shadow-lg mt-auto">
        <CardContent className="p-3 flex gap-2">
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите сообщение или спросите AI..." 
            className="flex-1 border-none bg-slate-100 focus-visible:ring-1 focus-visible:ring-primary"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={() => sendMessage()} className="bg-primary text-black font-bold gap-2">
             <Send className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2 border-primary/20 text-slate-600">
             <Sparkles className="h-4 w-4 text-primary" /> Саммери
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
