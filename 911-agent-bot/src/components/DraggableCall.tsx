"use client";
import * as React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Paper, Typography } from "@mui/material";
import type { Call } from "@/types/call";

export default function DraggableCall({ call }: { call: Call }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(call.callId), // this becomes e.active.id
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.6 : 1,
    cursor: "grab",
  } as const;

  return (
    <Paper ref={setNodeRef} {...listeners} {...attributes} sx={{
      p: 1.25,
      bgcolor: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      ...style,
    }}>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {call.score ?? 0} • {call.type ?? "-"} {call.intent ? `• ${call.intent}` : ""}
      </Typography>
      {call.lexText ? (
        <Typography variant="caption" sx={{ opacity: 0.85 }}>
          {call.lexText.slice(0, 120)}
        </Typography>
      ) : null}
    </Paper>
  );
}
