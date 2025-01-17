import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai as VercelAi } from "@ai-sdk/openai";
import OpenAI from "openai";

const AI_CHAT_MODEL = "gpt-4o-mini";
const AI_VOICE_TO_TEXT_MODEL = "whisper-1";
const AI_VOICE_PERSON = "alloy";
const AI_TEXT_TO_VOICE_MODEL = "tts-1";

export async function POST(req: NextRequest) {
  try {
    const openai = new OpenAI();

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }
    // Convert audio to text using the openai
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: AI_VOICE_TO_TEXT_MODEL,
      language: "en",
    });

    // Generate response using the AI SDK
    const { text } = await generateText({
      model: VercelAi(AI_CHAT_MODEL),
      prompt: transcription.text,
      maxRetries: 1,
    });
    // Convert text response to speech using the AI SDK
    const speechResponse = await openai.audio.speech.create({
      model: AI_TEXT_TO_VOICE_MODEL,
      voice: AI_VOICE_PERSON,
      input: text,
    });

    // Convert the AI audio buffer to a base64 string
    const audioBuffer = Buffer.from(await speechResponse.arrayBuffer());
    const audioBase64 = audioBuffer.toString("base64");

    // Convert the user audio buffer to a base64 string
    const userAudioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const userAudioBase64 = userAudioBuffer.toString("base64");

    return NextResponse.json({
      text,
      userAudioUrl: `data:audio/mp3;base64,${userAudioBase64}`,
      assistantAudioUrl: `data:audio/mp3;base64,${audioBase64}`,
      transcription: transcription.text,
    });
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.json(
      { error: "Error processing audio" },
      { status: 500 }
    );
  }
}
