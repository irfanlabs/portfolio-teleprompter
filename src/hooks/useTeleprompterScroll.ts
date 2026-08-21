import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

interface UseTeleprompterScrollArgs {
  containerRef: RefObject<HTMLDivElement | null>;
  textRef: RefObject<HTMLDivElement | null>;
  speed: number; // pixels per second
  script: string; // reset scroll position whenever the script text changes
  fontSize: number; // reset scroll position whenever the font size changes
}

interface UseTeleprompterScrollResult {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
}

export function useTeleprompterScroll({
  containerRef,
  textRef,
  speed,
  script,
  fontSize,
}: UseTeleprompterScrollArgs): UseTeleprompterScrollResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const positionRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const speedRef = useRef(speed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const applyTransform = useCallback(() => {
    if (textRef.current) {
      textRef.current.style.transform = `translateY(${positionRef.current}px)`;
    }
  }, [textRef]);

  const resetPosition = useCallback(() => {
    const containerHeight = containerRef.current?.clientHeight ?? 0;
    positionRef.current = containerHeight * 0.8;
    applyTransform();
  }, [containerRef, applyTransform]);

  const step = useCallback(
    (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      positionRef.current -= speedRef.current * dt;

      const textHeight = textRef.current?.scrollHeight ?? 0;
      const minPosition = -textHeight - 40;
      if (positionRef.current < minPosition) {
        positionRef.current = minPosition;
        applyTransform();
        setIsPlaying(false);
        return;
      }

      applyTransform();
      rafRef.current = requestAnimationFrame(step);
    },
    [applyTransform, textRef],
  );

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    lastTsRef.current = null;
    resetPosition();
  }, [resetPosition]);

  useEffect(() => {
    if (isPlaying) {
      lastTsRef.current = null;
      rafRef.current = requestAnimationFrame(step);
    } else if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, step]);

  // Reset scroll position when script text or font size changes
  useEffect(() => {
    resetPosition();
    setIsPlaying(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [script, fontSize]);

  useEffect(() => {
    const handleResize = () => resetPosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resetPosition]);

  return { isPlaying, play, pause, toggle, reset };
}
