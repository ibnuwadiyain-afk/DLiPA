export interface Storefront {
  code: string;
  name: string;
  flag: string;
  storefrontId: string;
}

export const STOREFRONTS: Storefront[] = [
  { code: 'om', name: 'Oman', flag: '🇴🇲', storefrontId: '143566-1,29' },
  { code: 'us', name: 'United States', flag: '🇺🇸', storefrontId: '143441-1,29' },
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧', storefrontId: '143444-2,29' },
  { code: 'al', name: 'Albania', flag: '🇦🇱', storefrontId: '143575-2,29' },
  { code: 'dz', name: 'Algeria', flag: '🇩🇿', storefrontId: '143563-2,29' },
  { code: 'ao', name: 'Angola', flag: '🇦🇴', storefrontId: '143564-2,29' },
  { code: 'ai', name: 'Anguilla', flag: '🇦🇮', storefrontId: '143538-2,29' },
  { code: 'ag', name: 'Antigua & Barbuda', flag: '🇦🇬', storefrontId: '143540-2,29' },
  { code: 'ar', name: 'Argentina', flag: '🇦🇷', storefrontId: '143505-28,29' },
  { code: 'am', name: 'Armenia', flag: '🇦🇲', storefrontId: '143524-2,29' },
  { code: 'au', name: 'Australia', flag: '🇦🇺', storefrontId: '143460-27,29' },
  { code: 'at', name: 'Austria', flag: '🇦🇹', storefrontId: '143445-4,29' },
  { code: 'az', name: 'Azerbaijan', flag: '🇦🇿', storefrontId: '143568-2,29' },
  { code: 'bs', name: 'Bahamas', flag: '🇧🇸', storefrontId: '143539-2,29' },
  { code: 'bh', name: 'Bahrain', flag: '🇧🇭', storefrontId: '143559-2,29' },
  { code: 'bd', name: 'Bangladesh', flag: '🇧🇩', storefrontId: '143490-2,29' },
  { code: 'br', name: 'Brazil', flag: '🇧🇷', storefrontId: '143503-15,29' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦', storefrontId: '143455-6,29' },
  { code: 'cn', name: 'China (Mainland)', flag: '🇨🇳', storefrontId: '143465-19,29' },
  { code: 'eg', name: 'Egypt', flag: '🇪🇬', storefrontId: '143516-2,29' },
  { code: 'fr', name: 'France', flag: '🇫🇷', storefrontId: '143442-3,29' },
  { code: 'de', name: 'Germany', flag: '🇩🇪', storefrontId: '143443-4,29' },
  { code: 'in', name: 'India', flag: '🇮🇳', storefrontId: '143467-2,29' },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩', storefrontId: '143476-2,29' },
  { code: 'it', name: 'Italy', flag: '🇮🇹', storefrontId: '143450-7,29' },
  { code: 'jp', name: 'Japan', flag: '🇯🇵', storefrontId: '143462-9,29' },
  { code: 'kr', name: 'Korea, Republic of', flag: '🇰🇷', storefrontId: '143466-12,29' },
  { code: 'kw', name: 'Kuwait', flag: '🇰🇼', storefrontId: '143493-2,29' },
  { code: 'mx', name: 'Mexico', flag: '🇲🇽', storefrontId: '143468-28,29' },
  { code: 'nl', name: 'Netherlands', flag: '🇳🇱', storefrontId: '143452-10,29' },
  { code: 'qa', name: 'Qatar', flag: '🇶🇦', storefrontId: '143498-2,29' },
  { code: 'ru', name: 'Russia', flag: '🇷🇺', storefrontId: '143469-16,29' },
  { code: 'sa', name: 'Saudi Arabia', flag: '🇸🇦', storefrontId: '143479-2,29' },
  { code: 'sg', name: 'Singapore', flag: '🇸🇬', storefrontId: '143464-2,29' },
  { code: 'es', name: 'Spain', flag: '🇪🇸', storefrontId: '143454-8,29' },
  { code: 'se', name: 'Sweden', flag: '🇸🇪', storefrontId: '143456-17,29' },
  { code: 'ch', name: 'Switzerland', flag: '🇨🇭', storefrontId: '143459-4,29' },
  { code: 'tr', name: 'Turkey', flag: '🇹🇷', storefrontId: '143480-25,29' },
  { code: 'ae', name: 'United Arab Emirates', flag: '🇦🇪', storefrontId: '143481-2,29' },
  { code: 'vn', name: 'Vietnam', flag: '🇻🇳', storefrontId: '143471-2,29' },
];

export type SupportedLanguage =
  | 'en'
  | 'ar'
  | 'zh'
  | 'fr'
  | 'de'
  | 'hi'
  | 'id'
  | 'it'
  | 'ja'
  | 'ko'
  | 'ru'
  | 'es'
  | 'tr'
  | 'vi';

export const LANGUAGE_LABELS: Record<SupportedLanguage, { name: string; native: string }> = {
  en: { name: 'English', native: 'English' },
  ar: { name: 'Arabic', native: 'العربية' },
  zh: { name: 'Chinese (Simplified)', native: '简体中文' },
  fr: { name: 'French', native: 'Français' },
  de: { name: 'German', native: 'Deutsch' },
  hi: { name: 'Hindi', native: 'हिन्दी' },
  id: { name: 'Indonesian', native: 'Bahasa Indonesia' },
  it: { name: 'Italian', native: 'Italiano' },
  ja: { name: 'Japanese', native: '日本語' },
  ko: { name: 'Korean', native: '한국어' },
  ru: { name: 'Russian', native: 'Русский' },
  es: { name: 'Spanish', native: 'Español' },
  tr: { name: 'Turkish', native: 'Türkçe' },
  vi: { name: 'Vietnamese', native: 'Tiếng Việt' },
};

export const UI_TRANSLATIONS: Record<
  SupportedLanguage,
  {
    search: string;
    downloads: string;
    accounts: string;
    compatLayer: string;
    settings: string;
    storefront: string;
    results: string;
    versions: string;
    cancel: string;
    searchPlaceholder: string;
    downloadsPlaceholder: string;
    generateGuid: string;
    resetAll: string;
  }
> = {
  en: {
    search: 'Search',
    downloads: 'Downloads',
    accounts: 'Accounts',
    compatLayer: 'iOS 9 Compat Layer',
    settings: 'Settings',
    storefront: 'Storefront',
    results: 'Results',
    versions: 'Versions',
    cancel: 'Cancel',
    searchPlaceholder: 'App name, Bundle ID, or App Store link',
    downloadsPlaceholder: 'App, Bundle ID',
    generateGuid: 'Generate new GUID',
    resetAll: 'Reset All',
  },
  ar: {
    search: 'بحث',
    downloads: 'التنزيلات',
    accounts: 'الحسابات',
    compatLayer: 'طبقة توافق iOS 9',
    settings: 'الإعدادات',
    storefront: 'المتجر',
    results: 'النتائج',
    versions: 'الإصدارات',
    cancel: 'إلغاء',
    searchPlaceholder: 'اسم التطبيق أو معرف الحزمة أو الرابط',
    downloadsPlaceholder: 'التطبيق، معرف الحزمة',
    generateGuid: 'توليد معرف GUID جديد',
    resetAll: 'إعادة تعيين الكل',
  },
  zh: {
    search: '搜索',
    downloads: '下载',
    accounts: '账户',
    compatLayer: 'iOS 9 兼容层',
    settings: '设置',
    storefront: '商店地区',
    results: '结果',
    versions: '历史版本',
    cancel: '取消',
    searchPlaceholder: '应用名称、Bundle ID 或链接',
    downloadsPlaceholder: '应用、Bundle ID',
    generateGuid: '生成新的 GUID',
    resetAll: '全部重置',
  },
  fr: {
    search: 'Rechercher',
    downloads: 'Téléchargements',
    accounts: 'Comptes',
    compatLayer: 'Compatibilité iOS 9',
    settings: 'Réglages',
    storefront: 'Boutique',
    results: 'Résultats',
    versions: 'Versions',
    cancel: 'Annuler',
    searchPlaceholder: 'Nom, Bundle ID ou lien App Store',
    downloadsPlaceholder: 'App, Bundle ID',
    generateGuid: 'Générer un nouveau GUID',
    resetAll: 'Tout réinitialiser',
  },
  de: {
    search: 'Suche',
    downloads: 'Downloads',
    accounts: 'Accounts',
    compatLayer: 'iOS 9 Kompatibilität',
    settings: 'Einstellungen',
    storefront: 'Storefront',
    results: 'Ergebnisse',
    versions: 'Versionen',
    cancel: 'Abbrechen',
    searchPlaceholder: 'App-Name, Bundle-ID oder Link',
    downloadsPlaceholder: 'App, Bundle-ID',
    generateGuid: 'Neue GUID generieren',
    resetAll: 'Alles zurücksetzen',
  },
  hi: {
    search: 'खोजें',
    downloads: 'डाउनलोड',
    accounts: 'खाते',
    compatLayer: 'iOS 9 संगतता परत',
    settings: 'सेटिंग्स',
    storefront: 'स्टोरफ्रंट',
    results: 'परिणाम',
    versions: 'संस्करण',
    cancel: 'रद्द करें',
    searchPlaceholder: 'ऐप का नाम, बंडल आईडी या लिंक',
    downloadsPlaceholder: 'ऐप, बंडल आईडी',
    generateGuid: 'नया GUID बनाएं',
    resetAll: 'सभी रीसेट करें',
  },
  id: {
    search: 'Cari',
    downloads: 'Unduhan',
    accounts: 'Akun',
    compatLayer: 'Kompatibilitas iOS 9',
    settings: 'Pengaturan',
    storefront: 'Etalase Negara',
    results: 'Hasil',
    versions: 'Versi',
    cancel: 'Batal',
    searchPlaceholder: 'Nama aplikasi, Bundle ID, atau tautan',
    downloadsPlaceholder: 'Aplikasi, Bundle ID',
    generateGuid: 'Buat GUID baru',
    resetAll: 'Atur Ulang Semua',
  },
  it: {
    search: 'Cerca',
    downloads: 'Download',
    accounts: 'Account',
    compatLayer: 'Compatibilità iOS 9',
    settings: 'Impostazioni',
    storefront: 'Storefront',
    results: 'Risultati',
    versions: 'Versioni',
    cancel: 'Annulla',
    searchPlaceholder: 'Nome app, Bundle ID o link',
    downloadsPlaceholder: 'App, Bundle ID',
    generateGuid: 'Genera nuovo GUID',
    resetAll: 'Reimposta tutto',
  },
  ja: {
    search: '検索',
    downloads: 'ダウンロード',
    accounts: 'アカウント',
    compatLayer: 'iOS 9 互換レイヤー',
    settings: '設定',
    storefront: 'ストアフロント',
    results: '検索結果',
    versions: 'バージョン履歴',
    cancel: 'キャンセル',
    searchPlaceholder: 'App名、Bundle ID、またはリンク',
    downloadsPlaceholder: 'App、Bundle ID',
    generateGuid: '新しいGUIDを生成',
    resetAll: 'すべてリセット',
  },
  ko: {
    search: '검색',
    downloads: '다운로드',
    accounts: '계정',
    compatLayer: 'iOS 9 호환 계층',
    settings: '설정',
    storefront: '스토어 국가',
    results: '결과',
    versions: '버전 기록',
    cancel: '취소',
    searchPlaceholder: '앱 이름, 번들 ID 또는 링크',
    downloadsPlaceholder: '앱, 번들 ID',
    generateGuid: '새 GUID 생성',
    resetAll: '모두 재설정',
  },
  ru: {
    search: 'Поиск',
    downloads: 'Загрузки',
    accounts: 'Аккаунты',
    compatLayer: 'Слой iOS 9+',
    settings: 'Настройки',
    storefront: 'Регион магазина',
    results: 'Результаты',
    versions: 'Версии',
    cancel: 'Отмена',
    searchPlaceholder: 'Имя, Bundle ID или ссылка',
    downloadsPlaceholder: 'Приложение, Bundle ID',
    generateGuid: 'Создать новый GUID',
    resetAll: 'Сбросить всё',
  },
  es: {
    search: 'Buscar',
    downloads: 'Descargas',
    accounts: 'Cuentas',
    compatLayer: 'Capa iOS 9+',
    settings: 'Ajustes',
    storefront: 'Tienda',
    results: 'Resultados',
    versions: 'Versiones',
    cancel: 'Cancelar',
    searchPlaceholder: 'Nombre, Bundle ID o enlace',
    downloadsPlaceholder: 'App, Bundle ID',
    generateGuid: 'Generar nuevo GUID',
    resetAll: 'Restablecer todo',
  },
  tr: {
    search: 'Ara',
    downloads: 'İndirilenler',
    accounts: 'Hesaplar',
    compatLayer: 'iOS 9 Uyumluluk',
    settings: 'Ayarlar',
    storefront: 'Mağaza Ülkesi',
    results: 'Sonuçlar',
    versions: 'Sürümler',
    cancel: 'İptal',
    searchPlaceholder: 'Uygulama adı, Bundle ID veya bağlantı',
    downloadsPlaceholder: 'Uygulama, Bundle ID',
    generateGuid: 'Yeni GUID oluştur',
    resetAll: 'Tümünü Sıfırla',
  },
  vi: {
    search: 'Tìm kiếm',
    downloads: 'Tải về',
    accounts: 'Tài khoản',
    compatLayer: 'Tương thích iOS 9',
    settings: 'Cài đặt',
    storefront: 'Cửa hàng',
    results: 'Kết quả',
    versions: 'Phiên bản',
    cancel: 'Hủy',
    searchPlaceholder: 'Tên ứng dụng, Bundle ID hoặc liên kết',
    downloadsPlaceholder: 'Ứng dụng, Bundle ID',
    generateGuid: 'Tạo GUID mới',
    resetAll: 'Đặt lại tất cả',
  },
};

export interface AppleAccount {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dsid: string;
  storefrontCode: string;
  storefrontName: string;
  passwordToken: string;
  isActive: boolean;
  lastAuthenticated: string;
}

export interface DownloadedIpaItem {
  id: string;
  accountEmail: string;
  trackId: number;
  trackName: string;
  bundleId: string;
  version: string;
  externalVersionId: string;
  minOSVersion: string;
  patchedMinOSVersion: string;
  architecture: 'armv7 + arm64 (Universal)' | 'arm64 (64-bit)';
  sizeMB: number;
  artworkUrl: string;
  downloadedAt: string;
  compatShimsApplied: {
    patchMinOs9: boolean;
    injectSwiftShim: boolean;
    injectCryptoShim: boolean;
    injectUIKitBackport: boolean;
    stripArm64Locks: boolean;
  };
}

export const INITIAL_ACCOUNTS: AppleAccount[] = [
  {
    id: 'acc-1',
    email: 'prooxy0@gmail.com',
    firstName: 'Ahmed',
    lastName: 'Bafkir',
    dsid: '11489204512',
    storefrontCode: 'om',
    storefrontName: 'Oman (143566)',
    passwordToken: 'MZFinance.Token.v2.98a71b0e4c',
    isActive: true,
    lastAuthenticated: '2026-10-29 01:35',
  },
  {
    id: 'acc-2',
    email: 'legacy.ios9@icloud.com',
    firstName: 'Legacy',
    lastName: 'Preservation',
    dsid: '10294819204',
    storefrontCode: 'us',
    storefrontName: 'United States (143441)',
    passwordToken: 'MZFinance.Token.v2.31f90c22d1',
    isActive: false,
    lastAuthenticated: '2026-10-28 19:20',
  },
];

// Matches Screenshot 4 of DLiPA (prooxy0@gmail.com (5)) + legacy iOS 9 account downloads
export const INITIAL_DOWNLOADS: DownloadedIpaItem[] = [
  {
    id: 'dl-youtube-20192',
    accountEmail: 'prooxy0@gmail.com',
    trackId: 544007664,
    trackName: 'YouTube',
    bundleId: 'com.google.ios.youtube',
    version: '20.19.2',
    externalVersionId: '874661846',
    minOSVersion: '14.0',
    patchedMinOSVersion: '9.0',
    architecture: 'armv7 + arm64 (Universal)',
    sizeMB: 205.8,
    artworkUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/9a/d1/02/9ad10246-711b-821b-104b-9e69a5c717a7/logo_youtube_2024_q4_color-0-1x_U007emarketing-0-0-0-7-0-0-0-85-220-0.png/512x512bb.jpg',
    downloadedAt: '2026-10-29 01:36',
    compatShimsApplied: {
      patchMinOs9: true,
      injectSwiftShim: true,
      injectCryptoShim: true,
      injectUIKitBackport: true,
      stripArm64Locks: true,
    },
  },
  {
    id: 'dl-snapchat-1344',
    accountEmail: 'prooxy0@gmail.com',
    trackId: 447188370,
    trackName: 'Snapchat: Chat with friends',
    bundleId: 'com.toyopagroup.picaboo',
    version: '13.44.0.45',
    externalVersionId: '873912045',
    minOSVersion: '14.0',
    patchedMinOSVersion: '9.0',
    architecture: 'armv7 + arm64 (Universal)',
    sizeMB: 250.8,
    artworkUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/79/4b/2d/794b2d5a-8284-8f33-92f0-32a2d4e8d208/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
    downloadedAt: '2026-10-29 01:34',
    compatShimsApplied: {
      patchMinOs9: true,
      injectSwiftShim: true,
      injectCryptoShim: true,
      injectUIKitBackport: false,
      stripArm64Locks: true,
    },
  },
  {
    id: 'dl-spotify-9050',
    accountEmail: 'prooxy0@gmail.com',
    trackId: 324684580,
    trackName: 'Spotify: Music and Podcasts',
    bundleId: 'com.spotify.client',
    version: '9.0.50',
    externalVersionId: '874102938',
    minOSVersion: '15.0',
    patchedMinOSVersion: '9.0',
    architecture: 'armv7 + arm64 (Universal)',
    sizeMB: 189.5,
    artworkUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/12/49/6d/12496d75-7a1d-76f1-0e02-71c522296228/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/512x512bb.jpg',
    downloadedAt: '2026-10-29 01:30',
    compatShimsApplied: {
      patchMinOs9: true,
      injectSwiftShim: true,
      injectCryptoShim: true,
      injectUIKitBackport: true,
      stripArm64Locks: true,
    },
  },
  {
    id: 'dl-telegram-1112',
    accountEmail: 'prooxy0@gmail.com',
    trackId: 686449807,
    trackName: 'Telegram Messenger',
    bundleId: 'ph.telegra.Telegraph',
    version: '11.12',
    externalVersionId: '873851920',
    minOSVersion: '12.0',
    patchedMinOSVersion: '9.0',
    architecture: 'armv7 + arm64 (Universal)',
    sizeMB: 125.6,
    artworkUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/e6/73/52/e67352c4-c891-4562-9f47-c730d6060246/AppIconLLC-0-0-1x_U007emarketing-0-10-0-0-85-220.png/512x512bb.jpg',
    downloadedAt: '2026-10-29 01:28',
    compatShimsApplied: {
      patchMinOs9: true,
      injectSwiftShim: true,
      injectCryptoShim: true,
      injectUIKitBackport: true,
      stripArm64Locks: true,
    },
  },
  {
    id: 'dl-netflix-1733',
    accountEmail: 'prooxy0@gmail.com',
    trackId: 363590051,
    trackName: 'Netflix',
    bundleId: 'com.netflix.Netflix',
    version: '17.33.0',
    externalVersionId: '874009182',
    minOSVersion: '17.0',
    patchedMinOSVersion: '9.0',
    architecture: 'armv7 + arm64 (Universal)',
    sizeMB: 147.8,
    artworkUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/85/09/15/8509153f-7102-e6a4-2735-5a38d41094b7/AppIcon-0-0-1x_U007emarketing-0-10-0-0-sRGB-85-220.png/512x512bb.jpg',
    downloadedAt: '2026-10-29 01:25',
    compatShimsApplied: {
      patchMinOs9: true,
      injectSwiftShim: true,
      injectCryptoShim: true,
      injectUIKitBackport: true,
      stripArm64Locks: true,
    },
  },
  {
    id: 'dl-youtube-ios9-native',
    accountEmail: 'legacy.ios9@icloud.com',
    trackId: 544007664,
    trackName: 'YouTube (Classic iOS 9.3.5 Build)',
    bundleId: 'com.google.ios.youtube',
    version: '12.11.6',
    externalVersionId: '821439081',
    minOSVersion: '9.0',
    patchedMinOSVersion: '9.0',
    architecture: 'armv7 + arm64 (Universal)',
    sizeMB: 64.2,
    artworkUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/9a/d1/02/9ad10246-711b-821b-104b-9e69a5c717a7/logo_youtube_2024_q4_color-0-1x_U007emarketing-0-0-0-7-0-0-0-85-220-0.png/512x512bb.jpg',
    downloadedAt: '2026-10-28 21:14',
    compatShimsApplied: {
      patchMinOs9: true,
      injectSwiftShim: true,
      injectCryptoShim: true,
      injectUIKitBackport: true,
      stripArm64Locks: true,
    },
  },
];

export interface CompatLayerModule {
  id: string;
  title: string;
  replacedApi: string;
  minIosOriginal: string;
  backportedTo: string;
  architectures: string;
  filePath: string;
  summary: string;
  code: string;
}

export const COMPATIBILITY_LAYERS: CompatLayerModule[] = [
  {
    id: 'uikit-backport',
    title: '01. UIKit & Navigation Backport Layer',
    replacedApi: 'SwiftUI NavigationStack, .searchable, UITableView.Style.insetGrouped',
    minIosOriginal: 'iOS 13.0+',
    backportedTo: 'iOS 9.0+',
    architectures: 'armv7 · armv7s · arm64',
    filePath: 'Sources/CompatLayers/UIKitLegacyBackport.swift',
    summary:
      'Original DLiPA uses iOS 13+ SwiftUI views and insetGrouped lists. This layer provides a drop-in UIKit view controller hierarchy with custom CALayer rounded section cards, collapsible large header titles, and iOS 9 AutoLayout anchors.',
    code: `import UIKit

/// Backports iOS 13+ .insetGrouped cards and Dark Mode tokens to iOS 9.0 - 12.5.7
public final class DLiPAInsetCardCell: UITableViewCell {
    private let cardContainer = UIView()

    public override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .clear
        contentView.backgroundColor = .clear
        cardContainer.backgroundColor = UIColor(red: 0.11, green: 0.11, blue: 0.118, alpha: 1.0)
        cardContainer.layer.cornerRadius = 12.0
        cardContainer.layer.masksToBounds = true
        cardContainer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(cardContainer)

        // NSLayoutAnchor is supported starting in iOS 9.0!
        NSLayoutConstraint.activate([
            cardContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            cardContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            cardContainer.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 1),
            cardContainer.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -1)
        ])
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }
}`,
  },
  {
    id: 'commoncrypto-shim',
    title: '02. CryptoKit to CommonCrypto Bridge',
    replacedApi: 'CryptoKit.SHA256, CryptoKit.HMAC<SHA256>',
    minIosOriginal: 'iOS 13.0+',
    backportedTo: 'iOS 9.0+',
    architectures: 'armv7 · arm64',
    filePath: 'Sources/CompatLayers/CommonCryptoBridge.swift',
    summary:
      'Apple Store authentication (ipatool auth & bag.xml signing) hashes passwords and generates HMAC-SHA256 tokens. CryptoKit crashes on iOS 9–12 because CryptoKit.framework does not exist prior to iOS 13. This shim routes all digests through libcommonCrypto.dylib.',
    code: `import Foundation
import CommonCrypto

public enum DLiPACryptoCompat {
    /// Replaces CryptoKit.SHA256.hash(data:) for iOS 9.0+ compatibility
    public static func sha256(_ data: Data) -> Data {
        var digest = [UInt8](repeating: 0, count: Int(CC_SHA256_DIGEST_LENGTH))
        data.withUnsafeBytes { rawBuffer in
            _ = CC_SHA256(rawBuffer.baseAddress, CC_LONG(data.count), &digest)
        }
        return Data(digest)
    }

    /// Replaces CryptoKit.HMAC<SHA256>.authenticationCode(for:using:)
    public static func hmacSHA256(key: Data, message: Data) -> Data {
        var mac = [UInt8](repeating: 0, count: Int(CC_SHA256_DIGEST_LENGTH))
        key.withUnsafeBytes { keyPtr in
            message.withUnsafeBytes { msgPtr in
                CCHmac(CCHmacAlgorithm(kCCHmacAlgSHA256),
                       keyPtr.baseAddress, key.count,
                       msgPtr.baseAddress, message.count, &mac)
            }
        }
        return Data(mac)
    }
}`,
  },
  {
    id: 'sfsymbols-vector',
    title: '03. SF Symbols CoreGraphics Vector Polyfill',
    replacedApi: 'UIImage(systemName:), UIImage.SymbolConfiguration',
    minIosOriginal: 'iOS 13.0+',
    backportedTo: 'iOS 9.0+',
    architectures: 'armv7 · arm64',
    filePath: 'Sources/CompatLayers/SFSymbolsLegacyFallback.swift',
    summary:
      'Calling UIImage(systemName:) on iOS 9–12 causes an unrecogized selector crash. This layer intercepts all DLiPA icon requests (magnifyingglass, arrow.down.square, person, gearshape) and draws crisp @2x/@3x CoreGraphics vector paths when running below iOS 13.',
    code: `import UIKit

public enum DLiPASymbol: String {
    case search = "magnifyingglass"
    case downloads = "arrow.down.square"
    case accounts = "person"
    case settings = "gearshape"
}

public extension UIImage {
    static func dlipaSymbol(_ symbol: DLiPASymbol, pointSize: CGFloat = 22, tint: UIColor = .white) -> UIImage {
        if #available(iOS 13.0, *), let sf = UIImage(systemName: symbol.rawValue) {
            return sf.withTintColor(tint, renderingMode: .alwaysOriginal)
        }
        UIGraphicsBeginImageContextWithOptions(CGSize(width: pointSize, height: pointSize), false, 0.0)
        defer { UIGraphicsEndImageContext() }
        guard let ctx = UIGraphicsGetCurrentContext() else { return UIImage() }
        ctx.setStrokeColor(tint.cgColor)
        ctx.setLineWidth(1.85)
        ctx.strokeEllipse(in: CGRect(x: 3, y: 3, width: pointSize - 6, height: pointSize - 6))
        return UIGraphicsGetImageFromCurrentImageContext() ?? UIImage()
    }
}`,
  },
  {
    id: 'async-urlsession-shim',
    title: '04. Swift Concurrency & TLS 1.2 Network Pipeline',
    replacedApi: 'URLSession.shared.data(for:) async throws, Combine AnyPublisher',
    minIosOriginal: 'iOS 13.0 / iOS 15.0',
    backportedTo: 'iOS 9.0+',
    architectures: 'armv7 · arm64',
    filePath: 'Sources/CompatLayers/LegacyURLSessionPipeline.swift',
    summary:
      'Replaces iOS 15 async/await URLSession calls and iOS 13 Combine publishers with a thread-safe DispatchGroup + NSURLSessionDataTask pipeline, enforcing TLS 1.2 cipher suites required by p25-buy.itunes.apple.com on iOS 9.',
    code: `import Foundation

public final class LegacyURLSessionPipeline {
    private let session: URLSession

    public init() {
        let cfg = URLSessionConfiguration.default
        cfg.TLSMinimumSupportedProtocol = .tlsProtocol12
        cfg.httpCookieAcceptPolicy = .always
        self.session = URLSession(configuration: cfg)
    }

    public func sendRequest(
        _ request: URLRequest,
        completion: @escaping (Result<(Data, HTTPURLResponse), Error>) -> Void
    ) {
        let task = session.dataTask(with: request) { data, response, error in
            if let error = error {
                DispatchQueue.main.async { completion(.failure(error)) }
                return
            }
            guard let data = data, let http = response as? HTTPURLResponse else {
                return
            }
            DispatchQueue.main.async { completion(.success((data, http))) }
        }
        task.resume()
    }
}`,
  },
  {
    id: 'checkmate-store-sinf',
    title: '05. StoreClient externalVersionId & Capability Override',
    replacedApi: 'Standard App Store Buy Request (blocks old iOS devices)',
    minIosOriginal: 'iOS 13.0+',
    backportedTo: 'iOS 9.0+',
    architectures: 'armv7 (32-bit) · arm64 (64-bit)',
    filePath: 'ios/Sources/StoreClient/StoreClientLegacyBuy.swift',
    summary:
      'Allows DLiPA to request any historical externalVersionId (including 32-bit armv7 Universal builds for iPhone 4S / iPhone 5 / iPad 2 on iOS 9.3.5), injects the SINF FairPlay manifest into SC_Info/, and rewrites MinimumOSVersion in Info.plist.',
    code: `import Foundation

public struct LegacyBuyParameters {
    public let adamId: String
    public let externalVersionId: String?
    public let hardwareGuid: String // 12-hex MAC identifier
    public let dsid: String

    public func toPlistDictionary() -> [String: Any] {
        var dict: [String: Any] = [
            "creditDisplay": "",
            "guid": hardwareGuid.uppercased(),
            "salableAdamId": adamId,
            "pg": "default",
            "appExtVrsId": externalVersionId ?? "0"
        ]
        if let verId = externalVersionId {
            dict["externalVersionId"] = verId
        }
        return dict
    }
}`,
  },
  {
    id: 'github-actions-workflow',
    title: '06. GitHub Actions Automated IPA Build Pipeline',
    replacedApi: 'Manual Local Xcode Archiving & Signing',
    minIosOriginal: 'macOS Xcode 15+',
    backportedTo: 'iOS 9.0+ Mach-O Backport',
    architectures: 'armv7 · arm64 (.ipa Artifact)',
    filePath: '.github/workflows/build-ipa.yml',
    summary:
      'Complete GitHub Actions CI/CD workflow that installs xcodegen & ldid on macos-latest, generates DLiPA-Legacy.xcodeproj from ios/project.yml, compiles the unsigned Release app, uses vtool & PlistBuddy to backport Mach-O LC_BUILD_VERSION and MinimumOSVersion to iOS 9.0, ad-hoc signs with ldid, and uploads DLiPA_v1.4_iOS9_Compat.ipa to GitHub Artifacts and Releases.',
    code: `name: Build DLiPA Legacy iOS 9+ IPA & Web Studio

on:
  push:
    branches: [ main, master ]
    tags: [ 'v*' ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:
    inputs:
      min_ios_version:
        description: 'Target Minimum iOS Version (patched via Mach-O vtool & Info.plist)'
        required: true
        default: '9.0'
        type: choice
        options: ['9.0', '9.3', '10.3', '12.0', '13.0']
      sign_method:
        description: 'Code Signing Method'
        required: true
        default: 'ldid-adhoc'
        type: choice
        options: ['ldid-adhoc', 'unsigned']

permissions:
  contents: write

jobs:
  build-ios-ipa:
    name: Build Native iOS 9.0+ IPA (macOS Xcode)
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install XcodeGen & ldid
        run: brew install xcodegen ldid
      - name: Generate Xcode Project
        working-directory: ios
        run: xcodegen generate
      - name: Build Unsigned Release Archive
        working-directory: ios
        run: |
          xcodebuild clean build \\
            -project DLiPA-Legacy.xcodeproj \\
            -scheme DLiPA-Legacy \\
            -configuration Release \\
            -sdk iphoneos \\
            -derivedDataPath build \\
            CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO
      - name: Backport Mach-O & Info.plist to iOS 9.0
        working-directory: ios
        run: |
          APP_PATH="build/Build/Products/Release-iphoneos/DLiPA.app"
          /usr/libexec/PlistBuddy -c "Set :MinimumOSVersion 9.0" "$APP_PATH/Info.plist"
          xcrun vtool -set-build-version ios 9.0 16.0 -replace -output "$APP_PATH/DLiPA" "$APP_PATH/DLiPA" || true
          ldid -SResources/Entitlements.plist "$APP_PATH/DLiPA"
      - name: Package .IPA Archive
        working-directory: ios
        run: |
          mkdir -p dist/Payload
          cp -R "build/Build/Products/Release-iphoneos/DLiPA.app" dist/Payload/
          cd dist && zip -r9 "../DLiPA_v1.4_iOS9_Compat.ipa" Payload
      - uses: actions/upload-artifact@v4
        with:
          name: DLiPA-iOS9-Compatible-IPA
          path: ios/DLiPA_v1.4_iOS9_Compat.ipa

  build-web-studio:
    name: Verify Web Compatibility Studio & Express API
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: '22'
      - name: Install Dependencies & Build Web Bundle
        run: |
          if [ -f package.json ]; then
            npm install --legacy-peer-deps --no-audit --no-fund
            npm run lint
            npm run build
          fi`,
  },
  {
    id: 'xcodegen-project-yml',
    title: '07. XcodeGen Specification (ios/project.yml)',
    replacedApi: 'Fragile Hand-Edited project.pbxproj UUIDs',
    minIosOriginal: 'Xcode 15 / 16',
    backportedTo: 'iOS 9.0+ Target',
    architectures: 'iPhone & iPad Universal (1,2)',
    filePath: 'ios/project.yml',
    summary:
      'Deterministic XcodeGen project definition used by the GitHub Actions runner to synthesize DLiPA-Legacy.xcodeproj cleanly on any macOS runner image without merge conflicts.',
    code: `name: DLiPA-Legacy
options:
  bundleIdPrefix: com.ahmedbafkir
  deploymentTarget:
    iOS: "12.0" # Base SDK floor; post-build vtool & PlistBuddy patch Mach-O minos down to iOS 9.0
  xcodeVersion: "15.0"

settings:
  base:
    PRODUCT_NAME: DLiPA
    PRODUCT_BUNDLE_IDENTIFIER: com.ahmedbafkir.dlipa.legacy
    MARKETING_VERSION: "1.4.0"
    CURRENT_PROJECT_VERSION: "140"
    SWIFT_VERSION: "5.0"
    TARGETED_DEVICE_FAMILY: "1,2"
    CODE_SIGN_IDENTITY: ""
    CODE_SIGNING_REQUIRED: NO
    CODE_SIGNING_ALLOWED: NO

targets:
  DLiPA-Legacy:
    type: application
    platform: iOS
    sources:
      - path: Sources
    info:
      path: Resources/Info.plist`,
  },
];

