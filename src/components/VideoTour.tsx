"use client";

import { useState } from "react";
import { videoEmbed } from "@/lib/video";
import type { MediaItem } from "@/lib/properties";

export default function VideoTour({ videos }: { videos: MediaItem[] }) {
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);

  if (!videos.length) return null;

  const multi = videos.length > 1;
  const current = videos[active];
  const embed = videoEmbed(current.url);

  const go = (i: number) => {
    setActive((i + videos.length) % videos.length);
  };

  return (
    <section className="mb-10 rounded-[20px] border border-line bg-cream p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-[13px] text-white">
          ▶
        </span>
        <h3 className="m-0 font-display text-[20px] font-extrabold text-[#13160F]">
          Video tour
        </h3>
        {multi && (
          <span className="rounded-full bg-white px-2.5 py-1 text-[11.5px] font-bold text-muted">
            {active + 1} / {videos.length}
          </span>
        )}
      </div>

      <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-start">
        {/* Player — 9:16 */}
        <div className="relative w-full max-w-[300px] flex-none">
          <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[18px] bg-black shadow-[0_24px_50px_-24px_rgba(22,26,18,0.5)]">
            {embed.kind === "mp4" ? (
              <video
                key={current.id}
                src={embed.src}
                className="absolute inset-0 h-full w-full object-cover"
                controls
                autoPlay
                loop
                muted={muted}
                playsInline
              />
            ) : (
              <iframe
                key={current.id}
                src={embed.src}
                className="absolute inset-0 h-full w-full"
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                allowFullScreen
                title={current.caption ?? "Property video"}
              />
            )}

            {/* prev / next */}
            {multi && (
              <>
                <button
                  type="button"
                  onClick={() => go(active - 1)}
                  aria-label="Previous video"
                  className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => go(active + 1)}
                  aria-label="Next video"
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  ›
                </button>
              </>
            )}

            {embed.kind === "mp4" && (
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm"
              >
                {muted ? "🔇 Tap for sound" : "🔊 Sound on"}
              </button>
            )}
          </div>
          {current.caption && (
            <p className="mt-2 text-center text-[12.5px] font-medium text-muted">
              {current.caption}
            </p>
          )}
        </div>

        {/* Thumbnail rail */}
        {multi && (
          <div className="flex w-full flex-row flex-wrap gap-2.5 lg:flex-col">
            {videos.map((v, i) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setActive(i)}
                className={`flex items-center gap-2.5 rounded-[12px] border p-2 pr-3.5 text-left transition-colors ${
                  i === active
                    ? "border-brand bg-white"
                    : "border-line bg-white hover:border-brand"
                }`}
              >
                <span
                  className={`flex h-9 w-9 flex-none items-center justify-center rounded-[9px] text-[13px] font-extrabold ${
                    i === active
                      ? "bg-brand text-white"
                      : "bg-leaf-bg text-brand"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-[13px] font-bold text-ink">
                  {v.caption || `Clip ${i + 1}`}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
