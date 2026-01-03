
import { GoogleGenAI, Type } from "@google/genai";
import { GestureResponse } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

const SYSTEM_INSTRUCTION = `
You are a hand tracking engine for a browser scroll interface.
Analyze the image and locate the user's hand.
Determine the vertical position of the hand's center within the frame.

Output Rules:
- Return 'verticalPosition' as a number between 0 (top edge) and 100 (bottom edge).
- If no hand is visible, set 'handDetected' to false and 'verticalPosition' to 50.
- Ignore faces, background objects, or other body parts. Focus on the hand/palm/finger.
- If multiple hands are visible, choose the most prominent or central one.

Return JSON.
`;

export const analyzeGesture = async (base64Image: string): Promise<GestureResponse> => {
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: "Locate hand vertical position.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            handDetected: {
              type: Type.BOOLEAN,
            },
            verticalPosition: {
              type: Type.NUMBER,
              description: "0 is top, 100 is bottom",
            },
            confidence: {
              type: Type.NUMBER,
            },
          },
          required: ["handDetected", "verticalPosition"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      return { handDetected: false, verticalPosition: 50, confidence: 0 };
    }

    return JSON.parse(jsonText) as GestureResponse;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return { handDetected: false, verticalPosition: 50, confidence: 0 };
  }
};
