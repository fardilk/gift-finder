import * as React from 'react';

type Props = {
  images: string[];
  title: string;
  intervalMs?: number;
};

export default function ImageCarousel({ images, title, intervalMs = 3500 }: Props) {
  const [index, setIndex] = React.useState(0);
  const [hovered, setHovered] = React.useState(false);
  const len = images.length;
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // autoplay
  React.useEffect(() => {
    if (!len) return;
    if (hovered) return; // pause on hover
    const id = setInterval(() => setIndex((i) => (i + 1) % len), intervalMs);
    return () => clearInterval(id);
  }, [len, hovered, intervalMs]);

  function goTo(i: number) {
    setIndex(((i % len) + len) % len);
  }
  function next() {
    goTo(index + 1);
  }
  function prev() {
    goTo(index - 1);
  }

  // swipe handling (mouse + touch)
  const startX = React.useRef<number | null>(null);
  const lastX = React.useRef<number | null>(null);

  function onPointerDown(x: number) {
    startX.current = x;
    lastX.current = x;
  }
  function onPointerMove(x: number) {
    lastX.current = x;
  }
  function onPointerUp() {
    if (startX.current == null || lastX.current == null) return;
    const dx = lastX.current - startX.current;
    const threshold = 30; // pixels
    if (dx > threshold) prev();
    else if (dx < -threshold) next();
    startX.current = null;
    lastX.current = null;
  }

  if (!len) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100" />
    );
  }

  return (
    <div
      className="relative aspect-square w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={containerRef}
      onClick={next}
    >
      {/* top progress indicators */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex gap-1 p-2">
        {images.map((_, i) => (
          <div key={i} className="flex-1">
            <div
              className="w-full rounded-full bg-slate-300/70"
              style={{ height: '1.2px' }}
            />
            {i === index && (
              <div
                className="-mt-[1.2px] w-0 rounded-full bg-purple-500"
                style={{ height: '1.2px', animation: `fill ${intervalMs}ms linear forwards` as React.CSSProperties['animation'] }}
              />
            )}
          </div>
        ))}
      </div>

      {/* images */}
      <div className="h-full w-full">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${title} ${i + 1}`}
            className={`absolute left-0 top-0 h-full w-full object-cover transition-opacity duration-500 ${i === index ? 'opacity-100' : 'opacity-0'}`}
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              t.onerror = null;
              t.src =
                'data:image/svg+xml;utf8,' +
                encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200"><rect width="100%" height="100%" fill="#f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-family="Inter, Arial, sans-serif" font-size="28">Image not available</text></svg>'
                );
            }}
            onMouseDown={(ev) => onPointerDown(ev.clientX)}
            onMouseMove={(ev) => onPointerMove(ev.clientX)}
            onMouseUp={() => onPointerUp()}
            onMouseLeave={() => {
              // cancel drag
              startX.current = null;
              lastX.current = null;
            }}
            onTouchStart={(ev) => onPointerDown(ev.touches[0]?.clientX ?? 0)}
            onTouchMove={(ev) => onPointerMove(ev.touches[0]?.clientX ?? 0)}
            onTouchEnd={() => onPointerUp()}
          />
        ))}
      </div>

      {/* bottom thumbnails overlay */}
      <div className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-2xl bg-white/70 p-1 shadow-sm backdrop-blur">
        <div className="flex gap-1">
          {images.map((src, i) => (
            <button
              key={i}
              className={`h-12 w-12 overflow-hidden rounded-lg border ${i === index ? 'border-purple-500' : 'border-slate-200'}`}
              onClick={(e) => {
                e.stopPropagation();
                goTo(i);
              }}
              aria-label={`Go to image ${i + 1}`}
            >
              <img src={src} alt={`${title} thumb ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* navigation buttons (optional, hidden on small) */}
      <button
        className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded bg-black/30 p-2 text-white hover:bg-black/40 md:block"
        onClick={(e) => { e.stopPropagation(); prev(); }}
        aria-label="Previous image"
      >
        <i className="fa-solid fa-chevron-left" />
      </button>
      <button
        className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded bg-black/30 p-2 text-white hover:bg-black/40 md:block"
        onClick={(e) => { e.stopPropagation(); next(); }}
        aria-label="Next image"
      >
        <i className="fa-solid fa-chevron-right" />
      </button>

      {/* keyframes for progress fill */}
      <style>{`@keyframes fill { from { width: 0; } to { width: 100%; } }`}</style>
    </div>
  );
}
