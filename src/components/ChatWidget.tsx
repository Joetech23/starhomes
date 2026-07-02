"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi 👋 I’m Homey, your Star Homes assistant. Ask me about rentals, land, shortlets, prices, or booking an inspection.",
};

const SUGGESTIONS = [
  "2-bedroom flats in Awka",
  "Land for sale",
  "How do I book an inspection?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: question }];
    setMsgs([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m) => m.content).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMsgs((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMsgs((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Sorry, I couldn’t connect. Please message us on WhatsApp.",
        };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Chat with Star Homes"}
        className="fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-[0_12px_30px_-8px_rgba(91,154,36,0.7)] transition-transform hover:scale-105"
      >
        {open ? (
          <span className="text-[22px] leading-none">×</span>
        ) : (
          <span className="text-[24px] leading-none">💬</span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-[80] flex h-[540px] max-h-[calc(100vh-7rem)] w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_30px_70px_-20px_rgba(22,26,18,0.5)]">
          {/* Header */}
          <div className="flex items-center gap-3 bg-ink-900 px-4 py-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <Image src="/logo-mark.png" alt="" width={22} height={22} style={{ width: "auto", height: "20px" }} />
            </div>
            <div className="leading-tight">
              <div className="text-[14px] font-extrabold text-white">Star Homes Assistant</div>
              <div className="flex items-center gap-1.5 text-[11.5px] text-[#B7BCAD]">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Usually replies instantly
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-cream p-3.5">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-[14px] px-3.5 py-2.5 text-[13.5px] leading-[1.5] ${
                    m.role === "user"
                      ? "bg-brand text-white"
                      : "border border-line bg-white text-[#2b2f24]"
                  }`}
                >
                  {m.content || (
                    <span className="inline-flex gap-1">
                      <Dot /> <Dot /> <Dot />
                    </span>
                  )}
                </div>
              </div>
            ))}

            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-line bg-white px-3 py-1.5 text-[12px] font-semibold text-[#3A3F32] transition-colors hover:border-brand hover:text-brand"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-line bg-white p-2.5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a property…"
              className="flex-1 rounded-full border border-line-input bg-white px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-hover disabled:opacity-40"
              aria-label="Send"
            >
              ↑
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function Dot() {
  return <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-muted-light" />;
}
