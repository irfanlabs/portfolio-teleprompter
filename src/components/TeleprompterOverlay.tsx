import { type RefObject } from "react";

interface TeleprompterOverlayProps {
  containerRef: RefObject<HTMLDivElement | null>;
  textRef: RefObject<HTMLDivElement | null>;
  script: string;
  fontSize: number;
}

export function TeleprompterOverlay({ containerRef, textRef, script, fontSize }: TeleprompterOverlayProps) {
  return (
    <>
      {/* Reading guide line */}
      <div className="pointer-events-none absolute inset-x-[5%] top-[42%] z-[3] h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-x-[5%] top-[6%] bottom-[8%] z-[4] overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div
          ref={textRef}
          className="absolute inset-x-0 top-0 px-1 text-center font-medium whitespace-pre-wrap text-white"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: 1.4,
          }}
        >
          {script.trim() ? script : "Click “Script” below to paste your script. It will scroll here while you read."}
        </div>
      </div>
    </>
  );
}
