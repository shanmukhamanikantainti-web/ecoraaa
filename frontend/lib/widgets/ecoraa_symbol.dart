import 'package:flutter/material.dart';
import '../app/theme/app_colors.dart';

class EcoraaSymbol extends StatelessWidget {
  final double size;
  final Color? color;

  const EcoraaSymbol({
    super.key,
    this.size = 32,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final activeColor = color ?? AppColors.primary;

    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(
        painter: _EcoraaSymbolPainter(color: activeColor),
      ),
    );
  }
}

class _EcoraaSymbolPainter extends CustomPainter {
  final Color color;

  _EcoraaSymbolPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill
      ..isAntiAlias = true;

    final double w = size.width;
    final double h = size.height;

    // A beautiful, precise geometric symbol representing connection and intelligence:
    // A centralized precision circle intersected by elegant orbital rings or lines,
    // forming a minimal, confident geometric emblem (Apple-level craftsmanship/discipline).

    // Draw central node
    final double centerSize = w * 0.28;
    canvas.drawCircle(Offset(w / 2, h / 2), centerSize, paint);

    // Draw the surrounding precision arcs representing intelligence / human intersection
    final strokePaint = Paint()
      ..color = color.withValues(alpha: 0.8)
      ..style = PaintingStyle.stroke
      ..strokeWidth = w * 0.08
      ..isAntiAlias = true
      ..strokeCap = StrokeCap.round;

    final outerRect = Rect.fromLTWH(
      w * 0.1,
      h * 0.1,
      w * 0.8,
      h * 0.8,
    );

    // Orbital path 1
    canvas.drawArc(
      outerRect,
      -0.6, // Start angle (radians)
      2.5,  // Sweep angle
      false,
      strokePaint,
    );

    // Orbital path 2
    canvas.drawArc(
      outerRect,
      2.5, // Start angle
      2.5, // Sweep angle
      false,
      strokePaint,
    );
  }

  @override
  bool shouldRepaint(covariant _EcoraaSymbolPainter oldDelegate) {
    return oldDelegate.color != color;
  }
}
