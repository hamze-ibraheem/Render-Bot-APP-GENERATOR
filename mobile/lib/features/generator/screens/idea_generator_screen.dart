import 'package:flutter/material.dart';

import 'package:renderbot_mobile/services/gemini_service.dart';
import 'package:renderbot_mobile/models/generated_idea.dart';

class IdeaGeneratorScreen extends StatefulWidget {
  const IdeaGeneratorScreen({super.key});

  @override
  State<IdeaGeneratorScreen> createState() => _IdeaGeneratorScreenState();
}

class _IdeaGeneratorScreenState extends State<IdeaGeneratorScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nicheController = TextEditingController();
  final _apiKeyController = TextEditingController();
  
  String _platform = 'Mobile';
  String _complexity = 'Standard';
  bool _isLoading = false;
  bool _showApiKey = false;
  String? _error;
  List<GeneratedIdea> _generatedIdeas = [];
  
  final GeminiService _geminiService = GeminiService();

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() {
      _isLoading = true;
      _error = null;
      _generatedIdeas = [];
    });

    try {
      final ideas = await _geminiService.generateAppIdeas(
        niche: _nicheController.text,
        platform: _platform,
        complexity: _complexity,
        apiKey: _apiKeyController.text,
      );
      
      if (mounted) {
        setState(() {
          _generatedIdeas = ideas;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString();
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI App Generator'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            const Center(
              child: Column(
                children: [
                  Icon(Icons.auto_fix_high, size: 48, color: Color(0xFF4F46E5)),
                  SizedBox(height: 16),
                  Text(
                    'AI App Idea Generator',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Enter a niche, hobby, or problem. AI will architect complete app concepts.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.grey),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            
            // Form
            Form(
              key: _formKey,
              child: Column(
                children: [
                  TextFormField(
                    controller: _nicheController,
                    decoration: InputDecoration(
                      labelText: 'Describe your niche...',
                      hintText: 'e.g., Sustainable gardening',
                      prefixIcon: const Icon(Icons.lightbulb_outline),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      filled: true,
                      fillColor: Colors.white,
                    ),
                    validator: (value) => value == null || value.isEmpty ? 'Please enter a niche' : null,
                  ),
                  const SizedBox(height: 16),
                  
                  Row(
                    children: [
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          value: _platform,
                          decoration: InputDecoration(
                            labelText: 'Platform',
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          items: ['Mobile', 'Web', 'Cross-platform', 'Game', 'Watch']
                              .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                              .toList(),
                          onChanged: (v) => setState(() => _platform = v!),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          value: _complexity,
                          decoration: InputDecoration(
                            labelText: 'Complexity',
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          items: ['MVP', 'Standard', 'Advanced', 'Enterprise']
                              .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                              .toList(),
                          onChanged: (v) => setState(() => _complexity = v!),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  
                  // API Key Input
                  TextFormField(
                    controller: _apiKeyController,
                    obscureText: !_showApiKey,
                    decoration: InputDecoration(
                      labelText: 'Custom API Key (Optional)',
                      hintText: 'Enter Gemini API Key',
                      prefixIcon: const Icon(Icons.vpn_key_outlined),
                      suffixIcon: IconButton(
                        icon: Icon(_showApiKey ? Icons.visibility_off : Icons.visibility),
                        onPressed: () => setState(() => _showApiKey = !_showApiKey),
                      ),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: (_isLoading || _nicheController.text.isEmpty) ? null : _handleSubmit,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF4F46E5),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: _isLoading 
                        ? const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)),
                              SizedBox(width: 12),
                              Text('Generating...'),
                            ],
                          )
                        : const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.auto_awesome),
                              SizedBox(width: 8),
                              Text('Generate Blueprints', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                            ],
                          ),
                    ),
                  ),
                ],
              ),
            ),
            
            // Results
            if (_error != null) ...[
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red[50],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.red[100]!),
                ),
                child: Text(_error!, style: const TextStyle(color: Colors.red)),
              ),
            ],
            
            if (_generatedIdeas.isNotEmpty) ...[
              const SizedBox(height: 32),
              const Text(
                'Generated Ideas',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              ..._generatedIdeas.map((idea) => Padding(
                padding: const EdgeInsets.only(bottom: 16.0),
                child: _buildIdeaCard(idea),
              )),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildIdeaCard(GeneratedIdea idea) {
    // Generate a consistent seed based on the idea name
    final imageSeed = idea.name.hashCode.toString();
    
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey[200]!),
        boxShadow: const [
          BoxShadow(
             color: Color(0x0D000000),
             blurRadius: 10,
             offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 80,
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
              image: DecorationImage(
                image: NetworkImage('https://api.dicebear.com/7.x/identicon/png?seed=$imageSeed'),
                fit: BoxFit.cover,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        idea.name,
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                    ),
                    Text(
                      '\$${idea.price}',
                      style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF4F46E5)),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  idea.tagline,
                  style: const TextStyle(fontSize: 14, color: Colors.grey),
                ),
                const SizedBox(height: 8),
                Text(idea.description),
                const SizedBox(height: 8),
                // Displaying Tech Stack as tags
                Wrap(
                  spacing: 4,
                  runSpacing: 4,
                  children: idea.techStack.take(3).map((tech) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(tech, style: const TextStyle(fontSize: 10, color: Colors.grey)),
                  )).toList(),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () {},
                    child: const Text('View Details'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
