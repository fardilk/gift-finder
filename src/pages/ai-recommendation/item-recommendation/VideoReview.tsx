import * as React from 'react';

type Props = {
  videoUrl?: string;
  title: string;
  heading?: string; // e.g., "Video Streaming"
  expandOnClick?: boolean; // clicking toggles expanded styling
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

export default function VideoReview({ videoUrl, title, heading = 'Video Streaming', expandOnClick = true }: Props) {
  const embed = toEmbedUrl(videoUrl);
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div className={`rounded-xl border border-slate-200 bg-white ${expanded ? 'p-0' : 'p-2'}`}>
      <div className="px-2 pt-2">
        <div className="text-sm font-semibold text-slate-900">{heading}</div>
      </div>
      <div
        className={`w-full overflow-hidden ${expanded ? 'rounded-none' : 'rounded-lg'} bg-black/5 ${expanded ? '' : 'mt-1'} ${expanded ? 'aspect-video' : 'aspect-video'}`}
        onClick={() => expandOnClick && setExpanded((v) => !v)}
        role={expandOnClick ? 'button' : undefined}
        aria-label={expandOnClick ? 'Toggle video size' : undefined}
      >
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
      <div className="px-2 pb-2" />
    </div>
  );
}
