import 'package:equatable/equatable.dart';

abstract class CommandCenterEvent extends Equatable {
  const CommandCenterEvent();
  @override
  List<Object> get props => [];
}

class CommandCenterSubmitGoal extends CommandCenterEvent {
  final String goal;
  const CommandCenterSubmitGoal(this.goal);
  @override
  List<Object> get props => [goal];
}

class CommandCenterClearInput extends CommandCenterEvent {}