import { Check, Download, Loader2, RotateCcw, X } from "lucide-react";
import { useVideoConverter } from "../hooks/useVideoConverter";
import { TARGET_FORMATS, type TargetFormatId } from "../lib/videoConverter";

interface RecordingPreviewModalProps {
  url: string;
  filename: string;
  mimeType: string;
  onRerecord: () => void;
  onClose: () => void;
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}

export function RecordingPreviewModal({ url, filename, mimeType, onRerecord, onClose }: RecordingPreviewModalProps) {
  const { converting, progress, error, results, convert } = useVideoConverter(url, mimeType);

  const baseName = filename.replace(/\.[^.]+$/, "");
  const nativeExt = filename.split(".").pop() ?? "webm";
  const convertibleFormats = TARGET_FORMATS.filter((f) => f.extension !== nativeExt);

  const handleFormatClick = async (target: TargetFormatId) => {
    const format = TARGET_FORMATS.find((f) => f.id === target)!;
    const cached = results[target];
    if (cached) {
      triggerDownload(cached.url, `${baseName}.${format.extension}`);
      return;
    }
    const result = await convert(target);
    if (result) triggerDownload(result.url, `${baseName}.${format.extension}`);
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="modal-card modal-in flex max-h-[90vh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Recording ready</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
            title="Close preview"
          >
            <X className="h-4.5 w-4.5" strokeWidth={2} />
          </button>
        </div>

        <video
          src={url}
          controls
          autoPlay
          playsInline
          className="max-h-[50vh] w-full rounded-xl border border-white/10 bg-black"
        />

        <div className="flex gap-2.5">
          <button
            onClick={onRerecord}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm font-medium text-white/80 transition hover:border-white/25 hover:text-white active:scale-95"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2} />
            Re-record
          </button>
          <a
            href={url}
            download={filename}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 active:scale-95"
          >
            <Download className="h-4 w-4" strokeWidth={2} />
            Download {nativeExt.toUpperCase()}
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[13px] text-white/60">Other formats</span>
          <div className="flex gap-2">
            {convertibleFormats.map((format) => {
              const isConverting = converting === format.id;
              const isDone = !!results[format.id];
              return (
                <button
                  key={format.id}
                  onClick={() => handleFormatClick(format.id)}
                  disabled={converting !== null}
                  title={format.description}
                  className="flex flex-1 flex-col items-center gap-0.5 rounded-xl border border-white/10 px-3 py-2.5 transition hover:border-white/25 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
                >
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                    {isConverting ? (
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                    ) : isDone ? (
                      <Check className="h-4 w-4 text-emerald-400" strokeWidth={2} />
                    ) : (
                      <Download className="h-4 w-4 text-white/60" strokeWidth={2} />
                    )}
                    {format.label}
                  </span>
                  <span className="text-[11px] text-white/40">
                    {isConverting
                      ? progress > 0
                        ? `Converting… ${Math.round(progress * 100)}%`
                        : "Converting…"
                      : format.description}
                  </span>
                </button>
              );
            })}
          </div>
          {error && <span className="text-[12px] text-red-400">{error}</span>}
          <span className="text-[11px] text-white/35">
            Conversion runs entirely on your device — nothing is uploaded. The first conversion loads a ~31&nbsp;MB
            converter, and re-encoding long or high-resolution clips can take a while.
          </span>
        </div>
      </div>
    </div>
  );
}
