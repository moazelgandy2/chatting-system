"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import StarFieldCanvas from "./star-field-canvas";
import NebulaGlow from "./nebula-glow";
import OrbitalSystem from "./orbital-system";
import ConstellationLines from "./constellation-lines";
import PulsingDots from "./pulsing-dots";
import ChatEmptyText from "./chat-empty-text";

export default function ChatEmptyState() {
  const t = useTranslations("chat.messageArea");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <div
      className="relative w-full h-[72dvh] overflow-hidden flex items-center justify-center shadow-2xl backdrop-blur-md bg-white/10"
      style={{
        background: "rgba(30, 34, 60, 0.18)",
        boxShadow: "0 4px 32px 0 rgba(80,120,255,0.10)",
      }}
    >
      <StarFieldCanvas />
      <NebulaGlow />
      <div className="relative z-10 flex flex-col items-center justify-center">
        <OrbitalSystem />
        <ChatEmptyText />
        <ConstellationLines />
        <PulsingDots />
      </div>
    </div>
  );
}
