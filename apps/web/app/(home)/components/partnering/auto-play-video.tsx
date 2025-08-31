"use client";

import { useEffect, useRef } from "react";

type props = {
  src: string;
  width?: number;
  height?: number;
  className?: string;
};

export function AutoPlayVideo({ src, width, height, className }: props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const reduce = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      )?.matches;
      if (!reduce) ref.current?.play().catch(() => {});
    }
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      width={width}
      height={height}
      className={className}
      aria-hidden="true" // Since it's decorative content
    />
  );
}
