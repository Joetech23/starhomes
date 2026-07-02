// Normalizes a pasted video link (Cloudinary, Google Drive, YouTube, Vimeo,
// or a direct file) into something we can render in a 9:16 frame.

export type VideoEmbed = {
  kind: "mp4" | "iframe";
  src: string;
  provider: "file" | "drive" | "youtube" | "vimeo" | "cloudinary" | "other";
};

export function videoEmbed(raw: string): VideoEmbed {
  const url = (raw || "").trim();

  // Google Drive: .../file/d/<id>/view  or  ...?id=<id>
  if (url.includes("drive.google.com")) {
    const m = url.match(/\/file\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
    if (m) {
      return {
        kind: "iframe",
        src: `https://drive.google.com/file/d/${m[1]}/preview`,
        provider: "drive",
      };
    }
  }

  // YouTube (incl. Shorts)
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/
  );
  if (yt) {
    return {
      kind: "iframe",
      src: `https://www.youtube.com/embed/${yt[1]}`,
      provider: "youtube",
    };
  }

  // Vimeo
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) {
    return {
      kind: "iframe",
      src: `https://player.vimeo.com/video/${vm[1]}`,
      provider: "vimeo",
    };
  }

  // Cloudinary player embed
  if (url.includes("player.cloudinary.com")) {
    return { kind: "iframe", src: url, provider: "cloudinary" };
  }

  // Direct video file (Cloudinary raw delivery or any .mp4/.webm/…)
  if (/\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url) || url.includes("/video/upload/")) {
    return {
      kind: "mp4",
      src: url,
      provider: url.includes("cloudinary") ? "cloudinary" : "file",
    };
  }

  // Fallback: try to embed as-is
  return { kind: "iframe", src: url, provider: "other" };
}
