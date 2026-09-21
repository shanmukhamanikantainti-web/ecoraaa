import 'package:flutter/material.dart';

/// ECORAA Spacing & Shape Language System
class AppSpacing {
  // Base spacing scale
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 16.0;
  static const double lg = 24.0;
  static const double xl = 32.0;
  static const double xxl = 48.0;
  static const double xxxl = 64.0;

  // Semantic spacing
  static const double cardPadding = 16.0;
  static const double pagePadding = 24.0;
  static const double sectionGap = 24.0;
  static const double componentGap = 16.0;

  // Shape language - corner radius hierarchy
  static const BorderRadius radiusXs = BorderRadius.all(Radius.circular(4));
  static const BorderRadius radiusSm = BorderRadius.all(Radius.circular(6));
  static const BorderRadius radiusMd = BorderRadius.all(Radius.circular(8));
  static const BorderRadius radiusLg = BorderRadius.all(Radius.circular(12));
  static const BorderRadius radiusXl = BorderRadius.all(Radius.circular(16));
  static const BorderRadius radiusXxl = BorderRadius.all(Radius.circular(20));
}