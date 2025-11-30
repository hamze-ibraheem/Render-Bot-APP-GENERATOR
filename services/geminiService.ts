import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedIdeaRaw } from '../types';

export const generateAppIdeas = async (
  niche: string,
  platform: string = 'Mobile',
  complexity: string = 'Standard',
  count: number = 3,
  apiKey?: string
): Promise<GeneratedIdeaRaw[]> => {
  try {
    const keyToUse = apiKey || process.env.API_KEY || "";
    if (!keyToUse) {
      console.warn("API Key is missing or empty.");
    }

    // Initialize client inside function to ensure fresh config
    const ai = new GoogleGenAI({ apiKey: keyToUse });
    
    const prompt = `Generate ${count} unique, viable, and innovative ${complexity} ${platform} app ideas for the niche: "${niche}". 
      Each idea MUST include both English and Arabic versions for the name, tagline, description, category, feature list, and target audience.
      For the Arabic fields, ensure the translation is high-quality, professional, and culturally appropriate.
      Include a suggested price for the source code ($20-$500) and a tech stack suitable for a ${complexity} ${platform} application.
      
      Output strictly valid JSON array matching the provided schema. Do not include markdown code blocks.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
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

    let text = response.text;
    if (text) {
      // Robust cleaning of markdown code blocks if present
      if (text.startsWith("```json")) {
        text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (text.startsWith("```")) {
         text = text.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }
      
      const data = JSON.parse(text) as GeneratedIdeaRaw[];
      return data;
    }
    
    throw new Error("No data returned from AI");
  } catch (error) {
    console.error("Error generating app ideas:", error);
    throw error;
  }
};