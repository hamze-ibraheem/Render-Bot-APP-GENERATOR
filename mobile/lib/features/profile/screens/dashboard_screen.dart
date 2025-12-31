import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user.dart';
import 'overview_tab.dart';
import 'saved_apps_tab.dart';
import 'orders_tab.dart';

// Mock User Provider for Demo
final userProvider = Provider<User>((ref) {
  return User(
    id: 'u-123',
    name: 'Alex Creator',
    email: 'alex@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Alex',
    plan: 'Enterprise',
    credits: 850,
    points: 1250,
    downloadsRemaining: 999999,
    memberSince: 'Oct 2023',
    role: UserRole.manager,
  );
});



class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  int _selectedIndex = 0;

  static const List<Widget> _pages = <Widget>[
    OverviewTab(),
    SavedAppsTab(),
    OrdersTab(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Dashboard"),
        actions: [
          IconButton(icon: const Icon(LucideIcons.settings), onPressed: () {}),
        ],
      ),
      body: IndexedStack(
        index: _selectedIndex,
        children: _pages,
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(icon: Icon(LucideIcons.layoutDashboard), label: 'Overview'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.heart), label: 'Saved'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.shoppingBag), label: 'Orders'),
        ],
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        selectedItemColor: Theme.of(context).primaryColor,
        unselectedItemColor: Colors.grey,
        showUnselectedLabels: true,
      ),
    );
  }
}

