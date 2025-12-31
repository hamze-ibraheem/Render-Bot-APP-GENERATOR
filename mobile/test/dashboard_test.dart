
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:renderbot_mobile/main.dart';

import 'package:renderbot_mobile/features/profile/widgets/profile_header.dart';
import 'package:renderbot_mobile/features/profile/widgets/stat_card.dart';

import 'package:network_image_mock/network_image_mock.dart';

void main() {
  testWidgets('Dashboard UI Test', (WidgetTester tester) async {
    await mockNetworkImagesFor(() async {
      // Build our app and trigger a frame.
      await tester.pumpWidget(const ProviderScope(child: MyApp()));

      // Verify that Dashboard title is present
      expect(find.text('Dashboard'), findsOneWidget);

      // Verify Overview Tab is selected by default
      expect(find.text('Overview'), findsWidgets);

      // Verify Profile Header elements
      expect(find.byType(ProfileHeader), findsOneWidget);
      expect(find.text('Alex Creator'), findsOneWidget);
      expect(find.text('Enterprise'), findsOneWidget);

      // Verify Stat Cards
      expect(find.byType(StatCard), findsNWidgets(3));
      expect(find.text('Credits Available'), findsOneWidget);
      expect(find.text('Genius Points'), findsOneWidget);
      expect(find.text('Total Orders'), findsOneWidget);

      // Verify values from mock provider
      expect(find.text('850'), findsOneWidget);
      expect(find.text('1250'), findsOneWidget);

      // Verify Bottom Navigation
      expect(find.byIcon(Icons.widgets_outlined), findsNothing); // Lucide icons mappings might differ slightly in test environment if font not loaded, preventing exact icon match check can be safer, but text label check works. 
      // Actually LucideIcons returns IconData, so find.byIcon should work if we import it.
      // However, for safety in headless, let's verify text labels.
      expect(find.text('Saved'), findsOneWidget);
      expect(find.text('Orders'), findsOneWidget);

      // Tap on Saved tab
      await tester.tap(find.text('Saved'));
      await tester.pumpAndSettle();

      // Verify Saved Apps content
      expect(find.text('Saved Ideas'), findsOneWidget);
      expect(find.text('E-Commerce Starter'), findsOneWidget); 
      expect(find.text('Fitness Tracker'), findsOneWidget);

      // Tap on Orders tab
      await tester.tap(find.text('Orders'));
      await tester.pumpAndSettle();

      // Verify Orders content
      expect(find.text('Order History'), findsOneWidget);
      expect(find.text('E-Commerce Starter'), findsOneWidget); // Order item name
      expect(find.text('Completed'), findsWidgets); // Status badge
    });
  });
}
