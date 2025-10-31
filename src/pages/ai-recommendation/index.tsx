import * as React from 'react';
import ReplyBubble from 'src/shared/ui/replyBubble';
import { ProfileAssistant } from 'src/shared/components/layout/aibox/profileAssistant';
import { useLocation } from 'react-router-dom';
import useTypingEffect from 'src/shared/components/effects/typeEffect';
import { MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addPick } from 'src/store/picksSlice';

type RecoItem = {
  id: string;
  title: string;
  imageUrl?: string;
  description: string;
  cost: string;
};

type LocationState = { state?: { prompt?: string } };

function useRecoPrompt(): string | null {
  const loc = useLocation() as unknown as LocationState;
  const statePrompt = loc?.state?.prompt as string | undefined;
  const [prompt, setPrompt] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fromState = statePrompt ?? null;
    if (fromState) {
      setPrompt(fromState);
      try {
        sessionStorage.setItem('ai_reco_prompt', fromState);
      } catch (e) {
        // ignore storage errors
      }
      return;
    }
    try {
      const saved = sessionStorage.getItem('ai_reco_prompt');
      setPrompt(saved);
    } catch (e) {
      setPrompt(null);
    }
  }, [statePrompt]);

  return prompt ?? null;
}

function buildRecoText(prompt?: string | null): string {
  const p = prompt?.trim();
  if (!p) return 'Here are curated hampers and gift ideas based on your preferences.';
  return `Based on your request: "${p}", I recommend the following hampers and gift options tailored to the recipient and budget. Each pick balances usefulness, sentiment, and presentation.`;
}

function useRecommendations(): RecoItem[] {
  // Placeholder local generation; replace with backend results later
  const base: RecoItem[] = [
    {
      id: 'h1',
      title: 'Festive Snack Hamper',
      imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop',
      description: 'Assorted premium snacks with a handwritten note. Great for casual gifting.',
      cost: '$29',
    },
    {
      id: 'h2',
      title: 'Tea & Treats Box',
      imageUrl: 'https://images.unsplash.com/photo-1505575967455-40e256f73376?q=80&w=1200&auto=format&fit=crop',
      description: 'Curated teas with artisan cookies in a reusable box.',
      cost: '$39',
    },
    {
      id: 'h3',
      title: 'Self-Care Essentials',
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
      description: 'Bath salts, candle, and face mask set—relaxation guaranteed.',
      cost: '$49',
    },
    {
      id: 'h4',
      title: 'Fruit & Nuts Basket',
      imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop',
      description: 'Fresh seasonal fruits with premium mixed nuts.',
      cost: '$35',
    },
  ];
  return base;
}

function Card({ item }: { item: RecoItem }) {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="aspect-4/3 w-full bg-slate-100">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="text-sm font-semibold text-slate-900">{item.title}</div>
          <div className="relative">
            <button
              aria-label="Actions"
              onClick={() => setOpen((v) => !v)}
              className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {open && (
              <div className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-md border border-slate-200 bg-white py-1 text-sm shadow-md">
                <button
                  onClick={() => {
                    dispatch(
                      addPick({
                        id: item.id,
                        title: item.title,
                        imageUrl: item.imageUrl,
                        description: item.description,
                        cost: item.cost,
                      })
                    );
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-50"
                >
                  Save to Picks
                </button>
                <button
                  onClick={() => {
                    // eslint-disable-next-line no-console
                    console.log('make an order', item);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-50"
                >
                  Make an order!
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="mt-1 text-xs text-slate-600">{item.description}</p>
        <div className="mt-2 text-xs font-medium text-slate-900">{item.cost}</div>
          <div className="mt-2">
            <Link
              to={`/ai-recommendation/${item.id}`}
              className="inline-flex items-center gap-1 rounded-md border border-purple-200 px-2 py-1 text-xs font-medium text-purple-700 hover:bg-purple-50"
            >
              <i className="fa-solid fa-circle-info" /> See details
            </Link>
          </div>
      </div>
    </div>
  );
}

export default function AiRecommendationPage() {
  const prompt = useRecoPrompt();
  const text = React.useMemo(() => buildRecoText(prompt), [prompt]);
  const { text: typed } = useTypingEffect({ words: [text], caret: false, loop: false, typingSpeed: 24, deleteSpeed: 9999, delayBetweenWords: 999999 });
  const recos = useRecommendations();

  return (
    <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">AI Recommendation</h1>
        <div className="rounded-2xl border border-purple-100 bg-white/80 p-4 shadow-sm">
          {/* AIBubble: ProfileAssistant + ReplyBubble (typing) */}
          <div className="flex items-start gap-2">
            <ProfileAssistant />
            <ReplyBubble role="assistant" fluid>
              <span className="whitespace-pre-wrap">{typed}</span>
            </ReplyBubble>
          </div>

          {/* Recommendation cards */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {recos.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
  );
}
