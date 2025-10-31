import * as React from 'react';

type Props = {
  videoUrl?: string;
  title: string;
};

function toEmbedUrl(url?: string) {
  if (!url) return undefined;
  // Support watch?v=, youtu.be/, or already embed
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname === '/watch' && u.searchParams.get('v')) {
        const id = u.searchParams.get('v')!;
        return `https://www.youtube.com/embed/${id}`;
      }
      if (u.pathname.startsWith('/embed/')) return url;
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.replace('/', '');
      return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    // ignore invalid URLs
  }
  return undefined;
}

export default function VideoReview({ videoUrl, title }: Props) {
  const embed = toEmbedUrl(videoUrl);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black/5">
        {embed ? (
          <iframe
            className="h-full w-full"
            src={embed}
            title={`${title} review`}
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">No video available</div>
        )}
      </div>
      <a
        className="mt-2 inline-flex items-center gap-1 text-xs text-purple-700 hover:underline"
        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' review')}`}
        target="_blank"
        rel="noreferrer"
      >
        <i className="fa-brands fa-youtube" /> Search more reviews
      </a>
    </div>
  );
}
