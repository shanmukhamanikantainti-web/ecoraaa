import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../widgets/glass_container.dart';

class ConsoleScreen extends StatefulWidget {
  const ConsoleScreen({super.key});

  @override
  State<ConsoleScreen> createState() => _ConsoleScreenState();
}

class _ConsoleScreenState extends State<ConsoleScreen> {
  final TextEditingController _commandController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  final List<String> _consoleLogs = [
    'PEGASUS Console v1.0.0 (ECORAA Engine)',
    'Type \'help\' for available commands.',
    '',
    'pegasus@device:~\$ adb devices',
    'List of devices attached',
    'PEGASUS-001      device',
    '',
    'pegasus@device:~\$ pegasus status',
    'Device         : Online',
    'USB            : Mounted',
    'AI             : Ready',
    'Mirror         : Ready',
    'Storage        : 142.0 / 256 GB',
    'Battery        : 82%',
    'Uptime         : 2 days, 14 hours',
    'pegasus@device:~\$'
  ];

  final List<Map<String, String>> _systemLogs = [
    {'time': '15:09:42', 'level': 'INFO', 'msg': 'Screen mirror connected successfully'},
    {'time': '15:09:30', 'level': 'SUCCESS', 'msg': 'AI memory synchronized (24 new items indexed)'},
    {'time': '15:09:24', 'level': 'INFO', 'msg': 'USB sync completed (142 files)'},
    {'time': '15:08:55', 'level': 'WARNING', 'msg': 'High memory usage detected (78%)'},
    {'time': '15:08:41', 'level': 'INFO', 'msg': 'ADB session authenticated'},
  ];

  void _runCommand() {
    final cmd = _commandController.text.trim();
    if (cmd.isEmpty) return;

    setState(() {
      _consoleLogs.add('pegasus@device:~\$ $cmd');
      if (cmd == 'help') {
        _consoleLogs.add('Available commands: adb devices, pegasus status, clear, logcat, dumpsys');
      } else if (cmd == 'clear') {
        _consoleLogs.clear();
      } else {
        _consoleLogs.add('Executed: $cmd\nCommand completed successfully.');
      }
      _consoleLogs.add('pegasus@device:~\$');
      _commandController.clear();
    });

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 200),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _commandController.dispose();
    _scrollController.dispose();
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
                      Text('Console Shell', style: AppTypography.pageTitle),
                      const SizedBox(height: 4),
                      Text(
                        'Run terminal commands, view system logs, and monitor execution',
                        style: AppTypography.metadata,
                      ),
                    ],
                  ),
                  OutlinedButton.icon(
                    onPressed: () => setState(() => _consoleLogs.clear()),
                    icon: const Icon(Icons.clear_all, size: 16),
                    label: const Text('Clear Output'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.textPrimary,
                      side: const BorderSide(color: AppColors.border),
                      shape: RoundedRectangleBorder(borderRadius: AppSpacing.radiusSm),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              // Interactive Terminal Display Box
              Expanded(
                flex: 3,
                child: EcoraaGlassContainer(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppSpacing.md),
                  borderRadius: AppSpacing.radiusLg,
                  child: ListView.builder(
                    controller: _scrollController,
                    itemCount: _consoleLogs.length,
                    itemBuilder: (context, index) {
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 2),
                        child: Text(
                          _consoleLogs[index],
                          style: AppTypography.terminal.copyWith(
                            color: const Color(0xFF38BDF8),
                            fontSize: 12,
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.md),

              // Command Input Prompt
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _commandController,
                      style: AppTypography.terminal.copyWith(fontSize: 13),
                      decoration: InputDecoration(
                        hintText: 'Type command... (e.g. adb devices, pegasus status)',
                        hintStyle: AppTypography.terminal.copyWith(color: AppColors.textSecondary, fontSize: 13),
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
                      onSubmitted: (_) => _runCommand(),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  ElevatedButton(
                    onPressed: _runCommand,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: AppSpacing.radiusSm),
                    ),
                    child: const Text('Run'),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              // System Logs Section
              Expanded(
                flex: 2,
                child: EcoraaGlassContainer(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  borderRadius: AppSpacing.radiusLg,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('System Events & Diagnostics', style: AppTypography.sectionTitle),
                      const SizedBox(height: AppSpacing.md),
                      Expanded(
                        child: ListView.builder(
                          itemCount: _systemLogs.length,
                          itemBuilder: (context, index) {
                            final log = _systemLogs[index];
                            final level = log['level']!;
                            Color badgeColor;
                            if (level == 'SUCCESS') {
                              badgeColor = AppColors.success;
                            } else if (level == 'WARNING') {
                              badgeColor = AppColors.warning;
                            } else {
                              badgeColor = AppColors.primary;
                            }

                            return Container(
                              margin: const EdgeInsets.only(bottom: 6),
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                border: Border(bottom: BorderSide(color: AppColors.glassBorder)),
                              ),
                              child: Row(
                                children: [
                                  Text(log['time']!, style: AppTypography.metadata.copyWith(fontSize: 11)),
                                  const SizedBox(width: 12),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: badgeColor.withValues(alpha: 0.1),
                                      borderRadius: AppSpacing.radiusXs,
                                    ),
                                    child: Text(
                                      level,
                                      style: AppTypography.metadata.copyWith(
                                        fontSize: 10,
                                        color: badgeColor,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Text(
                                      log['msg']!,
                                      style: AppTypography.bodySmall,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                            );
                          },
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