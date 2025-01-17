"use client";

import { ChatMessages } from "@/components/ChatMessages";
import { Header } from "@/components/Header";
import { RecordingControls } from "@/components/RecordingControls";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { processAudioMessage } from "@/services/audioService";
import { useChat } from "ai/react";
import { useState } from "react";

export default function VoiceChat() {
  const { messages, append } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const {
    isRecording,
    recordingTime,
    recordedBlob,
    startRecording,
    stopRecording,
    cancelRecording,
    setRecordedBlob,
  } = useVoiceRecorder();
  const sendRecording = async () => {
    if (recordedBlob) {
      try {
        setError("");
        setIsLoading(true);
        const response = await processAudioMessage(recordedBlob);
        await append({
          role: "user",
          content: response.userAudioUrl,
          data: response.transcription,
        });
        await append({
          role: "assistant",
          content: response.assistantAudioUrl,
          data: response.text,
        });
        setRecordedBlob(null);
        toast({
          title: "Message sent",
          description: "Your message has been processed successfully.",
        });
      } catch (error) {
        setError(error as string);
        console.error("Error sending audio message:", error);
        toast({
          title: "Error",
          description: "Failed to process your message. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4" role="main">
        <Card className="w-full max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle>Voice Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              error={error}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4">
            <RecordingControls
              isRecording={isRecording}
              recordingTime={recordingTime}
              recordedBlob={recordedBlob}
              isLoading={isLoading}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onSendRecording={sendRecording}
              onCancelRecording={cancelRecording}
            />
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
