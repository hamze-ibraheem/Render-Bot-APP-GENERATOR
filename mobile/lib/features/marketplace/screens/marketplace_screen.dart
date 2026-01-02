import 'package:flutter/material.dart';

// Simple model for AppProduct to mock data locally
class AppProduct {
  final String id;
  final String name;
  final String tagline;
  final String description;
  final double price;
  final String category;
  final String imageSeed;

  AppProduct({
    required this.id,
    required this.name,
    required this.tagline,
    required this.description,
    required this.price,
    required this.category,
    required this.imageSeed,
  });
}

class MarketplaceScreen extends StatefulWidget {
  const MarketplaceScreen({super.key});

  @override
  State<MarketplaceScreen> createState() => _MarketplaceScreenState();
}

class _MarketplaceScreenState extends State<MarketplaceScreen> {
  // Mock Data mimicking constants.ts
  final List<AppProduct> _products = [
    AppProduct(
      id: 'app-1',
      name: 'ZenFocus',
      tagline: 'Minimalist Productivity Timer',
      description: 'A distraction-free productivity timer that combines the Pomodoro technique with ambient nature sounds.',
      price: 49,
      category: 'Productivity',
      imageSeed: '101',
    ),
    AppProduct(
      id: 'app-2',
      name: 'FitBuddy AI',
      tagline: 'Your Personal Pocket Trainer',
      description: 'Uses computer vision to analyze your workout form in real-time through your phone camera.',
      price: 199,
      category: 'Health & Fitness',
      imageSeed: '102',
    ),
    AppProduct(
      id: 'app-3',
      name: 'CryptoScout',
      tagline: 'Real-time Gem Detector',
      description: 'An advanced analytics dashboard that aggregates social sentiment and on-chain data.',
      price: 299,
      category: 'Finance',
      imageSeed: '103',
    ),
    AppProduct(
      id: 'app-4',
      name: 'LocalBites',
      tagline: 'Home Cooked Meals Delivered',
      description: 'A marketplace connecting verified home cooks with neighbors looking for authentic meals.',
      price: 89,
      category: 'Food & Drink',
      imageSeed: '104',
    ),
  ];

  String _searchQuery = '';
  String _selectedCategory = '';

  @override
  Widget build(BuildContext context) {
    final filteredProducts = _products.where((p) {
       final matchesSearch = p.name.toLowerCase().contains(_searchQuery.toLowerCase()) || 
                             p.tagline.toLowerCase().contains(_searchQuery.toLowerCase());
       final matchesCategory = _selectedCategory.isEmpty || p.category == _selectedCategory;
       return matchesSearch && matchesCategory;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Marketplace'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              onChanged: (value) => setState(() => _searchQuery = value),
              decoration: InputDecoration(
                hintText: 'Search apps...',
                prefixIcon: const Icon(Icons.search),
                filled: true,
                fillColor: Colors.grey[100],
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              ),
            ),
          ),
          
          // Filter Chips (Categories)
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                _buildFilterChip('All', _selectedCategory.isEmpty, () => setState(() => _selectedCategory = '')),
                const SizedBox(width: 8),
                _buildFilterChip('Productivity', _selectedCategory == 'Productivity', () => setState(() => _selectedCategory = 'Productivity')),
                const SizedBox(width: 8),
                _buildFilterChip('Health & Fitness', _selectedCategory == 'Health & Fitness', () => setState(() => _selectedCategory = 'Health & Fitness')),
                const SizedBox(width: 8),
                _buildFilterChip('Finance', _selectedCategory == 'Finance', () => setState(() => _selectedCategory = 'Finance')),
              ],
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Product List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: filteredProducts.length,
              itemBuilder: (context, index) {
                final product = filteredProducts[index];
                return _buildProductCard(product);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isSelected, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFEEF2FF) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? const Color(0xFF4F46E5) : Colors.grey[300]!,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? const Color(0xFF4F46E5) : Colors.grey[700],
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }

  Widget _buildProductCard(AppProduct product) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey[200]!),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image Stub
          Container(
            height: 120,
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
              image: DecorationImage(
                image: NetworkImage('https://api.dicebear.com/7.x/identicon/png?seed=${product.imageSeed}'),
                fit: BoxFit.cover, // Just a placeholder approach
              ),
            ),
            child: Stack(
              children: [
                Positioned(
                  top: 10,
                  right: 10,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '\$${product.price}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF4F46E5),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.category,
                  style: const TextStyle(
                    color: Color(0xFF6366F1),
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  product.name,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  product.tagline,
                  style: const TextStyle(
                    color: Color(0xFF64748B),
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () {
                      // Detail view would go here
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF4F46E5),
                      side: const BorderSide(color: Color(0xFF4F46E5)),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text('View Details'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
