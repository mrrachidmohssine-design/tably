
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const scanReceipt = async (base64Image: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: "Extract all line items, prices, and quantities from this receipt image. Return ONLY a JSON array. Ignore subtotals, taxes, and totals.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            price: { type: Type.NUMBER },
            quantity: { type: Type.INTEGER },
          },
          required: ["name", "price", "quantity"],
        },
      },
    },
  });

  const text = response.text;
  try {
    return JSON.parse(text || '[]');
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
};
