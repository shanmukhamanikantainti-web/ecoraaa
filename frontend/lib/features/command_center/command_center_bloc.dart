import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'command_center_event.dart';
import 'command_center_state.dart';
import '../../services/api_service.dart';

class CommandCenterBloc extends Bloc<CommandCenterEvent, CommandCenterState> {
  final ApiService apiService;

  StreamSubscription? _missionSubscription;

  CommandCenterBloc({
    required this.apiService,
  }) : super(const CommandCenterInitial()) {
    on<CommandCenterSubmitGoal>(_onSubmitGoal);
    on<CommandCenterClearInput>(_onClearInput);
  }

  Future<void> _onSubmitGoal(
    CommandCenterSubmitGoal event,
    Emitter<CommandCenterState> emit,
  ) async {
    emit(CommandCenterProcessing(goal: event.goal));

    try {
      final result = await apiService.executeGoal(event.goal);
      final missionId = result['mission_id'] ?? 'unknown';
      final status = result['status'] ?? 'unknown';
      emit(CommandCenterResult(result: 'Mission $missionId - $status'));
    } catch (e) {
      emit(CommandCenterErrorState(error: e.toString()));
    }
  }

  void _onClearInput(
    CommandCenterClearInput event,
    Emitter<CommandCenterState> emit,
  ) {
    emit(const CommandCenterInitial());
  }

  @override
  Future<void> close() {
    _missionSubscription?.cancel();
    return super.close();
  }
}