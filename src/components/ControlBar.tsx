import { FileText, FlipHorizontal, Pause, Play, RotateCcw, Settings, Video } from "lucide-react";

interface ControlBarProps {
  speed: number;
  onSpeedChange: (value: number) => void;
  fontSize: number;
  onFontSizeChange: (value: number) => void;
  mirrored: boolean;
  onToggleMirror: () => void;
  onOpenScript: () => void;
  onOpenSettings: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  isRecording: boolean;
  canRecord: boolean;
  onToggleRecord: () => void;
  onOpenPreview?: () => void;
}

export function ControlBar({
  speed,
  onSpeedChange,
  fontSize,
  onFontSizeChange,
  mirrored,
  onToggleMirror,
  onOpenScript,
  onOpenSettings,
  isPlaying,
  onTogglePlay,
  onReset,
  isRecording,
  canRecord,
  onToggleRecord,
  onOpenPreview,
}: ControlBarProps) {
  return (
    <footer className="glass-panel absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2.5 px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      {/* Sliders */}
      <div className="flex items-center gap-6 sm:gap-7">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <label
            htmlFor="speed"
            className="w-9 shrink-0 text-[11px] font-medium tracking-wide text-white/45 uppercase sm:w-11"
          >
            Speed
          </label>
          <input
            id="speed"
            type="range"
            className="tp-slider min-w-0 flex-1"
            min={10}
            max={160}
            step={1}
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
          />
          <span className="w-9 shrink-0 rounded-md bg-white/6 py-0.5 text-center font-mono text-[11px] text-white/60">
            {speed}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <label
            htmlFor="size"
            className="w-9 shrink-0 text-[11px] font-medium tracking-wide text-white/45 uppercase sm:w-11"
          >
            Size
          </label>
          <input
            id="size"
            type="range"
            className="tp-slider min-w-0 flex-1"
            min={20}
            max={96}
            step={1}
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
          />
          <span className="w-9 shrink-0 rounded-md bg-white/6 py-0.5 text-center font-mono text-[11px] text-white/60">
            {fontSize}
          </span>
        </div>
      </div>

      {/* Main row */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex items-center justify-self-start gap-1">
          <button
            onClick={onOpenScript}
            className="flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1.5 text-white/60 transition hover:bg-white/8 hover:text-white"
            title="Edit script"
          >
            <FileText className="h-5 w-5" strokeWidth={1.8} />
            <span className="hidden text-[10px] font-medium sm:block">Script</span>
          </button>

          <button
            onClick={onToggleMirror}
            className={`flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1.5 transition hover:bg-white/8 ${
              mirrored ? "bg-brand-500/15 text-brand-400" : "text-white/60 hover:text-white"
            }`}
            title="Mirror camera preview"
          >
            <FlipHorizontal className="h-5 w-5" strokeWidth={1.8} />
            <span className="hidden text-[10px] font-medium sm:block">Mirror</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1.5 text-white/60 transition hover:bg-white/8 hover:text-white"
            title="Camera / microphone settings"
          >
            <Settings className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>

        <div className="flex items-center justify-self-center gap-4 sm:gap-5">
          <button
            onClick={onReset}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:bg-white/14 active:scale-95"
            title="Reset scroll"
          >
            <RotateCcw className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <div className="relative">
            {isRecording && (
              <span className="rec-pulse-ring pointer-events-none absolute inset-0 rounded-full border-2 border-red-500" />
            )}
            <button
              onClick={onToggleRecord}
              disabled={!canRecord}
              title={isRecording ? "Stop recording" : "Start recording"}
              className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[3px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.45)] transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
                isRecording ? "border-red-500 shadow-[0_0_28px_rgba(255,59,48,0.45)]" : "border-white/35"
              }`}
            >
              <span
                className={`bg-gradient-to-br from-red-500 to-red-600 transition-all ${
                  isRecording ? "h-[22px] w-[22px] rounded-md" : "h-[26px] w-[26px] rounded-full"
                }`}
              />
            </button>
          </div>

          <button
            onClick={onTogglePlay}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:bg-white/14 active:scale-95"
            title="Play / pause scroll"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" strokeWidth={1.8} fill="currentColor" />
            ) : (
              <Play className="ml-0.5 h-5 w-5" strokeWidth={1.8} fill="currentColor" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-self-end">
          {onOpenPreview && (
            <button
              onClick={onOpenPreview}
              className="flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1.5 text-emerald-400 transition hover:bg-emerald-400/10"
              title="View last recording"
            >
              <Video className="h-5 w-5" strokeWidth={1.8} />
              <span className="hidden text-[10px] font-medium sm:block">Preview</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
