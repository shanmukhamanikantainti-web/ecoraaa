import 'dart:io';

abstract class PlatformService {
  Future<Map<String, dynamic>> getDeviceInfo();
  Future<bool> requestStoragePermission();
  Future<bool> requestNotificationPermission();
  Future<void> openSettings();
  Future<String?> getAppDirectory();
  Future<bool> isDesktop();
  Future<bool> isMobile();
  Future<bool> isAndroid();
}

class PlatformServiceImpl implements PlatformService {
  @override
  Future<bool> isDesktop() async {
    return Platform.isWindows || Platform.isMacOS || Platform.isLinux;
  }

  @override
  Future<bool> isMobile() async {
    return Platform.isAndroid || Platform.isIOS;
  }

  @override
  Future<bool> isAndroid() async {
    return Platform.isAndroid;
  }

  @override
  Future<Map<String, dynamic>> getDeviceInfo() async {
    return {
      'os': Platform.operatingSystem,
      'version': Platform.operatingSystemVersion,
      'isDesktop': await isDesktop(),
      'isMobile': await isMobile(),
    };
  }

  @override
  Future<bool> requestStoragePermission() async {
    // Will be implemented via MethodChannel for Android
    return true;
  }

  @override
  Future<bool> requestNotificationPermission() async {
    // Will be implemented via platform-specific code
    return true;
  }

  @override
  Future<void> openSettings() async {
    // Will be implemented via platform-specific code
  }

  @override
  Future<String?> getAppDirectory() async {
    // Will be implemented via path_provider or similar
    return null;
  }
}