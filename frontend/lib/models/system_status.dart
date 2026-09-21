class SystemStatus {
  final bool coreOnline;
  final int agentsActive;
  final int uptime;
  final String version;

  SystemStatus({
    required this.coreOnline,
    required this.agentsActive,
    required this.uptime,
    required this.version,
  });

  factory SystemStatus.fromJson(Map<String, dynamic> json) {
    return SystemStatus(
      coreOnline: json['core_online'] ?? false,
      agentsActive: json['agents_active'] ?? 0,
      uptime: json['uptime'] ?? 0,
      version: json['version'] ?? '0.1.0',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'core_online': coreOnline,
      'agents_active': agentsActive,
      'uptime': uptime,
      'version': version,
    };
  }

  static SystemStatus empty() => SystemStatus(
        coreOnline: false,
        agentsActive: 0,
        uptime: 0,
        version: '0.1.0',
      );
}
