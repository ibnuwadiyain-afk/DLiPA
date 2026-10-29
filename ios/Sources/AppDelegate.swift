import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        // Direct UIWindow initialization without UISceneDelegate so iOS 9.0 - 12.5.7 launch cleanly
        let win = UIWindow(frame: UIScreen.main.bounds)
        win.backgroundColor = DLiPAThemeCompat.backgroundPrimary
        win.rootViewController = MainTabBarController()
        win.makeKeyAndVisible()
        self.window = win
        return true
    }
}
