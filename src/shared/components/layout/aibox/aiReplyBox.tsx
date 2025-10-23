import * as React from 'react';
import { cn } from '../../../utils/cn';
import { ProfileAssistant } from './profileAssistant';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';

type Message = { id: string; role: 'user' | 'assistant'; content: string };

export function AiReplyBox({ className, onSend }: { className?: string; onSend?: (prompt: string) => void }) {
  const [messages, setMessages] = React.useState<Message[]>([
    { id: 'm1', role: 'assistant', content: "Hello! I'm ready to assist. Tell me who you're gifting for or the occasion." },
  ]);
  const [value, setValue] = React.useState('');
  const listRef = React.useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }

  React.useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const prompt = value.trim();
    if (!prompt) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setValue('');
    onSend?.(prompt); // trigger external results rendering

    // lightweight assistant reply to keep the conversation feel
    const reply: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `Got it. I'll suggest ideas based on: "${prompt}"`,
    };
    // small delay to simulate thinking
    await new Promise((r) => setTimeout(r, 300));
    setMessages((prev) => [...prev, reply]);
  }

  const container = 'w-full md:w-[25vw] mb-6 rounded-2xl border border-purple-100 bg-white/80 p-4 shadow-sm shadow-purple-100/70 backdrop-blur';

  return (
    <section className={cn(container, className)}>
      <div className="flex flex-col gap-4">
        <ProfileAssistant />

        <div
          ref={listRef}
          className="max-h-[45vh] overflow-y-auto rounded-xl border border-purple-50 bg-white p-3"
        >
          <ul className="space-y-2">
            {messages.map((m) => (
              <li key={m.id} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[85%] break-words rounded-2xl px-3 py-2 text-sm',
                    m.role === 'user'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-800'
                  )}
                >
                  {m.content}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            placeholder="Type your request…"
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </section>
  );
}

export default AiReplyBox;
