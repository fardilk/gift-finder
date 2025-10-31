import * as React from 'react';

type Social = Partial<Record<'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'facebook', string>>;

export default function SocialLinks({ social }: { social?: Social }) {
  return (
    <section>
      <div className="text-sm font-semibold text-slate-900">Brand on social media</div>
      {social && Object.keys(social).length > 0 ? (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          {social.instagram && (
            <a href={social.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50">
              <i className="fa-brands fa-instagram text-[#E1306C]" /> Instagram
            </a>
          )}
          {social.youtube && (
            <a href={social.youtube} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50">
              <i className="fa-brands fa-youtube text-[#FF0000]" /> YouTube
            </a>
          )}
          {social.tiktok && (
            <a href={social.tiktok} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50">
              <i className="fa-brands fa-tiktok" /> TikTok
            </a>
          )}
          {social.twitter && (
            <a href={social.twitter} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50">
              <i className="fa-brands fa-x-twitter" /> X
            </a>
          )}
          {social.facebook && (
            <a href={social.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50">
              <i className="fa-brands fa-facebook text-[#1877F2]" /> Facebook
            </a>
          )}
        </div>
      ) : (
        <div className="mt-1 text-xs text-slate-500">No specific brand socials available. Try searching on Instagram or YouTube above.</div>
      )}
    </section>
  );
}
