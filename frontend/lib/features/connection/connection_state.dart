import 'package:equatable/equatable.dart';

enum ConnectionStatus { disconnected, connecting, connected, error }

abstract class ConnectionState extends Equatable {
  final ConnectionStatus status;
  final String? errorMessage;

  const ConnectionState({required this.status, this.errorMessage});

  @override
  List<Object> get props => [status, errorMessage ?? ''];
}

class ConnectionInitial extends ConnectionState {
  const ConnectionInitial() : super(status: ConnectionStatus.disconnected);
}

class ConnectionConnecting extends ConnectionState {
  const ConnectionConnecting() : super(status: ConnectionStatus.connecting);
}

class ConnectionConnected extends ConnectionState {
  const ConnectionConnected() : super(status: ConnectionStatus.connected);
}

class ConnectionFailed extends ConnectionState {
  const ConnectionFailed(String message) : super(status: ConnectionStatus.error, errorMessage: message);
}

class ConnectionDisconnected extends ConnectionState {
  const ConnectionDisconnected() : super(status: ConnectionStatus.disconnected);
}