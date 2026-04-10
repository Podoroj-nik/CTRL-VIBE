'use client'

import React, { useState, useCallback } from 'react'
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Plus, Trash2, Edit2, Calendar, User, AlertCircle, CheckCircle2,
  Clock, GripVertical, X, Save, Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TaskItem {
  id: string
  projectId: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  assigneeId?: string | null
  dueDate?: Date | null
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

interface TaskManagerProps {
  projectId: string
  tasks: TaskItem[]
  onTaskUpdate: (taskId: string, updates: Partial<TaskItem>) => Promise<void>
  onTaskCreate: (task: Omit<TaskItem, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onTaskDelete: (taskId: string) => Promise<void>
  isLoading?: boolean
}

const STATUS_CONFIGS = {
  TODO: { label: 'Очередь', color: 'border-slate-200 bg-slate-50', icon: Clock },
  IN_PROGRESS: { label: 'В работе', color: 'border-yellow-200 bg-yellow-50/50', icon: AlertCircle },
  REVIEW: { label: 'На ревью', color: 'border-blue-200 bg-blue-50/50', icon: Clock },
  DONE: { label: 'Готово', color: 'border-green-200 bg-green-50/50', icon: CheckCircle2 },
}

const PRIORITY_COLORS = {
  CRITICAL: 'bg-red-500',
  HIGH: 'bg-orange-400',
  MEDIUM: 'bg-yellow-400',
  LOW: 'bg-slate-300',
}

export function TaskManager({
  projectId,
  tasks,
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
  isLoading
}: TaskManagerProps) {
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [localTasks, setLocalTasks] = useState(tasks)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const activeStatus = active.data.current?.sortable.containerId as string
    const overStatus = over.data.current?.sortable.containerId as string

    if (!activeStatus || !overStatus) return

    const activeTask = localTasks.find(t => t.id === active.id)
    if (activeTask && activeStatus !== overStatus) {
      onTaskUpdate(activeTask.id, { status: overStatus as any })
      setLocalTasks(tasks => tasks.map(t =>
        t.id === active.id ? { ...t, status: overStatus as any } : t
      ))
    }
  }, [localTasks, onTaskUpdate])

  const handleCreateTask = async (status: string) => {
    if (!newTaskTitle.trim()) return

    try {
      await onTaskCreate({
        title: newTaskTitle,
        status: status as any,
        priority: 'MEDIUM',
        tags: [],
      })
      setNewTaskTitle('')
      setIsCreatingTask(false)
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Удалить эту задачу?')) {
      await onTaskDelete(taskId)
      setLocalTasks(tasks => tasks.filter(t => t.id !== taskId))
    }
  }

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
          {(['kanban', 'list'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all',
                view === v ? 'bg-white shadow text-black' : 'text-slate-400 hover:text-black'
              )}
            >
              {v === 'kanban' ? 'Kanban' : 'Список'}
            </button>
          ))}
        </div>
      </div>

      {view === 'kanban' ? (
        <KanbanView
          tasks={localTasks}
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={handleDeleteTask}
          onTaskCreate={handleCreateTask}
          isLoading={isLoading}
        />
      ) : (
        <ListView
          tasks={localTasks}
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={handleDeleteTask}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}

function KanbanView({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onTaskCreate,
  isLoading,
}: {
  tasks: TaskItem[]
  onTaskUpdate: (taskId: string, updates: Partial<TaskItem>) => Promise<void>
  onTaskDelete: (taskId: string) => Promise<void>
  onTaskCreate: (status: string) => Promise<void>
  isLoading?: boolean
}) {
  const [newTaskStatus, setNewTaskStatus] = useState<string | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {Object.entries(STATUS_CONFIGS).map(([status, config]) => (
        <div
          key={status}
          className={cn('rounded-[24px] border p-4 space-y-3 min-h-[500px]', config.color)}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <config.icon className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {config.label}
              </span>
            </div>
            <span className="text-xs font-bold bg-white rounded-full px-2 py-0.5 shadow-sm">
              {tasks.filter(t => t.status === status).length}
            </span>
          </div>

          <div className="space-y-2 flex-1">
            {tasks
              .filter(t => t.status === status)
              .map(task => (
                <div
                  key={task.id}
                  className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all group space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold leading-snug text-slate-900 truncate">
                        {task.title}
                      </p>
                    </div>
                    <button
                      onClick={() => onTaskDelete(task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3 text-red-400 hover:text-red-600" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className={cn('w-2 h-2 rounded-full', PRIORITY_COLORS[task.priority])} />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      {task.priority}
                    </span>
                  </div>

                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                    </div>
                  )}
                </div>
              ))}
          </div>

          <button
            onClick={() => setNewTaskStatus(status)}
            className="w-full py-2 rounded-lg border-2 border-dashed border-slate-300 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:border-slate-400 hover:text-slate-600 transition-all"
          >
            + Добавить
          </button>

          {newTaskStatus === status && (
            <div className="bg-white rounded-lg p-3 space-y-2 border border-primary">
              <Input
                placeholder="Название задачи..."
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    onTaskCreate(status)
                    setNewTaskTitle('')
                    setNewTaskStatus(null)
                  }
                }}
                className="text-xs h-8"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onTaskCreate(status)
                    setNewTaskTitle('')
                    setNewTaskStatus(null)
                  }}
                  disabled={!newTaskTitle.trim() || isLoading}
                  className="flex-1 px-2 py-1 bg-primary text-black text-xs font-bold rounded hover:bg-yellow-400 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Создать'}
                </button>
                <button
                  onClick={() => {
                    setNewTaskStatus(null)
                    setNewTaskTitle('')
                  }}
                  className="flex-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded hover:bg-slate-200"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function ListView({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  isLoading,
}: {
  tasks: TaskItem[]
  onTaskUpdate: (taskId: string, updates: Partial<TaskItem>) => Promise<void>
  onTaskDelete: (taskId: string) => Promise<void>
  isLoading?: boolean
}) {
  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
      <div className="space-y-1 divide-y divide-slate-100">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p className="text-sm font-medium">Нет задач</p>
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-900">{task.title}</p>
                {task.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 ml-4">
                <Badge variant="outline" className="text-xs">
                  {STATUS_CONFIGS[task.status].label}
                </Badge>
                <div className={cn('w-2 h-2 rounded-full', PRIORITY_COLORS[task.priority])} />
                {task.dueDate && (
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                  </span>
                )}
                <button
                  onClick={() => onTaskDelete(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <Trash2 className="h-4 w-4 text-red-400 hover:text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

