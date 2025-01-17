import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        setRecordedBlob(audioBlob);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      toast({
        title: "Recording started",
        description: "Your voice is now being recorded.",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error",
        description:
          "Unable to start recording. Please check your microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "You can now send or cancel the recording.",
      });
    }
  };

  const cancelRecording = () => {
    setRecordedBlob(null);
    setRecordingTime(0);
    toast({
      title: "Recording cancelled",
      description:
        "Your recording has been discarded. You can start a new one.",
    });
  };

  return {
    isRecording,
    recordingTime,
    recordedBlob,
    startRecording,
    stopRecording,
    cancelRecording,
    setRecordedBlob,
  };
}
