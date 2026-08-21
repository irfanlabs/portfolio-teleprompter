import { useState } from "react";

interface ScriptEditorModalProps {
  initialScript: string;
  onSave: (script: string) => void;
  onClose: () => void;
}

export function ScriptEditorModal({ initialScript, onSave, onClose }: ScriptEditorModalProps) {
  const [draft, setDraft] = useState(initialScript);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="modal-card modal-in flex max-h-[82vh] w-full max-w-2xl flex-col gap-4 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white">Your Script</h3>
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Paste or type your script here…"
          className="tp-scroll min-h-[260px] flex-1 resize-y rounded-xl border border-white/10 bg-[#0e0f12] p-3.5 text-[15px] leading-relaxed text-white/90 outline-none focus:border-brand-500"
        />
        <div className="flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 px-4.5 py-2.5 text-sm font-medium text-white/60 transition hover:border-white/25 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(draft)}
            className="brand-gradient rounded-full px-4.5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(76,125,255,0.35)] transition hover:brightness-110 active:scale-95"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
