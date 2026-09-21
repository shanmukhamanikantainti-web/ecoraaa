import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../widgets/glass_container.dart';

class FilesScreen extends StatefulWidget {
  const FilesScreen({super.key});

  @override
  State<FilesScreen> createState() => _FilesScreenState();
}

class _FilesScreenState extends State<FilesScreen> {
  final String _currentDirectory = '/sdcard/Projects/PEGASUS';
  int? _selectedFileIndex = 2; // Default selected 'src'

  final List<Map<String, dynamic>> _fileItems = [
    {'name': 'app', 'size': '--', 'modified': 'May 10, 2024', 'type': 'Folder', 'isFolder': true},
    {'name': 'build', 'size': '--', 'modified': 'May 10, 2024', 'type': 'Folder', 'isFolder': true},
    {'name': 'src', 'size': '--', 'modified': 'May 10, 2024', 'type': 'Folder', 'isFolder': true},
    {'name': 'docs', 'size': '--', 'modified': 'May 10, 2024', 'type': 'Folder', 'isFolder': true},
    {'name': '.gitignore', 'size': '1.2 KB', 'modified': 'May 10, 2024', 'type': 'Text File', 'isFolder': false},
    {'name': 'build.gradle', 'size': '3.4 KB', 'modified': 'May 09, 2024', 'type': 'Gradle File', 'isFolder': false},
    {'name': 'README.md', 'size': '4.8 KB', 'modified': 'May 08, 2024', 'type': 'Markdown', 'isFolder': false},
    {'name': 'requirements.txt', 'size': '1.1 KB', 'modified': 'May 08, 2024', 'type': 'Text File', 'isFolder': false},
  ];

  @override
  Widget build(BuildContext context) {
    final selectedItem = _selectedFileIndex != null ? _fileItems[_selectedFileIndex!] : null;

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
                      Text('Files & Storage', style: AppTypography.pageTitle),
                      const SizedBox(height: 4),
                      Text(
                        'Browse and manage files on your PEGASUS device',
                        style: AppTypography.metadata,
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      OutlinedButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.upload_file, size: 16),
                        label: const Text('Upload'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.textPrimary,
                          side: const BorderSide(color: AppColors.border),
                          shape: RoundedRectangleBorder(borderRadius: AppSpacing.radiusSm),
                        ),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.sync, size: 16),
                        label: const Text('Sync Storage'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: AppSpacing.radiusSm),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              // File Explorer Layout
              Expanded(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Directory Tree Navigator
                    Expanded(
                      flex: 1,
                      child: EcoraaGlassContainer(
                        padding: const EdgeInsets.all(AppSpacing.md),
                        borderRadius: AppSpacing.radiusLg,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('PEGASUS Device', style: AppTypography.metadata.copyWith(fontWeight: FontWeight.w700)),
                            const SizedBox(height: AppSpacing.md),
                            _TreeFolderItem(icon: Icons.folder_special_outlined, label: 'Projects', isSelected: true),
                            _TreeFolderItem(icon: Icons.description_outlined, label: 'Documents', isSelected: false),
                            _TreeFolderItem(icon: Icons.download_outlined, label: 'Downloads', isSelected: false),
                            _TreeFolderItem(icon: Icons.photo_camera_outlined, label: 'DCIM', isSelected: false),
                            _TreeFolderItem(icon: Icons.music_note_outlined, label: 'Music', isSelected: false),
                            _TreeFolderItem(icon: Icons.movie_outlined, label: 'Videos', isSelected: false),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.lg),

                    // File Table View
                    Expanded(
                      flex: 3,
                      child: EcoraaGlassContainer(
                        borderRadius: AppSpacing.radiusLg,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Breadcrumb Bar
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 10),
                              decoration: BoxDecoration(
                                border: Border(bottom: BorderSide(color: AppColors.glassBorder)),
                              ),
                              child: Row(
                                children: [
                                  Icon(Icons.folder_outlined, size: 16, color: AppColors.textSecondary),
                                  const SizedBox(width: 8),
                                  Text(_currentDirectory, style: AppTypography.metadata.copyWith(color: AppColors.textPrimary)),
                                ],
                              ),
                            ),

                            // Table View
                            Expanded(
                              child: SingleChildScrollView(
                                child: DataTable(
                                  showCheckboxColumn: false,
                                  headingRowHeight: 36,
                                  dataRowMaxHeight: 42,
                                  dataRowMinHeight: 42,
                                  columns: const [
                                    DataColumn(label: Text('Name')),
                                    DataColumn(label: Text('Size')),
                                    DataColumn(label: Text('Modified')),
                                    DataColumn(label: Text('Type')),
                                  ],
                                  rows: _fileItems.asMap().entries.map((entry) {
                                    final idx = entry.key;
                                    final item = entry.value;
                                    final isSelected = _selectedFileIndex == idx;

                                    return DataRow(
                                      selected: isSelected,
                                      onSelectChanged: (_) => setState(() => _selectedFileIndex = idx),
                                      color: WidgetStateProperty.resolveWith<Color?>((states) {
                                        if (isSelected) return AppColors.primary.withValues(alpha: 0.08);
                                        return null;
                                      }),
                                      cells: [
                                        DataCell(
                                          Row(
                                            children: [
                                              Icon(
                                                item['isFolder'] ? Icons.folder : Icons.insert_drive_file_outlined,
                                                size: 16,
                                                color: item['isFolder'] ? AppColors.primary : AppColors.textSecondary,
                                              ),
                                              const SizedBox(width: 8),
                                              Text(item['name'], style: AppTypography.bodySmall),
                                            ],
                                          ),
                                        ),
                                        DataCell(Text(item['size'], style: AppTypography.metadata)),
                                        DataCell(Text(item['modified'], style: AppTypography.metadata)),
                                        DataCell(Text(item['type'], style: AppTypography.metadata)),
                                      ],
                                    );
                                  }).toList(),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.lg),

                    // File Details Inspector Panel
                    Expanded(
                      flex: 1,
                      child: EcoraaGlassContainer(
                        padding: const EdgeInsets.all(AppSpacing.lg),
                        borderRadius: AppSpacing.radiusLg,
                        child: selectedItem != null
                            ? Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Icon(
                                    selectedItem['isFolder'] ? Icons.folder : Icons.insert_drive_file_outlined,
                                    size: 40,
                                    color: AppColors.primary,
                                  ),
                                  const SizedBox(height: 12),
                                  Text(selectedItem['name'], style: AppTypography.sectionTitle),
                                  Text(selectedItem['type'], style: AppTypography.metadata),
                                  const SizedBox(height: 16),
                                  const Divider(),
                                  const SizedBox(height: 16),
                                  Text('Location:', style: AppTypography.metadata),
                                  Text('$_currentDirectory/${selectedItem['name']}', style: AppTypography.bodySmall.copyWith(fontSize: 11)),
                                  const SizedBox(height: 12),
                                  Text('Size:', style: AppTypography.metadata),
                                  Text(selectedItem['size'], style: AppTypography.bodySmall),
                                  const SizedBox(height: 12),
                                  Text('Modified:', style: AppTypography.metadata),
                                  Text(selectedItem['modified'], style: AppTypography.bodySmall),
                                  const Spacer(),
                                  ElevatedButton(
                                    onPressed: () {},
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: AppColors.primary,
                                      foregroundColor: Colors.white,
                                      minimumSize: const Size.fromHeight(38),
                                      elevation: 0,
                                      shape: RoundedRectangleBorder(borderRadius: AppSpacing.radiusSm),
                                    ),
                                    child: const Text('Open'),
                                  ),
                                ],
                              )
                            : Center(
                                child: Text('Select a file to inspect details', style: AppTypography.metadata),
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

class _TreeFolderItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isSelected;

  const _TreeFolderItem({
    required this.icon,
    required this.label,
    required this.isSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected ? AppColors.primary.withValues(alpha: 0.1) : Colors.transparent,
        borderRadius: AppSpacing.radiusSm,
      ),
      child: Row(
        children: [
          Icon(icon, size: 16, color: isSelected ? AppColors.primary : AppColors.textSecondary),
          const SizedBox(width: 8),
          Text(
            label,
            style: AppTypography.bodySmall.copyWith(
              color: isSelected ? AppColors.primary : AppColors.textPrimary,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
            ),
          ),
        ],
      ),
    );
  }
}