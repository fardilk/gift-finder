import * as React from 'react';

type Props = {
  images: string[];
  title: string;
};

export default function ImageGallery({ images, title }: Props) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  function openAt(i: number) {
    setIndex(i);
    setOpen(true);
  }

  function close() {
    setOpen(false);
  }

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  function next() {
    setIndex((i) => (i + 1) % images.length);
  }

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="grid grid-cols-2 gap-2">
      {images.map((src, idx) => (
        <button
          key={idx}
          className="aspect-4/3 overflow-hidden rounded-lg border bg-slate-100"
          onClick={() => openAt(idx)}
          aria-label={`Open image ${idx + 1}`}
        >
          <img
            src={src}
            alt={`${title} ${idx + 1}`}
            className="h-full w-full object-cover"
            onError={(e) => {
              try {
                const target = e.currentTarget as HTMLImageElement;
                target.onerror = null;
                target.src =
                  'data:image/svg+xml;utf8,' +
                  encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900"><rect width="100%" height="100%" fill="#f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-family="Inter, Arial, sans-serif" font-size="28">Image not available</text></svg>'
                  );
              } catch (err) {
                // ignore
              }
            }}
          />
        </button>
      ))}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true">
          <button className="absolute right-4 top-4 rounded bg-white/10 px-3 py-1 text-white hover:bg-white/20" onClick={close} aria-label="Close">
            <i className="fa-solid fa-xmark" />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 rounded bg-white/10 p-2 text-white hover:bg-white/20" onClick={prev} aria-label="Previous">
            <i className="fa-solid fa-chevron-left" />
          </button>
          <div className="max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-black">
            <img src={images[index]} alt={`${title} large ${index + 1}`} className="h-full w-full object-contain" />
          </div>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 rounded bg-white/10 p-2 text-white hover:bg-white/20" onClick={next} aria-label="Next">
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      )}
    </div>
  );
}
