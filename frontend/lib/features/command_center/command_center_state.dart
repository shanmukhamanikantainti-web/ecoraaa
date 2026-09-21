import 'package:equatable/equatable.dart';

abstract class CommandCenterState extends Equatable {
  final String input;
  final String currentTask;
  final bool isProcessing;
  final String? error;

  const CommandCenterState({
    required this.input,
    required this.currentTask,
    required this.isProcessing,
    this.error,
  });

  @override
  List<Object> get props => [input, currentTask, isProcessing, error ?? ''];
}

class CommandCenterInitial extends CommandCenterState {
  const CommandCenterInitial()
      : super(input: '', currentTask: 'Idle', isProcessing: false);
}

class CommandCenterProcessing extends CommandCenterState {
  const CommandCenterProcessing({required String goal})
      : super(input: goal, currentTask: goal, isProcessing: true);
}

class CommandCenterResult extends CommandCenterState {
  const CommandCenterResult({required String result})
      : super(input: '', currentTask: 'Completed: $result', isProcessing: false);
}

class CommandCenterErrorState extends CommandCenterState {
  const CommandCenterErrorState({required String error})
      : super(input: '', currentTask: 'Error', isProcessing: false, error: error);
}