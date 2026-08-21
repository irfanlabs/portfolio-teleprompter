import type { DeviceOption, ActiveResolution } from "../hooks/useMediaStream";
import type { QualityPreset } from "../constants/quality";

interface SettingsModalProps {
  cameras: DeviceOption[];
  mics: DeviceOption[];
  selectedCameraId: string;
  selectedMicId: string;
  onSelectCamera: (id: string) => void;
  onSelectMic: (id: string) => void;
  qualities: QualityPreset[];
  selectedQualityId: string;
  onSelectQuality: (id: string) => void;
  activeResolution: ActiveResolution | null;
  onClose: () => void;
}

export function SettingsModal({
  cameras,
  mics,
  selectedCameraId,
  selectedMicId,
  onSelectCamera,
  onSelectMic,
  qualities,
  selectedQualityId,
  onSelectQuality,
  activeResolution,
  onClose,
}: SettingsModalProps) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="modal-card modal-in flex w-full max-w-sm flex-col gap-4 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white">Camera & Recording</h3>

        <label className="flex flex-col gap-1.5 text-[13px] text-white/60">
          <span>Camera</span>
          <select
            value={selectedCameraId}
            onChange={(e) => onSelectCamera(e.target.value)}
            className="rounded-lg border border-white/10 bg-[#0e0f12] px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500"
          >
            {cameras.length === 0 && <option value="">Default camera</option>}
            {cameras.map((cam) => (
              <option key={cam.deviceId} value={cam.deviceId}>
                {cam.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-[13px] text-white/60">
          <span>Microphone</span>
          <select
            value={selectedMicId}
            onChange={(e) => onSelectMic(e.target.value)}
            className="rounded-lg border border-white/10 bg-[#0e0f12] px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500"
          >
            {mics.length === 0 && <option value="">Default microphone</option>}
            {mics.map((mic) => (
              <option key={mic.deviceId} value={mic.deviceId}>
                {mic.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-[13px] text-white/60">
          <span>Video quality</span>
          <select
            value={selectedQualityId}
            onChange={(e) => onSelectQuality(e.target.value)}
            className="rounded-lg border border-white/10 bg-[#0e0f12] px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500"
          >
            {qualities.map((q) => (
              <option key={q.id} value={q.id}>
                {q.label} — {q.width}×{q.height}
              </option>
            ))}
          </select>
          {activeResolution && (
            <span className="text-[11px] text-white/40">
              Currently streaming at {activeResolution.width}×{activeResolution.height} ·{" "}
              {Math.round(activeResolution.frameRate)}fps
            </span>
          )}
        </label>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="brand-gradient rounded-full px-4.5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(76,125,255,0.35)] transition hover:brightness-110 active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
