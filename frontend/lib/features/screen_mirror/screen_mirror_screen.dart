import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../widgets/glass_container.dart';

class ScreenMirrorScreen extends StatefulWidget {
  const ScreenMirrorScreen({super.key});

  @override
  State<ScreenMirrorScreen> createState() => _ScreenMirrorScreenState();
}

class _ScreenMirrorScreenState extends State<ScreenMirrorScreen> {
  bool _isRemoteControlActive = true;
  bool _isLandscape = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.pagePadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Screen Mirror', style: AppTypography.pageTitle),
                      const SizedBox(height: 4),
                      Text(
                        'View and control your PEGASUS device in real time',
                        style: AppTypography.metadata,
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.success.withValues(alpha: 0.1),
                          borderRadius: AppSpacing.radiusSm,
                          border: Border.all(color: AppColors.success.withValues(alpha: 0.3)),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: AppColors.success,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 6),
                            Text(
                              'Live • 60 FPS • 24 ms • 1080p',
                              style: AppTypography.metadata.copyWith(color: AppColors.success, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              // Screen Mirror Viewport & Controls Split
              Expanded(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Smartphone Frame Container
                    Expanded(
                      flex: 3,
                      child: EcoraaGlassContainer(
                        borderRadius: AppSpacing.radiusLg,
                        child: Center(
                          child: Container(
                            width: _isLandscape ? 580 : 300,
                            height: _isLandscape ? 330 : 540,
                            decoration: BoxDecoration(
                              color: const Color(0xFF1E293B),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: const Color(0xFF334155), width: 4),
                              boxShadow: const [
                                BoxShadow(
                                  color: Colors.black45,
                                  blurRadius: 30,
                                  offset: Offset(0, 10),
                                ),
                              ],
                            ),
                            child: Column(
                              children: [
                                // Phone Status Header
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                                  color: Colors.black26,
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text('10:24', style: AppTypography.metadata.copyWith(color: Colors.white, fontSize: 10)),
                                      Row(
                                        children: [
                                          const Icon(Icons.wifi, size: 12, color: Colors.white),
                                          const SizedBox(width: 4),
                                          const Icon(Icons.battery_full, size: 12, color: Colors.white),
                                          const SizedBox(width: 4),
                                          Text('82%', style: AppTypography.metadata.copyWith(color: Colors.white, fontSize: 10)),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),

                                // Simulated Display Content
                                Expanded(
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        '10:24',
                                        style: AppTypography.pageTitle.copyWith(color: Colors.white, fontSize: 36),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        'Mon, May 10',
                                        style: AppTypography.metadata.copyWith(color: const Color(0xFF94A3B8)),
                                      ),
                                      const SizedBox(height: 24),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          _PhoneAppIcon(icon: Icons.folder, color: AppColors.primary),
                                          const SizedBox(width: 16),
                                          _PhoneAppIcon(icon: Icons.terminal, color: const Color(0xFF06B6D4)),
                                          const SizedBox(width: 16),
                                          _PhoneAppIcon(icon: Icons.language, color: AppColors.success),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.lg),

                    // Controls Panel
                    Expanded(
                      flex: 1,
                      child: EcoraaGlassContainer(
                        padding: const EdgeInsets.all(AppSpacing.lg),
                        borderRadius: AppSpacing.radiusLg,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Control Options', style: AppTypography.sectionTitle),
                            const SizedBox(height: AppSpacing.md),
                            
                            ElevatedButton.icon(
                              onPressed: () {
                                setState(() => _isRemoteControlActive = !_isRemoteControlActive);
                              },
                              icon: Icon(_isRemoteControlActive ? Icons.mouse : Icons.mouse_outlined, size: 16),
                              label: Text(_isRemoteControlActive ? 'Remote Active' : 'Enable Control'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: _isRemoteControlActive ? AppColors.primary : AppColors.background,
                                foregroundColor: _isRemoteControlActive ? Colors.white : AppColors.textPrimary,
                                minimumSize: const Size.fromHeight(40),
                                elevation: 0,
                                shape: RoundedRectangleBorder(borderRadius: AppSpacing.radiusSm),
                              ),
                            ),
                            const SizedBox(height: AppSpacing.sm),
                            OutlinedButton.icon(
                              onPressed: () {
                                setState(() => _isLandscape = !_isLandscape);
                              },
                              icon: const Icon(Icons.screen_rotation, size: 16),
                              label: Text(_isLandscape ? 'Landscape' : 'Portrait'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: AppColors.textPrimary,
                                side: const BorderSide(color: AppColors.border),
                                minimumSize: const Size.fromHeight(40),
                                shape: RoundedRectangleBorder(borderRadius: AppSpacing.radiusSm),
                              ),
                            ),
                            const SizedBox(height: AppSpacing.sm),
                            OutlinedButton.icon(
                              onPressed: () {},
                              icon: const Icon(Icons.camera_alt_outlined, size: 16),
                              label: const Text('Take Screenshot'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: AppColors.textPrimary,
                                side: const BorderSide(color: AppColors.border),
                                minimumSize: const Size.fromHeight(40),
                                shape: RoundedRectangleBorder(borderRadius: AppSpacing.radiusSm),
                              ),
                            ),
                            const SizedBox(height: AppSpacing.sm),
                            OutlinedButton.icon(
                              onPressed: () {},
                              icon: const Icon(Icons.fullscreen, size: 16),
                              label: const Text('Fullscreen'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: AppColors.textPrimary,
                                side: const BorderSide(color: AppColors.border),
                                minimumSize: const Size.fromHeight(40),
                                shape: RoundedRectangleBorder(borderRadius: AppSpacing.radiusSm),
                              ),
                            ),

                            const Spacer(),
                            const Divider(),
                            const SizedBox(height: 8),
                            Text('Session Info', style: AppTypography.metadata.copyWith(fontWeight: FontWeight.w700)),
                            const SizedBox(height: 6),
                            Text('Bitrate: 8 Mbps', style: AppTypography.metadata),
                            Text('Codec: H.264', style: AppTypography.metadata),
                            Text('Latency: 24ms', style: AppTypography.metadata),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _PhoneAppIcon extends StatelessWidget {
  final IconData icon;
  final Color color;

  const _PhoneAppIcon({required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 44,
      height: 44,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Icon(icon, color: Colors.white, size: 20),
    );
  }
}