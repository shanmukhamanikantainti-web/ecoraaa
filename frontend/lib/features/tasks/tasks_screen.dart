import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../services/api_service.dart';
import '../../services/websocket_service.dart';

class TasksScreen extends StatefulWidget {
  const TasksScreen({super.key});

  @override
  State<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends State<TasksScreen> {
  late Future<Map<String, dynamic>> _tasksFuture;
  late StreamSubscription _wsSubscription;
  int _selectedTaskIndex = -1;

  @override
  void initState() {
    super.initState();
    _fetchTasks();
    _connectWebSocket();
  }

  void _fetchTasks() {
    setState(() {
      _tasksFuture = context.read<ApiService>().getMissions().then((missions) {
        return {'active': missions, 'completed': []};
      }).catchError((_) async {
        return {'active': [], 'completed': []};
      });
    });
  }

  void _connectWebSocket() {
    final wsService = context.read<WebSocketService>();
    _wsSubscription = wsService.messageStream.listen((message) {
      if (message.type.contains('TASK') || message.type.contains('AGENT') || message.type == 'mission_update') {
        if (mounted) {
          _fetchTasks();
        }
      }
    });
  }

  @override
  void dispose() {
    _wsSubscription.cancel();
    super.dispose();
  }

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
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Tasks', style: AppTypography.pageTitle),
                      const SizedBox(height: 4),
                      Text(
                        'Active missions, agent progress, and complete task history',
                        style: AppTypography.metadata,
                      ),
                    ],
                  ),
                  IconButton(
                    onPressed: _fetchTasks,
                    icon: const Icon(Icons.refresh),
                    tooltip: 'Refresh tasks',
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              Expanded(
                child: FutureBuilder<Map<String, dynamic>>(
                  future: _tasksFuture,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const Center(child: CircularProgressIndicator());
                    }

                    final activeMissions = (snapshot.data?['active'] as List? ?? []);
                    final completedMissions = (snapshot.data?['completed'] as List? ?? []);

                    if (activeMissions.isEmpty && completedMissions.isEmpty) {
                      return Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.assignment_outlined, size: 48, color: AppColors.textSecondary.withValues(alpha: 0.5)),
                            const SizedBox(height: 16),
                            Text('No active or historical tasks', style: AppTypography.sectionTitle),
                            const SizedBox(height: 8),
                            Text('Submit a request on the Main page to start a new task.', style: AppTypography.metadata),
                          ],
                        ),
                      );
                    }

                    return Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Task List & History Sidebar
                        Expanded(
                          flex: 1,
                          child: Container(
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: AppSpacing.radiusLg,
                              border: Border.all(color: AppColors.border),
                            ),
                            child: ListView(
                              padding: const EdgeInsets.all(AppSpacing.md),
                              children: [
                                Text('Active Tasks', style: AppTypography.sectionTitle.copyWith(fontSize: 14)),
                                const SizedBox(height: 8),
                                ...activeMissions.asMap().entries.map((entry) {
                                  final idx = entry.key;
                                  final task = entry.value;
                                  final isSelected = _selectedTaskIndex == idx;
                                  return GestureDetector(
                                    onTap: () => setState(() => _selectedTaskIndex = idx),
                                    child: Container(
                                      margin: const EdgeInsets.only(bottom: 8),
                                      padding: const EdgeInsets.all(12),
                                      decoration: BoxDecoration(
                                        color: isSelected ? AppColors.primary.withValues(alpha: 0.1) : AppColors.background,
                                        borderRadius: AppSpacing.radiusSm,
                                        border: Border.all(color: isSelected ? AppColors.primary : AppColors.border),
                                      ),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                            children: [
                                              Text('ID: ${task['id']}', style: AppTypography.metadata.copyWith(fontWeight: FontWeight.w600)),
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                                decoration: BoxDecoration(
                                                  color: AppColors.primary.withValues(alpha: 0.1),
                                                  borderRadius: AppSpacing.radiusXs,
                                                ),
                                                child: Text(
                                                  task['status'] ?? 'RUNNING',
                                                  style: AppTypography.metadata.copyWith(fontSize: 9, color: AppColors.primary, fontWeight: FontWeight.w600),
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            task['goal'] ?? 'Development Goal',
                                            style: AppTypography.bodySmall,
                                            maxLines: 2,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                }),
                                const Divider(height: 24),
                                Text('Task History', style: AppTypography.sectionTitle.copyWith(fontSize: 14)),
                                const SizedBox(height: 8),
                                ...completedMissions.asMap().entries.map((entry) {
                                  final idx = activeMissions.length + entry.key;
                                  final task = entry.value;
                                  final isSelected = _selectedTaskIndex == idx;
                                  return GestureDetector(
                                    onTap: () => setState(() => _selectedTaskIndex = idx),
                                    child: Container(
                                      margin: const EdgeInsets.only(bottom: 8),
                                      padding: const EdgeInsets.all(12),
                                      decoration: BoxDecoration(
                                        color: isSelected ? AppColors.primary.withValues(alpha: 0.1) : AppColors.background,
                                        borderRadius: AppSpacing.radiusSm,
                                        border: Border.all(color: isSelected ? AppColors.primary : AppColors.border),
                                      ),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text('ID: ${task['id']}', style: AppTypography.metadata),
                                          const SizedBox(height: 4),
                                          Text(
                                            task['goal'] ?? 'Completed Task',
                                            style: AppTypography.bodySmall,
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                }),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: AppSpacing.lg),

                        // Task Details Panel
                        Expanded(
                          flex: 2,
                          child: Container(
                            padding: const EdgeInsets.all(AppSpacing.lg),
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: AppSpacing.radiusLg,
                              border: Border.all(color: AppColors.border),
                            ),
                            child: _selectedTaskIndex >= 0 && _selectedTaskIndex < (activeMissions.length + completedMissions.length)
                                ? _buildTaskDetail(
                                    _selectedTaskIndex < activeMissions.length
                                        ? activeMissions[_selectedTaskIndex]
                                        : completedMissions[_selectedTaskIndex - activeMissions.length],
                                  )
                                : Center(
                                    child: Text(
                                      'Select a task from the list to view live agent activity and reports.',
                                      style: AppTypography.metadata,
                                    ),
                                  ),
                          ),
                        ),
                      ],
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

  Widget _buildTaskDetail(Map<String, dynamic> task) {
    final steps = (task['steps'] as List? ?? []);
    final result = task['result'] as String?;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Task Details: ${task['id']}', style: AppTypography.sectionTitle),
        const SizedBox(height: 8),
        Text('Goal: ${task['goal']}', style: AppTypography.body),
        const SizedBox(height: 16),
        Text('Agent Pipeline Steps:', style: AppTypography.metadata.copyWith(fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        Expanded(
          child: ListView.builder(
            itemCount: steps.length,
            itemBuilder: (context, idx) {
              final step = steps[idx];
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: AppSpacing.radiusSm,
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle_outline, size: 18, color: AppColors.success),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(step['name'] ?? '', style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w600)),
                          if (step['agent'] != null)
                            Text('Agent: ${step['agent']} | Tool: ${step['tool'] ?? 'N/A'}', style: AppTypography.metadata),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
        if (result != null) ...[
          const Divider(height: 24),
          Text('Final Result:', style: AppTypography.metadata.copyWith(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(12),
            width: double.infinity,
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: AppSpacing.radiusSm,
              border: Border.all(color: AppColors.border),
            ),
            child: Text(result, style: AppTypography.bodySmall),
          ),
        ],
      ],
    );
  }
}
