
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/app_product.dart';
import '../widgets/app_card_mobile.dart';

// Mock Provider for Saved Apps
final savedAppsProvider = Provider<List<AppProduct>>((ref) {
  return [
    AppProduct(
      id: '1',
      name: 'E-Commerce Starter',
      tagline: 'Complete shop solution',
      description: 'Full stack e-commerce app',
      price: 49.99,
      category: 'Commerce',
      features: ['Cart', 'Payment'],
      techStack: ['Flutter', 'Node'],
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800',
    ),
    AppProduct(
      id: '2',
      name: 'Fitness Tracker',
      tagline: 'Track your workouts',
      description: 'Health and fitness tracking',
      price: 0,
      category: 'Health',
      features: ['GPS', 'Pedometer'],
      techStack: ['Flutter', 'Firebase'],
      imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&q=80&w=800',
    ),
     AppProduct(
      id: '3',
      name: 'Chat AI Bot',
      tagline: 'Intelligent assistant',
      description: 'AI powered chat bot',
      price: 99.00,
      category: 'AI',
      features: ['GPT-4', 'Voice'],
      techStack: ['Python', 'React'],
      imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=800',
    ),
  ];
});

class SavedAppsTab extends ConsumerWidget {
  const SavedAppsTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final savedApps = ref.watch(savedAppsProvider);

    if (savedApps.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.bookmark_border, size: 64, color: Theme.of(context).disabledColor),
            const SizedBox(height: 16),
            Text("No saved apps yet", style: Theme.of(context).textTheme.titleMedium),
          ],
        ),
      );
    }

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Saved Ideas",
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(), // Handle scroll in parent if needed, or change to custom scroll view
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 0.75,
              ),
              itemCount: savedApps.length,
              itemBuilder: (context, index) {
                return AppCardMobile(
                  product: savedApps[index],
                  onTap: () {},
                  onRemove: () {},
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
