import * as React from 'react';

export type AiResult = {
  id: string;
  title: string;
  detail: string;
};

export function useAiResults() {
  const [results, setResults] = React.useState<AiResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit(prompt: string) {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: replace with real API call
      await new Promise((r) => setTimeout(r, 600));
      setResults([
        { id: '1', title: 'Thoughtful Gift Idea', detail: `Generated idea for: ${prompt}` },
        { id: '2', title: 'Alternative Option', detail: 'A budget-friendly option with similar sentiment.' },
      ]);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return { results, isLoading, error, submit } as const;
}
