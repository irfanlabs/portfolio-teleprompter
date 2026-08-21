import { VideoOff } from "lucide-react";

interface PermissionOverlayProps {
  message: string;
  onRetry: () => void;
}

export function PermissionOverlay({ message, onRetry }: PermissionOverlayProps) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="modal-card modal-in mx-4 flex max-w-sm flex-col items-center gap-4 rounded-2xl p-7 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15">
          <VideoOff className="h-6 w-6 text-red-400" strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">Camera & microphone needed</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/60">{message}</p>
        </div>
        <button
          onClick={onRetry}
          className="brand-gradient w-full rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(76,125,255,0.35)] transition hover:brightness-110 active:scale-95"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
