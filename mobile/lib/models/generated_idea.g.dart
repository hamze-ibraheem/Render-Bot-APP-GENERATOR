// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'generated_idea.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class GeneratedIdeaAdapter extends TypeAdapter<GeneratedIdea> {
  @override
  final int typeId = 4;

  @override
  GeneratedIdea read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return GeneratedIdea(
      name: fields[0] as String,
      nameAr: fields[1] as String,
      tagline: fields[2] as String,
      taglineAr: fields[3] as String,
      description: fields[4] as String,
      descriptionAr: fields[5] as String,
      price: fields[6] as double,
      category: fields[7] as String,
      categoryAr: fields[8] as String,
      features: (fields[9] as List).cast<String>(),
      featuresAr: (fields[10] as List).cast<String>(),
      techStack: (fields[11] as List).cast<String>(),
      targetAudience: fields[12] as String,
      targetAudienceAr: fields[13] as String,
    );
  }

  @override
  void write(BinaryWriter writer, GeneratedIdea obj) {
    writer
      ..writeByte(14)
      ..writeByte(0)
      ..write(obj.name)
      ..writeByte(1)
      ..write(obj.nameAr)
      ..writeByte(2)
      ..write(obj.tagline)
      ..writeByte(3)
      ..write(obj.taglineAr)
      ..writeByte(4)
      ..write(obj.description)
      ..writeByte(5)
      ..write(obj.descriptionAr)
      ..writeByte(6)
      ..write(obj.price)
      ..writeByte(7)
      ..write(obj.category)
      ..writeByte(8)
      ..write(obj.categoryAr)
      ..writeByte(9)
      ..write(obj.features)
      ..writeByte(10)
      ..write(obj.featuresAr)
      ..writeByte(11)
      ..write(obj.techStack)
      ..writeByte(12)
      ..write(obj.targetAudience)
      ..writeByte(13)
      ..write(obj.targetAudienceAr);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is GeneratedIdeaAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
