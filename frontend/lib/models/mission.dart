class MissionStep {
  final String name;
  final String status;
  final String? agent;
  final String? result;
  final String? error;

  MissionStep({
    required this.name,
    required this.status,
    this.agent,
    this.result,
    this.error,
  });

  factory MissionStep.fromJson(Map<String, dynamic> json) {
    return MissionStep(
      name: json['name'] ?? '',
      status: json['status'] ?? 'PENDING',
      agent: json['agent'],
      result: json['result'],
      error: json['error'],
    );
  }
}

class Mission {
  final String id;
  final String goal;
  final String status;
  final List<MissionStep> steps;
  final double createdAt;
  final String? result;

  Mission({
    required this.id,
    required this.goal,
    required this.status,
    required this.steps,
    required this.createdAt,
    this.result,
  });

  factory Mission.fromJson(Map<String, dynamic> json) {
    var stepsList = (json['steps'] as List?) ?? [];
    List<MissionStep> parsedSteps = stepsList.map((s) => MissionStep.fromJson(s)).toList();

    return Mission(
      id: json['id'] ?? '',
      goal: json['goal'] ?? '',
      status: json['status'] ?? 'PLANNING',
      steps: parsedSteps,
      createdAt: (json['created_at'] as num?)?.toDouble() ?? 0.0,
      result: json['result'],
    );
  }
}
