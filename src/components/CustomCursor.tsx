"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches
  );

  useEffect(() => {
    if (!enabled) return;

    const ring = { x: 0, y: 0 };
    let mouseX = 0;
    let mouseY = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button']");
      ringRef.current?.classList.toggle("scale-[2.2]", Boolean(interactive));
      ringRef.current?.classList.toggle("opacity-40", Boolean(interactive));
    };

    const animate = () => {
      ring.x += (mouseX - ring.x) * 0.18;
      ring.y += (mouseY - ring.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`;
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/40 transition-transform duration-200 ease-out"
      />
    </>
  );
}
