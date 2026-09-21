class AgentInfo {
  final String name;
  final String type;
  final String state;
  final String? currentTask;
  final double runtime;
  final double cpuUsage;
  final double memoryUsage;

  AgentInfo({
    required this.name,
    required this.type,
    required this.state,
    this.currentTask,
    required this.runtime,
    required this.cpuUsage,
    required this.memoryUsage,
  });

  factory AgentInfo.fromJson(Map<String, dynamic> json) {
    return AgentInfo(
      name: json['name'] ?? '',
      type: json['type'] ?? '',
      state: json['state'] ?? 'IDLE',
      currentTask: json['current_task'],
      runtime: (json['runtime'] as num?)?.toDouble() ?? 0.0,
      cpuUsage: (json['cpu_usage'] as num?)?.toDouble() ?? 0.0,
      memoryUsage: (json['memory_usage'] as num?)?.toDouble() ?? 0.0,
    );
  }
}
