import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AgentCardModel {
  final String id;
  final String name;
  final String description;
  final IconData icon;
  final Color activeColor;

  const AgentCardModel({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    required this.activeColor,
  });
}

class AiAgentsPanel extends StatefulWidget {
  final String selectedAgentId;
  final ValueChanged<AgentCardModel> onSelectAgent;

  const AiAgentsPanel({
    super.key,
    required this.selectedAgentId,
    required this.onSelectAgent,
  });

  static const List<AgentCardModel> agents = [
    AgentCardModel(
      id: 'general',
      name: 'General Agent',
      description: 'Chat, brainstorm & get answers',
      icon: Icons.auto_awesome,
      activeColor: Color(0xFF2563EB),
    ),
    AgentCardModel(
      id: 'coding',
      name: 'Coding Agent',
      description: 'Write, debug & refactor code',
      icon: Icons.code_rounded,
      activeColor: Color(0xFF2563EB),
    ),
    AgentCardModel(
      id: 'research',
      name: 'Research Agent',
      description: 'Search, synthesize & analyze data',
      icon: Icons.search_rounded,
      activeColor: Color(0xFF2563EB),
    ),
    AgentCardModel(
      id: 'creative',
      name: 'Creative Agent',
      description: 'Design, write & ideate visuals',
      icon: Icons.edit_outlined,
      activeColor: Color(0xFF2563EB),
    ),
  ];

  @override
  State<AiAgentsPanel> createState() => _AiAgentsPanelState();
}

class _AiAgentsPanelState extends State<AiAgentsPanel> {
  String? _hoveredAgentId;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 180,
      height: double.infinity,
      child: Stack(
        alignment: Alignment.centerRight,
        clipBehavior: Clip.none,
        children: [
          // 1. Giant Curved Glass Dome Arc intersecting the right edge
          Positioned(
            right: -130,
            top: 0,
            bottom: 0,
            width: 320,
            child: CustomPaint(
              painter: _GlassDomeArcPainter(),
            ),
          ),

          // 2. Floating Vertical Glass Capsule Pill Dock
          Positioned(
            right: 28,
            child: Container(
              width: 68,
              padding: const EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.65),
                borderRadius: BorderRadius.circular(34),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.92),
                  width: 1.8,
                ),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF1E40AF).withValues(alpha: 0.08),
                    blurRadius: 30,
                    offset: const Offset(-4, 8),
                  ),
                  BoxShadow(
                    color: const Color(0xFF3B82F6).withValues(alpha: 0.05),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(34),
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 24, sigmaY: 24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: List.generate(AiAgentsPanel.agents.length, (index) {
                      final agent = AiAgentsPanel.agents[index];
                      final isSelected = widget.selectedAgentId == agent.id;
                      final isHovered = _hoveredAgentId == agent.id;

                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 7),
                        child: MouseRegion(
                          cursor: SystemMouseCursors.click,
                          onEnter: (_) => setState(() => _hoveredAgentId = agent.id),
                          onExit: (_) => setState(() => _hoveredAgentId = null),
                          child: Stack(
                            clipBehavior: Clip.none,
                            alignment: Alignment.center,
                            children: [
                              // Circular Agent Button
                              GestureDetector(
                                onTap: () => widget.onSelectAgent(agent),
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 220),
                                  width: 46,
                                  height: 46,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    gradient: isSelected
                                        ? const LinearGradient(
                                            begin: Alignment.topLeft,
                                            end: Alignment.bottomRight,
                                            colors: [
                                              Color(0xFF2563EB),
                                              Color(0xFF1D4ED8),
                                            ],
                                          )
                                        : null,
                                    color: isSelected
                                        ? null
                                        : isHovered
                                            ? Colors.white.withValues(alpha: 0.95)
                                            : Colors.white.withValues(alpha: 0.7),
                                    border: Border.all(
                                      color: isSelected
                                          ? Colors.white.withValues(alpha: 0.9)
                                          : Colors.white.withValues(alpha: 0.95),
                                      width: isSelected ? 1.8 : 1.2,
                                    ),
                                    boxShadow: isSelected
                                        ? [
                                            BoxShadow(
                                              color: const Color(0xFF2563EB)
                                                  .withValues(alpha: 0.45),
                                              blurRadius: 14,
                                              offset: const Offset(0, 4),
                                            ),
                                          ]
                                        : [
                                            BoxShadow(
                                              color: const Color(0xFF1E40AF)
                                                  .withValues(alpha: 0.04),
                                              blurRadius: 8,
                                              offset: const Offset(0, 2),
                                            ),
                                          ],
                                  ),
                                  child: Center(
                                    child: Icon(
                                      agent.icon,
                                      size: 21,
                                      color: isSelected
                                          ? Colors.white
                                          : const Color(0xFF2563EB),
                                    ),
                                  ),
                                ),
                              ),

                              // Floating Glass Tooltip on Hover or Selection
                              if (isHovered)
                                Positioned(
                                  right: 58,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 14, vertical: 8),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withValues(alpha: 0.9),
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(
                                        color: Colors.white,
                                        width: 1.4,
                                      ),
                                      boxShadow: [
                                        BoxShadow(
                                          color: const Color(0xFF1E40AF)
                                              .withValues(alpha: 0.1),
                                          blurRadius: 16,
                                          offset: const Offset(0, 4),
                                        ),
                                      ],
                                    ),
                                    child: ClipRRect(
                                      borderRadius: BorderRadius.circular(16),
                                      child: BackdropFilter(
                                        filter: ImageFilter.blur(
                                            sigmaX: 16, sigmaY: 16),
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Text(
                                              agent.name,
                                              style: GoogleFonts.inter(
                                                fontSize: 12,
                                                fontWeight: FontWeight.w700,
                                                color: const Color(0xFF1E293B),
                                              ),
                                            ),
                                            Text(
                                              agent.description,
                                              style: GoogleFonts.inter(
                                                fontSize: 10,
                                                fontWeight: FontWeight.w400,
                                                color: const Color(0xFF64748B),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        ),
                      );
                    }),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _GlassDomeArcPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final double w = size.width;
    final double h = size.height;

    // Center of the large dome sphere
    final center = Offset(w * 0.75, h * 0.5);
    final radius = h * 0.46;

    // Ambient radial gradient for the translucent glass sphere
    final spherePaint = Paint()
      ..shader = RadialGradient(
        center: const Alignment(-0.3, -0.2),
        radius: 0.85,
        colors: [
          Colors.white.withValues(alpha: 0.45),
          const Color(0xFFBAE6FD).withValues(alpha: 0.25),
          const Color(0xFF60A5FA).withValues(alpha: 0.12),
          Colors.transparent,
        ],
        stops: const [0.0, 0.4, 0.75, 1.0],
      ).createShader(Rect.fromCircle(center: center, radius: radius));

    canvas.drawCircle(center, radius, spherePaint);

    // Glowing Specular Rim of the Dome
    final rimPaint = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          Color(0x99FFFFFF),
          Color(0x6693C5FD),
          Color(0x2238BDF8),
          Color(0x66FFFFFF),
        ],
      ).createShader(Rect.fromCircle(center: center, radius: radius))
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.2
      ..isAntiAlias = true;

    canvas.drawCircle(center, radius, rimPaint);

    // Outer soft glow aura
    final glowPaint = Paint()
      ..color = const Color(0xFF60A5FA).withValues(alpha: 0.15)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 18
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 12);
    canvas.drawCircle(center, radius, glowPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

