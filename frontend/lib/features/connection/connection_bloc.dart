import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'connection_event.dart';
import 'connection_state.dart';
import '../../services/api_service.dart';
import '../../services/websocket_service.dart';

class ConnectionBloc extends Bloc<ConnectionEvent, ConnectionState> {
  final ApiService apiService;
  final WebSocketService wsService;

  StreamSubscription? _apiSubscription;
  StreamSubscription? _wsSubscription;

  ConnectionBloc({
    required this.apiService,
    required this.wsService,
  }) : super(const ConnectionInitial()) {
    on<ConnectionConnect>(_onConnect);
    on<ConnectionDisconnect>(_onDisconnect);
    on<ConnectionStatusChanged>(_onStatusChanged);
    on<ConnectionHandleError>(_onError);

    // Start listening to WebSocket messages
    _wsSubscription = wsService.messageStream.listen((message) {
      _handleWebSocketMessage(message);
    });
  }

  Future<void> _onConnect(
    ConnectionConnect event,
    Emitter<ConnectionState> emit,
  ) async {
    emit(const ConnectionConnecting());

    try {
      // Test API connection
      await apiService.getStatus();

      // Connect WebSocket
      await wsService.connect();

      emit(const ConnectionConnected());
    } catch (e) {
      emit(ConnectionFailed(e.toString()));
    }
  }

  Future<void> _onDisconnect(
    ConnectionDisconnect event,
    Emitter<ConnectionState> emit,
  ) async {
    wsService.disconnect();
    emit(const ConnectionDisconnected());
  }

  void _onStatusChanged(
    ConnectionStatusChanged event,
    Emitter<ConnectionState> emit,
  ) {
    switch (event.state) {
      case ConnectionStatus.connecting:
        emit(const ConnectionConnecting());
        break;
      case ConnectionStatus.connected:
        emit(const ConnectionConnected());
        break;
      case ConnectionStatus.error:
        emit(ConnectionFailed(event.errorMessage ?? 'Unknown error'));
        break;
      case ConnectionStatus.disconnected:
        emit(const ConnectionDisconnected());
        break;
    }
  }

  void _onError(
    ConnectionHandleError event,
    Emitter<ConnectionState> emit,
  ) {
    emit(ConnectionFailed(event.message));
  }

  void _handleWebSocketMessage(WebSocketMessage message) {
    // Handle incoming WebSocket messages
    // This will be expanded in future phases
  }

  @override
  Future<void> close() {
    _apiSubscription?.cancel();
    _wsSubscription?.cancel();
    wsService.dispose();
    apiService.dispose();
    return super.close();
  }
}