import 'package:flutter/material.dart';

/// ECORAA Official Color System
class AppColors {
  // Official Palette
  static const Color nearWhite = Color(0xFFFAFAFA);
  static const Color springtimeRain = Color(0xFFEDEFF3);
  static const Color windWeaver = Color(0xFFC6D1D7);
  static const Color wildThistle = Color(0xFF9FA0B5);
  static const Color soothingSapphire = Color(0xFF2F7EDA);
  static const Color blackwater = Color(0xFF555663);

  // Semantic mappings
  static const Color primary = soothingSapphire;
  static const Color background = nearWhite;
  static const Color surface = springtimeRain;
  static const Color border = windWeaver;
  static const Color textPrimary = blackwater;
  static const Color textSecondary = wildThistle;

  // Feedback states
  static const Color success = Color(0xFF28A745);
  static const Color warning = Color(0xFFFFC107);
  static const Color error = Color(0xFFDC3545);

  // Glass Material Opacities & Tints
  static final Color glassBackground = nearWhite.withValues(alpha: 0.85);
  static final Color glassBorder = windWeaver.withValues(alpha: 0.6);
  static final Color glassHighlight = Colors.white.withValues(alpha: 0.5);
  static final Color glassShadow = blackwater.withValues(alpha: 0.06);
}
