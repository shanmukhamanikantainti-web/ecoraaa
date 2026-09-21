import 'package:flutter/material.dart' hide ConnectionState;
import 'package:flutter_bloc/flutter_bloc.dart';
import 'theme/app_theme.dart';
import 'router.dart';
import '../services/api_service.dart';
import '../services/websocket_service.dart';
import '../features/connection/connection_bloc.dart';
import '../features/connection/connection_event.dart';
import '../features/connection/connection_state.dart';
import '../features/command_center/command_center_bloc.dart';

class EcoraaApp extends StatelessWidget {
  const EcoraaApp({super.key});

  @override
  Widget build(BuildContext context) {
    final apiService = ApiService();
    final wsService = WebSocketService();

    return MultiRepositoryProvider(
      providers: [
        RepositoryProvider.value(value: apiService),
        RepositoryProvider.value(value: wsService),
      ],
      child: MultiBlocProvider(
        providers: [
          BlocProvider(
            create: (context) => ConnectionBloc(
              apiService: apiService,
              wsService: wsService,
            )..add(ConnectionConnect()),
          ),
          BlocProvider(
            create: (context) => CommandCenterBloc(
              apiService: apiService,
            ),
          ),
        ],
        child: MaterialApp.router(
          title: 'ECORAA',
          debugShowCheckedModeBanner: false,
          theme: AppTheme.lightTheme,
          routerConfig: appRouter,
          builder: (context, child) {
            return _ConnectionStatusListener(child: child!);
          },
        ),
      ),
    );
  }
}

class _ConnectionStatusListener extends StatelessWidget {
  final Widget child;
  const _ConnectionStatusListener({required this.child});

  @override
  Widget build(BuildContext context) {
    return BlocListener<ConnectionBloc, ConnectionState>(
      listener: (context, state) {
        // Could show snackbar or toast on connection errors
      },
      child: child,
    );
  }
}