import React, { useState } from 'react';
import { Input } from 'src/shared/ui/input';
import { Button } from 'src/shared/ui/button';

export type TypingInputsProps = {
  onSubmit?: (text: string) => void;
  placeholder?: string;
};

export function TypingInputs({ onSubmit, placeholder = 'Describe the gift you want...' }: TypingInputsProps) {
  const [text, setText] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    onSubmit?.(value);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-2xl items-center gap-2 rounded-xl border border-gray-200 bg-white/70 p-2 shadow-sm backdrop-blur">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button type="submit" className="shrink-0">
        <i className="fa-solid fa-wand-magic-sparkles mr-2" /> Ask AI
      </Button>
    </form>
  );
}

export default TypingInputs;
