import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'theme/app_colors.dart';
import 'theme/app_typography.dart';
import 'theme/app_spacing.dart';
import '../widgets/ecoraa_symbol.dart';
import '../widgets/command_palette.dart';
import '../widgets/ambient_glass_background.dart';
import '../widgets/glass_container.dart';

class MainShell extends StatefulWidget {
  final Widget child;
  const MainShell({super.key, required this.child});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  bool _isCommandPaletteOpen = false;

  void _toggleCommandPalette() {
    setState(() {
      _isCommandPaletteOpen = !_isCommandPaletteOpen;
    });
  }

  @override
  Widget build(BuildContext context) {
    return CallbackShortcuts(
      bindings: {
        const SingleActivator(LogicalKeyboardKey.space, control: true): _toggleCommandPalette,
        const SingleActivator(LogicalKeyboardKey.keyK, control: true): _toggleCommandPalette,
      },
      child: Focus(
        autofocus: true,
        child: AmbientGlassBackground(
          child: Stack(
            children: [
              LayoutBuilder(
                builder: (context, constraints) {
                  final currentPath = GoRouterState.of(context).uri.path;
                  final isAssistantRoute = currentPath == '/assistant' || currentPath == '/';

                  if (isAssistantRoute) {
                    return Scaffold(
                      backgroundColor: Colors.transparent,
                      body: widget.child,
                    );
                  }

                  if (constraints.maxWidth >= 800) {
                    // Desktop Layout
                    return Scaffold(
                      backgroundColor: Colors.transparent,
                      body: Row(
                        children: [
                          _DesktopSidebar(onOpenCommandPalette: _toggleCommandPalette),
                          Expanded(child: widget.child),
                        ],
                      ),
                    );
                  } else {
                    // Mobile Layout
                    return Scaffold(
                      backgroundColor: Colors.transparent,
                      body: widget.child,
                      bottomNavigationBar: _MobileBottomNav(),
                    );
                  }
                },
              ),
              if (_isCommandPaletteOpen)
                CommandPaletteOverlay(
                  onClose: _toggleCommandPalette,
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class _DesktopSidebar extends StatelessWidget {
  final VoidCallback onOpenCommandPalette;

  const _DesktopSidebar({required this.onOpenCommandPalette});

  @override
  Widget build(BuildContext context) {
    final currentRoute = GoRouterState.of(context).uri.path;

    return EcoraaGlassContainer(
      width: 240,
      borderRadius: BorderRadius.zero,
      border: Border(right: BorderSide(color: AppColors.glassBorder, width: 1.2)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Brand Header
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: Row(
              children: [
                const EcoraaSymbol(size: 28),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'ECORAA',
                      style: AppTypography.pageTitle.copyWith(fontSize: 16, letterSpacing: 0.5),
                    ),
                    Text(
                      'Personal Intelligence',
                      style: AppTypography.metadata.copyWith(fontSize: 10),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          // Command Palette Trigger Button in Sidebar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: InkWell(
              onTap: onOpenCommandPalette,
              borderRadius: AppSpacing.radiusSm,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.5),
                  borderRadius: AppSpacing.radiusSm,
                  border: Border.all(color: AppColors.glassBorder),
                ),
                child: Row(
                  children: [
                    Icon(Icons.search, size: 16, color: AppColors.textSecondary),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Command...',
                        style: AppTypography.metadata.copyWith(color: AppColors.textSecondary),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.6),
                        borderRadius: AppSpacing.radiusXs,
                        border: Border.all(color: AppColors.glassBorder),
                      ),
                      child: Text(
                        'Ctrl+Space',
                        style: AppTypography.metadata.copyWith(fontSize: 9),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Nav Items
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              children: [
                _NavItem(
                  icon: Icons.chat_bubble_outline,
                  label: 'Main',
                  route: '/main',
                  active: currentRoute == '/main',
                ),
                _NavItem(
                  icon: Icons.assignment_outlined,
                  label: 'Tasks',
                  route: '/tasks',
                  active: currentRoute == '/tasks',
                ),
                _NavItem(
                  icon: Icons.person_outline,
                  label: 'Profile',
                  route: '/profile',
                  active: currentRoute == '/profile',
                ),
              ],
            ),
          ),

          // Footer status indicator
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: Border(top: BorderSide(color: AppColors.glassBorder)),
            ),
            child: Row(
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: AppColors.success,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  'ECORAA v1.0 Active',
                  style: AppTypography.metadata,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String route;
  final bool active;

  const _NavItem({
    required this.icon,
    required this.label,
    required this.route,
    required this.active,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => context.go(route),
          borderRadius: AppSpacing.radiusSm,
          hoverColor: AppColors.border.withValues(alpha: 0.3),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: BoxDecoration(
              color: active ? AppColors.primary.withValues(alpha: 0.15) : Colors.transparent,
              borderRadius: AppSpacing.radiusSm,
              border: active ? Border.all(color: AppColors.primary.withValues(alpha: 0.3)) : null,
            ),
            child: Row(
              children: [
                Icon(
                  icon,
                  size: 18,
                  color: active ? AppColors.primary : AppColors.textSecondary,
                ),
                const SizedBox(width: 12),
                Text(
                  label,
                  style: AppTypography.body.copyWith(
                    color: active ? AppColors.primary : AppColors.textPrimary,
                    fontWeight: active ? FontWeight.w600 : FontWeight.w400,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _MobileBottomNav extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final currentRoute = GoRouterState.of(context).uri.path;

    int getCurrentIndex() {
      switch (currentRoute) {
        case '/main': return 0;
        case '/tasks': return 1;
        case '/profile': return 2;
        default: return 0;
      }
    }

    return BottomNavigationBar(
      currentIndex: getCurrentIndex(),
      onTap: (index) {
        switch (index) {
          case 0: context.go('/main'); break;
          case 1: context.go('/tasks'); break;
          case 2: context.go('/profile'); break;
        }
      },
      type: BottomNavigationBarType.fixed,
      backgroundColor: Colors.white.withValues(alpha: 0.7),
      elevation: 0,
      selectedItemColor: AppColors.primary,
      unselectedItemColor: AppColors.textSecondary,
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.chat_bubble_outline),
          label: 'Main',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.assignment_outlined),
          label: 'Tasks',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person_outline),
          label: 'Profile',
        ),
      ],
    );
  }
}
