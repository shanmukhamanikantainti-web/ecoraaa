import 'package:flutter/material.dart';

/// ECORAA / AI Assist Official Color System
class AppColors {
  // Brand & Accent Colors
  static const Color primary = Color(0xFF1877F2);
  static const Color primaryBlue = Color(0xFF2563EB);
  static const Color vibrantBlue = Color(0xFF3B82F6);
  static const Color darkBlue = Color(0xFF1D4ED8);
  static const Color royalBlue = Color(0xFF1E40AF);
  static const Color electricCyan = Color(0xFF38BDF8);
  static const Color cyanGlow = Color(0xFF00C6FF);

  // Backgrounds & Surface Tones
  static const Color background = Color(0xFFF1F5FD);
  static const Color backgroundDeep = Color(0xFFE5EDFB);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceSoft = Color(0xFFF8FAFC);
  static const Color border = Color(0xFFE2E8F0);
  static const Color borderSubtle = Color(0xFFEEF2F6);

  // Typography Colors
  static const Color textHeadline = Color(0xFF0F172A);
  static const Color textPrimary = Color(0xFF1E293B);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color textMuted = Color(0xFF94A3B8);
  static const Color textLight = Color(0xFFCBD5E1);

  // Status & Feedback
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color statusOnline = Color(0xFF10B981);

  // Glass Material Opacities & Tints
  static final Color glassBackground = Colors.white.withValues(alpha: 0.72);
  static final Color glassBackgroundElevated = Colors.white.withValues(alpha: 0.88);
  static final Color glassBackgroundHover = Colors.white.withValues(alpha: 0.95);
  static final Color glassBorder = Colors.white.withValues(alpha: 0.85);
  static final Color glassBorderSubtle = const Color(0xFF93C5FD).withValues(alpha: 0.35);
  static final Color glassBorderActive = const Color(0xFF3B82F6).withValues(alpha: 0.55);
  static final Color glassHighlight = Colors.white.withValues(alpha: 0.6);
  static final Color glassShadow = const Color(0xFF1E40AF).withValues(alpha: 0.08);
  static final Color glassGlow = const Color(0xFF3B82F6).withValues(alpha: 0.18);

  // Gradients
  static const LinearGradient primaryPillGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFF3B82F6),
      Color(0xFF1D4ED8),
    ],
  );

  static const LinearGradient starGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFF38BDF8),
      Color(0xFF2563EB),
      Color(0xFF1D4ED8),
    ],
  );

  static const LinearGradient activeCardGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0x333B82F6),
      Color(0x153B82F6),
    ],
  );
}
