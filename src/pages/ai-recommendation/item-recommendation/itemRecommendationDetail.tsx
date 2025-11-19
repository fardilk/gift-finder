import * as React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import MarketplaceLinks from './MarketplaceLinks';
import VideoReview from './VideoReview';
import ImageCarousel from './ImageCarousel';
import { useDispatch } from 'react-redux';
import { addPick } from 'src/store/picksSlice';
import ProsCons from './ProsCons';
import CustomerReviews from './CustomerReviews';
import { matchHashedId } from 'src/shared/utils/hashId';

// Shared item shape
type RecoItem = {
  id: string;
  title: string;
  imageUrl?: string;
  description: string;
  cost: string; // fixed price string, e.g., "$29"
};

type Review = {
  id: string;
  author: string;
  rating: number; // 1-5
  text: string;
  date: string;
};

type DetailData = {
  item: RecoItem;
  gallery: string[];
  pros: string[];
  cons: string[];
  videoUrl?: string; // YouTube URL
  social?: Partial<Record<'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'facebook', string>>;
  reviews?: Review[];
  priceRange?: string; // e.g. "$25 - $40"
};

function getBaseItems(): Record<string, RecoItem> {
  // Keep consistent with list page items
  return {
    h1: {
      id: 'h1',
      title: 'Festive Snack Hamper',
      imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop',
      description: 'Assorted premium snacks with a handwritten note. Great for casual gifting.',
      cost: '$29',
    },
    h2: {
      id: 'h2',
      title: 'Tea & Treats Box',
      imageUrl: 'https://images.unsplash.com/photo-1505575967455-40e256f73376?q=80&w=1200&auto=format&fit=crop',
      description: 'Curated teas with artisan cookies in a reusable box.',
      cost: '$39',
    },
    h3: {
      id: 'h3',
      title: 'Self-Care Essentials',
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
      description: 'Bath salts, candle, and face mask set—relaxation guaranteed.',
      cost: '$49',
    },
    h4: {
      id: 'h4',
      title: 'Fruit & Nuts Basket',
      imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop',
      description: 'Fresh seasonal fruits with premium mixed nuts.',
      cost: '$35',
    },
  } as const as Record<string, RecoItem>;
}

function buildDetail(id: string): DetailData | null {
  const base = getBaseItems()[id];
  if (!base) return null;

  const commonPros = ['Good value for money', 'Easy to gift', 'Widely available'];
  const commonCons = ['May not fit dietary restrictions', 'Packaging varies by seller'];

  const galleries: Record<string, string[]> = {
    h1: [
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80&fm=jpg',
      'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=80&fm=jpg',
      'https://picsum.photos/id/1012/1200/900',
      'https://picsum.photos/id/1025/1200/900',
    ],
    h2: [
      'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1200&q=80&fm=jpg',
      'https://images.unsplash.com/photo-1513639725746-c5d3e861f32a?auto=format&fit=crop&w=1200&q=80&fm=jpg',
      'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80&fm=jpg',
    ],
    h3: [
      'https://images.unsplash.com/photo-1505575972945-2802f354ebb4?auto=format&fit=crop&w=1200&q=80&fm=jpg',
      'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?auto=format&fit=crop&w=1200&q=80&fm=jpg',
      'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&w=1200&q=80&fm=jpg',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80&fm=jpg',
    ],
    h4: [
      'https://images.unsplash.com/photo-1576046126311-54b6f8a0d58d?auto=format&fit=crop&w=1200&q=80&fm=jpg',
      'https://images.unsplash.com/photo-1457296898342-cdd24585d095?auto=format&fit=crop&w=1200&q=80&fm=jpg',
      'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1200&q=80&fm=jpg',
    ],
  };

  const videos: Record<string, string> = {
    // Use direct embeddable URLs to guarantee streaming in iframe
    h1: 'https://www.youtube.com/embed/aqz-KE-bpKQ?rel=0',
    h2: 'https://www.youtube.com/embed/ysz5S6PUM-U?rel=0',
    h3: 'https://www.youtube.com/embed/jNQXAC9IVRw?rel=0',
    h4: 'https://www.youtube.com/embed/mLoynSMpjKA?rel=0',
  };

  const pros: Record<string, string[]> = {
    h1: [...commonPros, 'Snack variety fits many tastes'],
    h2: [...commonPros, 'Calming theme with teas'],
    h3: [...commonPros, 'Relaxation-focused curation'],
    h4: [...commonPros, 'Fresh and healthy vibe'],
  };

  const cons: Record<string, string[]> = {
    h1: [...commonCons, 'Sweet-heavy selection'],
    h2: [...commonCons, 'Tea preferences can be personal'],
    h3: [...commonCons, 'Scent sensitivities vary'],
    h4: [...commonCons, 'Perishability of fruits'],
  };

  const reviews: Record<string, Review[]> = {
    h1: [
      { id: 'rv1', author: 'Nadia', rating: 5, date: '2025-10-12', text: 'Perfect variety and presentation. Arrived fast!' },
      { id: 'rv2', author: 'Hendra', rating: 4, date: '2025-10-20', text: 'Great value—some items a bit too sweet for me.' },
    ],
    h2: [
      { id: 'rv3', author: 'Putri', rating: 5, date: '2025-09-08', text: 'Tea quality is amazing. Packaging looks premium.' },
    ],
    h3: [
      { id: 'rv4', author: 'Dimas', rating: 4, date: '2025-07-28', text: 'Relaxing vibe. Would prefer a different candle scent.' },
    ],
    h4: [
      { id: 'rv5', author: 'Anita', rating: 5, date: '2025-08-15', text: 'Fresh fruits and crunchy nuts—everyone loved it.' },
    ],
  };

  const socialBase: Record<string, DetailData['social']> = {
    h1: { instagram: `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(base.title)}` },
    h2: { youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(base.title + ' review')}` },
    h3: { tiktok: `https://www.tiktok.com/search?q=${encodeURIComponent(base.title)}` },
    h4: { twitter: `https://x.com/search?q=${encodeURIComponent(base.title)}` },
  };

  return {
    item: base,
    gallery: galleries[id] || [],
    videoUrl: videos[id],
    pros: pros[id] || commonPros,
    cons: cons[id] || commonCons,
    social: socialBase[id],
    reviews: reviews[id],
    priceRange:
      id === 'h1' ? '$25 - $40' :
      id === 'h2' ? '$30 - $55' :
      id === 'h3' ? '$35 - $60' :
      id === 'h4' ? '$28 - $50' : undefined,
  } as DetailData;
}

export default function ItemRecommendationDetail() {
  const { itemId = '' } = useParams();
  const resolvedId = React.useMemo(() => {
    // Support old ids for backward compatibility
    const baseIds = Object.keys(getBaseItems());
    if (baseIds.includes(itemId)) return itemId;
    const match = matchHashedId(baseIds as Array<keyof ReturnType<typeof getBaseItems>>, itemId);
    return match || '';
  }, [itemId]);
  const data = React.useMemo(() => buildDetail(resolvedId), [resolvedId]);
  const dispatch = useDispatch();

  if (!data) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm">
          <p>
            Item not found. Go back to{' '}
            <RouterLink to="/ai-recommendation" className="text-purple-600 underline">
              AI Recommendation
            </RouterLink>
            .
          </p>
        </div>
      </div>
    );
  }

  const query = data.item.title || 'gift hamper';
  const avgRating = React.useMemo(() => {
    const arr = data.reviews ?? [];
    if (!arr.length) return 0;
    const sum = arr.reduce((acc, r) => acc + (r.rating || 0), 0);
    return Math.round((sum / arr.length) * 10) / 10;
  }, [data.reviews]);

  function Stars({ value }: { value: number }) {
    const clamped = Math.max(0, Math.min(5, value));
    return (
      <div className="text-yellow-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <i
            key={i}
            className={[
              'fa-solid',
              i < Math.round(clamped) ? 'fa-star' : 'fa-star-half-stroke opacity-30',
              'mr-0.5',
            ].join(' ')}
          />
        ))}
      </div>
    );
  }

  function truncate(s: string, max = 360) {
    if (s.length <= max) return s;
    return s.slice(0, max - 1) + '…';
  }

  function toRupiahDisplay(v?: string) {
    if (!v) return '-';
    const parts = v.split('-').map((p) => `Rp ${p.trim().replace(/^\$/,'')}`);
    return parts.join(' - ');
  }

  return (
    <section className="space-y-6">
      {/* Top section: two columns */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-10">
        {/* Left: Carousel with thumbnails and indicators */}
        <div className="md:col-span-4">
          <ImageCarousel images={data.gallery} title={data.item.title} />
        </div>
        {/* Right: Info */}
        <div className="space-y-3 md:col-span-6">
          <h1 className="text-2xl font-semibold text-slate-900">{data.item.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="font-semibold text-slate-900">
              {data.priceRange ? <span>{toRupiahDisplay(data.priceRange)}</span> : <span>{toRupiahDisplay(data.item.cost)}</span>}
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Stars value={avgRating} />
              <span className="text-xs">{avgRating}/5</span>
              {data.reviews?.length ? <span className="text-xs text-slate-500">({data.reviews.length} reviews)</span> : null}
            </div>
          </div>
          <p className="text-sm text-slate-700">{truncate(data.item.description, 360)}</p>

          {/* Buy links in two columns */}
          <MarketplaceLinks query={query} variant="grid2" price={toRupiahDisplay(data.item.cost)} />

          {/* Pros & Cons above actions */}
          <ProsCons pros={data.pros} cons={data.cons} stacked />

          {/* Actions: Save to picks and Report */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              onClick={() =>
                dispatch(
                  addPick({
                    id: data.item.id,
                    title: data.item.title,
                    imageUrl: data.item.imageUrl,
                    description: data.item.description,
                    cost: toRupiahDisplay(data.priceRange || data.item.cost),
                  })
                )
              }
            >
              <i className="fa-regular fa-bookmark" /> Save to Picks
            </button>
            <ReportButton itemId={data.item.id} itemTitle={data.item.title} />
          </div>
        </div>
      </div>

      {/* Video section only */}
      <section>
        <VideoReview videoUrl={data.videoUrl} title={data.item.title} heading="Video Streaming" />
      </section>

      {/* Testimonials after video */}
      <CustomerReviews reviews={data.reviews} />

      <div className="pt-2 text-xs">
        <RouterLink to="/ai-recommendation" className="text-purple-600 hover:underline">
          ← Back to AI Recommendation
        </RouterLink>
      </div>
    </section>
  );
}

function ReportButton({ itemId, itemTitle }: { itemId: string; itemTitle: string }) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  return (
    <div className="inline-flex flex-col gap-2">
      <button
        className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
        onClick={() => setOpen((v) => !v)}
      >
        <i className="fa-solid fa-flag" /> Report suggestion
      </button>
      {open && (
        <div className="w-full max-w-sm rounded-md border border-slate-200 bg-white p-2 text-sm shadow-sm">
          <div className="text-xs text-slate-500">Tell us what’s not appropriate about “{itemTitle}”.</div>
          <textarea
            className="mt-2 w-full resize-y rounded border border-slate-200 p-2 text-sm outline-none focus:ring-2 focus:ring-red-200"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Spam, unsafe, incorrect, etc."
          />
          <div className="mt-2 flex justify-end gap-2">
            <button className="rounded-md px-3 py-1 text-sm text-slate-600 hover:bg-slate-100" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button
              className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
              onClick={() => {
                // For now we simply log. Replace with API later.
                // eslint-disable-next-line no-console
                console.log('REPORT', { itemId, itemTitle, text });
                setOpen(false);
                setText('');
                alert('Thanks! Your report has been submitted.');
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
