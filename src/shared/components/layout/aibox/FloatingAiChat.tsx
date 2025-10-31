import * as React from 'react';
import { ProfileAssistant } from './profileAssistant';
import AiReplyBox from './aiReplyBox';
import { useAiResults } from './hooks/useAiResults';
import { useNavigate } from 'react-router-dom';

export default function FloatingAiChat() {
  const [open, setOpen] = React.useState(false);
  const { submit } = useAiResults();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open ? (
        <button
          aria-label="Open AI chat"
          onClick={() => setOpen(true)}
          className="group rounded-2xl border border-purple-200 bg-white/90 p-2 shadow-lg shadow-purple-200/50 backdrop-blur transition hover:scale-[1.02]"
        >
          <ProfileAssistant />
        </button>
      ) : (
  <div className="w-[63vw] max-w-[20rem]">
          <div className="overflow-hidden rounded-2xl border border-purple-200 bg-white/95 shadow-2xl shadow-purple-200/70 backdrop-blur">
            <div className="flex items-center justify-between border-b border-purple-100 px-3 py-2">
              <div className="flex items-center gap-2">
                <ProfileAssistant />
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-slate-900">Gift Assistant</div>
                  <div className="text-[10px] text-slate-500">Always here to help</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close AI chat"
                title="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="p-3">
              <AiReplyBox
                className="w-full"
                fluid
                onSend={(prompt) => {
                  submit(prompt);
                  // If prompt includes gift-related intent, route to AI Recommendation page
                  const p = prompt.toLowerCase();
                  const isGift = /\b(gift|hamper|hampers|present|kado)\b/.test(p);
                  if (isGift) {
                    try {
                      sessionStorage.setItem('ai_reco_prompt', prompt);
                    } catch (e) {
                      // ignore storage errors
                    }
                    navigate('/dashboard/ai-recommendation', { state: { prompt } });
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
