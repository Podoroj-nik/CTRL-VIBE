/**
 * Клиент для работы с AI-агентами на бекенде
 * Используется для обработки проектов через мультиагентную систему
 */

export interface AgentRequest {
  step_index: number; // 0-5 (Scorer, Researcher, Admin, HR, DevOps, Secretary)
  project_description: string;
  user_feedback?: string;
  previous_agents_context?: string;
}

export interface AgentResponse {
  result: string;
}

export interface ProcessStepOptions {
  step_index: number;
  projectDescription: string;
  userFeedback?: string;
  previousContext?: string;
}

/**
 * Интерпретация step_index:
 * 0 - Scorer (оценка проекта)
 * 1 - Researcher (исследование рынка)
 * 2 - Admin (административный план)
 * 3 - HR (подбор команды)
 * 4 - DevOps (инфраструктура)
 * 5 - Secretary (финальное резюме)
 */

class AgentClient {
  private frontendApiEndpoint: string;

  constructor(endpoint: string = '/api/ai/process') {
    this.frontendApiEndpoint = endpoint;
  }

  async processStep(options: ProcessStepOptions): Promise<string> {
    try {
      const response = await fetch(this.frontendApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step_index: options.step_index,
          project_description: options.projectDescription,
          user_feedback: options.userFeedback || '',
          previous_agents_context: options.previousContext || '',
        } as AgentRequest),
      });

      if (!response.ok) {
        throw new Error(`Agent API error: ${response.statusText}`);
      }

      const data: AgentResponse = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error calling agent:', error);
      throw error;
    }
  }

  /**
   * Проходит через все этапы агентов последовательно
   * Полезно для полного анализа проекта
   */
  async processFullPipeline(
    projectDescription: string,
    onStepComplete?: (stepIndex: number, result: string) => void
  ): Promise<string[]> {
    const results: string[] = [];
    let context = '';

    for (let i = 0; i <= 5; i++) {
      const result = await this.processStep({
        step_index: i,
        projectDescription,
        previousContext: context,
      });

      results.push(result);
      context += `\n\n--- Step ${i} Result ---\n${result}`;

      if (onStepComplete) {
        onStepComplete(i, result);
      }

      // Небольшая задержка между запросами
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
  }

  /**
   * Запрашивает исправления после обратной связи пользователя
   */
  async refineStep(
    stepIndex: number,
    projectDescription: string,
    userFeedback: string,
    previousContext: string
  ): Promise<string> {
    return this.processStep({
      step_index: stepIndex,
      projectDescription,
      userFeedback,
      previousContext,
    });
  }
}

export const agentClient = new AgentClient();

