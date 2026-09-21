import 'dart:async';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  static const String defaultHost = '127.0.0.1';
  static const int defaultPort = 8420;

  final String host;
  final int port;

  late final String baseUrl;
  late final http.Client _client;

  ApiService({
    String? host,
    int? port,
    http.Client? client,
  }) : host = host ?? defaultHost,
       port = port ?? defaultPort,
       _client = client ?? http.Client() {
    baseUrl = 'http://$host:$port';
  }

  Uri _uri(String path) => Uri.parse('$baseUrl$path');

  Future<Map<String, dynamic>> getStatus() async {
    final response = await _client.get(_uri('/api/status'));
    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> executeGoal(String goal) async {
    final response = await _client.post(
      _uri('/api/command'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'command': 'execute_goal',
        'params': {'goal': goal},
      }),
    );
    return _handleResponse(response);
  }

  Future<List<dynamic>> getMissions() async {
    final response = await _client.get(_uri('/api/missions'));
    return _handleResponse(response) as List<dynamic>;
  }

  Future<List<dynamic>> getAgents() async {
    final response = await _client.get(_uri('/api/agents'));
    return _handleResponse(response) as List<dynamic>;
  }

  Future<Map<String, dynamic>> getMemory() async {
    final response = await _client.get(_uri('/api/memory'));
    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> updateMemory({
    required String action,
    String category = '',
    String value = '',
  }) async {
    final response = await _client.post(
      _uri('/api/memory'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'action': action,
        'category': category,
        'value': value,
      }),
    );
    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> pairDevice(String code) async {
    final response = await _client.post(
      _uri('/api/pair'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'code': code}),
    );
    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> getUsbStatus() async {
    final response = await _client.get(_uri('/api/usb-status'));
    return _handleResponse(response);
  }

  Future<List<dynamic>> getCases() async {
    final response = await _client.get(_uri('/api/cases'));
    return _handleResponse(response) as List<dynamic>;
  }

  Map<String, dynamic> _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(response.body);
    } else {
      throw ApiException(
        'API Error: ${response.statusCode}',
        statusCode: response.statusCode,
        body: response.body,
      );
    }
  }

  void dispose() {
    _client.close();
  }
}

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final String? body;

  ApiException(this.message, {this.statusCode, this.body});

  @override
  String toString() => message;
}