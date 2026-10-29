import UIKit

/// Modern Compatibility Layer #3:
/// Backports iOS 13+ UITableView.Style.insetGrouped and Dark Mode palette to iOS 9.0 - 12.x
public enum DLiPAThemeCompat {
    public static let backgroundPrimary = UIColor(red: 0.0, green: 0.0, blue: 0.0, alpha: 1.0)
    public static let surfaceCard = UIColor(red: 0.11, green: 0.11, blue: 0.118, alpha: 1.0)
    public static let textPrimary = UIColor.white
    public static let textSecondary = UIColor(red: 0.557, green: 0.557, blue: 0.576, alpha: 1.0)
    public static let accentBlue = UIColor(red: 0.039, green: 0.518, blue: 1.0, alpha: 1.0)

    public static func makeInsetGroupedTableView() -> UITableView {
        if #available(iOS 13.0, *) {
            let table = UITableView(frame: .zero, style: .insetGrouped)
            table.backgroundColor = backgroundPrimary
            return table
        } else {
            let table = UITableView(frame: .zero, style: .grouped)
            table.backgroundColor = backgroundPrimary
            table.separatorColor = UIColor(white: 1.0, alpha: 0.12)
            return table
        }
    }
}
