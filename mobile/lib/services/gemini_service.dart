import 'dart:convert';
import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:renderbot_mobile/models/generated_idea.dart';

class GeminiService {
  static String get _defaultApiKey => dotenv.env['VITE_API_KEY'] ?? 'AIzaSyA9KmOKQaem6ROFj4DDlPrMbBMQXYaaExs';

  GenerativeModel _model(String apiKey) {
    return GenerativeModel(
      model: 'gemini-2.5-flash',
      apiKey: apiKey,
      generationConfig: GenerationConfig(
        temperature: 0.7,
        maxOutputTokens: 8192, // Further increased limit for Enterprise/Bilingual responses
        responseMimeType: 'application/json',
      ),
    );
  }

  Future<List<GeneratedIdea>> generateAppIdeas({
    required String niche,
    String platform = 'Mobile',
    String complexity = 'Standard',
    int count = 3,
    String? apiKey,
  }) async {
    final keyToUse =
        (apiKey != null && apiKey.isNotEmpty) ? apiKey : _defaultApiKey;

    if (keyToUse.isEmpty) {
      throw Exception('Gemini API key is missing.');
    }

    final model = _model(keyToUse);

    final prompt = '''
Generate $count unique, viable, and innovative $complexity $platform app ideas for the niche: "$niche". 
Each idea MUST include both English and Arabic versions for the name, tagline, description, category, feature list, and target audience.
For the Arabic fields, ensure the translation is high-quality, professional, and culturally appropriate.
Include a suggested price for the source code (\$20-\$500) and a tech stack suitable for a $complexity $platform application.

IMPORTANT: Keep descriptions and feature lists concise and to-the-point to ensure the response fits within the token limit.

Output strictly valid JSON array matching the provided schema. Do not include markdown code blocks.

Schema:
[
  {
    "name": "string",
    "name_ar": "string",
    "tagline": "string",
    "tagline_ar": "string",
    "description": "string",
    "description_ar": "string",
    "price": number,
    "category": "string",
    "category_ar": "string",
    "features": ["string"],
    "features_ar": ["string"],
    "techStack": ["string"],
    "targetAudience": "string",
    "targetAudience_ar": "string"
  }
]
''';

    try {
      final response = await model.generateContent([
        Content.text(prompt),
      ]);

      final rawText = response.text;
      if (rawText == null || rawText.isEmpty) {
        throw Exception('Empty Gemini response');
      }

      final cleaned = _cleanJson(rawText);
      final List<dynamic> decoded = jsonDecode(cleaned);

      return decoded.map<GeneratedIdea>((json) {
        return GeneratedIdea.fromJson(json);
      }).toList();
    } catch (e) {
      throw Exception('GeminiService error: $e');
    }
  }

  String _cleanJson(String text) {
    var t = text.trim();
    // Remove markdown code blocks if present
    t = t.replaceAll(RegExp(r'^```(json)?\s*|\s*```$'), '');
    
    // Find the first '[' and last ']' to ensure we only get the JSON array
    final startIndex = t.indexOf('[');
    final endIndex = t.lastIndexOf(']');
    
    if (startIndex != -1 && endIndex != -1 && endIndex > startIndex) {
      t = t.substring(startIndex, endIndex + 1);
    }
    
    return t.trim();
  }
}
