
import { Buffer } from 'buffer';

import { getAIClient } from "../lib/aiClient";


interface AudioOptions {
  numChannels: number;
  sampleRate: number;
  bitsPerSample: number;
}

export class TTSService {
  static async textToSpeech(
    text: string
  ): Promise<{ buffer: Uint8Array; mimeType: string }> { 
    const ai = getAIClient();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ role: "user", parts: [{ text }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              { speaker: "Dr. Anya", voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } },
              { speaker: "Liam", voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } },
            ],
          },
        },
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.find(
      (p) => p.inlineData?.mimeType?.includes("audio")
    );

    if (!part || !part.inlineData?.data || !part.inlineData.mimeType) {
      throw new Error("Failed to generate audio or missing data/mimeType.");
    }

    const rawBase64Data = part.inlineData.data;
    const rawMimeType = part.inlineData.mimeType;
    const audioBuffer = convertToWav(rawBase64Data, rawMimeType);
    return { buffer: audioBuffer, mimeType: "audio/wav" };
  }
}

function convertToWav(rawData: string, mimeType: string): Uint8Array {
  const options = parseMimeType(mimeType);
  const pcmBuffer = Buffer.from(rawData, 'base64'); 

  const wavHeaderBuffer = createWavHeader(pcmBuffer.length, options); 

  const wavHeaderUint8Array = new Uint8Array(wavHeaderBuffer.buffer, wavHeaderBuffer.byteOffset, wavHeaderBuffer.byteLength);

  const pcmUint8Array = new Uint8Array(pcmBuffer.buffer, pcmBuffer.byteOffset, pcmBuffer.byteLength);

  const combined = new Uint8Array(wavHeaderUint8Array.length + pcmUint8Array.length);

  combined.set(wavHeaderUint8Array, 0);
  combined.set(pcmUint8Array, wavHeaderUint8Array.length);
  
  return combined;
}
function parseMimeType(mimeType: string): AudioOptions {
  const [fileType, ...params] = mimeType.split(';').map(s => s.trim());
  

  const options: AudioOptions = { numChannels: 1, sampleRate: 24000, bitsPerSample: 16 };

  if (fileType.includes('/L')) {
    const formatPart = fileType.split('/').pop() || '';
    const bits = parseInt(formatPart.slice(1), 10);
    if (!isNaN(bits)) options.bitsPerSample = bits;
  }
  for (const param of params) {
    const [key, value] = param.split('=').map(s => s.trim());
    if (key === 'rate') {
      const rate = parseInt(value, 10);
      if (!isNaN(rate)) options.sampleRate = rate;
    }
  }

  return options;
}

function createWavHeader(dataLength: number, options: AudioOptions): Buffer {
  const { numChannels, sampleRate, bitsPerSample } = options;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8; 
  const buffer = Buffer.alloc(44);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataLength, 4); 
  buffer.write('WAVE', 8);

  
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); 
  buffer.writeUInt16LE(1, 20); 
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24); 
  buffer.writeUInt32LE(byteRate, 28); 
  buffer.writeUInt16LE(blockAlign, 32); 
  buffer.writeUInt16LE(bitsPerSample, 34); 

  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40); 

  return buffer;
}