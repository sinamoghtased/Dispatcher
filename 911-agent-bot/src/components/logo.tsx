"use client";
import Image from "next/image";
import { Box } from "@mui/material";

interface LogoProps {
  width?: number;
  height?: number;
  radius?: number; // px
}

export default function Logo({
  width = 200,
  height = 110,
  radius = 20,
}: LogoProps) {
  return (
    <Box
      sx={{
        position: "relative",
        width,
        height,
        borderRadius: `${radius}px`,
        overflow: "hidden",
      }}
    >
      <Image
        src="/logo.png"
        alt="911 Dispatcher logo"
        fill
        priority
        sizes={`${width}px`}
        style={{ objectFit: "contain", backgroundColor: "transparent" }}
      />
    </Box>
  );
}
