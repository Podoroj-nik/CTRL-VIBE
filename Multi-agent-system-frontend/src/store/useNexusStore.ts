import { create } from 'zustand';

interface AgentState {
  stepIndex: number;
  projectDescription: string;
  accumulatedContext: string;
  results: Record<number, string>;
  isLoading: boolean;
  error: string | null;
}

interface NexusActions {
  setProjectDescription: (desc: string) => void;
  runStep: (feedback?: string) => Promise<void>;
  nextStep: () => void;
  reset: () => void;
}

export const useNexusStore = create<AgentState & NexusActions>((set, get) => ({
  stepIndex: 0,
  projectDescription: '',
  accumulatedContext: '',
  results: {},
  isLoading: false,
  error: null,

  setProjectDescription: (desc) => set({ projectDescription: desc }),

  runStep: async (feedback = '') => {
    const { stepIndex, projectDescription, accumulatedContext } = get();
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/ai/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step_index: stepIndex,
          project_description: projectDescription,
          user_feedback: feedback,
          previous_agents_context: accumulatedContext,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'AI request failed');
      }

      const data = await response.json();
      
      set((state) => ({
        results: { ...state.results, [stepIndex]: data.result },
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  nextStep: () => {
    const { stepIndex, results, accumulatedContext } = get();
    const currentResult = results[stepIndex];
    
    // Increment step and append current result to context
    if (currentResult) {
      set({
        stepIndex: stepIndex + 1,
        accumulatedContext: accumulatedContext + (accumulatedContext ? '\n\n' : '') + `[AGENT ${stepIndex}]:\n${currentResult}`,
      });
    }
  },

  reset: () => set({
    stepIndex: 0,
    accumulatedContext: '',
    results: {},
    isLoading: false,
    error: null
  }),
}));
