import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:renderbot_mobile/theme/app_theme.dart';
import 'features/profile/screens/dashboard_screen.dart';
import 'features/auth/screens/auth_screen.dart';
import 'features/auth/screens/register_screen.dart';
import 'features/auth/providers/auth_provider.dart';
import 'features/home/screens/home_screen.dart';
import 'features/marketplace/screens/marketplace_screen.dart';
import 'features/generator/screens/idea_generator_screen.dart';
import 'features/common/widgets/bottom_nav_screen.dart';

import 'package:hive_flutter/hive_flutter.dart';
import 'features/profile/models/user.dart';
import 'models/generated_idea.dart';

void main() async {
  await dotenv.load(fileName: ".env");
  
  // Initialize Hive
  await Hive.initFlutter();
  
  // Register Adapters
  Hive.registerAdapter(UserAdapter());
  Hive.registerAdapter(UserRoleAdapter());
  Hive.registerAdapter(VendorMobileConfigAdapter());
  Hive.registerAdapter(AppProductAdapter());
  Hive.registerAdapter(GeneratedIdeaAdapter());
  
  // Open Boxes
  await Hive.openBox('authBox');
  await Hive.openBox('marketplaceIdeasBox');
  await Hive.openBox('userIdeasBox');
  await Hive.openBox('favoritesBox');

  runApp(const ProviderScope(child: MyApp()));
}

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    final router = GoRouter(
      navigatorKey: _rootNavigatorKey,
      initialLocation: '/',
      routes: [
        ShellRoute(
          navigatorKey: _shellNavigatorKey,
          builder: (context, state, child) {
            return BottomNavScreen(child: child);
          },
          routes: [
            GoRoute(
              path: '/',
              builder: (context, state) => const HomeScreen(),
            ),
            GoRoute(
              path: '/marketplace',
              builder: (context, state) => const MarketplaceScreen(),
            ),
            GoRoute(
              path: '/generator',
              builder: (context, state) => const IdeaGeneratorScreen(),
            ),
            GoRoute(
              path: '/profile',
              builder: (context, state) {
                // If not authenticated, show AuthScreen, otherwise Dashboard
                if (!authState.isAuthenticated) {
                  return const AuthScreen();
                }
                return const DashboardScreen();
              },
            ),
          ],
        ),
        // Auth routes outside ShellRoute if full screen needed, 
        // OR keep them inside if we want the nav bar to persist. 
        // For now, let's keep register standalone or handle it within AuthScreen flow.
        GoRoute(
          parentNavigatorKey: _rootNavigatorKey, // Full screen
          path: '/register',
          builder: (context, state) => const RegisterScreen(),
        ),
      ],
      // Removed the strict redirect loop
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
