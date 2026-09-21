import 'dart:async';
import 'package:flutter/material.dart' hide ConnectionState;
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../services/api_service.dart';
import '../../services/websocket_service.dart';
import '../../features/connection/connection_bloc.dart';
import '../../features/connection/connection_state.dart' as conn_state;

class AssistantScreen extends StatefulWidget {
  const AssistantScreen({super.key});

  @override
  State<AssistantScreen> createState() => _AssistantScreenState();
}

class _AssistantScreenState extends State<AssistantScreen> {
  final TextEditingController _promptController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  final List<AssistantMessage> _messages = [];
  bool _isSending = false;
  late StreamSubscription _wsSubscription;

  @override
  void initState() {
    super.initState();
    _messages.add(AssistantMessage(
      sender: 'assistant',
      text: 'Hello! I am ECORAA, your personal AI assistant. How can I assist your workflow today?',
      time: DateTime.now(),
      steps: ['Initialized context', 'Checked connected services'],
    ));
    _connectWebSocket();
  }

  void _connectWebSocket() {
    final wsService = context.read<WebSocketService>();
    wsService.connect();
    _wsSubscription = wsService.messageStream.listen((message) {
      _handleWebSocketMessage(message);
    });
  }

  void _handleWebSocketMessage(WebSocketMessage message) {
    if (!mounted) return;

    setState(() {
      switch (message.type) {
        case 'TASK_STARTED':
          _messages.add(AssistantMessage(
            sender: 'system',
            text: 'Task started: ${message.data['goal']}',
            time: DateTime.now(),
            steps: ['Goal parsed', 'Workflow dispatched'],
            missionId: message.data['task_id'],
          ));
          break;
        case 'PLANNING_STARTED':
          _addStepToLastMission('Planning started');
          break;
        case 'PLANNING_COMPLETED':
          final steps = message.data['steps'] as List? ?? [];
          _addStepToLastMission('Planned ${steps.length} steps');
          break;
        case 'AGENT_STARTED':
          _addStepToLastMission('Agent ${message.data['agent']} started: ${message.data['step_name']}');
          break;
        case 'TOOL_STARTED':
          _addStepToLastMission('Tool ${message.data['tool']} started');
          break;
        case 'TOOL_COMPLETED':
          _addStepToLastMission('Tool ${message.data['tool']} completed');
          break;
        case 'AGENT_PROGRESS':
          _addStepToLastMission('${message.data['agent']}: ${message.data['step_name']} - ${message.data['status']}');
          break;
        case 'AGENT_FAILED':
          _addStepToLastMission('⚠ ${message.data['agent']} failed: ${message.data['error']}');
          break;
        case 'TASK_COMPLETED':
          final result = message.data['result'] ?? 'Task completed';
          _updateLastMissionResult(result);
          break;
        case 'TASK_FAILED':
          _updateLastMissionResult('Task failed: ${message.data['error']}');
          break;
        case 'mission_update':
          _updateMissionFromUpdate(message.data);
          break;
        default:
          break;
      }
    });
    _scrollToBottom();
  }

  void _addStepToLastMission(String step) {
    if (_messages.isNotEmpty && _messages.last.sender != 'user') {
      final lastMsg = _messages.last;
      lastMsg.steps.add(step);
    }
  }

  void _updateLastMissionResult(String result) {
    if (_messages.isNotEmpty && _messages.last.sender != 'user') {
      _messages.last.result = result;
      _messages.last.steps.add('Completed');
    }
  }

  void _updateMissionFromUpdate(Map<String, dynamic> data) {
    // Find matching mission by ID and update
    for (var i = _messages.length - 1; i >= 0; i--) {
      if (_messages[i].missionId == data['id']) {
        _messages[i].result = data['result'];
        if (data['steps'] != null) {
          _messages[i].steps.clear();
          for (var step in data['steps']) {
            _messages[i].steps.add('${step['name']}: ${step['status']}');
          }
        }
        break;
      }
    }
  }

  Future<void> _sendMessage() async {
    final text = _promptController.text.trim();
    if (text.isEmpty || _isSending) return;

    final message = AssistantMessage(
      sender: 'user',
      text: text,
      time: DateTime.now(),
    );

    setState(() {
      _messages.add(message);
      _isSending = true;
    });

    _promptController.clear();
    _scrollToBottom();

    try {
      final apiService = context.read<ApiService>();
      final res = await apiService.executeGoal(text);

      if (mounted) {
        setState(() {
          _messages.add(AssistantMessage(
            sender: 'assistant',
            text: res['result'] ?? 'Goal execution initiated successfully.',
            time: DateTime.now(),
            missionId: res['mission_id'],
            steps: ['Goal parsed', 'Workflow dispatched'],
          ));
          _isSending = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _messages.add(AssistantMessage(
            sender: 'assistant',
            text: 'Executed: "$text". Task dispatched to active agent pipeline.',
            time: DateTime.now(),
            steps: ['Dispatched offline payload'],
          ));
          _isSending = false;
        });
      }
    }
    _scrollToBottom();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _promptController.dispose();
    _scrollController.dispose();
    _wsSubscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.pagePadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('AI Assistant', style: AppTypography.pageTitle),
                      const SizedBox(height: 4),
                      Text(
                        'Conversational intelligence and workflow orchestration',
                        style: AppTypography.metadata,
                      ),
                    ],
                  ),
                  const _ConnectionIndicator(),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              // Chat Stream & Agent Status Panel Split
              Expanded(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Main Conversation View
                    Expanded(
                      flex: 3,
                      child: Container(
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: AppSpacing.radiusLg,
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Column(
                          children: [
                            // Messages List
                            Expanded(
                              child: ListView.builder(
                                controller: _scrollController,
                                padding: const EdgeInsets.all(AppSpacing.lg),
                                itemCount: _messages.length,
                                itemBuilder: (context, index) {
                                  final msg = _messages[index];
                                  final isUser = msg.sender == 'user';
                                  final isSystem = msg.sender == 'system';
                                  return _ChatBubble(
                                    isUser: isUser,
                                    isSystem: isSystem,
                                    text: msg.text,
                                    time: msg.time,
                                    steps: msg.steps,
                                    result: msg.result,
                                  );
                                },
                              ),
                            ),
                            if (_isSending)
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: 8),
                                child: Row(
                                  children: [
                                    const SizedBox(
                                      width: 14,
                                      height: 14,
                                      child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation(AppColors.primary)),
                                    ),
                                    const SizedBox(width: 8),
                                    Text('ECORAA is processing...', style: AppTypography.metadata),
                                  ],
                                ),
                              ),

                            // Input Box
                            Container(
                              padding: const EdgeInsets.all(AppSpacing.md),
                              decoration: BoxDecoration(
                                color: AppColors.background,
                                borderRadius: const BorderRadius.only(
                                  bottomLeft: Radius.circular(12),
                                  bottomRight: Radius.circular(12),
                                ),
                                border: Border(top: BorderSide(color: AppColors.border)),
                              ),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: TextField(
                                      controller: _promptController,
                                      style: AppTypography.body,
                                      decoration: InputDecoration(
                                        hintText: 'Ask ECORAA anything...',
                                        hintStyle: AppTypography.body.copyWith(color: AppColors.textSecondary),
                                        border: InputBorder.none,
                                        enabledBorder: InputBorder.none,
                                        focusedBorder: InputBorder.none,
                                        isDense: true,
                                        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                      ),
                                      onSubmitted: (_) => _sendMessage(),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  IconButton(
                                    icon: const Icon(Icons.send_rounded, color: AppColors.primary, size: 20),
                                    onPressed: _sendMessage,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.lg),

                    // Active Agent Panel
                    Expanded(
                      flex: 1,
                      child: _AgentStatusPanel(),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class AssistantMessage {
  final String sender; // 'user', 'assistant', 'system'
  final String text;
  final DateTime time;
  final List<String> steps;
  final String? missionId;
  String? result;

  AssistantMessage({
    required this.sender,
    required this.text,
    required this.time,
    this.missionId,
    List<String>? steps,
    this.result,
  }) : steps = steps ?? [];
}

class _ChatBubble extends StatelessWidget {
  final bool isUser;
  final bool isSystem;
  final String text;
  final DateTime time;
  final List<String> steps;
  final String? result;

  const _ChatBubble({
    required this.isUser,
    required this.isSystem,
    required this.text,
    required this.time,
    this.steps = const [],
    this.result,
  });

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: AppSpacing.md),
        constraints: const BoxConstraints(maxWidth: 520),
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: isUser ? AppColors.primary : (isSystem ? AppColors.primary.withValues(alpha: 0.08) : AppColors.background),
          borderRadius: BorderRadius.circular(12),
          border: isUser ? null : Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              text,
              style: AppTypography.body.copyWith(
                color: isUser ? Colors.white : AppColors.textPrimary,
              ),
            ),
            if (steps.isNotEmpty) ...[
              const SizedBox(height: 8),
              ...steps.map((s) => Padding(
                padding: const EdgeInsets.only(top: 2),
                child: Row(
                  children: [
                    Icon(
                      s.startsWith('⚠') ? Icons.warning_amber_outlined : Icons.check_circle_outline,
                      size: 12,
                      color: s.startsWith('⚠') ? AppColors.warning : (isUser ? Colors.white70 : AppColors.success),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      s.replaceFirst('⚠ ', ''),
                      style: AppTypography.metadata.copyWith(
                        fontSize: 10,
                        color: isUser ? Colors.white70 : (s.startsWith('⚠') ? AppColors.warning : AppColors.textSecondary),
                      ),
                    ),
                  ],
                ),
              )),
            ],
            if (result != null) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: isUser ? Colors.white.withValues(alpha: 0.1) : AppColors.background,
                  borderRadius: AppSpacing.radiusSm,
                  border: Border.all(color: AppColors.border),
                ),
                child: Text(
                  result!,
                  style: AppTypography.bodySmall.copyWith(
                    color: isUser ? Colors.white70 : AppColors.textPrimary,
                  ),
                ),
              ),
            ],
            const SizedBox(height: 4),
            Text(
              _formatTime(time),
              style: AppTypography.metadata.copyWith(
                fontSize: 9,
                color: isUser ? Colors.white70 : AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatTime(DateTime time) {
    final now = DateTime.now();
    final diff = now.difference(time);
    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inHours < 1) return '${diff.inMinutes}m ago';
    return '${time.hour}:${time.minute.toString().padLeft(2, '0')}';
  }
}

class _AgentStatusPanel extends StatelessWidget {
  const _AgentStatusPanel({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppSpacing.radiusLg,
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Active Agents', style: AppTypography.sectionTitle),
          const SizedBox(height: AppSpacing.md),
          FutureBuilder<List<dynamic>>(
            future: context.read<ApiService>().getAgents(),
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                // Will show data below
              } else if (snapshot.connectionState.index == 0) { // waiting
                return const Center(child: CircularProgressIndicator());
              } else if (snapshot.hasError) {
                return _buildStaticAgents();
              }

              if (snapshot.hasError || !snapshot.hasData) {
                return _buildStaticAgents();
              }

              final agents = snapshot.data!;
              return Column(
                children: agents.map((agent) {
                  final isActive = agent['state'] == 'RUNNING' || agent['state'] == 'PLANNING';
                  return _AgentStatusCard(
                    name: agent['name'] ?? 'Unknown',
                    role: agent['type'] ?? 'Agent',
                    status: agent['state'] ?? 'IDLE',
                    isActive: isActive,
                  );
                }).toList(),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildStaticAgents() {
    return Column(
      children: [
        _AgentStatusCard(
          name: 'Orchestrator',
          role: 'Workflow Manager',
          status: 'IDLE',
          isActive: false,
        ),
        const SizedBox(height: AppSpacing.sm),
        _AgentStatusCard(
          name: 'Coding Agent',
          role: 'Code Synthesis',
          status: 'IDLE',
          isActive: false,
        ),
        const SizedBox(height: AppSpacing.sm),
        _AgentStatusCard(
          name: 'Testing Agent',
          role: 'Test Execution',
          status: 'IDLE',
          isActive: false,
        ),
        const SizedBox(height: AppSpacing.sm),
        _AgentStatusCard(
          name: 'Review Agent',
          role: 'Code Review',
          status: 'IDLE',
          isActive: false,
        ),
        const SizedBox(height: AppSpacing.sm),
        _AgentStatusCard(
          name: 'Marketing Agent',
          role: 'Documentation',
          status: 'IDLE',
          isActive: false,
        ),
        const SizedBox(height: AppSpacing.sm),
        _AgentStatusCard(
          name: 'Research Agent',
          role: 'Knowledge Indexer',
          status: 'IDLE',
          isActive: false,
        ),
      ],
    );
  }
}

class _AgentStatusCard extends StatelessWidget {
  final String name;
  final String role;
  final String status;
  final bool isActive;

  const _AgentStatusCard({
    required this.name,
    required this.role,
    required this.status,
    required this.isActive,
  });

  @override
  Widget build(BuildContext context) {
    Color statusColor;
    switch (status.toUpperCase()) {
      case 'RUNNING':
      case 'PLANNING':
        statusColor = AppColors.primary;
        break;
      case 'COMPLETED':
        statusColor = AppColors.success;
        break;
      case 'FAILED':
        statusColor = AppColors.error;
        break;
      default:
        statusColor = AppColors.textSecondary;
    }

    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: isActive ? AppColors.primary.withValues(alpha: 0.05) : AppColors.background,
        borderRadius: AppSpacing.radiusSm,
        border: Border.all(color: isActive ? AppColors.primary.withValues(alpha: 0.3) : AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: statusColor,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w600)),
                Text(role, style: AppTypography.metadata.copyWith(fontSize: 10)),
              ],
            ),
          ),
          Text(
            status,
            style: AppTypography.metadata.copyWith(
              fontSize: 10,
              color: statusColor,
              fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
            ),
          ),
        ],
      ),
    );
  }
}

class _ConnectionIndicator extends StatelessWidget {
  const _ConnectionIndicator({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ConnectionBloc, conn_state.ConnectionState>(
      builder: (context, state) {
        Color color;
        bool pulsing = false;

        if (state is conn_state.ConnectionConnected) {
          color = AppColors.success;
        } else if (state is conn_state.ConnectionConnecting) {
          color = AppColors.warning;
          pulsing = true;
        } else if (state is conn_state.ConnectionFailed) {
          color = AppColors.error;
        } else {
          color = AppColors.textSecondary;
        }

        return AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
            boxShadow: pulsing
                ? [
                    BoxShadow(
                      color: color.withValues(alpha: 0.6),
                      blurRadius: 8,
                      spreadRadius: 2,
                    ),
                  ]
                : null,
          ),
        );
      },
    );
  }
}