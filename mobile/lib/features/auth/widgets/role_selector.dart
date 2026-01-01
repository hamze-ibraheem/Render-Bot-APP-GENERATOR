
import 'package:flutter/material.dart';
import '../../profile/models/user.dart';
import 'package:lucide_icons/lucide_icons.dart';

class RoleSelector extends StatelessWidget {
  final UserRole selectedRole;
  final Function(UserRole) onRoleSelected;

  const RoleSelector({
    super.key,
    required this.selectedRole,
    required this.onRoleSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Select Role",
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 8),
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 2.5,
          children: [
            _buildRoleCard(context, UserRole.user, "User", LucideIcons.user),
            _buildRoleCard(context, UserRole.developer, "Developer", LucideIcons.terminal),
            _buildRoleCard(context, UserRole.vendor, "Vendor", LucideIcons.store),
            _buildRoleCard(context, UserRole.admin, "Admin", LucideIcons.shield),
          ],
        ),
        if (selectedRole == UserRole.admin || selectedRole == UserRole.vendor)
          Container(
            margin: const EdgeInsets.only(top: 8),
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.amber.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.amber.withValues(alpha: 0.3)),
            ),
            child: Row(
              children: [
                const Icon(LucideIcons.shield, size: 14, color: Colors.amber),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    "Requires admin approval",
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.amber[800], // Darker amber for text visibility
                    ),
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _buildRoleCard(BuildContext context, UserRole role, String label, IconData icon) {
    final isSelected = selectedRole == role;
    final colorScheme = Theme.of(context).colorScheme;

    return InkWell(
      onTap: () => onRoleSelected(role),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        decoration: BoxDecoration(
          color: isSelected ? colorScheme.primary.withValues(alpha: 0.1) : colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? colorScheme.primary : colorScheme.outline.withValues(alpha: 0.3),
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 18,
              color: isSelected ? colorScheme.primary : Colors.grey,
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 13,
                color: isSelected ? colorScheme.primary : colorScheme.onSurface.withValues(alpha: 0.7),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
