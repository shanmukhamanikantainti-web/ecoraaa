enum MemoryCategory { personal, project, session, knowledge }

enum MemoryAccessLevel { public, private, restricted }

class MemoryItem {
  final String id;
  final MemoryCategory category;
  final String title;
  final String content;
  final Map<String, dynamic> metadata;
  final MemoryAccessLevel accessLevel;
  final bool pinned;
  final double createdAt;
  final double updatedAt;
  final double? expiresAt;

  MemoryItem({
    required this.id,
    required this.category,
    required this.title,
    required this.content,
    required this.metadata,
    required this.accessLevel,
    required this.pinned,
    required this.createdAt,
    required this.updatedAt,
    this.expiresAt,
  });

  factory MemoryItem.fromJson(Map<String, dynamic> json) {
    return MemoryItem(
      id: json['id'] ?? '',
      category: MemoryCategory.values.firstWhere(
        (e) => e.name == json['category'],
        orElse: () => MemoryCategory.personal,
      ),
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      metadata: Map<String, dynamic>.from(json['metadata'] ?? {}),
      accessLevel: MemoryAccessLevel.values.firstWhere(
        (e) => e.name.toLowerCase() == (json['access_level'] ?? 'private').toLowerCase(),
        orElse: () => MemoryAccessLevel.private,
      ),
      pinned: json['pinned'] ?? false,
      createdAt: (json['created_at'] as num?)?.toDouble() ?? 0.0,
      updatedAt: (json['updated_at'] as num?)?.toDouble() ?? 0.0,
      expiresAt: (json['expires_at'] as num?)?.toDouble(),
    );
  }
}