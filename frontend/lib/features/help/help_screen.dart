import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';

class HelpScreen extends StatefulWidget {
  const HelpScreen({super.key});

  @override
  State<HelpScreen> createState() => _HelpScreenState();
}

class _HelpScreenState extends State<HelpScreen> {
  final TextEditingController _searchController = TextEditingController();

  final List<Map<String, String>> _topics = [
    {'title': 'Getting Started', 'articles': '8 articles', 'desc': 'Learn the basics and set up your environment.'},
    {'title': 'Device Setup', 'articles': '12 articles', 'desc': 'Connect and configure your Android device.'},
    {'title': 'Screen Mirror', 'articles': '10 articles', 'desc': 'Troubleshoot and optimize screen mirroring.'},
    {'title': 'ADB & Console', 'articles': '14 articles', 'desc': 'Use ADB, run commands and manage devices.'},
    {'title': 'Settings & Customization', 'articles': '9 articles', 'desc': 'Personalize your experience and preferences.'},
    {'title': 'Security & Privacy', 'articles': '6 articles', 'desc': 'Learn about data safety and permissions.'},
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.pagePadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Help & Support', style: AppTypography.pageTitle),
                  const SizedBox(height: 4),
                  Text(
                    'Find answers, learn how to use ECORAA, or contact support',
                    style: AppTypography.metadata,
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              // Search Banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppSpacing.xl),
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.08),
                  borderRadius: AppSpacing.radiusLg,
                  border: Border.all(color: AppColors.primary.withValues(alpha: 0.2)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'HOW CAN WE HELP YOU?',
                      style: AppTypography.metadata.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Find answers. Solve faster.',
                      style: AppTypography.pageTitle.copyWith(color: AppColors.textPrimary),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    TextField(
                      controller: _searchController,
                      style: AppTypography.body,
                      decoration: InputDecoration(
                        hintText: 'Search for help articles, guides, or troubleshooting...',
                        hintStyle: AppTypography.body.copyWith(color: AppColors.textSecondary),
                        prefixIcon: const Icon(Icons.search, color: AppColors.primary),
                        filled: true,
                        fillColor: AppColors.surface,
                        border: OutlineInputBorder(
                          borderRadius: AppSpacing.radiusSm,
                          borderSide: BorderSide(color: AppColors.border),
                        ),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.xl),

              // Popular Help Topics Grid
              Text('Popular Help Topics', style: AppTypography.sectionTitle),
              const SizedBox(height: AppSpacing.md),

              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                  maxCrossAxisExtent: 320,
                  mainAxisExtent: 140,
                  crossAxisSpacing: AppSpacing.md,
                  mainAxisSpacing: AppSpacing.md,
                ),
                itemCount: _topics.length,
                itemBuilder: (context, index) {
                  final topic = _topics[index];
                  return Container(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: AppSpacing.radiusLg,
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(topic['title']!, style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w700)),
                            const SizedBox(height: 4),
                            Text(topic['desc']!, style: AppTypography.metadata, maxLines: 2, overflow: TextOverflow.ellipsis),
                          ],
                        ),
                        Text(
                          '${topic['articles']} →',
                          style: AppTypography.metadata.copyWith(color: AppColors.primary, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  );
                },
              ),
              const SizedBox(height: AppSpacing.xl),

              // System Info & Support Contact Panel
              Container(
                padding: const EdgeInsets.all(AppSpacing.lg),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: AppSpacing.radiusLg,
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('System Information', style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w700)),
                        const SizedBox(height: 4),
                        Text('ECORAA v1.0 • Flutter 3.29 • Dart 3.7', style: AppTypography.metadata),
                      ],
                    ),
                    OutlinedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.copy, size: 14),
                      label: const Text('Copy Diagnostics'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.textPrimary,
                        side: const BorderSide(color: AppColors.border),
                        shape: RoundedRectangleBorder(borderRadius: AppSpacing.radiusSm),
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