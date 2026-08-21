interface TopBarProps {
  isRecording: boolean;
  elapsedMs: number;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function BrandMark() {
  return (
    <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
      <defs>
        <linearGradient id="tp-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4C7DFF" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="14" fill="url(#tp-mark)" />
      <rect x="16" y="19" width="32" height="5" rx="2.5" fill="#fff" opacity="0.95" />
      <rect x="16" y="30" width="24" height="5" rx="2.5" fill="#fff" opacity="0.7" />
      <rect x="16" y="41" width="16" height="5" rx="2.5" fill="#fff" opacity="0.45" />
      <circle cx="46" cy="43" r="7" fill="#fff" />
      <circle cx="46" cy="43" r="3.4" fill="#FF3B30" />
    </svg>
  );
}

export function TopBar({ isRecording, elapsedMs }: TopBarProps) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
      <div className="glass-pill flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-2">
        <BrandMark />
        <span className="text-[13.5px] font-bold tracking-wide text-white">
          Prompter<span className="ml-1 font-light text-white/60">Studio</span>
        </span>
      </div>

      {isRecording && (
        <div className="flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/15 px-3.5 py-2 shadow-[0_0_24px_rgba(255,59,48,0.25)] backdrop-blur-xl">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="text-[12px] font-bold tracking-wider text-red-400">REC</span>
          <span className="font-mono text-[12px] font-medium tabular-nums text-white">
            {formatTime(elapsedMs)}
          </span>
        </div>
      )}
    </header>
  );
}
