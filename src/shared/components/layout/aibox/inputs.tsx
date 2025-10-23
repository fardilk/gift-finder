import * as React from 'react';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';

export function AiInputs({ onSubmit }: { onSubmit: (prompt: string) => Promise<void> | void }) {
  const [prompt, setPrompt] = React.useState('Find a gift for my friend who loves hiking and photography');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(prompt);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Input
        value={prompt}
        onChange={(e) => setPrompt(e.currentTarget.value)}
        placeholder="Describe the person or occasion..."
        className="flex-1"
      />
      <Button type="submit" className="w-full">Ask AI</Button>
    </form>
  );
}
