import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:renderbot_mobile/theme/app_theme.dart';
import 'features/profile/screens/dashboard_screen.dart';
import 'features/auth/screens/auth_screen.dart';
import 'features/auth/screens/register_screen.dart';
import 'features/auth/providers/auth_provider.dart';

void main() {
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    final router = GoRouter(
      initialLocation: '/auth',
      routes: [
        GoRoute(
          path: '/auth',
          builder: (context, state) => const AuthScreen(),
        ),
        GoRoute(
          path: '/register',
          builder: (context, state) => const RegisterScreen(),
        ),
        GoRoute(
          path: '/',
          builder: (context, state) => const DashboardScreen(),
        ),
      ],
      redirect: (context, state) {
        final isAuthenticated = authState.isAuthenticated;
        final isAuthRoute = state.uri.path == '/auth' || state.uri.path == '/register';

        if (!isAuthenticated && !isAuthRoute) return '/auth';
        if (isAuthenticated && isAuthRoute) return '/';

        return null;
      },
    );

    return MaterialApp.router(
      title: 'RenderBot',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}
