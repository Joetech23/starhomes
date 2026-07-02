"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { videoEmbed } from "@/lib/video";
import type { MediaItem } from "@/lib/properties";

export default function VideoLightbox({
  videos,
  title,
  href,
  startIndex = 0,
  onClose,
}: {
  videos: MediaItem[];
  title: string;
  href?: string;
  startIndex?: number;
  onClose: () => void;
}) {
  const [active, setActive] = useState(startIndex);
  const multi = videos.length > 1;
  const current = videos[active];
  const embed = videoEmbed(current.url);

  // Autoplay embeds that support it via query param
  const iframeSrc =
    embed.kind === "iframe" &&
    (embed.provider === "youtube" || embed.provider === "vimeo")
      ? `${embed.src}${embed.src.includes("?") ? "&" : "?"}autoplay=1`
      : embed.src;

  const go = (i: number) => setActive((i + videos.length) % videos.length);

  // Lock page scroll + ESC / arrow keys
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (multi && e.key === "ArrowRight") setActive((a) => (a + 1) % videos.length);
      if (multi && e.key === "ArrowLeft")
        setActive((a) => (a - 1 + videos.length) % videos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, multi, videos.length]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} video tour`}
    >
      {/* stage */}
      <div
        className="relative flex max-h-full flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative overflow-hidden rounded-[20px] bg-black shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]"
          style={{ aspectRatio: "9/16", height: "min(78vh, 720px)" }}
        >
          {embed.kind === "mp4" ? (
            <video
              key={current.id}
              src={embed.src}
              className="h-full w-full object-cover"
              controls
              autoPlay
              loop
              playsInline
            />
          ) : (
            <iframe
              key={current.id}
              src={iframeSrc}
              className="h-full w-full"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              title={current.caption ?? `${title} video`}
            />
          )}

          {multi && (
            <>
              <button
                type="button"
                onClick={() => go(active - 1)}
                aria-label="Previous video"
                className="absolute left-2.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-[20px] text-white backdrop-blur-sm transition-colors hover:bg-brand"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => go(active + 1)}
                aria-label="Next video"
                className="absolute right-2.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-[20px] text-white backdrop-blur-sm transition-colors hover:bg-brand"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* caption bar */}
        <div className="mt-3.5 flex w-full max-w-[420px] items-center justify-between gap-3 px-1">
          <div className="min-w-0">
            <div className="truncate text-[14.5px] font-bold text-white">
              {title}
            </div>
            <div className="text-[12px] font-semibold text-white/60">
              {current.caption || `Clip ${active + 1}`}
              {multi && ` · ${active + 1} / ${videos.length}`}
            </div>
          </div>
          {href && (
            <Link
              href={href}
              className="flex-none rounded-full bg-brand px-4 py-2 text-[12.5px] font-bold text-white transition-colors hover:bg-brand-hover"
            >
              Full details →
            </Link>
          )}
        </div>

        {/* clip dots */}
        {multi && (
          <div className="mt-2.5 flex gap-1.5">
            {videos.map((v, i) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Clip ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-6 bg-brand" : "w-3 bg-white/35 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[18px] text-white backdrop-blur-sm transition-colors hover:bg-white/25"
      >
        ✕
      </button>
    </div>,
    document.body
  );
}
