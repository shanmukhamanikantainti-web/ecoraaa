import 'dart:ui';
import 'package:flutter/material.dart';

class AmbientGlassBackground extends StatelessWidget {
  final Widget child;

  const AmbientGlassBackground({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // 1. Base clean frosty light gradient background
        Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFFF6FAFE),
                Color(0xFFEEF4FD),
                Color(0xFFE4EDFC),
              ],
            ),
          ),
        ),

        // 2. Glowing Ambient Orbs matching the design

        // Top-Right Large Soft Blue Glowing Sphere
        Positioned(
          top: -60,
          right: -40,
          child: Container(
            width: 460,
            height: 460,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  const Color(0xFF93C5FD).withValues(alpha: 0.65),
                  const Color(0xFF60A5FA).withValues(alpha: 0.35),
                  const Color(0xFF38BDF8).withValues(alpha: 0.15),
                  Colors.transparent,
                ],
                stops: const [0.0, 0.35, 0.65, 1.0],
              ),
            ),
          ),
        ),

        // Bottom-Right Large Translucent Glass Orb intersecting with the arc
        Positioned(
          right: -120,
          bottom: -100,
          child: Container(
            width: 520,
            height: 520,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  const Color(0xFF60A5FA).withValues(alpha: 0.45),
                  const Color(0xFF93C5FD).withValues(alpha: 0.25),
                  Colors.transparent,
                ],
                stops: const [0.0, 0.5, 1.0],
              ),
            ),
          ),
        ),

        // Bottom-Left Ambient Violet/Blue Orb behind sidebar corner
        Positioned(
          left: -80,
          bottom: -80,
          child: Container(
            width: 400,
            height: 400,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  const Color(0xFFC7D2FE).withValues(alpha: 0.6),
                  const Color(0xFF93C5FD).withValues(alpha: 0.4),
                  Colors.transparent,
                ],
                stops: const [0.0, 0.4, 1.0],
              ),
            ),
          ),
        ),

        // Top-Center Soft Ambient Light Orb
        Positioned(
          top: -100,
          left: 300,
          child: Container(
            width: 380,
            height: 380,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  const Color(0xFFBAE6FD).withValues(alpha: 0.45),
                  Colors.transparent,
                ],
                stops: const [0.0, 0.8],
              ),
            ),
          ),
        ),

        // Frosted glass atmospheric blur filter
        Positioned.fill(
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 45, sigmaY: 45),
            child: const SizedBox.expand(),
          ),
        ),

        // 3. Foreground Content
        child,
      ],
    );
  }
}

