export interface QualityPreset {
  id: string;
  label: string;
  width: number;
  height: number;
}

export const QUALITY_PRESETS: QualityPreset[] = [
  { id: "2160p", label: "4K (2160p)", width: 3840, height: 2160 },
  { id: "1440p", label: "QHD (1440p)", width: 2560, height: 1440 },
  { id: "1080p", label: "Full HD (1080p)", width: 1920, height: 1080 },
  { id: "720p", label: "HD (720p)", width: 1280, height: 720 },
  { id: "480p", label: "SD (480p)", width: 854, height: 480 },
];

export const DEFAULT_QUALITY_ID = "1080p";

/** Estimate a healthy video bitrate for the resolution/frame rate actually
 * negotiated with the camera. Unset bitrates lead browsers to pick
 * conservative defaults that look blocky, especially at 1080p+. */
export function estimateBitrate(width: number, height: number, frameRate: number): number {
  const pixelsPerSecond = width * height * (frameRate || 30);
  const bitsPerPixel = 0.12;
  const bitrate = pixelsPerSecond * bitsPerPixel;
  return Math.min(Math.max(Math.round(bitrate), 2_500_000), 50_000_000);
}
