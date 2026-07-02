import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { PHONE_DISPLAY, EMAIL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMsg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      `Our AI assistant isn’t switched on yet — but our team is ready to help on WhatsApp at ${PHONE_DISPLAY}.`,
      { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  let messages: ChatMsg[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  messages = messages
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12);
  if (messages.length === 0) return new Response("No messages", { status: 400 });

  // Ground the assistant in the current published listings
  let listingLines = "";
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("listings")
      .select("listing_no,type,title,location,price,unit")
      .eq("status", "published")
      .order("created_at", { ascending: true });
    listingLines = (data ?? [])
      .map((l) => {
        const price = Number(l.price) > 0 ? `₦${Number(l.price).toLocaleString("en-NG")}${l.unit || ""}` : "Price on request";
        return `- ${l.title} · ${l.type} · ${l.location} · ${price} · Ref SH-${String(l.listing_no).padStart(3, "0")}`;
      })
      .join("\n");
  } catch {
    listingLines = "";
  }

  const system = `You are "Homey", the friendly virtual assistant for Star Homes & Properties, a real-estate company based in Awka, Anambra State, Nigeria.

About us:
- We help people rent, buy and invest in homes, land, serviced/shortlet apartments and commercial space across Anambra and Nigeria at large.
- We also offer interior design (Star Homes Interiors) — page: /interior-design.
- Contact: WhatsApp or call ${PHONE_DISPLAY}; email ${EMAIL}.
- To book a viewing, send people to the "Book Inspection" page (/book-inspection) or WhatsApp.

How to behave:
- Be warm, concise and helpful. Keep answers to 2–5 short sentences. Use Naira (₦) for prices.
- Only discuss Star Homes, our properties/services, and general Nigerian property guidance. Politely decline unrelated requests and steer back to how we can help.
- Recommend from the current listings below when relevant, and mention the Ref. If we don't have an exact match, suggest the closest option and invite them to WhatsApp or the Book Inspection page. Never invent listings that aren't listed.
- Do not give legal or financial guarantees; encourage inspection and verification, which we help with.
- Reply as plain text (no markdown headings). Finish with a helpful next step when it fits.

Current published listings:
${listingLines || "(No listings available right now — invite the user to WhatsApp.)"}`;

  const anthropic = new Anthropic({ apiKey });
  const encoder = new TextEncoder();

  const rs = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = anthropic.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 1024,
          system,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        });
        stream.on("text", (t) => controller.enqueue(encoder.encode(t)));
        await stream.finalMessage();
      } catch {
        controller.enqueue(
          encoder.encode(
            `\n\nSorry — I hit a snag. Please reach our team on WhatsApp at ${PHONE_DISPLAY}.`
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(rs, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
