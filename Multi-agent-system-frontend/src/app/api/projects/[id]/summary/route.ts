import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { agentClient } from '@/lib/agent-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Получаем проект с задачами и сообщениями
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        application: true,
        tasks: true,
        chatMessages: {
          orderBy: { createdAt: 'desc' },
          take: 10, // Последние 10 сообщений
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Формируем контекст для саммери
    const taskStats = {
      total: project.tasks.length,
      done: project.tasks.filter(t => t.status === 'DONE').length,
      inProgress: project.tasks.filter(t => t.status === 'IN_PROGRESS').length,
      todo: project.tasks.filter(t => t.status === 'TODO').length,
    };

    const progress = Math.round((taskStats.done / (taskStats.total || 1)) * 100);

    const context = `
Проект: ${project.name}
Прогресс: ${progress}% (${taskStats.done}/${taskStats.total} задач выполнено)
В работе: ${taskStats.inProgress} задач
Ожидают: ${taskStats.todo} задач

Последние сообщения в чате:
${project.chatMessages.map(m => `${m.isAiSummary ? '[AI]' : '[User]'}: ${m.content}`).join('\n')}

Создайте краткий саммери прогресса проекта за последние 3 дня.
`;

    // Получаем саммери от ИИ
    const summary = await agentClient.processStep({
      step_index: 5, // Secretary для финального резюме
      projectDescription: project.application?.description || '',
      userFeedback: `Создай саммери прогресса проекта за последние 3 дня. ${context}`,
      previousContext: '',
    });

    // Сохраняем саммери в чат
    const message = await prisma.chatMessage.create({
      data: {
        projectId,
        content: `📊 **Саммери прогресса за 3 дня**\n\n${summary}`,
        isAiSummary: true,
      },
    });

    return NextResponse.json(message);
  } catch (error: any) {
    console.error('Error generating summary:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
