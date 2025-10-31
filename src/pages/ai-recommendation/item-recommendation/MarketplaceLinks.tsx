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
  // Use Simple Icons CDN for brand logos
  const map: Record<string, string> = {
    shopee: 'https://cdn.simpleicons.org/shopee/EE4D2D',
    lazada: 'https://cdn.simpleicons.org/lazada/1a9cf2',
    tokopedia: 'https://cdn.simpleicons.org/tokopedia/42B549',
    bukalapak: 'https://cdn.simpleicons.org/bukalapak/ED2B2A',
    blibli: 'https://cdn.simpleicons.org/blibli/0D6EFD',
  };
  return map[slug] || 'https://cdn.simpleicons.org/store/6b7280';
}

export default function MarketplaceLinks({ query }: Props) {
  const links = useAffiliateLinks(query);
  return (
    <section>
      <div className="text-sm font-semibold text-slate-900">Buy on</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {links.map((l) => (
          <a
            key={l.marketplace}
            href={l.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-purple-200 bg-white px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-50"
          >
            <img
              src={marketplaceLogoUrl(l.marketplace)}
              alt={l.marketplace}
              className="h-4 w-4"
              onError={(e) => {
                const t = e.currentTarget as HTMLImageElement;
                t.onerror = null;
                t.src = 'https://cdn.simpleicons.org/store/6b7280';
              }}
            />
            <span>{l.marketplace}</span>
            {l.code ? <span className="text-[10px] text-slate-500">({l.code})</span> : null}
          </a>
        ))}
      </div>
    </section>
  );
}
