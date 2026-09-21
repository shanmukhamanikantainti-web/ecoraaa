import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../app/theme/app_colors.dart';
import '../app/theme/app_typography.dart';
import '../app/theme/app_spacing.dart';
import '../widgets/glass_container.dart';

class CommandPaletteOverlay extends StatefulWidget {
  final VoidCallback onClose;

  const CommandPaletteOverlay({super.key, required this.onClose});

  @override
  State<CommandPaletteOverlay> createState() => _CommandPaletteOverlayState();
}

class _CommandPaletteOverlayState extends State<CommandPaletteOverlay> {
  final TextEditingController _searchController = TextEditingController();
  String _query = '';

  final List<Map<String, dynamic>> _commands = [
    {'icon': Icons.adjust, 'label': 'Command Center', 'route': '/command', 'shortcut': 'G C'},
    {'icon': Icons.chat_bubble_outline, 'label': 'AI Assistant', 'route': '/assistant', 'shortcut': 'G A'},
    {'icon': Icons.dashboard_outlined, 'label': 'Workspaces', 'route': '/workspaces', 'shortcut': 'G W'},
    {'icon': Icons.folder_outlined, 'label': 'Files', 'route': '/files', 'shortcut': 'G F'},
    {'icon': Icons.terminal_outlined, 'label': 'Console', 'route': '/console', 'shortcut': 'G T'},
    {'icon': Icons.smartphone_outlined, 'label': 'Screen Mirror', 'route': '/screen', 'shortcut': 'G S'},
    {'icon': Icons.assignment_outlined, 'label': 'Cases', 'route': '/cases', 'shortcut': 'G C'},
    {'icon': Icons.psychology_outlined, 'label': 'Memory', 'route': '/memory', 'shortcut': 'G M'},
    {'icon': Icons.settings_outlined, 'label': 'Settings', 'route': '/settings', 'shortcut': 'G SET'},
    {'icon': Icons.help_outline, 'label': 'Help', 'route': '/help', 'shortcut': 'G H'},
  ];

  @override
  Widget build(BuildContext context) {
    final filteredCommands = _commands.where((cmd) {
      return (cmd['label'] as String).toLowerCase().contains(_query.toLowerCase());
    }).toList();

    return GestureDetector(
      onTap: widget.onClose,
      child: Material(
        color: Colors.black.withValues(alpha: 0.3),
        child: Center(
          child: GestureDetector(
            onTap: () {}, // Prevent tap through
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 580, maxHeight: 440),
              child: EcoraaGlassContainer(
                blur: 20,
                color: AppColors.background.withValues(alpha: 0.95),
                borderRadius: AppSpacing.radiusXl,
                border: Border.all(color: AppColors.border, width: 1.5),
                child: Column(
                  children: [
                    // Search input
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: TextField(
                        controller: _searchController,
                        autofocus: true,
                        style: AppTypography.body.copyWith(fontSize: 16),
                        onChanged: (val) => setState(() => _query = val),
                        decoration: InputDecoration(
                          hintText: 'What would you like to search or execute? (Ctrl + Space)',
                          prefixIcon: Icon(Icons.search, color: AppColors.primary),
                          border: InputBorder.none,
                          enabledBorder: InputBorder.none,
                          focusedBorder: InputBorder.none,
                          filled: false,
                        ),
                      ),
                    ),
                    const Divider(height: 1),
                    // Commands list
                    Expanded(
                      child: ListView.builder(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        itemCount: filteredCommands.length,
                        itemBuilder: (context, index) {
                          final cmd = filteredCommands[index];
                          return InkWell(
                            onTap: () {
                              widget.onClose();
                              context.go(cmd['route']);
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                              child: Row(
                                children: [
                                  Icon(cmd['icon'], size: 18, color: AppColors.primary),
                                  const SizedBox(width: 14),
                                  Expanded(
                                    child: Text(
                                      cmd['label'],
                                      style: AppTypography.body.copyWith(
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: AppColors.surface,
                                      borderRadius: AppSpacing.radiusXs,
                                      border: Border.all(color: AppColors.border),
                                    ),
                                    child: Text(
                                      cmd['shortcut'],
                                      style: AppTypography.metadata.copyWith(fontSize: 10),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    // Footer hint
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: AppColors.surface.withValues(alpha: 0.5),
                        border: Border(top: BorderSide(color: AppColors.border)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Navigate with arrow keys • Enter to select', style: AppTypography.metadata),
                          Text('ESC to close', style: AppTypography.metadata),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
