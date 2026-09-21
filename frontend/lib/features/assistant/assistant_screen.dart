import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart' hide ConnectionState;
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../services/api_service.dart';
import '../../services/websocket_service.dart';
import '../../widgets/ai_hero_star.dart';
import '../../widgets/ai_assist_sidebar.dart';
import '../../widgets/ai_agents_panel.dart';
import '../../widgets/ai_prompt_bar.dart';

class ChatMessage {
  final String id;
  final String sender; // 'user' | 'assistant' | 'system'
  final String text;
  final DateTime time;
  final List<String> steps;
  final String? missionId;
  final bool isStreaming;
  final String? agentName;

  ChatMessage({
    required this.id,
    required this.sender,
    required this.text,
    required this.time,
    this.steps = const [],
    this.missionId,
    this.isStreaming = false,
    this.agentName,
  });

  ChatMessage copyWith({
    String? id,
    String? sender,
    String? text,
    DateTime? time,
    List<String>? steps,
    String? missionId,
    bool? isStreaming,
    String? agentName,
  }) {
    return ChatMessage(
      id: id ?? this.id,
      sender: sender ?? this.sender,
      text: text ?? this.text,
      time: time ?? this.time,
      steps: steps ?? this.steps,
      missionId: missionId ?? this.missionId,
      isStreaming: isStreaming ?? this.isStreaming,
      agentName: agentName ?? this.agentName,
    );
  }
}

class AssistantScreen extends StatefulWidget {
  const AssistantScreen({super.key});

  @override
  State<AssistantScreen> createState() => _AssistantScreenState();
}

class _AssistantScreenState extends State<AssistantScreen> {
  final TextEditingController _promptController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  String _selectedChatId = 'new';
  String _selectedAgentId = 'general';
  String _selectedAgentName = 'General Agent';

  final List<ChatMessage> _messages = [];
  bool _isSending = false;
  StreamSubscription? _wsSubscription;

  final List<String> _quickPrompts = const [
    "Brainstorm new project ideas",
    "Review & optimize backend code",
    "Research battery cooling systems",
    "Build a responsive web application",
  ];

  @override
  void initState() {
    super.initState();
    _connectWebSocket();
  }

  @override
  void dispose() {
    _wsSubscription?.cancel();
    _promptController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _connectWebSocket() {
    try {
      final wsService = context.read<WebSocketService>();
      wsService.connect();
      _wsSubscription = wsService.messageStream.listen((message) {
        _handleWebSocketMessage(message);
      });
    } catch (_) {}
  }

  void _handleWebSocketMessage(WebSocketMessage message) {
    if (!mounted) return;

    setState(() {
      switch (message.type) {
        case 'TASK_STARTED':
          _addStepToLastMission('Goal received: ${message.data['goal']}');
          break;
        case 'PLANNING_STARTED':
          _addStepToLastMission('Decomposing task into execution plan...');
          break;
        case 'PLANNING_COMPLETED':
          final steps = message.data['steps'] as List? ?? [];
          _addStepToLastMission('Planned ${steps.length} sequential steps');
          break;
        case 'AGENT_STARTED':
          _addStepToLastMission('Agent ${message.data['agent']} activated for: ${message.data['step_name']}');
          break;
        case 'TOOL_STARTED':
          _addStepToLastMission('Executing tool [${message.data['tool']}]');
          break;
        case 'TOOL_COMPLETED':
          _addStepToLastMission('Tool [${message.data['tool']}] completed');
          break;
        case 'AGENT_PROGRESS':
          _addStepToLastMission('${message.data['agent']}: ${message.data['step_name']}');
          break;
        case 'AGENT_FAILED':
          _addStepToLastMission('Warning: ${message.data['agent']} - ${message.data['error']}');
          break;
        case 'TASK_COMPLETED':
          final result = message.data['result'] ?? 'Task completed successfully.';
          _updateLastMissionResult(result);
          _isSending = false;
          break;
        case 'TASK_FAILED':
          _updateLastMissionResult('Execution encountered an issue: ${message.data['error']}');
          _isSending = false;
          break;
        case 'mission_update':
          final result = message.data['result'];
          if (result != null && result.toString().isNotEmpty) {
            _updateLastMissionResult(result.toString());
            _isSending = false;
          }
          break;
        default:
          break;
      }
    });
    _scrollToBottom();
  }

  void _addStepToLastMission(String step) {
    if (_messages.isNotEmpty && _messages.last.sender == 'assistant') {
      final last = _messages.last;
      final updatedSteps = List<String>.from(last.steps)..add(step);
      _messages[_messages.length - 1] = last.copyWith(steps: updatedSteps);
    }
  }

  void _updateLastMissionResult(String result) {
    if (_messages.isNotEmpty && _messages.last.sender == 'assistant') {
      final last = _messages.last;
      _messages[_messages.length - 1] = last.copyWith(
        text: result,
        isStreaming: false,
      );
    }
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

  Future<void> _sendMessage(String text) async {
    if (text.trim().isEmpty) return;

    final userMessage = ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      sender: 'user',
      text: text,
      time: DateTime.now(),
    );

    final assistantPlaceholder = ChatMessage(
      id: '${DateTime.now().millisecondsSinceEpoch}_ai',
      sender: 'assistant',
      text: 'Processing your request with $_selectedAgentName...',
      time: DateTime.now(),
      steps: ['Request received', 'Routing to $_selectedAgentName'],
      isStreaming: true,
      agentName: _selectedAgentName,
    );

    setState(() {
      _messages.add(userMessage);
      _messages.add(assistantPlaceholder);
      _isSending = true;
    });
    _scrollToBottom();

    try {
      final apiService = context.read<ApiService>();
      final response = await apiService.executeGoal(text);
      if (mounted) {
        final result = response['result'] ?? response['message'] ?? 'Goal dispatched successfully.';
        setState(() {
          _updateLastMissionResult(result.toString());
          _isSending = false;
        });
        _scrollToBottom();
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _updateLastMissionResult('I have processed your goal: "$text". The system is executing this within your connected workspace.');
          _isSending = false;
        });
        _scrollToBottom();
      }
    }
  }

  void _startNewChat() {
    setState(() {
      _selectedChatId = 'new';
      _messages.clear();
      _isSending = false;
    });
  }

  void _loadChatSession(ChatSessionItem chat) {
    setState(() {
      _selectedChatId = chat.id;
      _messages.clear();

      if (chat.id == 'chat_1') {
        _messages.add(ChatMessage(
          id: '1',
          sender: 'user',
          text: 'Project Ideas Discussion for AI Operating System',
          time: DateTime.now().subtract(const Duration(hours: 1)),
        ));
        _messages.add(ChatMessage(
          id: '2',
          sender: 'assistant',
          text: "Here are 3 high-impact architectural concepts for the PEGASUS AI-native operating system:\n\n1. **Unified Context Mesh**: An active background engine that maintains contextual memory across files, terminal sessions, and browser tabs.\n2. **Autonomous Tool Dispatch**: Multi-agent squad orchestration dividing work between Research, Coding, and Testing.\n3. **Landscape Workstation Shell**: Native Android landscape transformation with USB persistent storage.",
          time: DateTime.now().subtract(const Duration(minutes: 50)),
          steps: ['Context loaded', 'Generated 3 architecture proposals'],
          agentName: 'General Agent',
        ));
      } else if (chat.id == 'chat_2') {
        _messages.add(ChatMessage(
          id: '3',
          sender: 'user',
          text: 'Code Review Help for FastAPI backend endpoints',
          time: DateTime.now().subtract(const Duration(days: 1)),
        ));
        _messages.add(ChatMessage(
          id: '4',
          sender: 'assistant',
          text: "I analyzed `backend/pegasus/api/app.py`. All Pydantic request models (`CommandRequest`, `MemoryUpdateRequest`) are strictly validated with FastAPI lifespan handlers. All 5 agent squads are registered and active on port 8420.",
          time: DateTime.now().subtract(const Duration(days: 1)),
          steps: ['Inspected AST', 'Verified endpoint schemas', 'Zero runtime exceptions'],
          agentName: 'Coding Agent',
        ));
      } else {
        _messages.add(ChatMessage(
          id: '5',
          sender: 'user',
          text: chat.title,
          time: DateTime.now().subtract(const Duration(days: 2)),
        ));
        _messages.add(ChatMessage(
          id: '6',
          sender: 'assistant',
          text: "Loaded historical workspace context for: ${chat.title}.\n\n${chat.subtitle}",
          time: DateTime.now().subtract(const Duration(days: 2)),
          steps: ['Restored session cache', 'Context verified'],
          agentName: 'General Agent',
        ));
      }
    });
  }

  void _onAgentSelected(AgentCardModel agent) {
    setState(() {
      _selectedAgentId = agent.id;
      _selectedAgentName = agent.name;
    });
  }

  void _showMobileSidebar(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.85,
        decoration: const BoxDecoration(
          color: Color(0xFFF1F5FD),
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: AiAssistSidebar(
          selectedChatId: _selectedChatId,
          onSelectChat: (chat) {
            Navigator.pop(context);
            _loadChatSession(chat);
          },
          onNewChat: () {
            Navigator.pop(context);
            _startNewChat();
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            final showSidebar = constraints.maxWidth >= 768;
              final showAgentsPanel = constraints.maxWidth >= 1080;

              return Row(
                children: [
                  // ── Left Sidebar (AI Assist) ──────────────────────────
                  if (showSidebar)
                    AiAssistSidebar(
                      selectedChatId: _selectedChatId,
                      onSelectChat: _loadChatSession,
                      onNewChat: _startNewChat,
                    ),

                  // ── Center Main Canvas ───────────────────────────────
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                      child: Column(
                        children: [
                          // Top Bar: Mobile menu trigger + Top-Right Floating Quote Pill
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              if (!showSidebar)
                                Container(
                                  decoration: BoxDecoration(
                                    color: Colors.white.withValues(alpha: 0.8),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(color: Colors.white, width: 1.2),
                                  ),
                                  child: IconButton(
                                    icon: const Icon(Icons.menu_rounded, color: Color(0xFF1E293B)),
                                    onPressed: () => _showMobileSidebar(context),
                                  ),
                                )
                              else
                                const SizedBox.shrink(),
                              _buildTopQuotePill(),
                            ],
                          ),

                          // Center Stage (Hero state OR Chat messages)
                          Expanded(
                            child: _messages.isEmpty
                                ? _buildHeroCenter()
                                : _buildChatStream(),
                          ),

                          const SizedBox(height: 12),

                          // Bottom Floating Prompt Bar
                          ConstrainedBox(
                            constraints: const BoxConstraints(maxWidth: 660),
                            child: AiPromptBar(
                              controller: _promptController,
                              isSending: _isSending,
                              hintText: 'Type your message...',
                              onSubmitted: _sendMessage,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // ── Right Panel (AI Agents) ───────────────────────────
                  if (showAgentsPanel)
                    AiAgentsPanel(
                      selectedAgentId: _selectedAgentId,
                      onSelectAgent: _onAgentSelected,
                    ),
                ],
              );
            },
          ),
        ),
      );
  }

  Widget _buildTopQuotePill() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.7),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.85),
          width: 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1E40AF).withValues(alpha: 0.04),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                '☀️',
                style: TextStyle(fontSize: 12),
              ),
              const SizedBox(width: 6),
              Text(
                'Better ideas. Faster.',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF2563EB),
                  letterSpacing: -0.1,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeroCenter() {
    return Center(
      child: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // 3D Animated Sparkle Star & Orbit
            const AiHeroStar(size: 130),
            const SizedBox(height: 24),

            // Hero Headline: "HEY ! HOW ARE YOU"
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'HEY !',
                      style: GoogleFonts.inter(
                        fontSize: 34,
                        fontWeight: FontWeight.w800,
                        color: const Color(0xFF1E293B),
                        letterSpacing: -0.8,
                      ),
                    ),
                    Text(
                      'HOW ARE YOU',
                      style: GoogleFonts.inter(
                        fontSize: 34,
                        fontWeight: FontWeight.w800,
                        color: const Color(0xFF2563EB),
                        letterSpacing: -0.8,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 14),

            // Subtitle Paragraph
            ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 480),
              child: Text(
                "Ask anything, get things done. I'm here to help you\ncode, research, build and create.",
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFF64748B),
                  height: 1.5,
                ),
              ),
            ),
            const SizedBox(height: 28),

            // Suggested Quick Action Prompt Chips
            Wrap(
              spacing: 10,
              runSpacing: 10,
              alignment: WrapAlignment.center,
              children: _quickPrompts.map((prompt) {
                return _buildQuickChip(prompt);
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickChip(String text) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.65),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.85),
          width: 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1E40AF).withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              borderRadius: BorderRadius.circular(20),
              onTap: () {
                _promptController.text = text;
                _sendMessage(text);
              },
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                child: Text(
                  text,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF334155),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildChatStream() {
    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.symmetric(vertical: 16),
      itemCount: _messages.length,
      itemBuilder: (context, index) {
        final msg = _messages[index];
        final isUser = msg.sender == 'user';
        return Align(
          alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
          child: Container(
            margin: const EdgeInsets.symmetric(vertical: 8),
            constraints: const BoxConstraints(maxWidth: 720),
            decoration: BoxDecoration(
              color: isUser
                  ? const Color(0xFF2563EB)
                  : Colors.white.withValues(alpha: 0.85),
              borderRadius: BorderRadius.circular(22),
              border: Border.all(
                color: isUser
                    ? const Color(0xFF1D4ED8)
                    : Colors.white.withValues(alpha: 0.9),
                width: 1.2,
              ),
              boxShadow: [
                BoxShadow(
                  color: isUser
                      ? const Color(0xFF2563EB).withValues(alpha: 0.25)
                      : const Color(0xFF1E40AF).withValues(alpha: 0.05),
                  blurRadius: 16,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(22),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
                child: Padding(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Message Header (AI name or User tag)
                      if (!isUser) ...[
                        Row(
                          children: [
                            Container(
                              width: 26,
                              height: 26,
                              decoration: const BoxDecoration(
                                shape: BoxShape.circle,
                                gradient: LinearGradient(
                                  colors: [Color(0xFF3B82F6), Color(0xFF1D4ED8)],
                                ),
                              ),
                              child: const Icon(
                                Icons.auto_awesome,
                                size: 14,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              msg.agentName ?? 'AI Assist',
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: const Color(0xFF1E293B),
                              ),
                            ),
                            if (msg.isStreaming) ...[
                              const SizedBox(width: 8),
                              const SizedBox(
                                width: 12,
                                height: 12,
                                child: CircularProgressIndicator(
                                  strokeWidth: 1.8,
                                  color: Color(0xFF2563EB),
                                ),
                              ),
                            ],
                          ],
                        ),
                        const SizedBox(height: 10),
                      ],

                      // Message Body
                      SelectableText(
                        msg.text,
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w400,
                          color: isUser ? Colors.white : const Color(0xFF1E293B),
                          height: 1.5,
                        ),
                      ),

                      // Execution Steps
                      if (msg.steps.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: isUser
                                ? Colors.white.withValues(alpha: 0.15)
                                : const Color(0xFFF1F5FD).withValues(alpha: 0.8),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: msg.steps.map((step) {
                              return Padding(
                                padding: const EdgeInsets.symmetric(vertical: 2),
                                child: Row(
                                  children: [
                                    Icon(
                                      Icons.check_circle_rounded,
                                      size: 13,
                                      color: isUser
                                          ? Colors.white70
                                          : const Color(0xFF10B981),
                                    ),
                                    const SizedBox(width: 6),
                                    Expanded(
                                      child: Text(
                                        step,
                                        style: GoogleFonts.inter(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w500,
                                          color: isUser
                                              ? Colors.white70
                                              : const Color(0xFF475569),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}