"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Database, 
  Cloud, 
  Cpu, 
  HardDrive, 
  Loader2, 
  Plus,
  Activity,
  Trash2
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const INITIAL_RESOURCES = [
  { id: 1, type: "postgresql", name: "nexus-mrt-db", spec: "vCPU: 2, RAM: 4GB, SSD: 20GB", status: "ACTIVE" },
  { id: 2, type: "object_storage", name: "nexus-mrt-bucket", spec: "Size: 50GB", status: "ACTIVE" },
  { id: 3, type: "compute", name: "nexus-mrt-ml-gpu", spec: "NVIDIA T4, RAM: 16GB", status: "PROVISIONING" },
];

export default function InfraPage() {
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [isProvisioning, setIsProvisioning] = useState(false);

  const addResource = async () => {
    setIsProvisioning(true);
    const newId = resources.length + 1;
    const newRes = { 
      id: newId, 
      type: "compute", 
      name: `nexus-mrt-worker-${newId}`, 
      spec: "vCPU: 4, RAM: 8GB", 
      status: "PROVISIONING" 
    };
    
    setResources([...resources, newRes]);
    
    // Simulate real-looking provisioning
    toast.info("Запуск процесса нарезки инфраструктуры...");
    
    setTimeout(() => {
      setResources(prev => prev.map(r => r.id === newId ? { ...r, status: "ACTIVE" } : r));
      setIsProvisioning(false);
      toast.success("Ресурс успешно создан и готов к работе");
    }, 3000);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'postgresql': return <Database className="h-5 w-5" />;
      case 'object_storage': return <HardDrive className="h-5 w-5" />;
      case 'compute': return <Cpu className="h-5 w-5" />;
      default: return <Cloud className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Инфраструктура Yandex Cloud</h2>
          <p className="text-sm text-muted-foreground">Управление облачными ресурсами проекта</p>
        </div>
        <Button onClick={addResource} disabled={isProvisioning} className="bg-primary text-black font-bold gap-2">
          {isProvisioning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Нарезать инфраструктуру
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res) => (
          <Card key={res.id} className={cn(
             "border-2 transition-all",
             res.status === "PROVISIONING" ? "border-primary border-dashed animate-pulse" : "border-slate-100 shadow-sm"
          )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary">
                {getIcon(res.type)}
              </div>
              <Badge variant={res.status === "ACTIVE" ? "success" : "secondary"}>
                {res.status === "ACTIVE" ? "Активен" : "Настройка..."}
              </Badge>
            </CardHeader>
            <CardContent className="pt-4">
              <CardTitle className="text-lg">{res.name}</CardTitle>
              <CardDescription className="font-mono text-[10px] mt-1 uppercase tracking-wider">{res.type}</CardDescription>
              <div className="mt-4 p-3 bg-slate-50 rounded-lg border text-xs font-medium space-y-1">
                 <p className="text-slate-400">Конфигурация:</p>
                 <p>{res.spec}</p>
              </div>
            </CardContent>
            <CardFooter className="pt-0 justify-between">
               <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold">
                  <Activity className="h-3 w-3" /> 99.9% Uptime
               </div>
               <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-destructive">
                 <Trash2 className="h-4 w-4" />
               </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
