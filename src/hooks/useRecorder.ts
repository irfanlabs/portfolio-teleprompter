import { useCallback, useEffect, useRef, useState } from "react";
import { estimateBitrate } from "../constants/quality";

const CANDIDATE_MIME_TYPES = [
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm",
  "video/mp4",
];

function pickMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  return CANDIDATE_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

export interface RecordingResult {
  url: string;
  filename: string;
  mimeType: string;
}

interface UseRecorderResult {
  isRecording: boolean;
  elapsedMs: number;
  result: RecordingResult | null;
  canRecord: boolean;
  start: () => void;
  stop: () => void;
  clearResult: () => void;
}

export function useRecorder(
  stream: MediaStream | null,
  onFinish?: (result: RecordingResult) => void,
): UseRecorderResult {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [result, setResult] = useState<RecordingResult | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const prevUrlRef = useRef<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- recursive rAF loop intentionally references itself
  const tick = useCallback((now: number) => {
    setElapsedMs(now - startTimeRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    if (!stream || isRecording) return;
    const mimeType = pickMimeType();
    const videoSettings = stream.getVideoTracks()[0]?.getSettings();
    const videoBitsPerSecond = estimateBitrate(
      videoSettings?.width ?? 1920,
      videoSettings?.height ?? 1080,
      videoSettings?.frameRate ?? 30,
    );
    const options: MediaRecorderOptions = {
      ...(mimeType ? { mimeType } : {}),
      videoBitsPerSecond,
      audioBitsPerSecond: 128_000,
    };
    const recorder = new MediaRecorder(stream, options);
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const type = recorder.mimeType || "video/webm";
      const blob = new Blob(chunksRef.current, { type });
      const url = URL.createObjectURL(blob);
      const ext = type.includes("mp4") ? "mp4" : "webm";
      const stamp = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const filename = `teleprompter-${stamp.getFullYear()}${pad(stamp.getMonth() + 1)}${pad(
        stamp.getDate(),
      )}-${pad(stamp.getHours())}${pad(stamp.getMinutes())}${pad(stamp.getSeconds())}.${ext}`;

      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = url;
      const nextResult = { url, filename, mimeType: type };
      setResult(nextResult);
      setIsRecording(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      onFinish?.(nextResult);
    };

    recorderRef.current = recorder;
    recorder.start(250);
    startTimeRef.current = performance.now();
    setElapsedMs(0);
    setResult(null);
    setIsRecording(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [stream, isRecording, tick, onFinish]);

  const stop = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  }, []);

  const clearResult = useCallback(() => {
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = null;
    }
    setResult(null);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, []);

  return {
    isRecording,
    elapsedMs,
    result,
    canRecord: !!stream && typeof MediaRecorder !== "undefined",
    start,
    stop,
    clearResult,
  };
}
