
class AppProduct {
  final String id;
  final String name;
  final String? nameAr;
  final String tagline;
  final String description;
  final double price;
  final String category;
  final List<String> features;
  final List<String> techStack;
  final int? imageSeed;
  final String? imageUrl;
  final bool isAI;

  AppProduct({
    required this.id,
    required this.name,
    this.nameAr,
    required this.tagline,
    required this.description,
    required this.price,
    required this.category,
    required this.features,
    required this.techStack,
    this.imageSeed,
    this.imageUrl,
    this.isAI = false,
  });
}
