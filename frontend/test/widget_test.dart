import 'package:flutter_test/flutter_test.dart';
import 'package:ecoraa/app/app.dart';

void main() {
  testWidgets('App load smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const EcoraaApp());

    // Verify that ECORAA text is present
    expect(find.text('ECORAA'), findsWidgets);
  });
}