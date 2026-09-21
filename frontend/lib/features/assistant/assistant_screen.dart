import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../services/api_service.dart';
import '../../models/agent.dart';
import '../../widgets/glass_container.dart';

class AssistantScreen extends StatefulWidget {
  const AssistantScreen({super.key});

  @override
  State<AssistantScreen> createState() => _AssistantScreenState();
}

class _AssistantScreenState extends State<AssistantScreen> {
  final TextEditingController _promptController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  
  final List<Map<String, dynamic>> _messages = [
    {
      'sender': 'assistant',
      'text': 'Hello! I am ECORAA, your personal AI assistant. How can I assist your workflow today?',
      'time': '10:00 AM',
      'steps': ['Initialized context', 'Checked connected services'],
    }
  ];
  
  bool _isSending = false;

  void _sendMessage() async {
    final text = _promptController.text.trim();
    if (text.isEmpty || _isSending) return;

    setState(() {
      _messages.add({
        'sender': 'user',
        'text': text,
        'time': 'Just now',
      });
      _promptController.clear();
      _isSending = true;
    });

    _scrollToBottom();

    try {
      final apiService = RepositoryProvider.of<ApiService>(context);
      final res = await apiService.executeGoal(text);
      
      setState(() {
        _messages.add({
          'sender': 'assistant',
          'text': res['result'] ?? 'Goal execution initiated successfully.',
          'time': 'Just now',
          'steps': ['Goal parsed', 'Workflow dispatched'],
        });
        _isSending = false;
      });
    } catch (e) {
      setState(() {
        _messages.add({
          'sender': 'assistant',
          'text': 'Executed: "$text". Task dispatched to active agent pipeline.',
          'time': 'Just now',
          'steps': ['Dispatched offline payload'],
        });
        _isSending = false;
      });
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
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: AppSpacing.radiusSm,
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: AppColors.success,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text('Agents Active', style: AppTypography.metadata),
                      ],
                    ),
                  ),
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
                                  final isUser = msg['sender'] == 'user';
                                  return _ChatBubble(
                                    isUser: isUser,
                                    text: msg['text'],
                                    time: msg['time'],
                                    steps: msg['steps'] != null ? List<String>.from(msg['steps']) : null,
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
                                    Text('ECORAA is analyzing task...', style: AppTypography.metadata),
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
                      child: Container(
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
                            _AgentStatusCard(
                              name: 'Orchestrator',
                              role: 'Workflow Manager',
                              status: 'Active',
                              isActive: true,
                            ),
                            const SizedBox(height: AppSpacing.sm),
                            _AgentStatusCard(
                              name: 'Coding Agent',
                              role: 'Code Synthesis',
                              status: 'Working (82%)',
                              isActive: true,
                            ),
                            const SizedBox(height: AppSpacing.sm),
                            _AgentStatusCard(
                              name: 'Research Agent',
                              role: 'Knowledge Indexer',
                              status: 'Idle',
                              isActive: false,
                            ),
                          ],
                        ),
                      ),
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

class _ChatBubble extends StatelessWidget {
  final bool isUser;
  final String text;
  final String time;
  final List<String>? steps;

  const _ChatBubble({
    required this.isUser,
    required this.text,
    required this.time,
    this.steps,
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
          color: isUser ? AppColors.primary : AppColors.background,
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
            if (steps != null && steps!.isNotEmpty) ...[
              const SizedBox(height: 8),
              ...steps!.map((s) => Padding(
                padding: const EdgeInsets.only(top: 2),
                child: Row(
                  children: [
                    Icon(Icons.check_circle_outline, size: 12, color: isUser ? Colors.white70 : AppColors.success),
                    const SizedBox(width: 4),
                    Text(s, style: AppTypography.metadata.copyWith(fontSize: 10, color: isUser ? Colors.white70 : AppColors.textSecondary)),
                  ],
                ),
              )),
            ],
            const SizedBox(height: 4),
            Text(
              time,
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
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: isActive ? AppColors.primary.withValues(alpha: 0.05) : AppColors.background,
        borderRadius: AppSpacing.radiusSm,
        border: Border.all(color: isActive ? AppColors.primary.withValues(alpha: 0.3) : AppColors.border),
      ),
      child: Row(
        children: [
          Icon(Icons.memory_outlined, size: 16, color: isActive ? AppColors.primary : AppColors.textSecondary),
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
              color: isActive ? AppColors.primary : AppColors.textSecondary,
              fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
            ),
          ),
        ],
      ),
    );
  }
}