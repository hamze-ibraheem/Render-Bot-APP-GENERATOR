import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../../profile/models/user.dart';

// Simple Auth State
class AuthState {
  final bool isAuthenticated;
  final bool isLoading;
  final User? user;
  final String? error;

  AuthState({
    this.isAuthenticated = false,
    this.isLoading = false,
    this.user,
    this.error,
  });

  AuthState copyWith({
    bool? isAuthenticated,
    bool? isLoading,
    User? user,
    String? error,
  }) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      user: user ?? this.user,
      error: error,
    );
  }
}

// Auth Notifier
final authProvider = NotifierProvider<AuthNotifier, AuthState>(AuthNotifier.new);

class AuthNotifier extends Notifier<AuthState> {
  @override
  AuthState build() {
    final box = Hive.box('authBox');
    final bool isAuthenticated = box.get('isAuthenticated', defaultValue: false);
    final User? user = box.get('user');
    
    // If we have a user but for some reason isAuthenticated is false, we might want to check that.
    // But we'll trust the stored boolean for now, or just check if user != null.
    
    if (isAuthenticated && user != null) {
      return AuthState(
        isAuthenticated: true,
        user: user,
      );
    }
    
    return AuthState();
  }

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    
    // Simulate API delay
    await Future.delayed(const Duration(milliseconds: 1500));

    // Check for Super Admin credentials (matches App.tsx)
    if (email == 'hamzaalsarsour@taskfoundation.net' && password == 'Hamzere@RE589185') {
      final user = User(
          id: 'sa-001',
          name: 'Hamza Alsarsour',
          email: email,
          avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Hamza',
          plan: 'Enterprise',
          credits: 999999,
          points: 999999,
          downloadsRemaining: 999999,
          memberSince: 'Mar 2024',
          role: UserRole.superAdmin,
          mobileConfig: VendorMobileConfig(
            appName: 'Task Foundation App',
            packageName: 'net.taskfoundation.app',
            version: '1.0.0',
            status: 'Ready',
          ),
        );
        
      state = state.copyWith(
        isAuthenticated: true,
        isLoading: false,
        user: user,
      );
      
      // Save to Hive
      final box = Hive.box('authBox');
      box.put('isAuthenticated', true);
      box.put('user', user);
      
      return;
    }

    // Standard Mock User Login (Matches MOCK_USER in constants.ts)
    if (email.isNotEmpty && password.length >= 6) {
      final user = User(
          id: 'u-123',
          name: 'Alex Creator',
          email: email, // Override with entered email
          avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Alex',
          plan: 'Enterprise',
          credits: 850,
          points: 1250,
          downloadsRemaining: 999999,
          memberSince: 'Oct 2023',
          role: UserRole.manager,
        );

      state = state.copyWith(
        isAuthenticated: true,
        isLoading: false,
        user: user,
      );
      
      // Save to Hive
      final box = Hive.box('authBox');
      box.put('isAuthenticated', true);
      box.put('user', user);
    } else {
      state = state.copyWith(
        isLoading: false,
        error: "Invalid email or password",
      );
    }
  }

  Future<void> signup(String name, String email, UserRole role) async {
    state = state.copyWith(isLoading: true, error: null);

    // Simulate API delay
    await Future.delayed(const Duration(milliseconds: 1500));

    // Check if role requires approval (Matches App.tsx)
    if (role == UserRole.admin || role == UserRole.vendor) {
      state = state.copyWith(
        isLoading: false,
        error: "Registration successful! Your account is pending approval.",
        // Do not authenticate
      );
      return;
    }

    if (name.isNotEmpty && email.isNotEmpty) {
      final user = User(
          id: 'u-${DateTime.now().millisecondsSinceEpoch}',
          name: name,
          email: email,
          role: role,
          avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=${name.replaceAll(" ", "")}',
          plan: 'Free',
          // Give more initial credits to Developers (Matches App.tsx)
          credits: (role == UserRole.developer) ? 50 : 20,
          points: 0,
          downloadsRemaining: 0,
          memberSince: 'Now',
        );

      state = state.copyWith(
        isAuthenticated: true,
        isLoading: false,
        user: user,
      );
      
      // Save to Hive
      final box = Hive.box('authBox');
      box.put('isAuthenticated', true);
      box.put('user', user);
    } else {
      state = state.copyWith(
        isLoading: false,
        error: "Please fill in all fields",
      );
    }
  }

  void logout() {
    state = AuthState(); // Reset state
    
    Hive.box('authBox').clear();
    Hive.box('userIdeasBox').clear();
    Hive.box('favoritesBox').clear();
  }
}
