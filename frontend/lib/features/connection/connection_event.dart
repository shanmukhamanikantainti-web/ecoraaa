import 'package:equatable/equatable.dart';
import 'connection_state.dart';

abstract class ConnectionEvent extends Equatable {
  const ConnectionEvent();
  @override
  List<Object> get props => [];
}

class ConnectionConnect extends ConnectionEvent {}

class ConnectionDisconnect extends ConnectionEvent {}

class ConnectionStatusChanged extends ConnectionEvent {
  final ConnectionStatus state;
  final String? errorMessage;

  const ConnectionStatusChanged(this.state, {this.errorMessage});

  @override
  List<Object> get props => [state, errorMessage ?? ''];
}

class ConnectionHandleError extends ConnectionEvent {
  final String message;
  const ConnectionHandleError(this.message);
  @override
  List<Object> get props => [message];
}