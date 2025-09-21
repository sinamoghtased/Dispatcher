import type { Call } from "@/types/call";

const API = process.env.NEXT_PUBLIC_API_BASE!;

// Define what the API might return before transformation
interface RawCall extends Omit<Call, "score" | "startTs"> {
  score?: number | string;
  startTs?: number | string;
}

export async function getCalls(): Promise<Call[]> {
  const r = await fetch(`${API}/calls`, { cache: "no-store" });
  if (!r.ok) throw new Error(`GET /calls failed: ${r.status}`);

  const data = (await r.json()) as { items?: RawCall[] };

  return (data.items ?? []).map((x) => ({
    ...x,
    score: typeof x.score === "string" ? Number(x.score) : x.score ?? 0,
    startTs: typeof x.startTs === "string" ? Number(x.startTs) : x.startTs ?? 0,
  }));
}

/** UI sends 'dispatcher' or 'bot'; API expects 'agent' or 'ai' */
export async function routeCall(
  callId: string,
  uiTarget: "dispatcher" | "bot"
) {
  const target = uiTarget === "dispatcher" ? "agent" : "ai";
  const r = await fetch(`${API}/calls/${encodeURIComponent(callId)}/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target }),
  });
  if (!r.ok)
    throw new Error(`POST /calls/${callId}/assign failed: ${r.status}`);
  return r.json();
}
