import 'package:hive/hive.dart';

part 'user.g.dart';

@HiveType(typeId: 1)
enum UserRole {
  @HiveField(0)
  user,
  @HiveField(1)
  manager,
  @HiveField(2)
  admin,
  @HiveField(3)
  vendor,
  @HiveField(4)
  developer,
  @HiveField(5)
  superAdmin
}

@HiveType(typeId: 2)
class VendorMobileConfig {
  @HiveField(0)
  final String appName;
  @HiveField(1)
  final String packageName;
  @HiveField(2)
  final String version;
  @HiveField(3)
  final String status;
  @HiveField(4)
  final String? lastBuild;
  @HiveField(5)
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

@HiveType(typeId: 0)
class User {
  @HiveField(0)
  final String id;
  @HiveField(1)
  final String name;
  @HiveField(2)
  final String email;
  @HiveField(3)
  final String avatar;
  @HiveField(4)
  final String plan;
  @HiveField(5)
  final int credits;
  @HiveField(6)
  final int points;
  @HiveField(7)
  final int downloadsRemaining;
  @HiveField(8)
  final String memberSince;
  @HiveField(9)
  final UserRole role;
  @HiveField(10)
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
