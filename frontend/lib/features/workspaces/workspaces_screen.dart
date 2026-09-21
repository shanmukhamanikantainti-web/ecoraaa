import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';

class WorkspacesScreen extends StatefulWidget {
  const WorkspacesScreen({super.key});

  @override
  State<WorkspacesScreen> createState() => _WorkspacesScreenState();
}

class _WorkspacesScreenState extends State<WorkspacesScreen> {
  int _activeWorkspaceIndex = 0;

  final List<Map<String, dynamic>> _workspaces = [
    {
      'id': 'ws-1',
      'name': 'Workspace 1 — Core OS',
      'path': 'C:/Users/shanm/OneDrive/Desktop/pro.vscode/pegasus',
      'activeFiles': 12,
      'status': 'Active',
      'lastSync': '2 mins ago',
      'agents': ['Orchestrator', 'Coding Agent'],
    },
    {
      'id': 'ws-2',
      'name': 'Workspace 2 — Flutter ECORAA',
      'path': 'C:/Users/shanm/OneDrive/Desktop/pro.vscode/pegasus/frontend',
      'activeFiles': 24,
      'status': 'Ready',
      'lastSync': '15 mins ago',
      'agents': ['UI Architect'],
    },
    {
      'id': 'ws-3',
      'name': 'Workspace 3 — Python Services',
      'path': 'C:/Users/shanm/OneDrive/Desktop/pro.vscode/pegasus/backend',
      'activeFiles': 8,
      'status': 'Idle',
      'lastSync': '1 hour ago',
      'agents': [],
    },
    {
      'id': 'ws-4',
      'name': 'Workspace 4 — Research Notes',
      'path': 'C:/Users/shanm/OneDrive/Desktop/pro.vscode/pegasus/docs',
      'activeFiles': 5,
      'status': 'Idle',
      'lastSync': '3 hours ago',
      'agents': [],
    },
  ];

  @override
  Widget build(BuildContext context) {
    final activeWs = _workspaces[_activeWorkspaceIndex];

    return Scaffold(
      backgroundColor: AppColors.background,
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
                      Text('Workspaces', style: AppTypography.pageTitle),
                      const SizedBox(height: 4),
                      Text(
                        'Isolated project contexts and execution environments',
                        style: AppTypography.metadata,
                      ),
                    ],
                  ),
                  ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.add, size: 16),
                    label: const Text('New Workspace'),
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

              // Workspaces Grid & Active Workspace Detail
              Expanded(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Workspaces List Cards
                    Expanded(
                      flex: 2,
                      child: ListView.builder(
                        itemCount: _workspaces.length,
                        itemBuilder: (context, index) {
                          final ws = _workspaces[index];
                          final isSelected = index == _activeWorkspaceIndex;
                          return GestureDetector(
                            onTap: () => setState(() => _activeWorkspaceIndex = index),
                            child: Container(
                              margin: const EdgeInsets.only(bottom: AppSpacing.md),
                              padding: const EdgeInsets.all(AppSpacing.lg),
                              decoration: BoxDecoration(
                                color: isSelected ? AppColors.primary.withValues(alpha: 0.06) : AppColors.surface,
                                borderRadius: AppSpacing.radiusLg,
                                border: Border.all(
                                  color: isSelected ? AppColors.primary : AppColors.border,
                                  width: isSelected ? 1.5 : 1.0,
                                ),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        ws['name'],
                                        style: AppTypography.sectionTitle.copyWith(
                                          color: isSelected ? AppColors.primary : AppColors.textPrimary,
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: ws['status'] == 'Active' ? AppColors.success.withValues(alpha: 0.1) : AppColors.background,
                                          borderRadius: AppSpacing.radiusXs,
                                          border: Border.all(
                                            color: ws['status'] == 'Active' ? AppColors.success : AppColors.border,
                                          ),
                                        ),
                                        child: Text(
                                          ws['status'],
                                          style: AppTypography.metadata.copyWith(
                                            fontSize: 10,
                                            color: ws['status'] == 'Active' ? AppColors.success : AppColors.textSecondary,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    ws['path'],
                                    style: AppTypography.metadata.copyWith(fontSize: 11),
                                  ),
                                  const SizedBox(height: 12),
                                  Row(
                                    children: [
                                      Icon(Icons.insert_drive_file_outlined, size: 14, color: AppColors.textSecondary),
                                      const SizedBox(width: 4),
                                      Text('${ws['activeFiles']} active files', style: AppTypography.metadata),
                                      const SizedBox(width: 16),
                                      Icon(Icons.sync, size: 14, color: AppColors.textSecondary),
                                      const SizedBox(width: 4),
                                      Text('Synced ${ws['lastSync']}', style: AppTypography.metadata),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(width: AppSpacing.lg),

                    // Active Workspace Inspector Panel
                    Expanded(
                      flex: 1,
                      child: Container(
                        padding: const EdgeInsets.all(AppSpacing.lg),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: AppSpacing.radiusLg,
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Workspace Context', style: AppTypography.sectionTitle),
                            const SizedBox(height: AppSpacing.md),
                            Text(
                              activeWs['name'],
                              style: AppTypography.body.copyWith(fontWeight: FontWeight.w700),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              activeWs['path'],
                              style: AppTypography.metadata.copyWith(fontSize: 10),
                            ),
                            const SizedBox(height: 16),
                            const Divider(),
                            const SizedBox(height: 16),
                            Text('Assigned AI Agents', style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w600)),
                            const SizedBox(height: 8),
                            if ((activeWs['agents'] as List).isEmpty)
                              Text('No agents assigned', style: AppTypography.metadata)
                            else
                              ...(activeWs['agents'] as List).map((agent) => Padding(
                                    padding: const EdgeInsets.only(bottom: 6),
                                    child: Row(
                                      children: [
                                        const Icon(Icons.memory_outlined, size: 14, color: AppColors.primary),
                                        const SizedBox(width: 6),
                                        Text(agent, style: AppTypography.bodySmall),
                                      ],
                                    ),
                                  )),
                            const Spacer(),
                            OutlinedButton.icon(
                              onPressed: () {},
                              icon: const Icon(Icons.swap_horiz, size: 16),
                              label: const Text('Switch Context'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: AppColors.primary,
                                side: const BorderSide(color: AppColors.primary),
                                minimumSize: const Size.fromHeight(40),
                                shape: RoundedRectangleBorder(borderRadius: AppSpacing.radiusSm),
                              ),
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