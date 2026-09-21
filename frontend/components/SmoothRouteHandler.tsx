'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function SmoothRouteHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const pathRef = useRef(pathname);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const prev = pathRef.current;
    const next = pathname + searchParams?.toString();
    if (prev !== next && prev) {
      // Start progress
      setVisible(true);
      setProgress(0);
      if (progressTimer.current) clearInterval(progressTimer.current);
      let p = 0;
      progressTimer.current = setInterval(() => {
        p = Math.min(p + Math.random() * 18 + 6, 88);
        setProgress(p);
      }, 120);

      // Scroll to top smoothly
      if (typeof window !== 'undefined') {
        try {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch {
          window.scrollTo(0, 0);
        }
      }
    }
    pathRef.current = next;

    return () => {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
        progressTimer.current = null;
      }
    };
  }, [pathname, searchParams]);

  // Complete progress shortly after path change happens (after fetch completes)
  useEffect(() => {
    if (!visible) return;
    if (finishTimer.current) clearTimeout(finishTimer.current);
    finishTimer.current = setTimeout(() => {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
        progressTimer.current = null;
      }
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 220);
    }, 280);
    return () => {
      if (finishTimer.current) clearTimeout(finishTimer.current);
    };
  }, [pathname, searchParams, visible]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-0.5 pointer-events-none"
    >
      <div
        className="h-full bg-blue transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%`, opacity: visible ? 1 : 0 }}
      />
    </div>
  );
}
