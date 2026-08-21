import { useCallback, useEffect, useRef, useState } from "react";
import {
  convertRecording,
  resetConverter,
  type ConversionResult,
  type TargetFormatId,
} from "../lib/videoConverter";

interface UseVideoConverterResult {
  /** Format currently being converted, or null when idle. */
  converting: TargetFormatId | null;
  /** 0..1 progress of the active conversion (0 until ffmpeg reports). */
  progress: number;
  error: string | null;
  /** Finished conversions for the current source, keyed by format. */
  results: Partial<Record<TargetFormatId, ConversionResult>>;
  convert: (target: TargetFormatId) => Promise<ConversionResult | null>;
}

export function useVideoConverter(sourceUrl: string, sourceMimeType: string): UseVideoConverterResult {
  const [converting, setConverting] = useState<TargetFormatId | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Partial<Record<TargetFormatId, ConversionResult>>>({});
  const activeRef = useRef(false);

  // Drop cached conversions (and their blob URLs) when the recording changes.
  useEffect(() => {
    return () => {
      setResults((prev) => {
        Object.values(prev).forEach((r) => URL.revokeObjectURL(r.url));
        return {};
      });
      if (activeRef.current) {
        resetConverter();
        activeRef.current = false;
      }
    };
  }, [sourceUrl]);

  const convert = useCallback(
    async (target: TargetFormatId): Promise<ConversionResult | null> => {
      if (activeRef.current) return null;
      activeRef.current = true;
      setConverting(target);
      setProgress(0);
      setError(null);
      try {
        const result = await convertRecording(sourceUrl, sourceMimeType, target, setProgress);
        setResults((prev) => ({ ...prev, [target]: result }));
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Conversion failed");
        return null;
      } finally {
        activeRef.current = false;
        setConverting(null);
      }
    },
    [sourceUrl, sourceMimeType],
  );

  return { converting, progress, error, results, convert };
}
