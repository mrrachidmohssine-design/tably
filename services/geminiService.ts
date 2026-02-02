
import { GoogleGenAI, Type } from "@google/genai";

export const scanReceipt = async (base64Image: string) => {
  // Utilisation directe de process.env.API_KEY comme requis
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("Clé API manquante (process.env.API_KEY non configuré)");
  }

  const ai = new GoogleGenAI({ apiKey });

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
          text: "Extract all line items, prices, and quantities from this receipt image. Return ONLY a JSON array. Schema: [{ name: string, price: number, quantity: integer }]. Ignore subtotals, taxes, and totals.",
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
  if (!text) return [];
  
  try {
    return JSON.parse(text.trim());
  } catch (e) {
    console.error("Gemini Response Parse Error:", e, text);
    return [];
  }
};
