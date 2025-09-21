"use client";
import * as React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Box, Paper, Typography } from "@mui/material";
import type { Call } from "@/types/call";

export default function DroppableColumn({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: Call[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Box ref={setNodeRef}>
      {title ? (
        <Typography variant="body2" sx={{ mb: 1, color: "rgba(255,255,255,0.9)" }}>
          {title}
        </Typography>
      ) : null}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {items.map((c) => (
          <CallCard key={c.callId} call={c} highlight={isOver} />
        ))}
      </Box>
    </Box>
  );
}

function CallCard({ call, highlight }: { call: Call; highlight: boolean }) {
  return (
    <Paper
      component="div"
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", call.callId)}
      elevation={highlight ? 6 : 2}
      sx={{
        p: 1.25,
        bgcolor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        cursor: "grab",
      }}
    >
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
