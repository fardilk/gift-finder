import * as React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import MarketplaceLinks from './MarketplaceLinks';
import VideoReview from './VideoReview';
import ImageGallery from './ImageGallery';
import ProsCons from './ProsCons';
import SocialLinks from './SocialLinks';
import CustomerReviews from './CustomerReviews';

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
    h1: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    h2: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    h3: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    h4: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
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
  } as DetailData;
}

export default function ItemRecommendationDetail() {
  const { itemId = '' } = useParams();
  const data = React.useMemo(() => buildDetail(itemId), [itemId]);

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

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{data.item.title}</h1>
          <p className="mt-1 text-sm text-slate-600">{data.item.description}</p>
        </div>
        <div className="text-right text-sm font-medium text-slate-900">{data.item.cost}</div>
      </header>

      <MarketplaceLinks query={query} />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <VideoReview videoUrl={data.videoUrl} title={data.item.title} />
        </div>
        <div className="md:col-span-2">
          <ImageGallery images={data.gallery} title={data.item.title} />
        </div>
      </section>

      <ProsCons pros={data.pros} cons={data.cons} />

      <SocialLinks social={data.social} />

      <CustomerReviews reviews={data.reviews} />

      <div className="pt-2 text-xs">
        <RouterLink to="/ai-recommendation" className="text-purple-600 hover:underline">
          ← Back to AI Recommendation
        </RouterLink>
      </div>
    </section>
  );
}
