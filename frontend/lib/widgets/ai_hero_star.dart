import 'dart:math' as math;
import 'package:flutter/material.dart';

class AiHeroStar extends StatefulWidget {
  final double size;
  const AiHeroStar({super.key, this.size = 140});

  @override
  State<AiHeroStar> createState() => _AiHeroStarState();
}

class _AiHeroStarState extends State<AiHeroStar>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 8),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          size: Size(widget.size * 1.6, widget.size * 1.4),
          painter: _AiHeroStarPainter(
            animationValue: _controller.value,
          ),
        );
      },
    );
  }
}

class _AiHeroStarPainter extends CustomPainter {
  final double animationValue;

  _AiHeroStarPainter({required this.animationValue});

  @override
  void paint(Canvas canvas, Size size) {
    final double cx = size.width / 2;
    final double cy = size.height / 2;
    final center = Offset(cx, cy);
    final double sphereRadius = size.width * 0.28;

    // 1. Draw glowing background ambient aura
    final auraPaint = Paint()
      ..shader = RadialGradient(
        colors: [
          const Color(0xFF60A5FA).withValues(alpha: 0.4),
          const Color(0xFF93C5FD).withValues(alpha: 0.18),
          Colors.transparent,
        ],
        stops: const [0.0, 0.55, 1.0],
      ).createShader(Rect.fromCircle(center: center, radius: sphereRadius * 1.8));
    canvas.drawCircle(center, sphereRadius * 1.8, auraPaint);

    // 2. Draw Translucent Frosted Glass Bubble Sphere around star
    final glassSpherePaint = Paint()
      ..shader = RadialGradient(
        center: const Alignment(-0.25, -0.3),
        radius: 0.85,
        colors: [
          Colors.white.withValues(alpha: 0.65),
          const Color(0xFFDBEAFE).withValues(alpha: 0.35),
          const Color(0xFF93C5FD).withValues(alpha: 0.15),
          Colors.white.withValues(alpha: 0.4),
        ],
        stops: const [0.0, 0.4, 0.8, 1.0],
      ).createShader(Rect.fromCircle(center: center, radius: sphereRadius));
    canvas.drawCircle(center, sphereRadius, glassSpherePaint);

    // Glass Sphere Specular Rim
    final glassRimPaint = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          Color(0xEEFFFFFF),
          Color(0x4493C5FD),
          Color(0x1160A5FA),
          Color(0x88FFFFFF),
        ],
      ).createShader(Rect.fromCircle(center: center, radius: sphereRadius))
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.8
      ..isAntiAlias = true;
    canvas.drawCircle(center, sphereRadius, glassRimPaint);

    // Soft Crescent Specular Highlight on top-left of glass bubble
    final specularPath = Path();
    specularPath.addArc(
      Rect.fromCircle(center: center + const Offset(-4, -4), radius: sphereRadius * 0.88),
      -math.pi * 0.85,
      math.pi * 0.55,
    );
    final specularPaint = Paint()
      ..color = Colors.white.withValues(alpha: 0.8)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 2);
    canvas.drawPath(specularPath, specularPaint);

    // 3. Draw surrounding floating mini sparkle stars (arc formation)
    final double breathe = math.sin(animationValue * 2 * math.pi);

    // Top-left outer
    _drawMiniSparkle(
      canvas,
      Offset(cx - sphereRadius * 1.3, cy - sphereRadius * 0.65 + breathe * 2),
      size: 11,
      color: const Color(0xFF60A5FA).withValues(alpha: 0.75 + 0.2 * breathe),
    );

    // Top-left inner
    _drawMiniSparkle(
      canvas,
      Offset(cx - sphereRadius * 0.8, cy - sphereRadius * 1.15 - breathe * 2),
      size: 8,
      color: const Color(0xFF93C5FD).withValues(alpha: 0.8),
    );

    // Top-right inner
    _drawMiniSparkle(
      canvas,
      Offset(cx + sphereRadius * 0.85, cy - sphereRadius * 1.1 + breathe * 2),
      size: 9,
      color: const Color(0xFF3B82F6).withValues(alpha: 0.85),
    );

    // Top-right outer
    _drawMiniSparkle(
      canvas,
      Offset(cx + sphereRadius * 1.35, cy - sphereRadius * 0.55 - breathe * 2),
      size: 13,
      color: const Color(0xFF60A5FA).withValues(alpha: 0.75 - 0.2 * breathe),
    );

    // Middle-right
    _drawMiniSparkle(
      canvas,
      Offset(cx + sphereRadius * 1.45, cy + sphereRadius * 0.2 + breathe * 3),
      size: 7,
      color: const Color(0xFF38BDF8).withValues(alpha: 0.7),
    );

    // 4. Draw Main 3D 4-Point Faceted Sparkle Star
    final double starRadius = sphereRadius * 0.82;
    final double innerRadius = starRadius * 0.26;

    // Star Drop Shadow
    final shadowPath = _createSparklePath(
      center + const Offset(0, 6),
      starRadius * 0.95,
      innerRadius * 0.95,
    );
    final shadowPaint = Paint()
      ..color = const Color(0xFF1E40AF).withValues(alpha: 0.25)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 10);
    canvas.drawPath(shadowPath, shadowPaint);

    // Star Base Body Fill
    final mainStarPath = _createSparklePath(center, starRadius, innerRadius);
    final starGradientPaint = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          Color(0xFF60A5FA),
          Color(0xFF2563EB),
          Color(0xFF1D4ED8),
        ],
      ).createShader(Rect.fromCircle(center: center, radius: starRadius))
      ..style = PaintingStyle.fill;
    canvas.drawPath(mainStarPath, starGradientPaint);

    // Volumetric 3D Facets (Top, Left, Right, Bottom)
    _drawVolumetricFacets(canvas, center, starRadius, innerRadius);

    // Center Core Glow & Specular Light Point
    final centerCorePaint = Paint()
      ..shader = RadialGradient(
        colors: [
          Colors.white,
          const Color(0xFF93C5FD).withValues(alpha: 0.7),
          Colors.transparent,
        ],
        stops: const [0.0, 0.45, 1.0],
      ).createShader(Rect.fromCircle(center: center, radius: innerRadius * 1.4));
    canvas.drawCircle(center, innerRadius * 1.1, centerCorePaint);
  }

  Path _createSparklePath(Offset center, double outerR, double innerR) {
    final path = Path();
    const int points = 4;
    for (int i = 0; i < points * 2; i++) {
      final double r = (i % 2 == 0) ? outerR : innerR;
      final double angle = i * math.pi / points - math.pi / 2;
      final double x = center.dx + r * math.cos(angle);
      final double y = center.dy + r * math.sin(angle);
      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }
    path.close();
    return path;
  }

  void _drawVolumetricFacets(
      Canvas canvas, Offset center, double outerR, double innerR) {
    // 1. Top-Left Highlight facet
    final topFacet = Path()
      ..moveTo(center.dx, center.dy)
      ..lineTo(center.dx, center.dy - outerR)
      ..lineTo(center.dx - innerR, center.dy)
      ..close();
    final topHighlightPaint = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          Color(0xFFBAE6FD),
          Color(0xFF60A5FA),
        ],
      ).createShader(Rect.fromCircle(center: center, radius: outerR))
      ..style = PaintingStyle.fill;
    canvas.drawPath(topFacet, topHighlightPaint);

    // 2. Right Facet with Cyan / Electric Blue shine
    final rightFacet = Path()
      ..moveTo(center.dx, center.dy)
      ..lineTo(center.dx + outerR, center.dy)
      ..lineTo(center.dx, center.dy - innerR)
      ..close();
    final rightHighlightPaint = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
        colors: [
          Color(0xFF67E8F9),
          Color(0xFF2563EB),
        ],
      ).createShader(Rect.fromCircle(center: center, radius: outerR))
      ..style = PaintingStyle.fill;
    canvas.drawPath(rightFacet, rightHighlightPaint);

    // 3. Bottom Shadow Facet (Deep Navy)
    final bottomFacet = Path()
      ..moveTo(center.dx, center.dy)
      ..lineTo(center.dx, center.dy + outerR)
      ..lineTo(center.dx + innerR, center.dy)
      ..close();
    final bottomShadowPaint = Paint()
      ..color = const Color(0xFF1E3A8A).withValues(alpha: 0.55)
      ..style = PaintingStyle.fill;
    canvas.drawPath(bottomFacet, bottomShadowPaint);

    // 4. Left Bottom Facet
    final leftBottomFacet = Path()
      ..moveTo(center.dx, center.dy)
      ..lineTo(center.dx - outerR, center.dy)
      ..lineTo(center.dx, center.dy + innerR)
      ..close();
    final leftBottomPaint = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topRight,
        end: Alignment.bottomLeft,
        colors: [
          Color(0xFF3B82F6),
          Color(0xFF1E40AF),
        ],
      ).createShader(Rect.fromCircle(center: center, radius: outerR))
      ..style = PaintingStyle.fill;
    canvas.drawPath(leftBottomFacet, leftBottomPaint);
  }

  void _drawMiniSparkle(Canvas canvas, Offset center,
      {required double size, required Color color}) {
    final path = _createSparklePath(center, size, size * 0.28);
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant _AiHeroStarPainter oldDelegate) {
    return oldDelegate.animationValue != animationValue;
  }
}

