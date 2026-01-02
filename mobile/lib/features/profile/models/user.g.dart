// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class VendorMobileConfigAdapter extends TypeAdapter<VendorMobileConfig> {
  @override
  final int typeId = 2;

  @override
  VendorMobileConfig read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return VendorMobileConfig(
      appName: fields[0] as String,
      packageName: fields[1] as String,
      version: fields[2] as String,
      status: fields[3] as String,
      lastBuild: fields[4] as String?,
      downloadUrl: fields[5] as String?,
    );
  }

  @override
  void write(BinaryWriter writer, VendorMobileConfig obj) {
    writer
      ..writeByte(6)
      ..writeByte(0)
      ..write(obj.appName)
      ..writeByte(1)
      ..write(obj.packageName)
      ..writeByte(2)
      ..write(obj.version)
      ..writeByte(3)
      ..write(obj.status)
      ..writeByte(4)
      ..write(obj.lastBuild)
      ..writeByte(5)
      ..write(obj.downloadUrl);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is VendorMobileConfigAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class UserAdapter extends TypeAdapter<User> {
  @override
  final int typeId = 0;

  @override
  User read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return User(
      id: fields[0] as String,
      name: fields[1] as String,
      email: fields[2] as String,
      avatar: fields[3] as String,
      plan: fields[4] as String,
      credits: fields[5] as int,
      points: fields[6] as int,
      downloadsRemaining: fields[7] as int,
      memberSince: fields[8] as String,
      role: fields[9] as UserRole,
      mobileConfig: fields[10] as VendorMobileConfig?,
    );
  }

  @override
  void write(BinaryWriter writer, User obj) {
    writer
      ..writeByte(11)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.email)
      ..writeByte(3)
      ..write(obj.avatar)
      ..writeByte(4)
      ..write(obj.plan)
      ..writeByte(5)
      ..write(obj.credits)
      ..writeByte(6)
      ..write(obj.points)
      ..writeByte(7)
      ..write(obj.downloadsRemaining)
      ..writeByte(8)
      ..write(obj.memberSince)
      ..writeByte(9)
      ..write(obj.role)
      ..writeByte(10)
      ..write(obj.mobileConfig);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UserAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class UserRoleAdapter extends TypeAdapter<UserRole> {
  @override
  final int typeId = 1;

  @override
  UserRole read(BinaryReader reader) {
    switch (reader.readByte()) {
      case 0:
        return UserRole.user;
      case 1:
        return UserRole.manager;
      case 2:
        return UserRole.admin;
      case 3:
        return UserRole.vendor;
      case 4:
        return UserRole.developer;
      case 5:
        return UserRole.superAdmin;
      default:
        return UserRole.user;
    }
  }

  @override
  void write(BinaryWriter writer, UserRole obj) {
    switch (obj) {
      case UserRole.user:
        writer.writeByte(0);
        break;
      case UserRole.manager:
        writer.writeByte(1);
        break;
      case UserRole.admin:
        writer.writeByte(2);
        break;
      case UserRole.vendor:
        writer.writeByte(3);
        break;
      case UserRole.developer:
        writer.writeByte(4);
        break;
      case UserRole.superAdmin:
        writer.writeByte(5);
        break;
    }
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UserRoleAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
