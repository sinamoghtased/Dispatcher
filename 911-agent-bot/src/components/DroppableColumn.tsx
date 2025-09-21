"use client";

import * as React from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { Box, Paper, Typography } from "@mui/material";
import type { Call } from "@/types/call";

/** Draggable card used inside a column */
function DraggableCall({ call }: { call: Call }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(call.callId), // becomes e.active.id
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.6 : 1,
    cursor: "grab",
  } as const;

  return (
    <Paper ref={setNodeRef} {...attributes} {...listeners}
      sx={{
        p: 1.25,
        bgcolor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        ...style,
      }}
      elevation={isDragging ? 6 : 2}
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

export default function DroppableColumn({
  id,
  title,
  items,
}: {
  id: string;           // e.g., "agent", "ai", "incoming-critical"
  title?: string;
  items: Call[];
}) {
  // registers this column as a droppable target; id becomes e.over.id
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Box ref={setNodeRef}>
      {!!title && (
        <Typography variant="body2" sx={{ mb: 1, color: "rgba(255,255,255,0.9)" }}>
          {title}
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          outline: isOver ? "2px dashed rgba(255,255,255,0.25)" : "none",
          outlineOffset: 4,
          borderRadius: 2,
          p: isOver ? 0.5 : 0,
        }}
      >
        {items.map((c) => (
          <DraggableCall key={c.callId} call={c} />
        ))}
      </Box>
    </Box>
  );
}
