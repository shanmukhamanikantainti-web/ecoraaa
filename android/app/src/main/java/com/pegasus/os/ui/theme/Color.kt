package com.pegasus.os.ui.theme

import androidx.compose.ui.graphics.Color

/**
 * PEGASUS OS Color System
 * From UI Design Instructions: 80% neutral dark, 15% text/system, 5% accent
 */

// ── Backgrounds ──
val DeepBackground = Color(0xFF090C10)
val MainBackground = Color(0xFF0D1117)
val SecondaryBackground = Color(0xFF11161D)

// ── Surfaces ──
val PrimarySurface = Color(0xFF151B23)
val SecondarySurface = Color(0xFF1A212B)
val ElevatedSurface = Color(0xFF202833)

// ── Borders ──
val SubtleBorder = Color(0xFF2A333E)
val StrongBorder = Color(0xFF36414D)

// ── PEGASUS Accent (Muted Teal) ──
val PegasusAccent = Color(0xFF3FB8A5)
val AccentHover = Color(0xFF52C7B5)
val DarkAccent = Color(0xFF287F73)
val AccentBackground = Color(0xFF102A27)

// ── Text ──
val PrimaryText = Color(0xFFE6EDF3)
val SecondaryText = Color(0xFF9DA7B3)
val TertiaryText = Color(0xFF687481)
val DisabledText = Color(0xFF4B5561)

// ── Status ──
val SuccessColor = Color(0xFF4FAF78)
val WarningColor = Color(0xFFD6A84F)
val ErrorColor = Color(0xFFD05C5C)
val InfoColor = Color(0xFF6B9FC8)

// ── Agent States ──
val AgentRunning = PegasusAccent
val AgentIdle = TertiaryText
val AgentFailed = ErrorColor
val AgentCompleted = SuccessColor
