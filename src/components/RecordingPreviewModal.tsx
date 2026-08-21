import { Download, RotateCcw, X } from "lucide-react";

interface RecordingPreviewModalProps {
  url: string;
  filename: string;
  onRerecord: () => void;
  onClose: () => void;
}

export function RecordingPreviewModal({ url, filename, onRerecord, onClose }: RecordingPreviewModalProps) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="modal-card modal-in flex max-h-[90vh] w-full max-w-md flex-col gap-4 rounded-2xl p-5">
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
          className="max-h-[60vh] w-full rounded-xl border border-white/10 bg-black"
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
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
