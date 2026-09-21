import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../widgets/glass_container.dart';

class MemoryScreen extends StatefulWidget {
  const MemoryScreen({super.key});

  @override
  State<MemoryScreen> createState() => _MemoryScreenState();
}

class _MemoryScreenState extends State<MemoryScreen> {
  final TextEditingController _searchController = TextEditingController();

  final List<Map<String, dynamic>> _memoryVectors = [
    {
      'title': 'Authentication implementation notes',
      'category': 'Project',
      'updated': '2 days ago',
      'access': 'Private',
      'pinned': true,
      'preview': 'Stored JWT token authentication refresh workflow for desktop shell.',
    },
    {
      'title': 'Build error analysis',
      'category': 'Case',
      'updated': '3 days ago',
      'access': 'Restricted',
      'pinned': false,
      'preview': 'Analyzed dependency conflicts during Kotlin compiler assembly.',
    },
    {
      'title': 'Android 14 compatibility research',
      'category': 'Research',
      'updated': '5 days ago',
      'access': 'Public',
      'pinned': false,
      'preview': 'Reviewed platform permissions and USB debugging authorization protocols.',
    },
    {
      'title': 'ADB debugging guide',
      'category': 'Document',
      'updated': '1 week ago',
      'access': 'Public',
      'pinned': true,
      'preview': 'Recorded platform tools path resolution on Windows environment.',
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.pagePadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Memory & Context Hub', style: AppTypography.pageTitle),
                      const SizedBox(height: 4),
                      Text(
                        'Inspect vector memory, project notes, and long-term agent knowledge',
                        style: AppTypography.metadata,
                      ),
                    ],
                  ),
                  ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.bookmark_add_outlined, size: 16),
                    label: const Text('New Memory Item'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: AppSpacing.radiusSm),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              // Search Bar
              TextField(
                controller: _searchController,
                style: AppTypography.body,
                decoration: InputDecoration(
                  hintText: 'Search vector memory & context...',
                  hintStyle: AppTypography.body.copyWith(color: AppColors.textSecondary),
                  prefixIcon: const Icon(Icons.search, color: AppColors.textSecondary, size: 18),
                  filled: true,
                  fillColor: AppColors.glassBackground,
                  border: OutlineInputBorder(
                    borderRadius: AppSpacing.radiusSm,
                    borderSide: BorderSide(color: AppColors.glassBorder),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: AppSpacing.radiusSm,
                    borderSide: BorderSide(color: AppColors.glassBorder),
                  ),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
              ),
              const SizedBox(height: AppSpacing.lg),

              // Memory Items List
              Expanded(
                child: ListView.builder(
                  itemCount: _memoryVectors.length,
                  itemBuilder: (context, index) {
                    final item = _memoryVectors[index];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: AppSpacing.md),
                      child: EcoraaGlassContainer(
                        padding: const EdgeInsets.all(AppSpacing.lg),
                        borderRadius: AppSpacing.radiusLg,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  if (item['pinned'])
                                    const Padding(
                                      padding: EdgeInsets.only(right: 6),
                                      child: Icon(Icons.push_pin, size: 14, color: AppColors.primary),
                                    ),
                                  Text(item['title'], style: AppTypography.sectionTitle),
                                ],
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppColors.primary.withValues(alpha: 0.1),
                                  borderRadius: AppSpacing.radiusXs,
                                ),
                                child: Text(
                                  item['category'],
                                  style: AppTypography.metadata.copyWith(color: AppColors.primary, fontWeight: FontWeight.w600, fontSize: 10),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(item['preview'], style: AppTypography.body.copyWith(color: AppColors.textSecondary)),
                          const SizedBox(height: 10),
                          Row(
                            children: [
                              Icon(Icons.schedule, size: 12, color: AppColors.textSecondary),
                              const SizedBox(width: 4),
                              Text('Updated ${item['updated']}', style: AppTypography.metadata.copyWith(fontSize: 10)),
                              const SizedBox(width: 16),
                              Icon(Icons.lock_outline, size: 12, color: AppColors.textSecondary),
                              const SizedBox(width: 4),
                              Text(item['access'], style: AppTypography.metadata.copyWith(fontSize: 10)),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}