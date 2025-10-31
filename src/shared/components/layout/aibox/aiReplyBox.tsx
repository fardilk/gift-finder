import * as React from 'react';
import { cn } from '../../../utils/cn';
import { ProfileAssistant } from './profileAssistant';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import ReplyBubble from '../../../ui/replyBubble';

type Message = { id: string; role: 'user' | 'assistant'; content: string; at: number };

const STORAGE_KEY = 'ai_chat_history';
const TTL_MS = 24 * 60 * 60 * 1000; // 1 day

export function AiReplyBox({ className, onSend, fluid }: { className?: string; onSend?: (prompt: string) => void; fluid?: boolean }) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [value, setValue] = React.useState('');
  const listRef = React.useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }

  React.useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  // hydrate from localStorage (1-day TTL)
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const now = Date.now();
      if (!raw) {
        // seed with initial assistant message
        setMessages([
          {
            id: 'm1',
            role: 'assistant',
            content: "Hello! I'm ready to assist. Tell me who you're gifting for or the occasion.",
            at: now,
          },
        ]);
        return;
      }
      const parsed = JSON.parse(raw) as { messages: Message[]; updatedAt: number };
      if (!parsed?.updatedAt || now - parsed.updatedAt > TTL_MS) {
        localStorage.removeItem(STORAGE_KEY);
        setMessages([
          {
            id: 'm1',
            role: 'assistant',
            content: "Hello! I'm ready to assist. Tell me who you're gifting for or the occasion.",
            at: now,
          },
        ]);
        return;
      }
      setMessages(parsed.messages ?? []);
    } catch {
      // fallback seed
      setMessages([
        {
          id: 'm1',
          role: 'assistant',
          content: "Hello! I'm ready to assist. Tell me who you're gifting for or the occasion.",
          at: Date.now(),
        },
      ]);
    }
  }, []);

  // persist to localStorage on changes
  React.useEffect(() => {
    if (!messages.length) return;
    const payload = { messages, updatedAt: Date.now() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // ignore persistence errors (e.g., private mode quota)
    }
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const prompt = value.trim();
    if (!prompt) return;
  const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: prompt, at: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setValue('');
    onSend?.(prompt); // trigger external results rendering

    // lightweight assistant reply to keep the conversation feel
    const reply: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `Got it. I'll suggest ideas based on: "${prompt}"`,
      at: Date.now() + 300,
    };
    // small delay to simulate thinking
    await new Promise((r) => setTimeout(r, 300));
    setMessages((prev) => [...prev, reply]);
  }

  const container = `w-full ${fluid ? '' : 'md:w-[25vw]'} mb-6 rounded-2xl border border-purple-100 bg-white/80 p-4 shadow-sm shadow-purple-100/70 backdrop-blur`;

  function UserProfile() {
    return (
      <div className="h-8 w-8 shrink-0 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center text-[10px] font-semibold">
        You
      </div>
    );
  }

  return (
    <section className={cn(container, className)}>
      <div className="flex flex-col gap-4">
        <div ref={listRef} className="max-h-[45vh] overflow-y-auto rounded-xl bg-white p-3">
          <ul className="space-y-3">
            {messages.map((m) => {
              if (m.role === 'assistant') {

                return (
                  <li key={m.id} className="flex justify-start">
                    <div className="flex items-start gap-2">
                      <ProfileAssistant />
                      <ReplyBubble role="assistant" fluid={fluid}>
                        {m.content}
                      </ReplyBubble>
                    </div>
                  </li>
                );
              }
              // ProfileBubble: ReplyBubble + UserProfile (right)
              return (
                <li key={m.id} className="flex justify-end">
                  <div className="flex items-start gap-2">
                    <ReplyBubble role="user" fluid={fluid}>{m.content}</ReplyBubble>
                    <UserProfile />
                  </div>
                </li>
              );
            })}
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
