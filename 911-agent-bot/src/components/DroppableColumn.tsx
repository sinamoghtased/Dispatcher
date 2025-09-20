"use client";
import * as React from "react";
import { Box, Typography } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import { Call } from "@/types/call";

interface Props {
  id: string;
  title: string;
  items: ReadonlyArray<Call>;
}

export default function DroppableColumn({
  id,
  title,
  items,
}: Props): React.JSX.Element {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        p: 1,
        border: "1px dashed rgba(255,255,255,0.12)",
        borderRadius: 2,
        transition:
          "transform 120ms ease, border-color 120ms ease, box-shadow 120ms ease",
        transform: isOver ? "scale(1.01)" : "none",
        borderColor: isOver
          ? "rgba(255,255,255,0.35)"
          : "rgba(255,255,255,0.12)",
      }}
    >
      {title ? (
        <Typography
          variant="body2"
          color="rgba(255,255,255,0.85)"
          sx={{ mb: 1 }}
        >
          {title}
        </Typography>
      ) : null}
      {items.map((c) => (
        <Box
          key={c.callId}
          sx={{
            mb: 1,
            p: 1,
            borderRadius: 2,
            bgcolor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Typography variant="subtitle2" color="#fff">
            {c.callId}
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.9)">
            Priority: {c.priority} • Type: {c.type ?? "-"}
          </Typography>
          <Typography variant="caption" color="rgba(255,255,255,0.7)">
            Stage: {c.stage ?? "start"}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
