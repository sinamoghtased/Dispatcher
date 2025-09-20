"use client";
import * as React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { Call } from "@/types/call";

interface Props {
  call: Call;
}

export default function CallCard({ call }: Props): React.JSX.Element {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: call.callId,
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const p = Number(call.priority ?? "5");
  const bg =
    p >= 9 ? "#ffebee" : p >= 7 ? "#fff3e0" : p >= 4 ? "#e3f2fd" : "#e8f5e9";

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{ mb: 1, bgcolor: bg, cursor: "grab" }}
      style={style}
    >
      <CardContent sx={{ py: 1.5 }}>
        <Typography variant="subtitle2">{call.callId}</Typography>
        <Typography variant="body2">
          Priority: {call.priority} • Type: {call.type ?? "-"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Stage: {call.stage ?? "start"}
        </Typography>
      </CardContent>
    </Card>
  );
}
