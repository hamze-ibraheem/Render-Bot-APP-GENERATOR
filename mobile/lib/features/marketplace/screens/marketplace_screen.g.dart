// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'marketplace_screen.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class AppProductAdapter extends TypeAdapter<AppProduct> {
  @override
  final int typeId = 3;

  @override
  AppProduct read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return AppProduct(
      id: fields[0] as String,
      name: fields[1] as String,
      tagline: fields[2] as String,
      description: fields[3] as String,
      price: fields[4] as double,
      category: fields[5] as String,
      imageSeed: fields[6] as String,
    );
  }

  @override
  void write(BinaryWriter writer, AppProduct obj) {
    writer
      ..writeByte(7)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.tagline)
      ..writeByte(3)
      ..write(obj.description)
      ..writeByte(4)
      ..write(obj.price)
      ..writeByte(5)
      ..write(obj.category)
      ..writeByte(6)
      ..write(obj.imageSeed);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AppProductAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
