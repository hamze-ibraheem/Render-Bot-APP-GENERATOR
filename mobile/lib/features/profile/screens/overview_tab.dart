
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../screens/dashboard_screen.dart';
import '../widgets/profile_header.dart';
import '../widgets/stat_card.dart';

class OverviewTab extends ConsumerWidget {
  const OverviewTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(userProvider);
    
    // Handle null user (shouldn't happen if navigation is correct, but safety first)
    if (user == null) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Overview",
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          ProfileHeader(user: user),
          const SizedBox(height: 24),
          GridView.count(
            crossAxisCount: 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            childAspectRatio: 1.1,
            children: [
              StatCard(
                title: "Credits Available",
                value: user.credits.toString(),
                icon: LucideIcons.zap,
                baseColor: Colors.indigo,
                isGradient: true,
              ),
              StatCard(
                title: "Genius Points",
                value: user.points.toString(),
                icon: LucideIcons.trophy,
                baseColor: Colors.orange,
                isGradient: true,
              ),
              StatCard(
                title: "Total Orders",
                value: "12", // Mock value
                icon: LucideIcons.history,
                baseColor: Colors.green,
                isGradient: false,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
