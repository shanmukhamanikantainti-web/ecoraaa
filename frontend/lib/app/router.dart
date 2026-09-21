import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'shell.dart';
import '../features/command_center/command_center_screen.dart';
import '../features/assistant/assistant_screen.dart';
import '../features/workspaces/workspaces_screen.dart';
import '../features/files/files_screen.dart';
import '../features/console/console_screen.dart';
import '../features/screen_mirror/screen_mirror_screen.dart';
import '../features/cases/cases_screen.dart';
import '../features/memory/memory_screen.dart';
import '../features/settings/settings_screen.dart';
import '../features/help/help_screen.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/assistant',
  routes: [
    ShellRoute(
      builder: (context, state, child) => MainShell(child: child),
      routes: [
        GoRoute(
          path: '/command',
          builder: (context, state) => const CommandCenterScreen(),
        ),
        GoRoute(
          path: '/assistant',
          builder: (context, state) => const AssistantScreen(),
        ),
        GoRoute(
          path: '/workspaces',
          builder: (context, state) => const WorkspacesScreen(),
        ),
        GoRoute(
          path: '/files',
          builder: (context, state) => const FilesScreen(),
        ),
        GoRoute(
          path: '/console',
          builder: (context, state) => const ConsoleScreen(),
        ),
        GoRoute(
          path: '/screen',
          builder: (context, state) => const ScreenMirrorScreen(),
        ),
        GoRoute(
          path: '/cases',
          builder: (context, state) => const CasesScreen(),
        ),
        GoRoute(
          path: '/memory',
          builder: (context, state) => const MemoryScreen(),
        ),
        GoRoute(
          path: '/settings',
          builder: (context, state) => const SettingsScreen(),
        ),
        GoRoute(
          path: '/help',
          builder: (context, state) => const HelpScreen(),
        ),
      ],
    ),
  ],
  errorBuilder: (context, state) => Scaffold(
    body: Center(child: Text('Route not found: ${state.uri}')),
  ),
);