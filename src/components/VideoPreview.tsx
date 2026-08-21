import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import type { ActiveResolution } from "../hooks/useMediaStream";

interface VideoPreviewProps {
  stream: MediaStream | null;
  mirrored: boolean;
  activeResolution: ActiveResolution | null;
  children?: ReactNode;
}

export function VideoPreview({ stream, mirrored, activeResolution, children }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Size the frame to the camera's real aspect ratio, centered in the available box.
  useLayoutEffect(() => {
    const box = boxRef.current;
    const frame = frameRef.current;
    if (!box || !frame) return;

    const compute = () => {
      const boxW = box.clientWidth;
      const boxH = box.clientHeight;
      const vidW = activeResolution?.width ?? 16;
      const vidH = activeResolution?.height ?? 9;
      const scale = Math.min(boxW / vidW, boxH / vidH);
      const w = Math.round(vidW * scale);
      const h = Math.round(vidH * scale);
      frame.style.left = `${Math.round((boxW - w) / 2)}px`;
      frame.style.top = `${Math.round((boxH - h) / 2)}px`;
      frame.style.width = `${w}px`;
      frame.style.height = `${h}px`;
    };

    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(box);
    return () => observer.disconnect();
  }, [activeResolution]);

  return (
    <div className="absolute inset-0 bg-white px-5 pt-16 pb-36 sm:px-10 sm:pt-18 sm:pb-40">
      <div ref={boxRef} className="relative h-full w-full">
        <div
          ref={frameRef}
          className="absolute overflow-hidden rounded-2xl shadow-[0_8px_28px_rgba(0,0,0,0.18)]"
          style={{ left: 0, top: 0, width: "100%", height: "100%" }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`h-full w-full bg-black/5 object-cover ${mirrored ? "-scale-x-100" : ""}`}
          />
          {children}
        </div>
      </div>
    </div>
  );
}
