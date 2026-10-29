import UIKit

/// Modern Compatibility Layer #2:
/// Polyfills UIImage(systemName:) (iOS 13+) using CoreGraphics Bezier vector rendering on iOS 9.0 - 12.5.7
public enum DLiPAIconSymbol: String {
    case search = "magnifyingglass"
    case downloads = "arrow.down.square"
    case accounts = "person"
    case settings = "gearshape"
    case clear = "xmark.circle.fill"
    case back = "chevron.left"
}

public final class SFSymbolsLegacyFallback {
    public static func image(_ symbol: DLiPAIconSymbol, size: CGFloat = 22, tintColor: UIColor = .white) -> UIImage {
        if #available(iOS 13.0, *), let native = UIImage(systemName: symbol.rawValue) {
            return native.withTintColor(tintColor, renderingMode: .alwaysOriginal)
        }
        UIGraphicsBeginImageContextWithOptions(CGSize(width: size, height: size), false, 0.0)
        defer { UIGraphicsEndImageContext() }
        guard let ctx = UIGraphicsGetCurrentContext() else { return UIImage() }
        ctx.setStrokeColor(tintColor.cgColor)
        ctx.setFillColor(tintColor.cgColor)
        ctx.setLineWidth(1.8)
        switch symbol {
        case .search:
            ctx.strokeEllipse(in: CGRect(x: 3, y: 3, width: size * 0.58, height: size * 0.58))
            ctx.move(to: CGPoint(x: size * 0.62, y: size * 0.62))
            ctx.addLine(to: CGPoint(x: size - 3, y: size - 3))
            ctx.strokePath()
        case .downloads:
            let rect = CGRect(x: 3, y: 3, width: size - 6, height: size - 6)
            let path = UIBezierPath(roundedRect: rect, cornerRadius: 4)
            path.lineWidth = 1.8
            path.stroke()
            ctx.move(to: CGPoint(x: size / 2, y: 6))
            ctx.addLine(to: CGPoint(x: size / 2, y: size - 7))
            ctx.strokePath()
        default:
            ctx.strokeEllipse(in: CGRect(x: 4, y: 4, width: size - 8, height: size - 8))
        }
        return UIGraphicsGetImageFromCurrentImageContext() ?? UIImage()
    }
}
