import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'theme/app_colors.dart';
import 'theme/app_typography.dart';
import 'theme/app_spacing.dart';
import '../widgets/ecoraa_symbol.dart';
import '../widgets/command_palette.dart';

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
        child: Stack(
          children: [
            LayoutBuilder(
              builder: (context, constraints) {
                if (constraints.maxWidth >= 800) {
                  // Desktop Layout
                  return Scaffold(
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
    );
  }
}

class _DesktopSidebar extends StatelessWidget {
  final VoidCallback onOpenCommandPalette;

  const _DesktopSidebar({required this.onOpenCommandPalette});

  @override
  Widget build(BuildContext context) {
    final currentRoute = GoRouterState.of(context).uri.path;

    return Container(
      width: 240,
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border(right: BorderSide(color: AppColors.border, width: 1)),
      ),
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
                  color: AppColors.background,
                  borderRadius: AppSpacing.radiusSm,
                  border: Border.all(color: AppColors.border),
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
                        color: AppColors.surface,
                        borderRadius: AppSpacing.radiusXs,
                        border: Border.all(color: AppColors.border),
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
                  icon: Icons.adjust,
                  label: 'Command Center',
                  route: '/command',
                  active: currentRoute == '/command',
                ),
                _NavItem(
                  icon: Icons.chat_bubble_outline,
                  label: 'Assistant',
                  route: '/assistant',
                  active: currentRoute == '/assistant',
                ),
                _NavItem(
                  icon: Icons.dashboard_outlined,
                  label: 'Workspaces',
                  route: '/workspaces',
                  active: currentRoute == '/workspaces',
                ),
                _NavItem(
                  icon: Icons.folder_outlined,
                  label: 'Files',
                  route: '/files',
                  active: currentRoute == '/files',
                ),
                _NavItem(
                  icon: Icons.terminal_outlined,
                  label: 'Console',
                  route: '/console',
                  active: currentRoute == '/console',
                ),
                _NavItem(
                  icon: Icons.smartphone_outlined,
                  label: 'Screen Mirror',
                  route: '/screen',
                  active: currentRoute == '/screen',
                ),
                _NavItem(
                  icon: Icons.assignment_outlined,
                  label: 'Cases',
                  route: '/cases',
                  active: currentRoute == '/cases',
                ),
                _NavItem(
                  icon: Icons.psychology_outlined,
                  label: 'Memory',
                  route: '/memory',
                  active: currentRoute == '/memory',
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  child: Divider(),
                ),
                _NavItem(
                  icon: Icons.settings_outlined,
                  label: 'Settings',
                  route: '/settings',
                  active: currentRoute == '/settings',
                ),
                _NavItem(
                  icon: Icons.help_outline,
                  label: 'Help',
                  route: '/help',
                  active: currentRoute == '/help',
                ),
              ],
            ),
          ),

          // Footer status indicator
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: Border(top: BorderSide(color: AppColors.border)),
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
              color: active ? AppColors.primary.withValues(alpha: 0.08) : Colors.transparent,
              borderRadius: AppSpacing.radiusSm,
              border: active ? Border.all(color: AppColors.primary.withValues(alpha: 0.2)) : null,
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
        case '/command': return 0;
        case '/assistant': return 1;
        case '/workspaces': return 2;
        case '/files': return 3;
        case '/settings': return 4;
        default: return 0;
      }
    }

    return BottomNavigationBar(
      currentIndex: getCurrentIndex(),
      onTap: (index) {
        switch (index) {
          case 0: context.go('/command'); break;
          case 1: context.go('/assistant'); break;
          case 2: context.go('/workspaces'); break;
          case 3: context.go('/files'); break;
          case 4: context.go('/settings'); break;
        }
      },
      type: BottomNavigationBarType.fixed,
      backgroundColor: AppColors.surface,
      selectedItemColor: AppColors.primary,
      unselectedItemColor: AppColors.textSecondary,
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.adjust),
          label: 'Command',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.chat_bubble_outline),
          label: 'Assistant',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.dashboard_outlined),
          label: 'Workspaces',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.folder_outlined),
          label: 'Files',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.settings_outlined),
          label: 'Settings',
        ),
      ],
    );
  }
}
