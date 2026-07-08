"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "starhomes_install_dismissed_v1";

export default function PWARegister() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Register the service worker.
    if ("serviceWorker" in navigator) {
      const onLoad = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
      if (document.readyState === "complete") onLoad();
      else window.addEventListener("load", onLoad, { once: true });
    }

    // Capture install prompt.
    const onPrompt = (e: Event) => {
      e.preventDefault();
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!show || !deferred) return null;

  const install = async () => {
    await deferred.prompt();
    await deferred.userChoice.catch(() => {});
    localStorage.setItem(DISMISS_KEY, "1");
    setShow(false);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setShow(false);
  };

  return (
    <div className="fixed bottom-24 left-5 z-[70] flex max-w-[300px] items-center gap-3 rounded-[16px] border border-line bg-white p-3 shadow-[0_20px_50px_-20px_rgba(22,26,18,0.5)]">
      <div className="flex-1">
        <div className="text-[13.5px] font-extrabold text-ink">Install Star Homes</div>
        <div className="text-[12px] text-muted">Add the app to your home screen.</div>
      </div>
      <button
        type="button"
        onClick={install}
        className="flex-none rounded-full bg-brand px-3.5 py-2 text-[12.5px] font-bold text-white hover:bg-brand-hover"
      >
        Install
      </button>
      <button type="button" onClick={dismiss} aria-label="Dismiss" className="flex-none text-[16px] text-muted-light">
        ×
      </button>
    </div>
  );
}
