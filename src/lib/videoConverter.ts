import type { FFmpeg } from "@ffmpeg/ffmpeg";

export type TargetFormatId = "mp4" | "mkv" | "mov";

export interface TargetFormat {
  id: TargetFormatId;
  label: string;
  extension: string;
  mimeType: string;
  description: string;
}

export const TARGET_FORMATS: TargetFormat[] = [
  {
    id: "mp4",
    label: "MP4",
    extension: "mp4",
    mimeType: "video/mp4",
    description: "H.264 · plays everywhere",
  },
  {
    id: "mkv",
    label: "MKV",
    extension: "mkv",
    mimeType: "video/x-matroska",
    description: "Matroska · fast, lossless export",
  },
  {
    id: "mov",
    label: "MOV",
    extension: "mov",
    mimeType: "video/quicktime",
    description: "QuickTime · H.264",
  },
];

let ffmpegPromise: Promise<FFmpeg> | null = null;

async function loadFFmpeg(): Promise<FFmpeg> {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      // Core (~31 MB) is bundled with the app and fetched only on first use,
      // so conversion stays fully on-device — nothing is uploaded anywhere.
      const [{ FFmpeg }, { default: coreURL }, { default: wasmURL }] = await Promise.all([
        import("@ffmpeg/ffmpeg"),
        import("@ffmpeg/core?url"),
        import("@ffmpeg/core/wasm?url"),
      ]);
      const ffmpeg = new FFmpeg();
      await ffmpeg.load({ coreURL, wasmURL });
      return ffmpeg;
    })().catch((err) => {
      ffmpegPromise = null;
      throw err;
    });
  }
  return ffmpegPromise;
}

/** Kill the converter worker (e.g. to abort a running conversion). The next
 * conversion transparently spins up a fresh instance. */
export function resetConverter(): void {
  ffmpegPromise?.then((ffmpeg) => ffmpeg.terminate()).catch(() => {});
  ffmpegPromise = null;
}

/** Stream copy when the source codecs are valid in the target container;
 * transcode to H.264/AAC otherwise. Copy is near-instant and lossless. */
function buildArgs(input: string, output: string, target: TargetFormatId, sourceIsMp4: boolean): string[] {
  const canCopy = target === "mkv" || (sourceIsMp4 && target === "mov");
  if (canCopy) return ["-i", input, "-c", "copy", output];
  return [
    "-i", input,
    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-crf", "23",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "128k",
    "-movflags", "+faststart",
    output,
  ];
}

export interface ConversionResult {
  url: string;
  mimeType: string;
}

export async function convertRecording(
  sourceUrl: string,
  sourceMimeType: string,
  target: TargetFormatId,
  onProgress?: (ratio: number) => void,
): Promise<ConversionResult> {
  const format = TARGET_FORMATS.find((f) => f.id === target);
  if (!format) throw new Error(`Unknown format: ${target}`);

  const [ffmpeg, { fetchFile }] = await Promise.all([loadFFmpeg(), import("@ffmpeg/util")]);

  const sourceIsMp4 = sourceMimeType.includes("mp4");
  const input = sourceIsMp4 ? "input.mp4" : "input.webm";
  const output = `output.${format.extension}`;

  const handleProgress = ({ progress }: { progress: number }) => {
    // Chrome's MediaRecorder omits duration metadata, which can make ffmpeg's
    // ratio estimate drift out of range — clamp so the UI never shows >100%.
    if (onProgress && Number.isFinite(progress)) onProgress(Math.min(Math.max(progress, 0), 1));
  };
  ffmpeg.on("progress", handleProgress);

  try {
    await ffmpeg.writeFile(input, await fetchFile(sourceUrl));
    const code = await ffmpeg.exec(buildArgs(input, output, target, sourceIsMp4));
    if (code !== 0) throw new Error(`Conversion failed (ffmpeg exit code ${code})`);
    const data = await ffmpeg.readFile(output);
    const blob = new Blob([data as Uint8Array<ArrayBuffer>], { type: format.mimeType });
    return { url: URL.createObjectURL(blob), mimeType: format.mimeType };
  } finally {
    ffmpeg.off("progress", handleProgress);
    await ffmpeg.deleteFile(input).catch(() => {});
    await ffmpeg.deleteFile(output).catch(() => {});
  }
}
