export type Call = {
  stage: string;
  id?: string; // convenience for DnD
  callId: string;
  route?: "hold" | "agent" | "ai";
  score?: number;
  priority?: number | string;
  startTs?: number;
  intent?: string;
  lexText?: string;
  type?: string;
};
