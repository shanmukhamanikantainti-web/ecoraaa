import 'dart:async';
import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';

class WebSocketService {
  static const String defaultHost = '127.0.0.1';
  static const int defaultPort = 8420;

  final String host;
  final int port;

  WebSocketChannel? _channel;
  StreamController<WebSocketMessage>? _messageController;
  Timer? _reconnectTimer;
  int _reconnectAttempts = 0;
  static const int maxReconnectAttempts = 5;
  static const Duration reconnectDelay = Duration(seconds: 3);

  late final Stream<WebSocketMessage> messageStream;

  WebSocketService({
    String? host,
    int? port,
  }) : host = host ?? defaultHost,
       port = port ?? defaultPort {
    _messageController = StreamController<WebSocketMessage>.broadcast();
    messageStream = _messageController!.stream;
  }

  Future<void> connect() async {
    if (_channel != null) return;

    try {
      final wsUrl = 'ws://$host:$port/ws';
      _channel = WebSocketChannel.connect(Uri.parse(wsUrl));

      _channel!.stream.listen(
        _onMessage,
        onError: _onError,
        onDone: _onDone,
        cancelOnError: true,
      );

      _reconnectAttempts = 0;
    } catch (e) {
      _scheduleReconnect();
    }
  }

  void _onMessage(dynamic data) {
    try {
      final json = jsonDecode(data as String);
      final message = WebSocketMessage.fromJson(json);
      _messageController?.add(message);
    } catch (e) {
      // Ignore parse errors
    }
  }

  void _onError(dynamic error) {
    _scheduleReconnect();
  }

  void _onDone() {
    _channel = null;
    _scheduleReconnect();
  }

  void _scheduleReconnect() {
    if (_reconnectAttempts >= maxReconnectAttempts) return;

    _reconnectTimer?.cancel();
    _reconnectTimer = Timer(reconnectDelay * (_reconnectAttempts + 1), () {
      _reconnectAttempts++;
      connect();
    });
  }

  void send(WebSocketMessage message) {
    _channel?.sink.add(jsonEncode(message.toJson()));
  }

  void sendText(String text) {
    _channel?.sink.add(text);
  }

  void disconnect() {
    _reconnectTimer?.cancel();
    _channel?.sink.close();
    _channel = null;
  }

  void dispose() {
    disconnect();
    _messageController?.close();
  }
}

class WebSocketMessage {
  final String type;
  final Map<String, dynamic> data;

  WebSocketMessage({
    required this.type,
    required this.data,
  });

  factory WebSocketMessage.fromJson(Map<String, dynamic> json) {
    final type = json['type']?.toString() ?? '';
    final rawData = json['data'];
    Map<String, dynamic> dataMap = {};
    if (rawData is Map) {
      dataMap = Map<String, dynamic>.from(rawData);
    } else {
      dataMap = Map<String, dynamic>.from(json)..remove('type');
    }
    return WebSocketMessage(
      type: type,
      data: dataMap,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'type': type,
      'data': data,
    };
  }

  static WebSocketMessage executeGoal(String goal) {
    return WebSocketMessage(
      type: 'execute_goal',
      data: {'goal': goal},
    );
  }

  static WebSocketMessage getStatus() {
    return WebSocketMessage(type: 'get_status', data: {});
  }

  static WebSocketMessage getAgents() {
    return WebSocketMessage(type: 'get_agents', data: {});
  }

  static WebSocketMessage getMemory() {
    return WebSocketMessage(type: 'get_memory', data: {});
  }
}