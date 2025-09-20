import { Call } from "@/types/call";

const API = process.env.NEXT_PUBLIC_API_BASE!;

export async function getCalls(query: string): Promise<Call[]> {
  const r = await fetch(`${API}/calls${query ? `?${query}` : ""}`);
  if (!r.ok) throw new Error("Failed to fetch calls");
  return r.json();
}

export async function routeCall(
  callId: string,
  handledBy: "dispatcher" | "bot"
): Promise<{ ok: boolean; callId: string; handledBy: "dispatcher" | "bot" }> {
  const r = await fetch(`${API}/calls/${encodeURIComponent(callId)}/route`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ handledBy }),
  });
  if (!r.ok) throw new Error("Failed to route call");
  return r.json();
}

export async function resolveCall(
  callId: string
): Promise<{ ok: boolean; callId: string }> {
  const r = await fetch(`${API}/calls/${encodeURIComponent(callId)}/resolve`, {
    method: "POST",
  });
  if (!r.ok) throw new Error("Failed to resolve call");
  return r.json();
}
