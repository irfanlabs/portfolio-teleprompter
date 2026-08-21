import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_QUALITY_ID, QUALITY_PRESETS, type QualityPreset } from "../constants/quality";

export interface DeviceOption {
  deviceId: string;
  label: string;
}

export interface ActiveResolution {
  width: number;
  height: number;
  frameRate: number;
}

interface UseMediaStreamResult {
  stream: MediaStream | null;
  error: string | null;
  cameras: DeviceOption[];
  mics: DeviceOption[];
  selectedCameraId: string;
  selectedMicId: string;
  setSelectedCameraId: (id: string) => void;
  setSelectedMicId: (id: string) => void;
  availableQualities: QualityPreset[];
  activeResolution: ActiveResolution | null;
  retry: () => void;
}

export function useMediaStream(qualityId: string): UseMediaStreamResult {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<DeviceOption[]>([]);
  const [mics, setMics] = useState<DeviceOption[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [selectedMicId, setSelectedMicId] = useState<string>("");
  const [availableQualities, setAvailableQualities] = useState<QualityPreset[]>(QUALITY_PRESETS);
  const [activeResolution, setActiveResolution] = useState<ActiveResolution | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [attempt, setAttempt] = useState(0);

  const refreshDevices = useCallback(async () => {
    try {
      const list = await navigator.mediaDevices.enumerateDevices();
      const cams = list
        .filter((d) => d.kind === "videoinput")
        .map((d, i) => ({ deviceId: d.deviceId, label: d.label || `Camera ${i + 1}` }));
      const mics = list
        .filter((d) => d.kind === "audioinput")
        .map((d, i) => ({ deviceId: d.deviceId, label: d.label || `Microphone ${i + 1}` }));
      setCameras(cams);
      setMics(mics);
    } catch {
      // ignore enumeration failures; UI still functions with the active stream
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      setError(null);
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("This browser doesn't support camera access. Try the latest Chrome, Edge, or Safari.");
        return;
      }
      const preset = QUALITY_PRESETS.find((q) => q.id === qualityId) ?? QUALITY_PRESETS[2];
      try {
        const constraints: MediaStreamConstraints = {
          video: {
            ...(selectedCameraId ? { deviceId: { exact: selectedCameraId } } : { facingMode: "user" }),
            width: { ideal: preset.width },
            height: { ideal: preset.height },
            frameRate: { ideal: 30 },
          },
          audio: selectedMicId ? { deviceId: { exact: selectedMicId } } : true,
        };
        const media = await navigator.mediaDevices.getUserMedia(constraints);
        if (cancelled) {
          media.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = media;
        setStream(media);
        await refreshDevices();

        const videoTrack = media.getVideoTracks()[0];
        if (videoTrack) {
          const settings = videoTrack.getSettings();
          setActiveResolution({
            width: settings.width ?? preset.width,
            height: settings.height ?? preset.height,
            frameRate: settings.frameRate ?? 30,
          });

          const capabilities = videoTrack.getCapabilities?.();
          const maxWidth = capabilities?.width?.max;
          const maxHeight = capabilities?.height?.max;
          if (maxWidth && maxHeight) {
            const supported = QUALITY_PRESETS.filter((q) => q.width <= maxWidth && q.height <= maxHeight);
            setAvailableQualities(supported.length > 0 ? supported : [preset]);
          } else {
            setAvailableQualities(QUALITY_PRESETS);
          }
        }
      } catch (err) {
        if (cancelled) return;
        const name = err instanceof DOMException ? err.name : "";
        if (name === "NotAllowedError") {
          setError("Camera and microphone access was denied. Allow permissions in your browser settings and try again.");
        } else if (name === "NotFoundError") {
          setError("No camera or microphone was found on this device.");
        } else {
          setError("Couldn't access camera or microphone. Make sure no other app is using them.");
        }
      }
    }

    start();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCameraId, selectedMicId, qualityId, attempt]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    if (!navigator.mediaDevices) return;
    navigator.mediaDevices.addEventListener?.("devicechange", refreshDevices);
    return () => navigator.mediaDevices.removeEventListener?.("devicechange", refreshDevices);
  }, [refreshDevices]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return {
    stream,
    error,
    cameras,
    mics,
    selectedCameraId,
    selectedMicId,
    setSelectedCameraId,
    setSelectedMicId,
    availableQualities,
    activeResolution,
    retry,
  };
}

export { DEFAULT_QUALITY_ID };
