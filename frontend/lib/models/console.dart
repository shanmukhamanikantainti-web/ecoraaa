class ConsoleMessage {
  final String text;
  final ConsoleMessageType type;
  final DateTime timestamp;

  ConsoleMessage({
    required this.text,
    required this.type,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();
}

enum ConsoleMessageType { output, command, error, system }