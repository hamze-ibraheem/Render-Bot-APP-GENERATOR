# Flutter Mobile App Generation Prompt: User Profile Module

You are an expert Flutter Developer. Your task is to generate a comprehensive `assets` folder structure and a set of "Cursor Rules" or detailed prompts that can be used to build the **User Profile Mobile Module** for the RenderBot application. This module must mirror the functionality and design of the existing React web dashboard.

## Context
The application "RenderBot" is an AI-powered App Store and Generator. The User Profile (Dashboard) is a central hub where users manage their credits, plans, saved apps, orders, and vendor settings.

## 1. Directory Structure
Create a folder structure inside `lib/features/profile` (or similar) that organizes the code effectively:
*   `models/`: For Data models (User, AppProduct, Order, etc.).
*   `screens/`:
    *   `dashboard_screen.dart`: Main container with bottom or top navigation for sub-tabs.
    *   `overview_tab.dart`: Stats and "Activity".
    *   `saved_ideas_tab.dart`: Grid of `AppCard` widgets.
    *   `downloads_tab.dart`: List of purchased/downloaded items.
    *   `orders_tab.dart`: Order history list.
    *   `subscription_tab.dart`: Plan details and upgrade options.
    *   `rewards_tab.dart`: Points history and redemption.
    *   `vendor_portal_tab.dart`: (If user is vendor) Management of apps.
    *   `settings_tab.dart`: Edit profile form.
*   `widgets/`:
    *   `profile_header.dart`: Avatar, Name, Plan badge, Role badge.
    *   `stat_card.dart`: Reusable card for Credits, Points, Orders stats.
    *   `app_card_mobile.dart`: Mobile version of the web `AppCard`.
    *   `role_switcher.dart`: (Demo feature) Toggle for testing roles.

## 2. Data Models (Dart)
Based on the TypeScript interfaces, define the following Dart classes (using `freezed` or `json_serializable` is recommended):

### User
```dart
enum UserRole { user, manager, admin, vendor, developer, superAdmin }

class User {
  final String id;
  final String name;
  final String email;
  final String avatar;
  final String plan; // 'Free', 'Pro', 'Enterprise'
  final int credits;
  final int points;
  final int downloadsRemaining;
  final String memberSince;
  final UserRole role;
  final VendorMobileConfig? mobileConfig;
  // ... any other fields
}
```

### AppProduct (Simplified)
```dart
class AppProduct {
  final String id;
  final String name;
  final String tagline;
  final double price;
  final String category;
  final List<String> features;
  // ... other fields
}
```

## 3. Screen Requirements & Logic

### A. Profile Header
*   **UI**: Show circular avatar (use `CachedNetworkImage`).
*   **Badges**: Show Plan (e.g., "Pro") and Role (e.g., "VENDOR"). Use colors matching the web (Pro=Indigo, Admin=Red, Vendor=Amber).
*   **Role Switcher**: Implement a horizontal scrollable list of buttons to switch roles (User, Vendor, Admin) for demo purposes.

### B. Dashboard Overview
*   **Stats Grid**: 3 Cards.
    1.  **Credits**: Gradient Purple/Indigo. Icon: Zap. Content: `user.credits`.
    2.  **Rewards**: Gradient Amber/Orange. Icon: Trophy. Content: `user.points`.
    3.  **Order Count**: White/Dark card. Icon: History. Content: `orders.length`.

### C. Tabs Implementation
*   Use a `TabBar` and `TabBarView` or a Bottom Navigation setup.
*   **Saved Ideas**: Grid of `AppCardMobile`. Should support "Remove from Saved".
*   **Vendor Portal**:
    *   Only visible if `role == vendor`.
    *   Show "Build Mobile App" card.
    *   List `vendorApps` with Edit/Delete actions.
*   **Orders**: List view of past orders with Status/Date.

## 4. State Management Recommendation
*   Use **Riverpod** or **Bloc**.
*   Create a `UserProvider` to hold the current `User` state.
*   Create an `OrdersProvider` and `SavedAppsProvider`.

## 5. Styling Guidelines
*   **Theme**: Support Light and Dark mode.
*   **Colors**:
    *   Primary: Indigo (`0xFF4F46E5`)
    *   Background: White / Slate-900 (`0xFF0F172A`)
*   **Typography**: Use `GoogleFonts.inter()` if possible, or standard sans-serif.

## 6. Implementation Task
Generate the specific Dart code for the `User` model and the `DashboardScreen` widget structure first.
