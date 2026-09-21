package com.pegasus.os.ui.theme

import android.app.Activity
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

/**
 * PEGASUS OS Theme
 * Dark Linux-inspired system UI
 *
 * Design principle: 80% neutral dark, 15% text/system, 5% accent
 * "A serious operating system with intelligence built into it."
 */

private val PegasusDarkColorScheme = darkColorScheme(
    primary = PegasusAccent,
    onPrimary = DeepBackground,
    primaryContainer = AccentBackground,
    onPrimaryContainer = PegasusAccent,

    secondary = SecondarySurface,
    onSecondary = PrimaryText,
    secondaryContainer = PrimarySurface,
    onSecondaryContainer = SecondaryText,

    tertiary = DarkAccent,
    onTertiary = PrimaryText,

    background = MainBackground,
    onBackground = PrimaryText,

    surface = PrimarySurface,
    onSurface = PrimaryText,
    surfaceVariant = SecondaryBackground,
    onSurfaceVariant = SecondaryText,

    outline = SubtleBorder,
    outlineVariant = StrongBorder,

    error = ErrorColor,
    onError = PrimaryText,

    inverseSurface = ElevatedSurface,
    inverseOnSurface = PrimaryText,
    inversePrimary = DarkAccent,

    surfaceTint = PegasusAccent
)

@Composable
fun PegasusOSTheme(
    content: @Composable () -> Unit
) {
    val colorScheme = PegasusDarkColorScheme
    val view = LocalView.current

    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = DeepBackground.toArgb()
            window.navigationBarColor = DeepBackground.toArgb()
            WindowCompat.getInsetsController(window, view).apply {
                isAppearanceLightStatusBars = false
                isAppearanceLightNavigationBars = false
            }
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = PegasusTypography,
        content = content
    )
}
