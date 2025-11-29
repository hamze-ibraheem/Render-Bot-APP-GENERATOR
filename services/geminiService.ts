import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedIdeaRaw } from '../types';

// Initialize the Gemini AI client
// Note: In a real production app, ensure this is handled securely on the backend if possible,
// or via env vars in a secure build process.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAppIdeas = async (
  niche: string,
  count: number = 3
): Promise<GeneratedIdeaRaw[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate ${count} unique, viable, and innovative mobile app ideas for the niche: "${niche}". 
      Each idea should include a catchy name, a tagline, a detailed description, a suggested price for the source code (between $20 and $500), 
      a category, a list of 4 key features, a recommended tech stack (3 items), and a target audience.`,
      config: {
        thinkingConfig: {
          thinkingBudget: 1024,
        },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              tagline: { type: Type.STRING },
              description: { type: Type.STRING },
              price: { type: Type.NUMBER },
              category: { type: Type.STRING },
              features: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              techStack: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              targetAudience: { type: Type.STRING }
            },
            required: ["name", "tagline", "description", "price", "category", "features", "techStack", "targetAudience"]
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as GeneratedIdeaRaw[];
      return data;
    }
    
    throw new Error("No data returned from AI");
  } catch (error) {
    console.error("Error generating app ideas:", error);
    // Fallback or rethrow
    throw error;
  }
};