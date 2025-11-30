import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
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
    const genAI = new GoogleGenerativeAI(keyToUse);
    
    // Use the latest flash model for best performance and schema adherence
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `Generate ${count} unique, viable, and innovative ${complexity} ${platform} app ideas for the niche: "${niche}". 
      Each idea MUST include both English and Arabic versions for the name, tagline, description, category, feature list, and target audience.
      For the Arabic fields, ensure the translation is high-quality, professional, and culturally appropriate.
      Include a suggested price for the source code ($20-$500) and a tech stack suitable for a ${complexity} ${platform} application.
      
      Output strictly valid JSON array matching the provided schema. Do not include markdown code blocks.`;

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
      let text = response.text();
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