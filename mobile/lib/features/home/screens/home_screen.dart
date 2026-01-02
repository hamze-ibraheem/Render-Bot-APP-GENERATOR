import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Using a SafeArea to avoid system UI overlays
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Hero Section
            Container(
              padding: const EdgeInsets.only(top: 60, bottom: 40, left: 20, right: 20),
              decoration: const BoxDecoration(
                // Simulating the gradient background/blobs from web
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                     Color(0xFFF5F3FF), // indigo-50 equivalentish
                     Colors.white,
                  ],
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEEF2FF), // indigo-50
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFE0E7FF)), // indigo-100
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        Icon(Icons.auto_awesome, size: 16, color: Color(0xFF4338CA)), // indigo-700
                        SizedBox(width: 8),
                        Text(
                          'AI-Powered App Generation',
                          style: TextStyle(
                            color: Color(0xFF4338CA),
                            fontWeight: FontWeight.w500,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // Title
                  RichText(
                    textAlign: TextAlign.center,
                    text: const TextSpan(
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF0F172A), // slate-900
                        height: 1.2,
                        fontFamily: 'Inter', // Assuming standard font
                      ),
                      children: [
                        TextSpan(text: 'Transform Ideas into '),
                        TextSpan(
                          text: 'Apps',
                          style: TextStyle(
                            color: Color(0xFF4F46E5), // indigo-600
                          ),
                        ),
                        TextSpan(text: ' Instantly'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  
                  // Subtitle
                  const Text(
                    'Describe your dream app and let our advanced AI generate a complete, deployable codebase in minutes. No coding required.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 16,
                      color: Color(0xFF475569), // slate-600
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 32),
                  
                  // Buttons
                  Column(
                    children: [
                      SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: ElevatedButton(
                          onPressed: () {
                             // Navigate to Generator
                             context.push('/generator');
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF4F46E5), // indigo-600
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            elevation: 4,
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: const [
                              Icon(Icons.memory),
                              SizedBox(width: 8),
                              Text(
                                'Generate App',
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: OutlinedButton(
                          onPressed: () {
                             // Tab navigation to Marketplace (index 1)
                             // This depends on how we set up the ShellRoute, but for now we can try direct nav
                             context.go('/marketplace');
                          },
                          style: OutlinedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: const Color(0xFF334155), // slate-700
                            side: const BorderSide(color: Color(0xFFE2E8F0)), // slate-200
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: const [
                              Text(
                                'Browse Marketplace',
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                              ),
                              SizedBox(width: 8),
                              Icon(Icons.arrow_forward, size: 16),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 40),
                  
                  // Tech Stack Badges (Mock)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                       _buildTechText('React Native'),
                       _buildTechText('Flutter'),
                       _buildTechText('SwiftUI'),
                    ],
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildTechText(String text) {
    return Text(
      text,
      style: const TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.bold,
        color: Color(0xFF94A3B8), // slate-400
      ),
    );
  }
}
