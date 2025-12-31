
enum UserRole { user, manager, admin, vendor, developer, superAdmin }

class VendorMobileConfig {
  final String appName;
  final String packageName;
  final String version;
  final String status;
  final String? lastBuild;
  final String? downloadUrl;

  VendorMobileConfig({
    required this.appName,
    required this.packageName,
    required this.version,
    required this.status,
    this.lastBuild,
    this.downloadUrl,
  });
}

class User {
  final String id;
  final String name;
  final String email;
  final String avatar;
  final String plan;
  final int credits;
  final int points;
  final int downloadsRemaining;
  final String memberSince;
  final UserRole role;
  final VendorMobileConfig? mobileConfig;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.avatar,
    required this.plan,
    required this.credits,
    required this.points,
    required this.downloadsRemaining,
    required this.memberSince,
    required this.role,
    this.mobileConfig,
  });
}
