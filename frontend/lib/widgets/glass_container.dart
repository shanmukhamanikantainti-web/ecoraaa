import 'package:flutter/material.dart';
import 'dart:ui';
import '../app/theme/app_colors.dart';
import '../app/theme/app_spacing.dart';

class EcoraaGlassContainer extends StatelessWidget {
  final Widget child;
  final double blur;
  final BorderRadius? borderRadius;
  final Border? border;
  final Color? color;
  final double? width;
  final double? height;
  final EdgeInsetsGeometry? padding;
  final List<BoxShadow>? boxShadow;

  const EcoraaGlassContainer({
    super.key,
    required this.child,
    this.blur = 12.0,
    this.borderRadius,
    this.border,
    this.color,
    this.width,
    this.height,
    this.padding,
    this.boxShadow,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveRadius = borderRadius ?? AppSpacing.radiusLg;

    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        borderRadius: effectiveRadius,
        boxShadow: boxShadow ?? [
          BoxShadow(
            color: AppColors.glassShadow,
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: effectiveRadius,
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
          child: Container(
            padding: padding,
            decoration: BoxDecoration(
              color: color ?? AppColors.glassBackground,
              borderRadius: effectiveRadius,
              border: border ?? Border.all(
                color: AppColors.glassBorder,
                width: 1.0,
              ),
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}
