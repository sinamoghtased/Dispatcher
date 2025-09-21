"use client";
import * as React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Box, Typography } from "@mui/material";
import type { Call } from "@/types/call";
import CallCard from "./CallCard"; // use the draggable one

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
    <Box
      ref={setNodeRef}
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        border: isOver ? "2px dashed #6C63FF" : "2px dashed transparent",
        borderRadius: 2,
        p: 1,
        transition: "border 0.2s ease",
      }}
    >
      {title ? (
        <Typography
          variant="body2"
          sx={{ mb: 1, color: "rgba(255,255,255,0.9)" }}
        >
          {title}
        </Typography>
      ) : null}
      {items.map((c) => (
        <CallCard key={c.callId} call={c} />
      ))}
    </Box>
  );
}
