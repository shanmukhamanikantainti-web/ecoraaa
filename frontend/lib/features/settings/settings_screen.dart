import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  int _selectedCategoryIndex = 0;

  final List<String> _categories = [
    'General',
    'Device Connection',
    'Appearance',
    'Workspaces',
    'AI & Memory',
    'Recording & Logs',
    'Privacy & Security',
  ];

  bool _startAtLogin = true;
  bool _autoCheckUpdates = true;
  bool _enableNotifications = true;
  bool _enableDevMode = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.pagePadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Settings', style: AppTypography.pageTitle),
                  const SizedBox(height: 4),
                  Text(
                    'Customize ECORAA to fit your workflow',
                    style: AppTypography.metadata,
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              // Settings Category & Form Split
              Expanded(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Category Sidebar
                    Expanded(
                      flex: 1,
                      child: Container(
                        padding: const EdgeInsets.all(AppSpacing.md),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: AppSpacing.radiusLg,
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Column(
                          children: _categories.asMap().entries.map((entry) {
                            final idx = entry.key;
                            final cat = entry.value;
                            final isSelected = idx == _selectedCategoryIndex;
                            return GestureDetector(
                              onTap: () => setState(() => _selectedCategoryIndex = idx),
                              child: Container(
                                width: double.infinity,
                                margin: const EdgeInsets.only(bottom: 4),
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                decoration: BoxDecoration(
                                  color: isSelected ? AppColors.primary.withValues(alpha: 0.1) : Colors.transparent,
                                  borderRadius: AppSpacing.radiusSm,
                                ),
                                child: Text(
                                  cat,
                                  style: AppTypography.bodySmall.copyWith(
                                    color: isSelected ? AppColors.primary : AppColors.textPrimary,
                                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.lg),

                    // Main Form Content
                    Expanded(
                      flex: 3,
                      child: Container(
                        padding: const EdgeInsets.all(AppSpacing.xl),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: AppSpacing.radiusLg,
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${_categories[_selectedCategoryIndex]} Settings',
                              style: AppTypography.sectionTitle,
                            ),
                            const SizedBox(height: 4),
                            Text('Configure basic behavior and startup preferences.', style: AppTypography.metadata),
                            const SizedBox(height: AppSpacing.lg),
                            const Divider(),
                            const SizedBox(height: AppSpacing.md),

                            // Option Toggles
                            SwitchListTile(
                              title: Text('Start ECORAA at system login', style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w600)),
                              subtitle: Text('Automatically launch app when you log in.', style: AppTypography.metadata),
                              value: _startAtLogin,
                              activeColor: AppColors.primary,
                              onChanged: (val) => setState(() => _startAtLogin = val),
                            ),
                            SwitchListTile(
                              title: Text('Check for updates automatically', style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w600)),
                              subtitle: Text('Get notified when a new version is available.', style: AppTypography.metadata),
                              value: _autoCheckUpdates,
                              activeColor: AppColors.primary,
                              onChanged: (val) => setState(() => _autoCheckUpdates = val),
                            ),
                            SwitchListTile(
                              title: Text('Enable desktop notifications', style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w600)),
                              subtitle: Text('Receive notifications for completed AI tasks.', style: AppTypography.metadata),
                              value: _enableNotifications,
                              activeColor: AppColors.primary,
                              onChanged: (val) => setState(() => _enableNotifications = val),
                            ),
                            SwitchListTile(
                              title: Text('Developer mode', style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w600)),
                              subtitle: Text('Enable extended diagnostic logs and API options.', style: AppTypography.metadata),
                              value: _enableDevMode,
                              activeColor: AppColors.primary,
                              onChanged: (val) => setState(() => _enableDevMode = val),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}