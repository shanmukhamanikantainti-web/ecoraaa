import 'package:flutter/material.dart' hide ConnectionState;
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../features/connection/connection_bloc.dart';
import '../../features/connection/connection_state.dart';
import '../../features/command_center/command_center_bloc.dart';
import '../../features/command_center/command_center_event.dart';
import '../../features/command_center/command_center_state.dart';
import '../../widgets/ecoraa_symbol.dart';
import '../../widgets/glass_container.dart';

class CommandCenterScreen extends StatelessWidget {
  const CommandCenterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SafeArea(
        child: MultiBlocListener(
          listeners: [
            BlocListener<ConnectionBloc, ConnectionState>(
              listener: (context, state) {},
            ),
          ],
          child: _CommandCenterContent(),
        ),
      ),
    );
  }
}

class _CommandCenterContent extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.pagePadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Section
          _HeaderSection(),

          const SizedBox(height: AppSpacing.xl),

          // Main Command Input
          _MainCommandInput(),

          const SizedBox(height: AppSpacing.lg),

          // Status Bar - Device Connection + Current Task
          _StatusBar(),

          const SizedBox(height: AppSpacing.lg),

          // Active Work / Recent Missions (Progressive Disclosure)
          Expanded(
            child: _ActiveWorkSection(),
          ),

          // Navigation hint (minimal)
          _NavigationHint(),
        ],
      ),
    );
  }
}

class _HeaderSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const EcoraaSymbol(size: 32),
        const SizedBox(width: AppSpacing.md),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Good ${_getTimeOfDayGreeting()}.',
              style: AppTypography.pageTitle.copyWith(
                fontSize: 24,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 4),
            BlocBuilder<ConnectionBloc, ConnectionState>(
              builder: (context, state) {
                return Row(
                  children: [
                    _ConnectionIndicator(state: state),
                    const SizedBox(width: AppSpacing.sm),
                    Text(
                      _getConnectionText(state),
                      style: AppTypography.metadata.copyWith(
                        color: _getConnectionColor(state),
                      ),
                    ),
                  ],
                );
              },
            ),
          ],
        ),
        const Spacer(),
        // Quick time/date
        Text(
          _getFormattedDate(),
          style: AppTypography.metadata,
        ),
      ],
    );
  }

  String _getTimeOfDayGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  String _getFormattedDate() {
    return DateFormat('EEEE, MMMM d').format(DateTime.now());
  }

  String _getConnectionText(ConnectionState state) {
    if (state is ConnectionConnected) return 'Backend connected';
    if (state is ConnectionConnecting) return 'Connecting to backend...';
    if (state is ConnectionFailed) return 'Connection failed';
    return 'Backend disconnected';
  }

  Color _getConnectionColor(ConnectionState state) {
    if (state is ConnectionConnected) return AppColors.success;
    if (state is ConnectionConnecting) return AppColors.warning;
    if (state is ConnectionFailed) return AppColors.error;
    return AppColors.textSecondary;
  }
}

class _ConnectionIndicator extends StatelessWidget {
  final ConnectionState state;

  const _ConnectionIndicator({required this.state});

  @override
  Widget build(BuildContext context) {
    Color color;
    bool pulsing = false;

    if (state is ConnectionConnected) {
      color = AppColors.success;
    } else if (state is ConnectionConnecting) {
      color = AppColors.warning;
      pulsing = true;
    } else if (state is ConnectionFailed) {
      color = AppColors.error;
    } else {
      color = AppColors.textSecondary;
    }

    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      width: 8,
      height: 8,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        boxShadow: pulsing
            ? [
                BoxShadow(
                  color: color.withValues(alpha: 0.6),
                  blurRadius: 8,
                  spreadRadius: 2,
                ),
              ]
            : null,
      ),
    );
  }
}

class _MainCommandInput extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CommandCenterBloc, CommandCenterState>(
      builder: (context, state) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Main Question
            Text(
              'What would you like to accomplish?',
              style: AppTypography.pageTitle.copyWith(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
              textAlign: TextAlign.left,
            ),
            const SizedBox(height: AppSpacing.md),

            // Command Input Field
            _CommandInputField(state: state),

            // Error display
            if (state.error != null) ...[
              const SizedBox(height: AppSpacing.sm),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.md,
                  vertical: AppSpacing.sm,
                ),
                decoration: BoxDecoration(
                  color: AppColors.error.withValues(alpha: 0.08),
                  borderRadius: AppSpacing.radiusSm,
                  border: Border.all(color: AppColors.error.withValues(alpha: 0.3)),
                ),
                child: Row(
                  children: [
                    Icon(Icons.error_outline, size: 16, color: AppColors.error),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: Text(
                        state.error!,
                        style: AppTypography.bodySmall.copyWith(color: AppColors.error),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        );
      },
    );
  }
}

class _CommandInputField extends StatefulWidget {
  final CommandCenterState state;

  const _CommandInputField({required this.state});

  @override
  State<_CommandInputField> createState() => _CommandInputFieldState();
}

class _CommandInputFieldState extends State<_CommandInputField> {
  late TextEditingController _controller;
  bool _isHovered = false;
  bool _isFocused = false;
  final FocusNode _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.state.input);
    _focusNode.addListener(() {
      setState(() => _isFocused = _focusNode.hasFocus);
    });
  }

  @override
  void didUpdateWidget(covariant _CommandInputField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.state.input != widget.state.input) {
      _controller.text = widget.state.input;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isProcessing = widget.state.isProcessing;

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: EcoraaGlassContainer(
        borderRadius: AppSpacing.radiusLg,
        border: Border.all(
            color: _isFocused
                ? AppColors.primary
                : (_isHovered ? AppColors.primary.withValues(alpha: 0.5) : AppColors.border),
            width: _isFocused ? 2 : 1.5,
        ),
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: _controller,
                focusNode: _focusNode,
                style: AppTypography.body.copyWith(fontSize: 15),
                decoration: InputDecoration(
                  hintText: 'Ask ECORAA...',
                  hintStyle: AppTypography.body.copyWith(color: AppColors.textSecondary),
                  border: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  focusedBorder: InputBorder.none,
                  filled: false,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg,
                    vertical: AppSpacing.md,
                  ),
                ),
                onSubmitted: (value) {
                  if (value.trim().isNotEmpty && !isProcessing) {
                    context.read<CommandCenterBloc>().add(CommandCenterSubmitGoal(value.trim()));
                    _controller.clear();
                  }
                },
                enabled: !isProcessing,
              ),
            ),
            Container(
              height: 56,
              decoration: BoxDecoration(
                border: Border(left: BorderSide(color: AppColors.glassBorder)),
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: isProcessing
                      ? null
                      : () {
                          if (_controller.text.trim().isNotEmpty) {
                            context.read<CommandCenterBloc>().add(
                              CommandCenterSubmitGoal(_controller.text.trim()),
                            );
                            _controller.clear();
                          }
                        },
                  borderRadius: const BorderRadius.only(
                    topRight: Radius.circular(12),
                    bottomRight: Radius.circular(12),
                  ),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
                    child: isProcessing
                        ? SizedBox(
                            width: 22,
                            height: 22,
                            child: CircularProgressIndicator(
                              strokeWidth: 2.5,
                              valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                            ),
                          )
                        : Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const EcoraaSymbol(size: 18),
                              const SizedBox(width: AppSpacing.sm),
                              Text(
                                'Execute',
                                style: AppTypography.button,
                              ),
                            ],
                          ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatusBar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CommandCenterBloc, CommandCenterState>(
      builder: (context, state) {
        if (!state.isProcessing && state.currentTask == 'Idle') {
          return const SizedBox.shrink();
        }

        return EcoraaGlassContainer(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.lg,
            vertical: AppSpacing.md,
          ),
          borderRadius: AppSpacing.radiusMd,
          child: Row(
            children: [
              if (state.isProcessing)
                _PulseIndicator()
              else
                Icon(Icons.check_circle_outline, size: 18, color: AppColors.success),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      state.isProcessing ? 'Executing task...' : 'Task completed',
                      style: AppTypography.body.copyWith(
                        fontWeight: FontWeight.w500,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      state.currentTask,
                      style: AppTypography.metadata.copyWith(
                        color: AppColors.textSecondary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              if (!state.isProcessing)
                TextButton(
                  onPressed: () {
                    context.read<CommandCenterBloc>().add(CommandCenterClearInput());
                  },
                  child: Text('Dismiss', style: AppTypography.buttonSecondary),
                ),
            ],
          ),
        );
      },
    );
  }
}

class _PulseIndicator extends StatefulWidget {
  @override
  State<_PulseIndicator> createState() => _PulseIndicatorState();
}

class _PulseIndicatorState extends State<_PulseIndicator>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    )..repeat(reverse: true);
    _animation = Tween<double>(begin: 0.4, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Opacity(
          opacity: _animation.value,
          child: Container(
            width: 10,
            height: 10,
            decoration: BoxDecoration(
              color: AppColors.primary,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: AppColors.primary.withValues(alpha: 0.5),
                  blurRadius: 8,
                  spreadRadius: 2,
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _ActiveWorkSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Active Work', style: AppTypography.sectionTitle),
            TextButton(
              onPressed: () => context.go('/tasks'),
              child: Text('View all', style: AppTypography.buttonSecondary),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.md),
        Expanded(
          child: _ActiveWorkContent(),
        ),
      ],
    );
  }
}

class _ActiveWorkContent extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          EcoraaGlassContainer(
            padding: const EdgeInsets.all(AppSpacing.xl),
            borderRadius: AppSpacing.radiusXl,
            child: const EcoraaSymbol(size: 48, color: AppColors.textSecondary),
          ),
          const SizedBox(height: AppSpacing.lg),
          Text(
            'No active work',
            style: AppTypography.sectionTitle.copyWith(
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            'Tell ECORAA what you want to accomplish above.',
            style: AppTypography.body.copyWith(color: AppColors.textSecondary),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

class _NavigationHint extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: AppSpacing.lg),
      child: Center(
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.keyboard_arrow_right, size: 16, color: AppColors.textSecondary),
            const SizedBox(width: AppSpacing.sm),
            Text(
              'Main • Tasks • Profile',
              style: AppTypography.metadata,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}