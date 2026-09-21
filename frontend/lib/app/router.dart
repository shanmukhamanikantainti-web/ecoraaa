import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'shell.dart';
import '../features/command_center/command_center_screen.dart';
import '../features/tasks/tasks_screen.dart';
import '../features/profile/profile_screen.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/main',
  routes: [
    ShellRoute(
      builder: (context, state, child) => MainShell(child: child),
      routes: [
        GoRoute(
          path: '/main',
          builder: (context, state) => const CommandCenterScreen(),
        ),
        GoRoute(
          path: '/tasks',
          builder: (context, state) => const TasksScreen(),
        ),
        GoRoute(
          path: '/profile',
          builder: (context, state) => const ProfileScreen(),
        ),
        // Fallback redirects to maintain backwards compatibility if navigated by URL
        GoRoute(
          path: '/command',
          redirect: (context, state) => '/main',
        ),
        GoRoute(
          path: '/assistant',
          redirect: (context, state) => '/main',
        ),
        GoRoute(
          path: '/workspaces',
          redirect: (context, state) => '/main',
        ),
        GoRoute(
          path: '/settings',
          redirect: (context, state) => '/profile',
        ),
      ],
    ),
  ],
  errorBuilder: (context, state) => Scaffold(
    body: Center(child: Text('Route not found: ${state.uri}')),
  ),
);