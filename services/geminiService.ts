
import { GoogleGenAI, Type } from "@google/genai";

export const scanReceipt = async (base64Image: string) => {
  // Récupération sécurisée de la clé API au moment de l'appel
  const apiKey = (window as any).process?.env?.API_KEY || (process?.env?.API_KEY);
  
  if (!apiKey) {
    throw new Error("Clé API manquante. Veuillez configurer process.env.API_KEY.");
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
  if (!text) return [];
  
  try {
    return JSON.parse(text.trim());
  } catch (e) {
    console.error("Erreur de parsing Gemini:", e, text);
    return [];
  }
};
