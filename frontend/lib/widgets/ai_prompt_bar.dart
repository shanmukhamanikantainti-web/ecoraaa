import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AiPromptBar extends StatefulWidget {
  final TextEditingController controller;
  final ValueChanged<String> onSubmitted;
  final VoidCallback? onAttachTap;
  final VoidCallback? onUploadTap;
  final VoidCallback? onMicTap;
  final bool isSending;
  final String hintText;

  const AiPromptBar({
    super.key,
    required this.controller,
    required this.onSubmitted,
    this.onAttachTap,
    this.onUploadTap,
    this.onMicTap,
    this.isSending = false,
    this.hintText = 'Type your message...',
  });

  @override
  State<AiPromptBar> createState() => _AiPromptBarState();
}

class _AiPromptBarState extends State<AiPromptBar> {
  bool _hasText = false;

  @override
  void initState() {
    super.initState();
    _hasText = widget.controller.text.trim().isNotEmpty;
    widget.controller.addListener(_onTextChanged);
  }

  void _onTextChanged() {
    final hasText = widget.controller.text.trim().isNotEmpty;
    if (hasText != _hasText) {
      setState(() {
        _hasText = hasText;
      });
    }
  }

  @override
  void dispose() {
    widget.controller.removeListener(_onTextChanged);
    super.dispose();
  }

  void _submit() {
    final text = widget.controller.text.trim();
    if (text.isNotEmpty && !widget.isSending) {
      widget.onSubmitted(text);
      widget.controller.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 64,
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.85),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.95),
          width: 1.8,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1E40AF).withValues(alpha: 0.08),
            blurRadius: 30,
            offset: const Offset(0, 10),
          ),
          BoxShadow(
            color: const Color(0xFF3B82F6).withValues(alpha: 0.05),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(32),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 24, sigmaY: 24),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            child: LayoutBuilder(
              builder: (context, constraints) {
                final isCompact = constraints.maxWidth < 400;
                return Row(
                  children: [
                    // 1. Paperclip attachment button
                    IconButton(
                      icon: const Icon(
                        Icons.attach_file_rounded,
                        color: Color(0xFF64748B),
                        size: 22,
                      ),
                      tooltip: 'Attach File',
                      onPressed: widget.onAttachTap ?? () {},
                    ),

                    const SizedBox(width: 4),

                    // 2. Text input
                    Expanded(
                      child: TextField(
                        controller: widget.controller,
                        style: GoogleFonts.inter(
                          fontSize: 15,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF1E293B),
                        ),
                        decoration: InputDecoration(
                          hintText: widget.hintText,
                          hintStyle: GoogleFonts.inter(
                            fontSize: isCompact ? 13 : 15,
                            fontWeight: FontWeight.w400,
                            color: const Color(0xFF94A3B8),
                          ),
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(vertical: 14),
                        ),
                        onSubmitted: (_) => _submit(),
                      ),
                    ),

                    // 3. Upload / Export button
                    if (!isCompact)
                      IconButton(
                        icon: const Icon(
                          Icons.file_upload_outlined,
                          color: Color(0xFF64748B),
                          size: 21,
                        ),
                        tooltip: 'Upload Document',
                        onPressed: widget.onUploadTap ?? () {},
                      ),

                    // 4. Microphone voice button
                    if (!isCompact)
                      IconButton(
                        icon: const Icon(
                          Icons.mic_none_rounded,
                          color: Color(0xFF64748B),
                          size: 22,
                        ),
                        tooltip: 'Voice Input',
                        onPressed: widget.onMicTap ?? () {},
                      ),

                    const SizedBox(width: 4),

                    // 5. Circular Blue Send Button with glowing paper plane
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: const LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Color(0xFF3B82F6),
                            Color(0xFF1D4ED8),
                          ],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF2563EB).withValues(alpha: 0.4),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          customBorder: const CircleBorder(),
                          onTap: widget.isSending ? null : _submit,
                          child: Center(
                            child: widget.isSending
                                ? const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      color: Colors.white,
                                    ),
                                  )
                                : const Icon(
                                    Icons.near_me_rounded,
                                    color: Colors.white,
                                    size: 20,
                                  ),
                          ),
                        ),
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}
