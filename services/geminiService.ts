
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are an AI IMAGE GENERATION SYSTEM for "Stamps for Tomorrow".
OUTPUT OBJECTIVE: Generate a high-quality POSTAGE STAMP IMAGE.

STAMP FORMAT — ABSOLUTE RULES:
- Clearly be a postage stamp with a perforated border frame.
- Contain ONLY the stamp (centered).
- Background outside the stamp MUST be plain white.
- Style: Colorful vector illustration, bold rounded shapes, vibrant and playful.
- Theme: UAE Culture and Future. Use authentic heritage (camels, forts, falcons, ghaf trees) mixed with optimistic, futuristic visions (clean energy, space exploration, green cities).
- Audience: Families and children (ages 5-14).
- TONE: Warm, optimistic, inspiring, and clean.
- NO text, letters, or numbers inside the stamp image.
- NO logos or UI elements.
- HIGH CONTRAST and readable at small sizes.
`;

export async function generateStampImage(theme: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Theme: ${theme}. Create a beautiful, modern, vector-style UAE postage stamp. It should look like a collector's item with rich colors and playful shapes. Focus on high clarity.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: SYSTEM_INSTRUCTION },
          { text: prompt }
        ]
      }
    });

    let imageUrl = '';
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error('Image part not found in response');
    }

    return imageUrl;
  } catch (error) {
    console.error('Error generating stamp:', error);
    throw error;
  }
}
