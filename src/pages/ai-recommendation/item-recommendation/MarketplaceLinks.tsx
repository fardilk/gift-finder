import * as React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from 'src/store/store';

export type MarketplaceLink = {
  marketplace: string;
  url: string;
  code?: string;
};

type Props = {
  query: string;
  variant?: 'flex' | 'grid2';
  price?: string; // estimation price to show on each card
};

function useAffiliateLinks(query: string) {
  const affiliates = useSelector((s: RootState) => s.affiliate.affiliates);
  const masters = useSelector((s: RootState) => s.affiliate.masterMarketplaces);
  return React.useMemo<MarketplaceLink[]>(() => {
    const q = encodeURIComponent(query);
    const templates: Record<string, string> = {
      Shopee: `https://shopee.co.id/search?keyword=${q}`,
      Lazada: `https://www.lazada.co.id/catalog/?q=${q}`,
      Tokopedia: `https://www.tokopedia.com/search?st=product&q=${q}`,
      Bukalapak: `https://www.bukalapak.com/products?search%5Bkeyword%5D=${q}`,
      Blibli: `https://www.blibli.com/search?s=${q}`,
    };
    return masters.map((mkt) => {
      const base = templates[mkt] || `https://www.google.com/search?q=${q}`;
      const aff = affiliates.find((a) => a.marketplace.toLowerCase() === mkt.toLowerCase());
      const withCode = aff ? `${base}&utm_source=gift-finder&utm_campaign=${encodeURIComponent(aff.code)}` : base;
      return { marketplace: mkt, url: withCode, code: aff?.code };
    });
  }, [affiliates, masters, query]);
}

function marketplaceLogoUrl(name: string) {
  const slug = name.toLowerCase();
  // Use jsDelivr simple-icons SVGs to avoid ORB issues
  const map: Record<string, string> = {
    shopee: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/shopee.svg',
    lazada: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/lazada.svg',
    tokopedia: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tokopedia.svg',
    bukalapak: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/bukalapak.svg',
    blibli: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/blibli.svg',
  };
  return map[slug] || 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/store.svg';
}

export default function MarketplaceLinks({ query, variant = 'flex', price }: Props) {
  const links = useAffiliateLinks(query);
  return (
    <section>
      <div className="text-sm font-semibold text-slate-900">Buy on</div>
      <div className={variant === 'grid2' ? 'mt-2 grid grid-cols-2 gap-2' : 'mt-2 flex flex-wrap gap-2'}>
        {links.map((l) => (
          <a
            key={l.marketplace}
            href={l.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-md border border-purple-200 bg-white p-3 text-xs hover:bg-purple-50"
          >
            <img
              src={marketplaceLogoUrl(l.marketplace)}
              alt={l.marketplace}
              className="h-6 w-6"
              onError={(e) => {
                const t = e.currentTarget as HTMLImageElement;
                t.onerror = null;
                t.src = 'https://cdn.simpleicons.org/store/6b7280';
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1 text-slate-900">
                <span className="text-sm font-semibold">{l.marketplace}</span>
                {l.code ? <span className="text-[10px] text-slate-500">({l.code})</span> : null}
              </div>
              <div className="my-1 h-px w-full bg-slate-200" />
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Estimation price</div>
              <div className="text-sm font-medium text-slate-900">{price ?? '—'}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
