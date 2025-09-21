"use client";
import Image from "next/image";
import { Box } from "@mui/material";

type Props = { width?: number; height?: number; radius?: number };

export default function Logo({ width = 520, height = 290, radius = 28 }: Props) {
  return (
    <Box sx={{ display: "inline-block", borderRadius: `${radius}px`, overflow: "hidden" }}>
      <Image
        src="/logo.png"
        alt="911 Dispatcher logo"
        width={width}
        height={height}
        priority
        style={{ width: `${width}px`, height: `${height}px`, objectFit: "contain" }}
      />
    </Box>
  );
}
