import { useRef, useState } from "react";
import { useMediaStream } from "./hooks/useMediaStream";
import { useRecorder } from "./hooks/useRecorder";
import { useTeleprompterScroll } from "./hooks/useTeleprompterScroll";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { DEFAULT_QUALITY_ID } from "./constants/quality";
import { VideoPreview } from "./components/VideoPreview";
import { TeleprompterOverlay } from "./components/TeleprompterOverlay";
import { TopBar } from "./components/TopBar";
import { ControlBar } from "./components/ControlBar";
import { PermissionOverlay } from "./components/PermissionOverlay";
import { ScriptEditorModal } from "./components/ScriptEditorModal";
import { SettingsModal } from "./components/SettingsModal";
import { RecordingPreviewModal } from "./components/RecordingPreviewModal";

const DEFAULT_SCRIPT =
  "Welcome to your teleprompter.\n\nTap “Script” to paste your own text, adjust speed and size below, then hit record when you're ready.";

function App() {
  const [qualityId, setQualityId] = useLocalStorage("tp_quality", DEFAULT_QUALITY_ID);

  const {
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
  } = useMediaStream(qualityId);

  const [script, setScript] = useLocalStorage("tp_script", DEFAULT_SCRIPT);
  const [speed, setSpeed] = useLocalStorage("tp_speed", 60);
  const [fontSize, setFontSize] = useLocalStorage("tp_fontSize", 44);
  const [mirrored, setMirrored] = useLocalStorage("tp_mirrored", true);

  const [scriptOpen, setScriptOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Show the review screen automatically whenever a new recording finishes.
  const { isRecording, elapsedMs, result, canRecord, start, stop, clearResult } = useRecorder(stream, () =>
    setPreviewOpen(true),
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const { isPlaying, toggle, reset, play, pause } = useTeleprompterScroll({
    containerRef,
    textRef,
    speed,
    script,
    fontSize,
  });

  const handleToggleRecord = () => {
    if (isRecording) {
      stop();
      pause();
      return;
    }
    clearResult();
    if (!isPlaying) play();
    start();
  };

  const handleRerecord = () => {
    clearResult();
    setPreviewOpen(false);
    reset();
  };

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-white">
      <VideoPreview stream={stream} mirrored={mirrored} activeResolution={activeResolution}>
        <TeleprompterOverlay containerRef={containerRef} textRef={textRef} script={script} fontSize={fontSize} />
      </VideoPreview>

      <TopBar isRecording={isRecording} elapsedMs={elapsedMs} />

      {error && <PermissionOverlay message={error} onRetry={retry} />}

      {scriptOpen && (
        <ScriptEditorModal
          initialScript={script}
          onSave={(next) => {
            setScript(next);
            setScriptOpen(false);
          }}
          onClose={() => setScriptOpen(false)}
        />
      )}

      {settingsOpen && (
        <SettingsModal
          cameras={cameras}
          mics={mics}
          selectedCameraId={selectedCameraId}
          selectedMicId={selectedMicId}
          onSelectCamera={setSelectedCameraId}
          onSelectMic={setSelectedMicId}
          qualities={availableQualities}
          selectedQualityId={qualityId}
          onSelectQuality={setQualityId}
          activeResolution={activeResolution}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {previewOpen && result && (
        <RecordingPreviewModal
          url={result.url}
          filename={result.filename}
          mimeType={result.mimeType}
          onRerecord={handleRerecord}
          onClose={() => setPreviewOpen(false)}
        />
      )}

      <ControlBar
        speed={speed}
        onSpeedChange={setSpeed}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        mirrored={mirrored}
        onToggleMirror={() => setMirrored((m) => !m)}
        onOpenScript={() => setScriptOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        isPlaying={isPlaying}
        onTogglePlay={toggle}
        onReset={reset}
        isRecording={isRecording}
        canRecord={canRecord}
        onToggleRecord={handleToggleRecord}
        onOpenPreview={result ? () => setPreviewOpen(true) : undefined}
      />
    </div>
  );
}

export default App;
