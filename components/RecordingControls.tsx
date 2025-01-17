import { Button } from "@/components/ui/button";
import { Mic, MicOff, Check, X } from "lucide-react";

interface RecordingControlsProps {
  isRecording: boolean;
  recordingTime: number;
  recordedBlob: Blob | null;
  isLoading: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSendRecording: () => void;
  onCancelRecording: () => void;
}

export function RecordingControls({
  isRecording,
  recordingTime,
  recordedBlob,
  isLoading,
  onStartRecording,
  onStopRecording,
  onSendRecording,
  onCancelRecording,
}: RecordingControlsProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full flex flex-col space-y-2">
      {isRecording ? (
        <div className="w-full text-center">
          <p
            className="text-lg font-semibold mb-2 recording-timer"
            aria-live="assertive"
          >
            Recording: {formatTime(recordingTime)}
          </p>
          <Button
            onClick={onStopRecording}
            variant="destructive"
            className="w-full"
            aria-pressed={isRecording}
          >
            <MicOff className="mr-2" />
            Stop Recording
          </Button>
        </div>
      ) : (
        <Button
          onClick={onStartRecording}
          variant="default"
          className="w-full"
          disabled={isLoading || !!recordedBlob}
          aria-label="Start recording"
        >
          <Mic className="mr-2" />
          Start Recording
        </Button>
      )}
      {recordedBlob && (
        <>
          <div className="w-full flex justify-between mt-2">
            <Button
              onClick={onSendRecording}
              variant="default"
              className="flex-1 mr-2"
              aria-label="Send recording"
              disabled={isLoading}
            >
              <Check className="mr-2" />
              Send
            </Button>
            <Button
              onClick={onCancelRecording}
              variant="outline"
              className="flex-1 ml-2"
              aria-label="Cancel recording"
            >
              <X className="mr-2" />
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
