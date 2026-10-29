import UIKit

public final class MainTabBarController: UITabBarController {
    public override func viewDidLoad() {
        super.viewDidLoad()
        tabBar.barTintColor = DLiPAThemeCompat.backgroundPrimary
        tabBar.tintColor = .white
        tabBar.isTranslucent = true

        let searchVC = UINavigationController(rootViewController: LegacySearchViewController())
        searchVC.tabBarItem = UITabBarItem(
            title: "Search",
            image: SFSymbolsLegacyFallback.image(.search, tintColor: DLiPAThemeCompat.textSecondary),
            selectedImage: SFSymbolsLegacyFallback.image(.search, tintColor: .white)
        )

        let downloadsVC = UINavigationController(rootViewController: LegacyPlaceholderViewController(screenTitle: "Downloads"))
        downloadsVC.tabBarItem = UITabBarItem(
            title: "Downloads",
            image: SFSymbolsLegacyFallback.image(.downloads, tintColor: DLiPAThemeCompat.textSecondary),
            selectedImage: SFSymbolsLegacyFallback.image(.downloads, tintColor: .white)
        )

        let accountsVC = UINavigationController(rootViewController: LegacyPlaceholderViewController(screenTitle: "Accounts"))
        accountsVC.tabBarItem = UITabBarItem(
            title: "Accounts",
            image: SFSymbolsLegacyFallback.image(.accounts, tintColor: DLiPAThemeCompat.textSecondary),
            selectedImage: SFSymbolsLegacyFallback.image(.accounts, tintColor: .white)
        )

        let settingsVC = UINavigationController(rootViewController: LegacyPlaceholderViewController(screenTitle: "Settings"))
        settingsVC.tabBarItem = UITabBarItem(
            title: "Settings",
            image: SFSymbolsLegacyFallback.image(.settings, tintColor: DLiPAThemeCompat.textSecondary),
            selectedImage: SFSymbolsLegacyFallback.image(.settings, tintColor: .white)
        )

        viewControllers = [searchVC, downloadsVC, accountsVC, settingsVC]
    }
}

public final class LegacySearchViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    private var tableView: UITableView!
    private var apps: [[String: Any]] = []

    public override func viewDidLoad() {
        super.viewDidLoad()
        title = "Search"
        view.backgroundColor = DLiPAThemeCompat.backgroundPrimary
        navigationController?.navigationBar.barTintColor = DLiPAThemeCompat.backgroundPrimary
        navigationController?.navigationBar.titleTextAttributes = [.foregroundColor: UIColor.white]

        tableView = DLiPAThemeCompat.makeInsetGroupedTableView()
        tableView.translatesAutoresizingMaskIntoConstraints = false
        tableView.dataSource = self
        tableView.delegate = self
        view.addSubview(tableView)

        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.topAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor)
        ])

        StoreClientLegacyBuy.shared.searchApps(term: "YouTube") { [weak self] results in
            self?.apps = results
            self?.tableView.reloadData()
        }
    }

    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return apps.count
    }

    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "AppCell") ??
            UITableViewCell(style: .subtitle, reuseIdentifier: "AppCell")
        let item = apps[indexPath.row]
        cell.backgroundColor = DLiPAThemeCompat.surfaceCard
        cell.textLabel?.textColor = .white
        cell.textLabel?.text = (item["trackName"] as? String) ?? "Application"
        let ver = (item["version"] as? String) ?? "1.0"
        let minOs = (item["minimumOsVersion"] as? String) ?? "9.0"
        cell.detailTextLabel?.textColor = DLiPAThemeCompat.textSecondary
        cell.detailTextLabel?.text = "v\(ver) · iOS\(minOs)"
        return cell
    }
}

public final class LegacyPlaceholderViewController: UIViewController {
    private let screenTitle: String
    public init(screenTitle: String) {
        self.screenTitle = screenTitle
        super.init(nibName: nil, bundle: nil)
    }
    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    public override func viewDidLoad() {
        super.viewDidLoad()
        title = screenTitle
        view.backgroundColor = DLiPAThemeCompat.backgroundPrimary
        navigationController?.navigationBar.barTintColor = DLiPAThemeCompat.backgroundPrimary
        navigationController?.navigationBar.titleTextAttributes = [.foregroundColor: UIColor.white]
    }
}
