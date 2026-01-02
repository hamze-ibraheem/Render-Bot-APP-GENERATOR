class GeneratedIdea {
  final String name;
  final String nameAr;
  final String tagline;
  final String taglineAr;
  final String description;
  final String descriptionAr;
  final double price;
  final String category;
  final String categoryAr;
  final List<String> features;
  final List<String> featuresAr;
  final List<String> techStack;
  final String targetAudience;
  final String targetAudienceAr;

  GeneratedIdea({
    required this.name,
    required this.nameAr,
    required this.tagline,
    required this.taglineAr,
    required this.description,
    required this.descriptionAr,
    required this.price,
    required this.category,
    required this.categoryAr,
    required this.features,
    required this.featuresAr,
    required this.techStack,
    required this.targetAudience,
    required this.targetAudienceAr,
  });

  factory GeneratedIdea.fromJson(Map<String, dynamic> json) {
    return GeneratedIdea(
      name: json['name'] ?? '',
      nameAr: json['name_ar'] ?? '',
      tagline: json['tagline'] ?? '',
      taglineAr: json['tagline_ar'] ?? '',
      description: json['description'] ?? '',
      descriptionAr: json['description_ar'] ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      category: json['category'] ?? '',
      categoryAr: json['category_ar'] ?? '',
      features: List<String>.from(json['features'] ?? []),
      featuresAr: List<String>.from(json['features_ar'] ?? []),
      techStack: List<String>.from(json['techStack'] ?? []),
      targetAudience: json['targetAudience'] ?? '',
      targetAudienceAr: json['targetAudience_ar'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'name_ar': nameAr,
      'tagline': tagline,
      'tagline_ar': taglineAr,
      'description': description,
      'description_ar': descriptionAr,
      'price': price,
      'category': category,
      'category_ar': categoryAr,
      'features': features,
      'features_ar': featuresAr,
      'techStack': techStack,
      'targetAudience': targetAudience,
      'targetAudience_ar': targetAudienceAr,
    };
  }
}
