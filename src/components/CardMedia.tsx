"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { videoEmbed } from "@/lib/video";
import type { MediaItem } from "@/lib/properties";
import VideoLightbox from "./VideoLightbox";

/**
 * Card media area: cover photo that comes alive when the listing has videos.
 * - Desktop: hovering the card silently plays the first clip inline (mp4 only).
 * - Mobile (no hover): the clip auto-plays muted once ~60% of the card is visible.
 * - The play button opens a 9:16 popup player without navigating away.
 */
export default function CardMedia({
  cover,
  title,
  href,
  videos,
  heightClass,
}: {
  cover: string;
  title: string;
  href: string;
  videos: MediaItem[];
  heightClass: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const hasVideo = videos.length > 0;
  const first = hasVideo ? videoEmbed(videos[0].url) : null;
  const canInline = first?.kind === "mp4"; // iframes can't hover-preview

  // Touch devices: play preview when the card is mostly on screen
  useEffect(() => {
    if (!canInline || !wrapRef.current) return;
    if (window.matchMedia("(hover: hover)").matches) return; // desktop uses hover
    const el = wrapRef.current;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [canInline]);

  const playing = canInline && (hovered || inView);

  return (
    <div
      ref={wrapRef}
      className={`relative w-full overflow-hidden ${heightClass}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={cover}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 360px"
        className={`object-cover transition-transform duration-500 ${
          playing ? "scale-105 opacity-0" : "group-hover:scale-[1.04]"
        }`}
      />

      {playing && first && (
        <video
          src={first.src}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
        />
      )}

      {hasVideo && (
        <>
          {/* play button → popup */}
          <button
            type="button"
            aria-label={`Watch ${title} video tour`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
            }}
            className="absolute bottom-3 right-3 z-10 flex items-center gap-2 rounded-full bg-black/55 py-2 pl-2.5 pr-3.5 text-[11.5px] font-bold text-white backdrop-blur-md transition-all hover:bg-brand"
          >
            <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/25" />
              <span className="relative pl-[1px] text-[10px]">▶</span>
            </span>
            {videos.length > 1 ? `${videos.length} clips` : "Watch tour"}
          </button>

          {/* subtle live indicator while previewing */}
          {playing && (
            <span className="absolute left-3 bottom-3.5 z-10 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.08em] text-white backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              Preview
            </span>
          )}
        </>
      )}

      {open && (
        <VideoLightbox
          videos={videos}
          title={title}
          href={href}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
