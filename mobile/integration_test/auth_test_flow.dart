
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:renderbot_mobile/main.dart' as app;

// Integration test for Auth Sign Up Flow
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('verify signup flow and role selection', (WidgetTester tester) async {
    app.main();
    await tester.pumpAndSettle();

    // 1. Verify Login Screen Initial State
    print('Verifying Login Screen...');
    expect(find.text('Welcome back'), findsOneWidget);
    expect(find.text('Sign in'), findsWidgets); 

    // 2. Switch to Sign Up
    print('Switching to Sign Up...');
    final signupToggle = find.byKey(const Key('auth_toggle_button')).first;
    await tester.ensureVisible(signupToggle);
    await tester.tap(signupToggle);
    await tester.pumpAndSettle();

    // 3. Verify Sign Up Screen Elements
    print('Verifying Sign Up Screen...');
    expect(find.text('Create an account'), findsOneWidget);
    expect(find.text('Full Name'), findsOneWidget);
    expect(find.text('Select Role'), findsOneWidget);

    // 4. Fill Form
    print('Filling form...');
    await tester.enterText(find.ancestor(of: find.text('Full Name'), matching: find.byType(TextField)).first, 'Auto Tester');
    await tester.enterText(find.ancestor(of: find.text('Email'), matching: find.byType(TextField)).first, 'auto@test.com');
    await tester.enterText(find.ancestor(of: find.text('Password'), matching: find.byType(TextField)).first, 'password123');
    await tester.pumpAndSettle();

    // 5. Select Role (Developer)
    print('Selecting Developer role...');
    // Find the Developer card. Note: RoleSelector uses custom widgets, searching by text 'Developer' might be inside the card.
    await tester.tap(find.text('Developer'));
    await tester.pumpAndSettle();

    // 6. Submit Sign Up
    print('Submitting Sign Up...');
    final signupButton = find.byKey(const Key('auth_submit_button')).first;
    await tester.tap(signupButton);
    
    // 7. Wait for Mock API (1.5s delay) + Validation
    await tester.pumpAndSettle(const Duration(seconds: 2));

    // 8. Verify Navigation to Dashboard
    print('Verifying Dashboard...');
    expect(find.text('Dashboard'), findsOneWidget);
    // User name from mock provider for new signups is 'Auto Tester'
    expect(find.text('Auto Tester'), findsOneWidget);
    // Verify Developer role badge if possible, or just default UI
    expect(find.text('Overview'), findsWidgets);
  });
}
