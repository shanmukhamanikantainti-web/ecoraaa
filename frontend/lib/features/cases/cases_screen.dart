import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../widgets/glass_container.dart';

class CasesScreen extends StatefulWidget {
  const CasesScreen({super.key});

  @override
  State<CasesScreen> createState() => _CasesScreenState();
}

class _CasesScreenState extends State<CasesScreen> {
  final List<Map<String, dynamic>> _cases = [
    {
      'id': 'CASE-00127',
      'title': 'Build Failure Investigation',
      'status': 'Active',
      'created': 'May 10, 2024',
      'duration': '14:32:18',
      'category': 'PEGASUS',
    },
    {
      'id': 'CASE-00126',
      'title': 'Authentication Issue',
      'status': 'Completed',
      'created': 'May 09, 2024',
      'duration': '08:14',
      'category': 'PEGASUS',
    },
    {
      'id': 'CASE-00125',
      'title': 'USB Boot Analysis',
      'status': 'Completed',
      'created': 'May 08, 2024',
      'duration': '22:41',
      'category': 'System',
    },
    {
      'id': 'CASE-00124',
      'title': 'AI Integration Test',
      'status': 'Failed',
      'created': 'May 07, 2024',
      'duration': '11:26',
      'category': 'AI',
    },
  ];

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
                      Text('Cases & Workspaces', style: AppTypography.pageTitle),
                      const SizedBox(height: 4),
                      Text(
                        'Record, manage and analyze development sessions',
                        style: AppTypography.metadata,
                      ),
                    ],
                  ),
                  ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.add, size: 16),
                    label: const Text('New Case'),
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

              // Cases Table Panel
              Expanded(
                child: EcoraaGlassContainer(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  borderRadius: AppSpacing.radiusLg,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Active & Recorded Cases', style: AppTypography.sectionTitle),
                          Text('${_cases.length} Total Sessions', style: AppTypography.metadata),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.md),
                      Expanded(
                        child: SingleChildScrollView(
                          child: SizedBox(
                            width: double.infinity,
                            child: DataTable(
                              headingRowHeight: 40,
                              dataRowMaxHeight: 48,
                              dataRowMinHeight: 48,
                              columns: const [
                                DataColumn(label: Text('Case ID')),
                                DataColumn(label: Text('Title')),
                                DataColumn(label: Text('Category')),
                                DataColumn(label: Text('Status')),
                                DataColumn(label: Text('Created')),
                                DataColumn(label: Text('Duration')),
                              ],
                              rows: _cases.map((c) {
                                final isFinished = c['status'] == 'Completed';
                                final isFailed = c['status'] == 'Failed';
                                final statusColor = isFinished
                                    ? AppColors.textSecondary
                                    : isFailed
                                        ? AppColors.error
                                        : AppColors.success;

                                return DataRow(
                                  cells: [
                                    DataCell(Text(c['id'], style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w600))),
                                    DataCell(Text(c['title'], style: AppTypography.bodySmall)),
                                    DataCell(Text(c['category'], style: AppTypography.metadata)),
                                    DataCell(
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: statusColor.withValues(alpha: 0.1),
                                          borderRadius: AppSpacing.radiusXs,
                                        ),
                                        child: Text(
                                          c['status'],
                                          style: AppTypography.metadata.copyWith(
                                            color: statusColor,
                                            fontWeight: FontWeight.w700,
                                            fontSize: 10,
                                          ),
                                        ),
                                      ),
                                    ),
                                    DataCell(Text(c['created'], style: AppTypography.metadata)),
                                    DataCell(Text(c['duration'], style: AppTypography.metadata)),
                                  ],
                                );
                              }).toList(),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}