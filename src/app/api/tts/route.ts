import { NextResponse } from "next/server";
import { TranscriptService } from "@/services/transcriptService";
import { TTSService } from "@/services/ttsService";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // const transcript = await TranscriptService.generate(text);
    const {buffer, mimeType} = (await TTSService.textToSpeech(text));

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "TTS generation failed", details: error.message },
      { status: 500 }
    );
  }
}
