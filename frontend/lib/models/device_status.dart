enum ConnectionState { disconnected, connecting, connected, error }

class DeviceStatus {
  final bool connected;
  final String deviceId;
  final String model;
  final String androidVersion;
  final int batteryLevel;
  final bool usbConnected;
  final bool adbAuthorized;
  final bool wifiConnected;

  DeviceStatus({
    required this.connected,
    required this.deviceId,
    required this.model,
    required this.androidVersion,
    required this.batteryLevel,
    required this.usbConnected,
    required this.adbAuthorized,
    required this.wifiConnected,
  });

  factory DeviceStatus.fromJson(Map<String, dynamic> json) {
    return DeviceStatus(
      connected: json['connected'] ?? false,
      deviceId: json['device_id'] ?? '',
      model: json['model'] ?? '',
      androidVersion: json['android_version'] ?? '',
      batteryLevel: json['battery_level'] ?? 0,
      usbConnected: json['usb_connected'] ?? false,
      adbAuthorized: json['adb_authorized'] ?? false,
      wifiConnected: json['wifi_connected'] ?? false,
    );
  }
}