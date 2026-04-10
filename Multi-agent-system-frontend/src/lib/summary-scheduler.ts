import prisma from '@/lib/prisma';
import { agentClient } from '@/lib/agent-client';

class SummaryScheduler {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log('🚀 Starting summary scheduler...');

    // Для тестирования используем setInterval вместо cron
    // В продакшене можно заменить на cron.schedule('0 9 */3 * *', ...)
    this.intervalId = setInterval(async () => {
      await this.generateSummaries();
    }, 3 * 60 * 1000); // Каждые 3 минуты для тестирования

    // Также можно добавить cron для продакшена:
    // if (process.env.NODE_ENV === 'production') {
    //   cron.schedule('0 9 */3 * *', async () => {
    //     await this.generateSummaries();
    //   });
    // }

    console.log('✅ Summary scheduler started');
  }

  async generateSummaries() {
    try {
      console.log('📊 Generating project summaries...');

      // Получаем все активные проекты
      const projects = await prisma.project.findMany({
        where: { status: 'ACTIVE' },
        include: {
          tasks: true,
          chatMessages: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      for (const project of projects) {
        try {
          await this.generateProjectSummary(project);
          // Небольшая задержка между проектами
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`❌ Failed to generate summary for project ${project.id}:`, error);
        }
      }

      console.log('✅ All summaries generated');
    } catch (error) {
      console.error('❌ Error in summary generation:', error);
    }
  }

  private async generateProjectSummary(project: any) {
    const taskStats = {
      total: project.tasks.length,
      done: project.tasks.filter((t: any) => t.status === 'DONE').length,
      inProgress: project.tasks.filter((t: any) => t.status === 'IN_PROGRESS').length,
      todo: project.tasks.filter((t: any) => t.status === 'TODO').length,
    };

    const progress = Math.round((taskStats.done / (taskStats.total || 1)) * 100);

    const context = `
Проект: ${project.name}
Прогресс: ${progress}% (${taskStats.done}/${taskStats.total} задач выполнено)
В работе: ${taskStats.inProgress} задач
Ожидают: ${taskStats.todo} задач

Последние сообщения в чате:
${project.chatMessages.map((m: any) => `${m.isAiSummary ? '[AI]' : '[User]'}: ${m.content}`).join('\n')}

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
    await prisma.chatMessage.create({
      data: {
        projectId: project.id,
        content: `📊 **Саммери прогресса за 3 дня**\n\n${summary}`,
        isAiSummary: true,
      },
    });

    console.log(`📝 Summary generated for project: ${project.name}`);
  }

  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('🛑 Summary scheduler stopped');
  }
}

export const summaryScheduler = new SummaryScheduler();
