import 'package:flutter_test/flutter_test.dart';
import 'package:ecoraa/app/app.dart';

void main() {
  testWidgets('App load smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const EcoraaApp());
    await tester.pump(const Duration(milliseconds: 500));

    // Verify that AI Assist text is present
    expect(find.text('AI Assist'), findsWidgets);
  });
}