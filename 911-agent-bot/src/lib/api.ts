import type { Call } from "@/types/call";

const API = process.env.NEXT_PUBLIC_API_BASE!;

export async function getCalls(): Promise<Call[]> {
  const r = await fetch(`${API}/calls`, { cache: "no-store" });
  if (!r.ok) throw new Error(`GET /calls failed: ${r.status}`);
  const data = (await r.json()) as { items?: Call[] };
  return (data.items ?? []).map((x) => ({
    ...x,
    score: typeof (x as any).score === "string" ? Number((x as any).score) : (x as any).score,
    startTs:
      typeof (x as any).startTs === "string" ? Number((x as any).startTs) : (x as any).startTs,
  }));
}

/** UI sends 'dispatcher' or 'bot'; API expects 'agent' or 'ai' */
export async function routeCall(callId: string, uiTarget: "dispatcher" | "bot") {
  const target = uiTarget === "dispatcher" ? "agent" : "ai";
  const r = await fetch(`${API}/calls/${encodeURIComponent(callId)}/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target }),
  });
  if (!r.ok) throw new Error(`POST /calls/${callId}/assign failed: ${r.status}`);
  return r.json();
}
