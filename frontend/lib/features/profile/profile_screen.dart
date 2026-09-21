import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../app/theme/app_spacing.dart';
import '../../services/api_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final TextEditingController _pairCodeController = TextEditingController();
  late Future<Map<String, dynamic>> _pairingFuture;
  bool _isPairing = false;

  @override
  void initState() {
    super.initState();
    _fetchPairing();
  }

  void _fetchPairing() {
    setState(() {
      _pairingFuture = context.read<ApiService>().getPairingStatus();
    });
  }

  Future<void> _pairDevice() async {
    final code = _pairCodeController.text.trim();
    if (code.isEmpty) return;

    setState(() {
      _isPairing = true;
    });

    try {
      final res = await context.read<ApiService>().pairDevice(code);
      if (res['status'] == 'authenticated') {
        _fetchPairing();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Android device paired successfully!')),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Pairing failed: ${res['message']}')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Pairing error: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isPairing = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _pairCodeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.pagePadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Profile & Device Connection', style: AppTypography.pageTitle),
                  const SizedBox(height: 4),
                  Text(
                    'Manage your session, Android pairing, and system preferences',
                    style: AppTypography.metadata,
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              Expanded(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // User Profile Card
                    Expanded(
                      flex: 1,
                      child: Container(
                        padding: const EdgeInsets.all(AppSpacing.lg),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: AppSpacing.radiusLg,
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                CircleAvatar(
                                  radius: 28,
                                  backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                                  child: Icon(Icons.person_outline, size: 32, color: AppColors.primary),
                                ),
                                const SizedBox(width: 16),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Developer', style: AppTypography.sectionTitle),
                                    Text('ECORAA Core Session', style: AppTypography.metadata),
                                  ],
                                ),
                              ],
                            ),
                            const Divider(height: 32),
                            Text('Session Token:', style: AppTypography.metadata.copyWith(fontWeight: FontWeight.w600)),
                            const SizedBox(height: 4),
                            Text('eco_sec_tok_99184', style: AppTypography.bodySmall.copyWith(fontFamily: 'monospace')),
                            const SizedBox(height: 16),
                            Text('Security Boundary:', style: AppTypography.metadata.copyWith(fontWeight: FontWeight.w600)),
                            const SizedBox(height: 4),
                            Text('Sandboxed Workspace Access Only', style: AppTypography.bodySmall),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.lg),

                    // Pairing & Connection Panel
                    Expanded(
                      flex: 2,
                      child: Container(
                        padding: const EdgeInsets.all(AppSpacing.lg),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: AppSpacing.radiusLg,
                          border: Border.all(color: AppColors.border),
                        ),
                        child: FutureBuilder<Map<String, dynamic>>(
                          future: _pairingFuture,
                          builder: (context, snapshot) {
                            final paired = snapshot.data?['paired'] ?? false;
                            final code = snapshot.data?['code'] ?? 'ECORAA-4821';
                            final deviceName = snapshot.data?['device_name'] ?? 'ECORAA-ANDROID-PAD';

                            return Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Android Pairing Status', style: AppTypography.sectionTitle),
                                const SizedBox(height: 16),
                                Container(
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: paired ? AppColors.success.withValues(alpha: 0.1) : AppColors.warning.withValues(alpha: 0.1),
                                    borderRadius: AppSpacing.radiusSm,
                                    border: Border.all(color: paired ? AppColors.success : AppColors.warning),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(paired ? Icons.check_circle : Icons.sync_problem, color: paired ? AppColors.success : AppColors.warning),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              paired ? '● Android Connected ($deviceName)' : '○ Android Disconnected',
                                              style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.w600, color: paired ? AppColors.success : AppColors.warning),
                                            ),
                                            const SizedBox(height: 2),
                                            Text(
                                              paired ? 'Session synchronized via WebSocket server' : 'Enter pairing code on your Android device to connect',
                                              style: AppTypography.metadata,
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 24),
                                Text('Pairing Code:', style: AppTypography.metadata.copyWith(fontWeight: FontWeight.w600)),
                                const SizedBox(height: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                  decoration: BoxDecoration(
                                    color: AppColors.background,
                                    borderRadius: AppSpacing.radiusSm,
                                    border: Border.all(color: AppColors.border),
                                  ),
                                  child: Text(
                                    code,
                                    style: AppTypography.pageTitle.copyWith(fontSize: 22, letterSpacing: 2, color: AppColors.primary),
                                  ),
                                ),
                                const SizedBox(height: 24),
                                Text('Manual Code Entry / Test Pair:', style: AppTypography.metadata.copyWith(fontWeight: FontWeight.w600)),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    Expanded(
                                      child: TextField(
                                        controller: _pairCodeController,
                                        decoration: const InputDecoration(
                                          hintText: 'Enter code (e.g., ECORAA-4821)',
                                          border: OutlineInputBorder(),
                                          contentPadding: EdgeInsets.symmetric(horizontal: 12),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    ElevatedButton(
                                      onPressed: _isPairing ? null : _pairDevice,
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: AppColors.primary,
                                        foregroundColor: Colors.white,
                                        minimumSize: const Size(100, 48),
                                      ),
                                      child: _isPairing ? const CircularProgressIndicator(color: Colors.white) : const Text('Pair Device'),
                                    ),
                                  ],
                                ),
                              ],
                            );
                          },
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
