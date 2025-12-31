
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:renderbot_mobile/main.dart' as app;

// Integration test for Profile Feature
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('verify profile dashboard, saved apps, and orders tab', (WidgetTester tester) async {
    app.main();
    await tester.pumpAndSettle();

    // 1. Verify Overview Tab
    print('Verifying Overview Tab...');
    expect(find.text('Dashboard'), findsOneWidget);
    expect(find.text('Overview'), findsWidgets); // Bottom Nav Label
    expect(find.text('Alex Creator'), findsOneWidget);
    expect(find.text('850'), findsOneWidget); // Credits
    await Future.delayed(const Duration(seconds: 1)); // Delay for visual check

    // 2. Navigate to Saved Tab
    print('Tapping Saved Tab...');
    await tester.tap(find.text('Saved'));
    await tester.pumpAndSettle();
    expect(find.text('Saved Ideas'), findsOneWidget);
    expect(find.text('Fitness Tracker'), findsOneWidget);
    await Future.delayed(const Duration(seconds: 1));

    // 3. Navigate to Orders Tab
    print('Tapping Orders Tab...');
    await tester.tap(find.text('Orders'));
    await tester.pumpAndSettle();
    expect(find.text('Order History'), findsOneWidget);
    expect(find.text('Completed'), findsWidgets);
    await Future.delayed(const Duration(seconds: 1));

    // 4. Return to Overview
    print('Returning to Overview...');
    await tester.tap(find.text('Overview'));
    await tester.pumpAndSettle();
    expect(find.text('Genius Points'), findsOneWidget);
    await Future.delayed(const Duration(seconds: 1));
  });
}
