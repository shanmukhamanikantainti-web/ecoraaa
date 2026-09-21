import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../services/api_service.dart';
import '../../widgets/glass_container.dart';

class WorkspacesScreen extends StatefulWidget {
  const WorkspacesScreen({super.key});

  @override
  State<WorkspacesScreen> createState() => _WorkspacesScreenState();
}

class _WorkspacesScreenState extends State<WorkspacesScreen> {
  late Future<Map<String, dynamic>> _workspaceFuture;
  final TextEditingController _pathController = TextEditingController();
  bool _isUpdating = false;

  @override
  void initState() {
    super.initState();
    _refreshWorkspace();
  }

  void _refreshWorkspace() {
    setState(() {
      _workspaceFuture = context.read<ApiService>().getWorkspace();
    });
  }

  Future<void> _updateWorkspace(String path) async {
    if (path.isEmpty) return;

    setState(() {
      _isUpdating = true;
    });

    try {
      final result = await context.read<ApiService>().setWorkspace(path);
      if (result['status'] == 'success') {
        _refreshWorkspace();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Workspace updated successfully')),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error: ${result['message']}')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error updating workspace: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isUpdating = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _pathController.dispose();
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
                      Text('Workspaces', style: AppTypography.pageTitle),
                      const SizedBox(height: 4),
                      Text(
                        'Isolated project contexts and execution environments',
                        style: AppTypography.metadata,
                      ),
                    ],
                  ),
                  IconButton(
                    onPressed: _refreshWorkspace,
                    icon: const Icon(Icons.refresh),
                    tooltip: 'Refresh',
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              Expanded(
                child: FutureBuilder<Map<String, dynamic>>(
                  future: _workspaceFuture,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const Center(child: CircularProgressIndicator());
                    }

                    if (snapshot.hasError) {
                      return Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.error_outline, size: 48, color: AppColors.error),
                            const SizedBox(height: 16),
                            Text('Failed to load workspace', style: AppTypography.sectionTitle),
                            const SizedBox(height: 8),
                            Text(snapshot.error.toString(), style: AppTypography.metadata),
                            const SizedBox(height: 24),
                            ElevatedButton(
                              onPressed: _refreshWorkspace,
                              child: const Text('Retry'),
                            ),
                          ],
                        ),
                      );
                    }

                    final workspace = snapshot.data!;
                    final String path = workspace['path'] ?? 'No workspace selected';
                    final String name = workspace['name'] ?? 'Unknown';
                    final bool isValid = workspace['valid'] ?? false;

                    if (_pathController.text.isEmpty && path != 'No workspace selected') {
                      _pathController.text = path;
                    }

                    return Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Main Workspace Panel
                        Expanded(
                          flex: 2,
                          child: EcoraaGlassContainer(
                            padding: const EdgeInsets.all(AppSpacing.lg),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text('Active Workspace', style: AppTypography.sectionTitle),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: isValid ? AppColors.success.withValues(alpha: 0.1) : AppColors.error.withValues(alpha: 0.1),
                                        borderRadius: AppSpacing.radiusXs,
                                        border: Border.all(
                                          color: isValid ? AppColors.success : AppColors.error,
                                        ),
                                      ),
                                      child: Text(
                                        isValid ? 'Valid' : 'Invalid',
                                        style: AppTypography.metadata.copyWith(
                                          fontSize: 10,
                                          color: isValid ? AppColors.success : AppColors.error,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: AppSpacing.xl),
                                Text(
                                  'Current Path:',
                                  style: AppTypography.metadata.copyWith(fontWeight: FontWeight.w600),
                                ),
                                const SizedBox(height: 8),
                                Container(
                                  padding: const EdgeInsets.all(AppSpacing.md),
                                  width: double.infinity,
                                  decoration: BoxDecoration(
                                    color: AppColors.background,
                                    borderRadius: AppSpacing.radiusSm,
                                    border: Border.all(color: AppColors.border),
                                  ),
                                  child: Text(
                                    path,
                                    style: AppTypography.body.copyWith(fontFamily: 'monospace'),
                                  ),
                                ),
                                const SizedBox(height: AppSpacing.xl),
                                Text(
                                  'Change Workspace Path:',
                                  style: AppTypography.metadata.copyWith(fontWeight: FontWeight.w600),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    Expanded(
                                      child: TextField(
                                        controller: _pathController,
                                        decoration: InputDecoration(
                                          hintText: 'Enter absolute path...',
                                          contentPadding: const EdgeInsets.symmetric(horizontal: 12),
                                          border: OutlineInputBorder(
                                            borderRadius: AppSpacing.radiusSm,
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    ElevatedButton(
                                      onPressed: _isUpdating ? null : () => _updateWorkspace(_pathController.text),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: AppColors.primary,
                                        foregroundColor: Colors.white,
                                        minimumSize: const Size(100, 48),
                                        shape: RoundedRectangleBorder(borderRadius: AppSpacing.radiusSm),
                                      ),
                                      child: _isUpdating
                                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                                        : const Text('Update'),
                                    ),
                                  ],
                                ),
                                const Spacer(),
                                Text(
                                  'All agent operations, including file access and terminal commands, will be restricted to this directory for safety.',
                                  style: AppTypography.metadata.copyWith(fontStyle: FontStyle.italic),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: AppSpacing.lg),

                        // Info Panel
                        Expanded(
                          flex: 1,
                          child: EcoraaGlassContainer(
                            padding: const EdgeInsets.all(AppSpacing.lg),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Workspace Details', style: AppTypography.sectionTitle),
                                const SizedBox(height: AppSpacing.lg),
                                _InfoRow(label: 'Name', value: name),
                                const Divider(height: 32),
                                _InfoRow(label: 'Status', value: isValid ? 'Active' : 'Missing'),
                                const Divider(height: 32),
                                _InfoRow(label: 'Platform', value: 'Windows'),
                                const Spacer(),
                                Container(
                                  padding: const EdgeInsets.all(AppSpacing.md),
                                  decoration: BoxDecoration(
                                    color: AppColors.primary.withValues(alpha: 0.05),
                                    borderRadius: AppSpacing.radiusMd,
                                    border: Border.all(color: AppColors.primary.withValues(alpha: 0.2)),
                                  ),
                                  child: Column(
                                    children: [
                                      const Icon(Icons.info_outline, color: AppColors.primary),
                                      const SizedBox(height: 8),
                                      Text(
                                        'Changing the workspace will interrupt any running tasks and clear the current context.',
                                        style: AppTypography.metadata.copyWith(color: AppColors.textPrimary),
                                        textAlign: TextAlign.center,
                                      ),
                                    ],
                                  ),
                                ),
                              ],
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
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;

  const _InfoRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppTypography.metadata),
        const SizedBox(height: 4),
        Text(value, style: AppTypography.body.copyWith(fontWeight: FontWeight.w600)),
      ],
    );
  }
}