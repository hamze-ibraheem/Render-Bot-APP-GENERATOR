
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedIdeaRaw } from '../types';

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAppIdeas = async (
  niche: string,
  platform: string = 'Mobile',
  complexity: string = 'Standard',
  count: number = 3
): Promise<GeneratedIdeaRaw[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate ${count} unique, viable, and innovative ${complexity} ${platform} app ideas for the niche: "${niche}". 
      Each idea MUST include both English and Arabic versions for the name, tagline, description, category, feature list, and target audience.
      For the Arabic fields, ensure the translation is high-quality, professional, and culturally appropriate.
      Include a suggested price for the source code ($20-$500) and a tech stack suitable for a ${complexity} ${platform} application.`,
      config: {
        thinkingConfig: {
          thinkingBudget: 2048,
        },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              name_ar: { type: Type.STRING },
              tagline: { type: Type.STRING },
              tagline_ar: { type: Type.STRING },
              description: { type: Type.STRING },
              description_ar: { type: Type.STRING },
              price: { type: Type.NUMBER },
              category: { type: Type.STRING },
              category_ar: { type: Type.STRING },
              features: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              features_ar: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              techStack: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              targetAudience: { type: Type.STRING },
              targetAudience_ar: { type: Type.STRING }
            },
            required: [
              "name", "name_ar", 
              "tagline", "tagline_ar", 
              "description", "description_ar", 
              "price", 
              "category", "category_ar", 
              "features", "features_ar", 
              "techStack", 
              "targetAudience", "targetAudience_ar"
            ]
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
    throw error;
  }
};