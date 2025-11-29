import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { GeneratedIdeaRaw } from '../types';

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");

export const generateAppIdeas = async (
  niche: string,
  platform: string = 'Mobile',
  complexity: string = 'Standard',
  count: number = 3
): Promise<GeneratedIdeaRaw[]> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `Generate ${count} unique, viable, and innovative ${complexity} ${platform} app ideas for the niche: "${niche}". 
      Each idea MUST include both English and Arabic versions for the name, tagline, description, category, feature list, and target audience.
      For the Arabic fields, ensure the translation is high-quality, professional, and culturally appropriate.
      Include a suggested price for the source code ($20-$500) and a tech stack suitable for a ${complexity} ${platform} application.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }]}],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              name: { type: SchemaType.STRING },
              name_ar: { type: SchemaType.STRING },
              tagline: { type: SchemaType.STRING },
              tagline_ar: { type: SchemaType.STRING },
              description: { type: SchemaType.STRING },
              description_ar: { type: SchemaType.STRING },
              price: { type: SchemaType.NUMBER },
              category: { type: SchemaType.STRING },
              category_ar: { type: SchemaType.STRING },
              features: { 
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING }
              },
              features_ar: { 
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING }
              },
              techStack: { 
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING }
              },
              targetAudience: { type: SchemaType.STRING },
              targetAudience_ar: { type: SchemaType.STRING }
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

    const response = result.response;
    if (response) {
      const text = response.text();
      const data = JSON.parse(text) as GeneratedIdeaRaw[];
      return data;
    }
    
    throw new Error("No data returned from AI");
  } catch (error) {
    console.error("Error generating app ideas:", error);
    throw error;
  }
};