/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Download,
  User,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  Check,
  Share2,
  Smartphone,
  Layers,
  Trash2,
  Plus,
  Minus,
  RefreshCw,
  ExternalLink,
  Code2,
  HardDrive,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import {
  STOREFRONTS,
  Storefront,
  SupportedLanguage,
  LANGUAGE_LABELS,
  UI_TRANSLATIONS,
  AppleAccount,
  DownloadedIpaItem,
  INITIAL_ACCOUNTS,
  INITIAL_DOWNLOADS,
  COMPATIBILITY_LAYERS,
} from './data/dlipaData';

export interface HistoricalVersionItem {
  version: string;
  externalVersionId: string;
  minOSVersion: string;
  architecture: 'armv7 + arm64 (Universal)' | 'arm64 (64-bit)';
  sizeMB: number;
  releaseDate: string;
  compatibilityNote: string;
  requiresCompatShim: boolean;
}

export interface AppStoreItem {
  trackId: number;
  trackName: string;
  bundleId: string;
  version: string;
  minimumOsVersion: string;
  fileSizeMB: number;
  fileSizeBytes: number;
  sellerName: string;
  primaryGenreName: string;
  trackViewUrl: string;
  artworkUrl: string;
  price: number;
  formattedPrice: string;
  totalVersionsCount: number;
  versions: HistoricalVersionItem[];
}

interface ActiveDownloadProgress {
  app: AppStoreItem;
  versionObj: HistoricalVersionItem;
  downloadedMB: number;
  totalMB: number;
  stage: 'Authenticating SINF' | 'Downloading IPA' | 'Injecting iOS 9 Shims' | 'Packaging IPA';
  elapsedMs: number;
}

type ActiveTab = 'search' | 'downloads' | 'accounts' | 'compat' | 'settings';
type TargetIosFilter = 'all' | '9.0' | '10.3' | '12.0' | '13.0' | '15.0';

function AppIcon({ src, name, size = 'md' }: { src: string; name: string; size?: 'sm' | 'md' | 'lg' }) {
  const [failed, setFailed] = useState(false);
  const sizeClasses =
    size === 'sm'
      ? 'w-9 h-9 rounded-lg text-xs'
      : size === 'lg'
        ? 'w-16 h-16 rounded-2xl text-xl'
        : 'w-14 h-14 rounded-[14px] text-base';

  if (failed || !src) {
    const initials = (name || 'App')
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
    return (
      <div
        className={`${sizeClasses} bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-bold text-slate-200 shrink-0 select-none`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} icon`}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`${sizeClasses} object-cover border border-white/10 bg-slate-900 shrink-0`}
    />
  );
}

function generateHardwareGuid(): string {
  const hex = '0123456789ABCDEF';
  let out = '';
  for (let i = 0; i < 12; i++) {
    out += hex[Math.floor(Math.random() * 16)];
  }
  return out;
}

export default function App() {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<ActiveTab>('search');
  const [isStorefrontPickerOpen, setIsStorefrontPickerOpen] = useState(false);
  const [storefrontQuery, setStorefrontQuery] = useState('');

  // Storefront & Search State
  const [selectedStorefront, setSelectedStorefront] = useState<Storefront>(STOREFRONTS[0]); // Oman 🇴🇲 default matching Screenshot 2
  const [searchQuery, setSearchQuery] = useState('Youtube');
  const [searchInputText, setSearchInputText] = useState('Youtube');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Youtube',
    'com.google.ios.youtube',
    'WhatsApp Messenger',
    'Spotify',
    'Telegram Messenger',
    'TikTok',
    'Snapchat',
    'Netflix',
  ]);
  const [searchResults, setSearchResults] = useState<AppStoreItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AppStoreItem | null>(null);
  const [targetIosFilter, setTargetIosFilter] = useState<TargetIosFilter>('all');
  const [customVersionIdInput, setCustomVersionIdInput] = useState('');

  // Compatibility Layer Configuration State
  const [compatConfig, setCompatConfig] = useState({
    patchMinOs9: true,
    injectSwiftShim: true,
    injectCryptoShim: true,
    injectUIKitBackport: true,
    stripArm64Locks: true,
  });

  // Accounts & Downloads State
  const [accounts, setAccounts] = useState<AppleAccount[]>(INITIAL_ACCOUNTS);
  const [downloads, setDownloads] = useState<DownloadedIpaItem[]>(INITIAL_DOWNLOADS);
  const [downloadsFilter, setDownloadsFilter] = useState('');
  const [activeDownload, setActiveDownload] = useState<ActiveDownloadProgress | null>(null);
  const [inspectingDownload, setInspectingDownload] = useState<DownloadedIpaItem | null>(null);

  // Add Account Form State
  const [newAccEmail, setNewAccEmail] = useState('');
  const [newAccPassword, setNewAccPassword] = useState('');
  const [newAcc2FA, setNewAcc2FA] = useState('');
  const [newAccStorefront, setNewAccStorefront] = useState('om');
  const [deleteWithFiles, setDeleteWithFiles] = useState(true);

  // Settings State (Matching Screenshot 5 of DLiPA)
  const [searchLimit, setSearchLimit] = useState<number>(0);
  const [hardwareGuid, setHardwareGuid] = useState<string>('A483E72C91B0');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [defaultLegacyIos, setDefaultLegacyIos] = useState<string>('9.3.5');
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  // Selected Compatibility Layer Code Module
  const [selectedCompatModuleId, setSelectedCompatModuleId] = useState<string>('github-actions-workflow');

  // GitHub Actions CI/CD Pipeline Config & Runner State
  const [ciRunner, setCiRunner] = useState<'macos-latest' | 'macos-14' | 'macos-13'>('macos-latest');
  const [ciMinIos, setCiMinIos] = useState<'9.0' | '9.3' | '10.3' | '12.0'>('9.0');
  const [ciSignMethod, setCiSignMethod] = useState<'ldid-adhoc' | 'unsigned'>('ldid-adhoc');
  const [ciStepIndex, setCiStepIndex] = useState<number>(6); // 6 = completed ready state
  const [isCiRunning, setIsCiRunning] = useState<boolean>(false);

  // Clipboard & Notification Feedback Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const t = UI_TRANSLATIONS[language];
  const isRtl = language === 'ar';

  const activeAccount = useMemo(
    () => accounts.find((a) => a.isActive) || accounts[0],
    [accounts]
  );

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const copyToClipboard = (text: string, label: string, keyId: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedKey(keyId);
    triggerToast(`Copied ${label}: ${text}`);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === keyId ? null : prev));
    }, 1800);
  };

  const triggerGitHubActionsBuild = () => {
    if (isCiRunning) return;
    setIsCiRunning(true);
    setCiStepIndex(0);
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      if (step >= 6) {
        clearInterval(timer);
        setCiStepIndex(6);
        setIsCiRunning(false);
        triggerToast(`GitHub Actions workflow completed: DLiPA_v1.4_iOS${ciMinIos}_Compat.ipa artifact ready`);
      } else {
        setCiStepIndex(step);
      }
    }, 450);
  };

  // Fetch live App Store results from backend proxy
  const performSearch = async (termToSearch: string, countryCode: string, limitVal: number) => {
    const cleanTerm = termToSearch.trim() || 'Youtube';
    setIsSearching(true);
    try {
      const resp = await fetch(
        `/api/itunes/search?term=${encodeURIComponent(cleanTerm)}&country=${encodeURIComponent(countryCode)}&limit=${limitVal}`
      );
      if (resp.ok) {
        const data = await resp.json();
        const items: AppStoreItem[] = data.results || [];
        setSearchResults(items);
        if (items.length > 0) {
          setSelectedApp((prev) => {
            if (prev) {
              const found = items.find((i) => i.trackId === prev.trackId);
              if (found) return found;
            }
            return items[0];
          });
        }
      }
    } catch (_e) {
      // Handled gracefully
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    performSearch(searchQuery, selectedStorefront.code, searchLimit);
  }, [selectedStorefront.code, searchLimit]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchInputText.trim();
    if (!trimmed) return;
    setSearchQuery(trimmed);
    setIsSearchFocused(false);
    setRecentSearches((prev) => [trimmed, ...prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 15));
    performSearch(trimmed, selectedStorefront.code, searchLimit);
  };

  // Simulate realistic active download progress bar (matching Screenshot 3) and add to Downloads
  const startVersionDownload = (app: AppStoreItem, versionObj: HistoricalVersionItem) => {
    if (activeDownload) {
      triggerToast(`Download already in progress: ${activeDownload.app.trackName}`);
      return;
    }

    const totalMB = versionObj.sizeMB || 205.8;
    setActiveDownload({
      app,
      versionObj,
      downloadedMB: 0,
      totalMB,
      stage: 'Authenticating SINF',
      elapsedMs: 0,
    });

    const stepMs = 140;
    let currentMB = 0;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += stepMs;
      const increment = totalMB * 0.14;
      currentMB = Math.min(totalMB, Number((currentMB + increment).toFixed(1)));

      const ratio = currentMB / totalMB;
      const stage: ActiveDownloadProgress['stage'] =
        ratio < 0.2
          ? 'Authenticating SINF'
          : ratio < 0.75
            ? 'Downloading IPA'
            : ratio < 0.92
              ? 'Injecting iOS 9 Shims'
              : 'Packaging IPA';

      if (currentMB >= totalMB) {
        clearInterval(interval);
        const newItem: DownloadedIpaItem = {
          id: `dl-${app.trackId}-${versionObj.externalVersionId}-${Date.now()}`,
          accountEmail: activeAccount?.email || 'prooxy0@gmail.com',
          trackId: app.trackId,
          trackName: app.trackName,
          bundleId: app.bundleId,
          version: versionObj.version,
          externalVersionId: versionObj.externalVersionId,
          minOSVersion: versionObj.minOSVersion,
          patchedMinOSVersion: compatConfig.patchMinOs9 ? '9.0' : versionObj.minOSVersion,
          architecture: compatConfig.stripArm64Locks ? 'armv7 + arm64 (Universal)' : versionObj.architecture,
          sizeMB: totalMB,
          artworkUrl: app.artworkUrl,
          downloadedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
          compatShimsApplied: { ...compatConfig },
        };
        setDownloads((prev) => [newItem, ...prev.filter((d) => !(d.bundleId === newItem.bundleId && d.version === newItem.version && d.accountEmail === newItem.accountEmail))]);
        setActiveDownload(null);
        triggerToast(
          `Downloaded ${app.trackName} v${versionObj.version} (${compatConfig.patchMinOs9 ? 'iOS 9.0+ Patched' : `iOS ${versionObj.minOSVersion}`})`
        );
      } else {
        setActiveDownload({
          app,
          versionObj,
          downloadedMB: currentMB,
          totalMB,
          stage,
          elapsedMs: elapsed,
        });
      }
    }, stepMs);
  };

  const handleCustomVersionIdDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    const cleanId = customVersionIdInput.trim();
    if (!cleanId) {
      triggerToast('Enter a valid numeric Apple externalVersionId (e.g. 821439081)');
      return;
    }
    const existing = selectedApp.versions.find((v) => v.externalVersionId === cleanId);
    const targetVer: HistoricalVersionItem = existing || {
      version: `custom-${cleanId.slice(-4)}`,
      externalVersionId: cleanId,
      minOSVersion: '9.0',
      architecture: 'armv7 + arm64 (Universal)',
      sizeMB: Number((selectedApp.fileSizeMB * 0.45).toFixed(1)),
      releaseDate: 'Historical Archive',
      compatibilityNote: 'Custom externalVersionId requested via Apple Store buyProduct API',
      requiresCompatShim: true,
    };
    setCustomVersionIdInput('');
    startVersionDownload(selectedApp, targetVer);
  };

  const filteredStorefronts = useMemo(() => {
    const q = storefrontQuery.trim().toLowerCase();
    if (!q) return STOREFRONTS;
    return STOREFRONTS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
    );
  }, [storefrontQuery]);

  const filteredVersions = useMemo(() => {
    if (!selectedApp) return [];
    if (targetIosFilter === 'all') return selectedApp.versions;
    const maxIos = parseFloat(targetIosFilter);
    return selectedApp.versions.filter((v) => parseFloat(v.minOSVersion) <= maxIos);
  }, [selectedApp, targetIosFilter]);

  const groupedDownloads = useMemo(() => {
    const q = downloadsFilter.trim().toLowerCase();
    const groups: Record<string, DownloadedIpaItem[]> = {};
    for (const item of downloads) {
      if (
        q &&
        !item.trackName.toLowerCase().includes(q) &&
        !item.bundleId.toLowerCase().includes(q) &&
        !item.externalVersionId.includes(q)
      ) {
        continue;
      }
      if (!groups[item.accountEmail]) {
        groups[item.accountEmail] = [];
      }
      groups[item.accountEmail].push(item);
    }
    return groups;
  }, [downloads, downloadsFilter]);

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const email = newAccEmail.trim();
    if (!email || !email.includes('@')) {
      triggerToast('Please enter a valid Apple ID email address');
      return;
    }
    const sf = STOREFRONTS.find((s) => s.code === newAccStorefront) || STOREFRONTS[0];
    const newAcc: AppleAccount = {
      id: `acc-${Date.now()}`,
      email,
      firstName: email.split('@')[0],
      lastName: 'Apple ID',
      dsid: String(10000000000 + Math.floor(Math.random() * 89999999999)),
      storefrontCode: sf.code,
      storefrontName: `${sf.name} (${sf.storefrontId.split('-')[0]})`,
      passwordToken: `MZFinance.Token.v2.${Math.random().toString(16).slice(2, 12)}`,
      isActive: true,
      lastAuthenticated: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setAccounts((prev) => prev.map((a) => ({ ...a, isActive: false })).concat(newAcc));
    setNewAccEmail('');
    setNewAccPassword('');
    setNewAcc2FA('');
    triggerToast(`Authenticated Apple ID ${email} (${sf.name})`);
  };

  const handleDeleteAccount = (acc: AppleAccount) => {
    setAccounts((prev) => {
      const remaining = prev.filter((a) => a.id !== acc.id);
      if (remaining.length > 0 && !remaining.some((a) => a.isActive)) {
        remaining[0].isActive = true;
      }
      return remaining;
    });
    if (deleteWithFiles) {
      setDownloads((prev) => prev.filter((d) => d.accountEmail !== acc.email));
      triggerToast(`Deleted account ${acc.email} and its downloaded IPA files`);
    } else {
      triggerToast(`Removed account ${acc.email} (kept downloaded IPA files)`);
    }
  };

  const handleResetAll = () => {
    setSearchLimit(0);
    setHardwareGuid(generateHardwareGuid());
    setLanguage('en');
    setDefaultLegacyIos('9.3.5');
    setDownloads(INITIAL_DOWNLOADS);
    setAccounts(INITIAL_ACCOUNTS);
    setRecentSearches(['Youtube', 'WhatsApp Messenger', 'Spotify']);
    setConfirmResetOpen(false);
    triggerToast('Reset all settings and restored default state');
  };

  const buildIpaDownloadHref = (item: DownloadedIpaItem) => {
    const params = new URLSearchParams({
      bundleId: item.bundleId,
      appName: item.trackName,
      version: item.version,
      externalVersionId: item.externalVersionId,
      minOs: item.minOSVersion,
      appleId: item.accountEmail,
      guid: hardwareGuid,
      patchMinOs9: String(item.compatShimsApplied.patchMinOs9),
      injectSwiftShim: String(item.compatShimsApplied.injectSwiftShim),
      injectCryptoShim: String(item.compatShimsApplied.injectCryptoShim),
      injectUIKitBackport: String(item.compatShimsApplied.injectUIKitBackport),
      stripArm64Locks: String(item.compatShimsApplied.stripArm64Locks),
    });
    return `/api/ipa/download?${params.toString()}`;
  };

  const buildOtaItmsHref = (item: DownloadedIpaItem) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000';
    const plistUrl = `${origin}/api/ota/manifest.plist?bundleId=${encodeURIComponent(item.bundleId)}&appName=${encodeURIComponent(item.trackName)}&version=${encodeURIComponent(item.version)}&externalVersionId=${encodeURIComponent(item.externalVersionId)}`;
    return `itms-services://?action=download-manifest&url=${encodeURIComponent(plistUrl)}`;
  };

  const selectedCompatModule = useMemo(
    () => COMPATIBILITY_LAYERS.find((m) => m.id === selectedCompatModuleId) || COMPATIBILITY_LAYERS[0],
    [selectedCompatModuleId]
  );

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col pb-20 md:pb-10">
      {/* Top Bar Contract: 1-row, 3-zone header (Brand wordmark | 5 single-line nav links | 1 primary CTA) */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-4 bg-[#090A0F]/90 backdrop-blur-md border-b border-white/[0.08]">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('search');
            setIsStorefrontPickerOpen(false);
          }}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          DLiPA
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          <button
            type="button"
            onClick={() => {
              setActiveTab('search');
              setIsStorefrontPickerOpen(false);
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'search' ? 'text-white border-[#0A84FF]' : 'border-transparent'
            }`}
          >
            {t.search}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('downloads');
              setIsStorefrontPickerOpen(false);
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'downloads' ? 'text-white border-[#0A84FF]' : 'border-transparent'
            }`}
          >
            {t.downloads} ({downloads.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('accounts');
              setIsStorefrontPickerOpen(false);
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'accounts' ? 'text-white border-[#0A84FF]' : 'border-transparent'
            }`}
          >
            {t.accounts}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('compat');
              setIsStorefrontPickerOpen(false);
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'compat' ? 'text-white border-[#0A84FF]' : 'border-transparent'
            }`}
          >
            {t.compatLayer}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('settings');
              setIsStorefrontPickerOpen(false);
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'settings' ? 'text-white border-[#0A84FF]' : 'border-transparent'
            }`}
          >
            {t.settings}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <a
            href="/api/xcode-project/download"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0A84FF] rounded-lg hover:bg-[#0070E0] transition-colors whitespace-nowrap shrink-0"
          >
            Export iOS 9 Xcode Source
          </a>
        </div>
      </header>

      {/* Subtle Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 max-w-md bg-[#1C1C1E] border border-white/15 text-slate-100 px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 text-xs">
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Container (1440px desktop baseline, max-w-7xl) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* ================================================================= */}
        {/* STOREFRONT PICKER VIEW (Matches Screenshot 1 of DLiPA)             */}
        {/* ================================================================= */}
        {activeTab === 'search' && isStorefrontPickerOpen && (
          <div className="max-w-3xl mx-auto">
            <button
              type="button"
              onClick={() => setIsStorefrontPickerOpen(false)}
              className="inline-flex items-center gap-1 text-[#0A84FF] hover:underline text-base font-medium mb-3 min-h-[44px]"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>{t.search}</span>
            </button>

            <h1 className="text-3xl font-bold tracking-tight text-white mb-4">{t.storefront}</h1>

            <div className="relative mb-5">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={storefrontQuery}
                onChange={(e) => setStorefrontQuery(e.target.value)}
                placeholder={t.search}
                className="w-full h-11 pl-10 pr-10 bg-[#1C1C1E] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A84FF]"
              />
              {storefrontQuery && (
                <button
                  type="button"
                  onClick={() => setStorefrontQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.07] overflow-hidden">
              {filteredStorefronts.map((sf) => {
                const isSelected = sf.code === selectedStorefront.code;
                return (
                  <button
                    key={sf.code}
                    type="button"
                    onClick={() => {
                      setSelectedStorefront(sf);
                      setIsStorefrontPickerOpen(false);
                      triggerToast(`Switched App Store Storefront to ${sf.name} ${sf.flag}`);
                    }}
                    className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors min-h-[52px]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{sf.flag}</span>
                      <span className="text-[15px] font-medium text-white">{sf.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono tabular-nums">
                      <span>{sf.code.toUpperCase()} · {sf.storefrontId}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#0A84FF]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 1: SEARCH & VERSION DOWNGRADER (Matches Screenshots 2 & 3)     */}
        {/* ================================================================= */}
        {activeTab === 'search' && !isStorefrontPickerOpen && (
          <div>
            {/* Top Context Bar: Storefront Selector Trigger + Legacy iOS 9 Safari Portal Link */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsStorefrontPickerOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1C1C1E] hover:bg-[#2C2C2E] border border-white/[0.08] text-sm font-semibold text-white transition-colors min-h-[40px]"
                >
                  <span>{selectedStorefront.name}</span>
                  <span>{selectedStorefront.flag}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
                  <span>Active Apple ID: {activeAccount?.email}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">GUID: {hardwareGuid}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>iOS 9.0 – 18.x Compatibility Engine</span>
                <span aria-hidden="true">·</span>
                <a
                  href="/legacy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0A84FF] hover:underline font-medium inline-flex items-center gap-1 whitespace-nowrap"
                >
                  <span>Open iOS 9 Safari (ES5) Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Search Header & Bar (Matches Screenshot 2) */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-white mb-3">{t.search}</h1>
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 relative">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchInputText}
                    onFocus={() => setIsSearchFocused(true)}
                    onChange={(e) => setSearchInputText(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full h-11 pl-10 pr-10 bg-[#1C1C1E] border border-white/[0.08] rounded-xl text-[15px] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A84FF]"
                  />
                  {searchInputText && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInputText('');
                        setIsSearchFocused(true);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-600/80 hover:bg-slate-500 text-black flex items-center justify-center"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-4 h-11 bg-[#0A84FF] hover:bg-[#0070E0] text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0"
                >
                  {t.search}
                </button>
                {isSearchFocused && (
                  <button
                    type="button"
                    onClick={() => setIsSearchFocused(false)}
                    className="text-[15px] text-white hover:text-slate-300 px-2 h-11 whitespace-nowrap shrink-0"
                  >
                    {t.cancel}
                  </button>
                )}
              </form>

              {/* DLiPA v1.3 Feature: Access last 15 searches instantly when tapping search bar */}
              {isSearchFocused && recentSearches.length > 0 && (
                <div className="mt-2 p-3 bg-[#1C1C1E] border border-white/10 rounded-xl">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Recent Searches ({recentSearches.length}/15)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setRecentSearches([])}
                      className="text-slate-400 hover:text-white"
                    >
                      Clear History
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setSearchInputText(term);
                          setSearchQuery(term);
                          setIsSearchFocused(false);
                          performSearch(term, selectedStorefront.code, searchLimit);
                        }}
                        className="px-2.5 py-1.5 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-xs text-slate-200 rounded-lg transition-colors whitespace-nowrap"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2-Column Split Workspace: Left = App Store Results (Screenshot 2), Right = Versions & iOS 9 Patcher (Screenshot 3) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: App Store Search Results */}
              <div className="lg:col-span-7">
                <div className="flex items-center justify-between px-1 mb-2.5">
                  <span className="text-xs font-medium text-slate-400 tabular-nums">
                    {t.results} ({searchResults.length})
                  </span>
                  <span className="text-xs text-slate-500">
                    Tap any app to browse historical versions &amp; iOS 9 builds
                  </span>
                </div>

                <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.07] overflow-hidden">
                  {isSearching ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                      <div key={idx} className="p-4 flex items-center gap-4 animate-pulse">
                        <div className="w-14 h-14 rounded-[14px] bg-white/10 shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-40 bg-white/10 rounded" />
                          <div className="h-3 w-56 bg-white/5 rounded" />
                        </div>
                      </div>
                    ))
                  ) : searchResults.length === 0 ? (
                    <div className="p-10 text-center">
                      <p className="text-sm text-slate-300 mb-2">No applications found in {selectedStorefront.name}.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchInputText('Youtube');
                          performSearch('Youtube', selectedStorefront.code, searchLimit);
                        }}
                        className="px-4 py-2 text-xs font-semibold bg-[#0A84FF] text-white rounded-lg"
                      >
                        Reset Search to YouTube
                      </button>
                    </div>
                  ) : (
                    searchResults.map((app) => {
                      const isSelected = selectedApp?.trackId === app.trackId;
                      const ios9Build = app.versions[app.versions.length - 1];
                      return (
                        <div
                          key={app.trackId}
                          onClick={() => setSelectedApp(app)}
                          className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                            isSelected ? 'bg-white/[0.07]' : 'hover:bg-white/[0.03]'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <AppIcon src={app.artworkUrl} name={app.trackName} />
                            <div className="min-w-0">
                              <h2 className="text-[16px] font-semibold text-white truncate">{app.trackName}</h2>
                              {/* Clean unboxed metadata matching Screenshot 2: v20.22.1 · iOS16.0 · 330.5 MB */}
                              <div className="flex flex-wrap items-center gap-1.5 text-[13px] text-[#8E8E93] font-mono tabular-nums mt-0.5">
                                <span>v{app.version}</span>
                                <span aria-hidden="true">·</span>
                                <span>iOS{app.minimumOsVersion}</span>
                                <span aria-hidden="true">·</span>
                                <span>{app.fileSizeMB} MB</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 mt-1">
                                <span className="font-mono truncate max-w-[220px]">{app.bundleId}</span>
                                {ios9Build && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span className="text-blue-400">
                                      iOS 9 build: v{ios9Build.version}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quick Copy & Inspect Actions */}
                          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(app.bundleId, 'Bundle ID', `bundle-${app.trackId}`)}
                              title="Copy Bundle ID"
                              className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#2C2C2E] hover:bg-[#3A3A3C] rounded-lg transition-colors whitespace-nowrap"
                            >
                              {copiedKey === `bundle-${app.trackId}` ? 'Copied' : 'Bundle ID'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedApp(app)}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0A84FF] hover:bg-[#0070E0] rounded-lg transition-colors whitespace-nowrap"
                            >
                              {t.versions} ({app.totalVersionsCount})
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Selected App Versions & Legacy iOS 9.0+ Downgrader (Matches Screenshot 3) */}
              <div className="lg:col-span-5">
                {selectedApp ? (
                  <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl p-5">
                    {/* Selected App Header */}
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <AppIcon src={selectedApp.artworkUrl} name={selectedApp.trackName} size="md" />
                        <div className="min-w-0">
                          <h2 className="text-xl font-bold text-white truncate">{selectedApp.trackName}</h2>
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 mt-0.5 font-mono tabular-nums">
                            <span>ID {selectedApp.trackId}</span>
                            <span aria-hidden="true">·</span>
                            <span>{selectedApp.formattedPrice}</span>
                            <span aria-hidden="true">·</span>
                            <span>{selectedApp.sellerName}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Copy Strip (DLiPA feature: Copy Bundle-ID, Application-ID, Link, Purchase Free License) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 border-b border-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(selectedApp.bundleId, 'Bundle ID', 'sel-bundle')}
                        className="px-2.5 py-2 bg-[#2C2C2E] hover:bg-[#3A3A3C] rounded-lg text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Bundle ID</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(String(selectedApp.trackId), 'App ID', 'sel-appid')}
                        className="px-2.5 py-2 bg-[#2C2C2E] hover:bg-[#3A3A3C] rounded-lg text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy App ID</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(selectedApp.trackViewUrl, 'Store Link', 'sel-link')}
                        className="px-2.5 py-2 bg-[#2C2C2E] hover:bg-[#3A3A3C] rounded-lg text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <Share2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Link</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          triggerToast(
                            `Acquired free App Store license for ${selectedApp.trackName} on ${activeAccount?.email}`
                          )
                        }
                        className="px-2.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Purchase Free</span>
                      </button>
                    </div>

                    {/* Modern Compatibility Layer Controls for iOS 9.0+ */}
                    <div className="py-3.5 border-b border-white/[0.08]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white">
                          iOS 9.0+ Modern Compatibility Layer Injection
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const ios9Ver =
                              selectedApp.versions.find((v) => parseFloat(v.minOSVersion) <= 9.3) ||
                              selectedApp.versions[selectedApp.versions.length - 1];
                            if (ios9Ver) startVersionDownload(selectedApp, ios9Ver);
                          }}
                          className="text-xs font-semibold text-[#0A84FF] hover:underline whitespace-nowrap"
                        >
                          Download Last iOS 9.3.5 Build &rarr;
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <label className="flex items-center gap-2 p-2 rounded-lg bg-[#252528] cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={compatConfig.patchMinOs9}
                            onChange={(e) =>
                              setCompatConfig((c) => ({ ...c, patchMinOs9: e.target.checked }))
                            }
                            className="rounded accent-[#0A84FF]"
                          />
                          <span className="text-slate-200">Patch MinimumOSVersion &rarr; 9.0</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 rounded-lg bg-[#252528] cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={compatConfig.stripArm64Locks}
                            onChange={(e) =>
                              setCompatConfig((c) => ({ ...c, stripArm64Locks: e.target.checked }))
                            }
                            className="rounded accent-[#0A84FF]"
                          />
                          <span className="text-slate-200">Universal armv7 + arm64 Slice</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 rounded-lg bg-[#252528] cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={compatConfig.injectSwiftShim}
                            onChange={(e) =>
                              setCompatConfig((c) => ({ ...c, injectSwiftShim: e.target.checked }))
                            }
                            className="rounded accent-[#0A84FF]"
                          />
                          <span className="text-slate-200">Inject libswiftCompatibility50</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 rounded-lg bg-[#252528] cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={compatConfig.injectCryptoShim}
                            onChange={(e) =>
                              setCompatConfig((c) => ({ ...c, injectCryptoShim: e.target.checked }))
                            }
                            className="rounded accent-[#0A84FF]"
                          />
                          <span className="text-slate-200">CommonCrypto + SFVector Shim</span>
                        </label>
                      </div>
                    </div>

                    {/* DLiPA v1.3: Download Specific App Version via Version ID */}
                    <form onSubmit={handleCustomVersionIdDownload} className="py-3 border-b border-white/[0.08]">
                      <label className="block text-xs text-slate-400 mb-1.5">
                        Download Specific Version via Apple External Version ID
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={customVersionIdInput}
                          onChange={(e) => setCustomVersionIdInput(e.target.value)}
                          placeholder="e.g. 821439081 (iOS 9.0) or 875214761"
                          className="flex-1 h-9 px-3 bg-[#252528] border border-white/10 rounded-lg text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A84FF]"
                        />
                        <button
                          type="submit"
                          className="px-3 h-9 bg-[#2C2C2E] hover:bg-[#0A84FF] text-xs font-semibold text-white rounded-lg transition-colors whitespace-nowrap shrink-0"
                        >
                          Fetch Version ID
                        </button>
                      </div>
                    </form>

                    {/* Target iOS Version Filter Segmented Control */}
                    <div className="pt-3 pb-2 flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-slate-400 tabular-nums">
                        {t.versions} ({selectedApp.totalVersionsCount})
                      </span>
                      <div className="flex items-center gap-1 p-1 bg-[#121214] rounded-lg overflow-x-auto">
                        {(
                          [
                            { id: 'all', label: 'All' },
                            { id: '9.0', label: 'iOS 9' },
                            { id: '10.3', label: 'iOS 10' },
                            { id: '12.0', label: 'iOS 12' },
                            { id: '13.0', label: 'iOS 13+' },
                          ] as { id: TargetIosFilter; label: string }[]
                        ).map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setTargetIosFilter(tab.id)}
                            className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                              targetIosFilter === tab.id
                                ? 'bg-[#2C2C2E] text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Versions List matching Screenshot 3 of DLiPA: v20.22.1 / 875214761 */}
                    <div className="divide-y divide-white/[0.07] max-h-[460px] overflow-y-auto pr-1">
                      {filteredVersions.map((ver) => (
                        <div
                          key={ver.externalVersionId}
                          className="py-3 flex items-center justify-between gap-3 hover:bg-white/[0.02] px-2 rounded-lg transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[15px] font-bold text-white font-mono tabular-nums">
                                v{ver.version}
                              </span>
                              <span className="text-xs text-slate-400 font-mono tabular-nums">
                                · iOS {ver.minOSVersion}+ · {ver.sizeMB} MB
                              </span>
                            </div>
                            <div className="text-[13px] text-[#8E8E93] font-mono tabular-nums mt-0.5">
                              {ver.externalVersionId} · {ver.architecture}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{ver.compatibilityNote}</div>
                          </div>

                          <button
                            type="button"
                            onClick={() => startVersionDownload(selectedApp, ver)}
                            className="px-3 py-2 bg-[#2C2C2E] hover:bg-[#0A84FF] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Get IPA</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: DOWNLOADS & OTA INSTALLER (Matches Screenshot 4 of DLiPA)   */}
        {/* ================================================================= */}
        {activeTab === 'downloads' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold tracking-tight text-white">{t.downloads}</h1>
              <div className="text-xs text-slate-400">
                Each Apple ID account maintains isolated IPA packages &amp; SINF signatures
              </div>
            </div>

            {/* Downloads Search Input matching Screenshot 4 */}
            <div className="relative mb-6 max-w-xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={downloadsFilter}
                onChange={(e) => setDownloadsFilter(e.target.value)}
                placeholder={t.downloadsPlaceholder}
                className="w-full h-11 pl-10 pr-10 bg-[#1C1C1E] border border-white/[0.08] rounded-xl text-[15px] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A84FF]"
              />
              {downloadsFilter && (
                <button
                  type="button"
                  onClick={() => setDownloadsFilter('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Grouped by Apple ID Account (e.g. prooxy0@gmail.com (5)) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-6">
                {Object.keys(groupedDownloads).length === 0 ? (
                  <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl p-10 text-center">
                    <p className="text-sm text-slate-300 mb-3">No downloaded IPA archives match your filter.</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('search')}
                      className="px-4 py-2 bg-[#0A84FF] text-white text-xs font-semibold rounded-lg"
                    >
                      Browse App Store
                    </button>
                  </div>
                ) : (
                  Object.entries(groupedDownloads).map(([email, items]) => (
                    <div key={email}>
                      <div className="px-2 mb-2 text-[13px] font-medium text-[#8E8E93] tabular-nums">
                        {email} ({items.length})
                      </div>
                      <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.07] overflow-hidden">
                        {items.map((item) => {
                          const isInspected = inspectingDownload?.id === item.id;
                          return (
                            <div
                              key={item.id}
                              onClick={() => setInspectingDownload(item)}
                              className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                                isInspected ? 'bg-white/[0.07]' : 'hover:bg-white/[0.03]'
                              }`}
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <AppIcon src={item.artworkUrl} name={item.trackName} />
                                <div className="min-w-0">
                                  <h3 className="text-[16px] font-semibold text-white truncate">
                                    {item.trackName}
                                  </h3>
                                  {/* Matches Screenshot 4: v20.19.2 · 205.8 MB */}
                                  <div className="flex flex-wrap items-center gap-1.5 text-[13px] text-[#8E8E93] font-mono tabular-nums mt-0.5">
                                    <span>v{item.version}</span>
                                    <span aria-hidden="true">·</span>
                                    <span>{item.sizeMB} MB</span>
                                    <span aria-hidden="true">·</span>
                                    <span>Min iOS {item.patchedMinOSVersion}</span>
                                  </div>
                                  <div className="text-xs text-slate-400 font-mono truncate mt-0.5">
                                    {item.bundleId} · ID {item.externalVersionId} · {item.architecture}
                                  </div>
                                </div>
                              </div>

                              <div
                                className="flex items-center gap-2 shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <a
                                  href={buildIpaDownloadHref(item)}
                                  download
                                  onClick={() =>
                                    triggerToast(`Exporting signed .IPA for ${item.trackName} v${item.version}`)
                                  }
                                  className="px-3 py-2 bg-[#0A84FF] hover:bg-[#0070E0] text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Save .IPA</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={() => setInspectingDownload(item)}
                                  className="px-2.5 py-2 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-slate-200 text-xs font-medium rounded-xl transition-colors whitespace-nowrap"
                                >
                                  OTA / Patch
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDownloads((prev) => prev.filter((d) => d.id !== item.id));
                                    if (inspectingDownload?.id === item.id) setInspectingDownload(null);
                                    triggerToast(`Deleted ${item.trackName} v${item.version}`);
                                  }}
                                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                                  aria-label="Delete IPA"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Right Column: IPA Inspector, OTA Installer & AirDrop Sharing */}
              <div className="lg:col-span-5">
                {(() => {
                  const target = inspectingDownload || downloads[0];
                  if (!target) return null;
                  const otaHref = buildOtaItmsHref(target);
                  const ipaHref = buildIpaDownloadHref(target);

                  return (
                    <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-3.5 pb-4 border-b border-white/[0.08]">
                        <AppIcon src={target.artworkUrl} name={target.trackName} />
                        <div className="min-w-0">
                          <h2 className="text-lg font-bold text-white truncate">{target.trackName}</h2>
                          <div className="text-xs text-slate-400 font-mono tabular-nums">
                            v{target.version} · External ID {target.externalVersionId}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Signed for {target.accountEmail}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                          <span className="text-slate-400">Bundle Identifier</span>
                          <span className="font-mono text-white">{target.bundleId}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                          <span className="text-slate-400">Original MinimumOSVersion</span>
                          <span className="font-mono text-slate-300">iOS {target.minOSVersion}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                          <span className="text-slate-400">Patched MinimumOSVersion</span>
                          <span className="font-mono text-emerald-400 font-semibold">
                            iOS {target.patchedMinOSVersion} (iOS 9+ Ready)
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                          <span className="text-slate-400">Mach-O Slices</span>
                          <span className="font-mono text-white">{target.architecture}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        <a
                          href={ipaHref}
                          download
                          className="h-11 px-4 rounded-xl bg-[#0A84FF] hover:bg-[#0070E0] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download .IPA Archive</span>
                        </a>
                        <a
                          href={otaHref}
                          className="h-11 px-4 rounded-xl bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                        >
                          <Smartphone className="w-4 h-4 text-[#0A84FF]" />
                          <span>Install on Device (OTA)</span>
                        </a>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#141416] border border-white/[0.06] text-xs text-slate-300 space-y-2">
                        <div className="font-semibold text-white">
                          OTA Manifest &amp; AirDrop Installation Note
                        </div>
                        <p className="text-slate-400 leading-relaxed">
                          As noted in DLiPA documentation, installing directly via OTA uses{' '}
                          <code className="text-slate-200">itms-services://</code>. For best results on non-jailbroken
                          devices or legacy iOS 9–12 devices, share the downloaded <code className="text-slate-200">.ipa</code> via
                          AirDrop, AltStore, Sideloadly, or TrollStore.
                        </p>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(otaHref, 'OTA itms-services URL', `ota-${target.id}`)}
                          className="w-full py-2 bg-[#252528] hover:bg-[#2C2C2E] rounded-lg text-xs font-mono text-[#0A84FF] flex items-center justify-center gap-1.5"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy itms-services:// Manifest Link</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: ACCOUNTS MANAGER (Multi-Account Apple ID & Storefront)      */}
        {/* ================================================================= */}
        {activeTab === 'accounts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{t.accounts}</h1>
              <p className="text-sm text-slate-400 mb-4">
                Sign in with multiple Apple IDs to download region-locked apps and keep separate IPA libraries per account.
              </p>

              <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.07] overflow-hidden">
                {accounts.map((acc) => {
                  const count = downloads.filter((d) => d.accountEmail === acc.email).length;
                  return (
                    <div key={acc.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-semibold text-white truncate">{acc.email}</span>
                          {acc.isActive && (
                            <span className="text-xs font-medium text-[#0A84FF]">· Active Account</span>
                          )}
                        </div>
                        <div className="text-xs text-[#8E8E93] font-mono tabular-nums mt-1">
                          DSID {acc.dsid} · {acc.storefrontName} · {count} downloads
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Token: {acc.passwordToken} · Auth: {acc.lastAuthenticated}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!acc.isActive && (
                          <button
                            type="button"
                            onClick={() => {
                              setAccounts((prev) =>
                                prev.map((a) => ({ ...a, isActive: a.id === acc.id }))
                              );
                              const sf = STOREFRONTS.find((s) => s.code === acc.storefrontCode);
                              if (sf) setSelectedStorefront(sf);
                              triggerToast(`Switched active Apple ID to ${acc.email}`);
                            }}
                            className="px-3 py-1.5 bg-[#2C2C2E] hover:bg-[#0A84FF] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                          >
                            Use Account
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteAccount(acc)}
                          className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DLiPA v1.3 Fix: "Delete account with files" option */}
              <div className="p-4 bg-[#1C1C1E] border border-white/[0.08] rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Delete account with files</div>
                  <div className="text-xs text-slate-400">
                    Automatically remove downloaded IPA packages associated with an account when deleting it (v1.3)
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={deleteWithFiles}
                  onChange={(e) => setDeleteWithFiles(e.target.checked)}
                  className="w-4 h-4 accent-[#0A84FF]"
                />
              </div>
            </div>

            {/* Add Apple ID Account Form */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleAddAccount}
                className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl p-5 space-y-4"
              >
                <h2 className="text-lg font-bold text-white">Add Apple ID Account</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Authenticates against Apple&apos;s <code className="text-slate-200">buy.itunes.apple.com</code>{' '}
                  endpoint using the CommonCrypto SHA-256 + HMAC compatibility layer and your hardware GUID.
                </p>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Apple ID (Email)</label>
                  <input
                    type="email"
                    required
                    value={newAccEmail}
                    onChange={(e) => setNewAccEmail(e.target.value)}
                    placeholder="user@icloud.com"
                    className="w-full h-10 px-3 bg-[#252528] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#0A84FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={newAccPassword}
                    onChange={(e) => setNewAccPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-10 px-3 bg-[#252528] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#0A84FF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">2FA Code (Optional)</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={newAcc2FA}
                      onChange={(e) => setNewAcc2FA(e.target.value)}
                      placeholder="123456"
                      className="w-full h-10 px-3 bg-[#252528] border border-white/10 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#0A84FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Account Storefront</label>
                    <select
                      value={newAccStorefront}
                      onChange={(e) => setNewAccStorefront(e.target.value)}
                      className="w-full h-10 px-3 bg-[#252528] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#0A84FF]"
                    >
                      {STOREFRONTS.map((sf) => (
                        <option key={sf.code} value={sf.code}>
                          {sf.flag} {sf.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-[#0A84FF] hover:bg-[#0070E0] text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Authenticate Apple ID
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: iOS 9.0+ MODERN COMPATIBILITY LAYER ARCHITECTURE STUDIO     */}
        {/* ================================================================= */}
        {activeTab === 'compat' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  GitHub Actions CI/CD &amp; iOS 9.0+ Compatibility Layer
                </h1>
                <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                  Includes <code className="text-slate-200">.github/workflows/build-ipa.yml</code> and{' '}
                  <code className="text-slate-200">ios/project.yml</code> (XcodeGen) to automatically compile, backport
                  Mach-O headers to iOS 9.0 via <code className="text-slate-200">vtool</code>, ad-hoc sign with{' '}
                  <code className="text-slate-200">ldid</code>, and publish <code className="text-slate-200">DLiPA_v1.4_iOS9_Compat.ipa</code>.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="/legacy"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 whitespace-nowrap"
                >
                  <ExternalLink className="w-4 h-4 text-[#0A84FF]" />
                  <span>Launch iOS 9 Safari ES5 WebApp</span>
                </a>
                <a
                  href="/api/xcode-project/download"
                  className="px-4 py-2.5 bg-[#0A84FF] hover:bg-[#0070E0] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 whitespace-nowrap"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Download GitHub Actions + Xcode Repo (.zip)</span>
                </a>
              </div>
            </div>

            {/* GitHub Actions Interactive Workflow Dispatch & Artifact Builder */}
            <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-base font-bold text-white">
                    GitHub Actions Workflow Dispatch (.github/workflows/build-ipa.yml)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure <code className="text-slate-200">workflow_dispatch</code> parameters, trigger the CI build
                    pipeline, or export the compiled <code className="text-slate-200">DLiPA_v1.4_iOS9_Compat.ipa</code> artifact.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={triggerGitHubActionsBuild}
                    disabled={isCiRunning}
                    className="px-4 py-2 bg-[#2C2C2E] hover:bg-[#3A3A3C] disabled:opacity-50 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isCiRunning ? 'animate-spin text-[#0A84FF]' : ''}`} />
                    <span>{isCiRunning ? 'Running Workflow...' : 'Run workflow_dispatch'}</span>
                  </button>
                  <a
                    href={`/api/ipa/download?bundleId=com.ahmedbafkir.dlipa.legacy&appName=DLiPA&version=1.4.0&externalVersionId=900000140&minOs=${ciMinIos}&patchMinOs9=${ciMinIos === '9.0' ? 'true' : 'false'}`}
                    download
                    onClick={() => triggerToast(`Downloading GitHub Actions Artifact: DLiPA_v1.4.0_iOS${ciMinIos}.ipa`)}
                    className="px-4 py-2 bg-[#0A84FF] hover:bg-[#0070E0] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Built DLiPA.ipa Artifact</span>
                  </a>
                </div>
              </div>

              {/* Workflow Inputs Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Runner Image (runs-on)</label>
                  <select
                    value={ciRunner}
                    onChange={(e) => setCiRunner(e.target.value as 'macos-latest' | 'macos-14' | 'macos-13')}
                    className="w-full h-9 px-3 bg-[#252528] border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#0A84FF]"
                  >
                    <option value="macos-latest">macos-latest (Xcode 15/16 + vtool iOS 9 patch)</option>
                    <option value="macos-14">macos-14 (Apple Silicon M1 arm64)</option>
                    <option value="macos-13">macos-13 (Xcode 14.2 Legacy SDK)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">inputs.min_ios_version</label>
                  <select
                    value={ciMinIos}
                    onChange={(e) => setCiMinIos(e.target.value as '9.0' | '9.3' | '10.3' | '12.0')}
                    className="w-full h-9 px-3 bg-[#252528] border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#0A84FF]"
                  >
                    <option value="9.0">iOS 9.0 (Mach-O vtool + PlistBuddy backport)</option>
                    <option value="9.3">iOS 9.3.5 / 9.3.6 (32-bit armv7 &amp; arm64)</option>
                    <option value="10.3">iOS 10.3.3 / 10.3.4</option>
                    <option value="12.0">iOS 12.0 – 12.5.7</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">inputs.sign_method</label>
                  <select
                    value={ciSignMethod}
                    onChange={(e) => setCiSignMethod(e.target.value as 'ldid-adhoc' | 'unsigned')}
                    className="w-full h-9 px-3 bg-[#252528] border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#0A84FF]"
                  >
                    <option value="ldid-adhoc">ldid -SResources/Entitlements.plist (Ad-Hoc / TrollStore / AltStore)</option>
                    <option value="unsigned">Unsigned Payload (Sideloadly / iOS App Signer)</option>
                  </select>
                </div>
              </div>

              {/* 6-Step GitHub Actions Job Execution Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 pt-1">
                {[
                  { step: 1, name: '1. Checkout & Brew', cmd: 'brew install xcodegen ldid' },
                  { step: 2, name: '2. XcodeGen', cmd: 'xcodegen generate (ios/project.yml)' },
                  { step: 3, name: '3. Xcode Archive', cmd: 'xcodebuild -scheme DLiPA-Legacy' },
                  { step: 4, name: '4. Mach-O iOS 9 Patch', cmd: `vtool -set-build-version ios ${ciMinIos}` },
                  { step: 5, name: '5. Ad-Hoc Sign', cmd: ciSignMethod === 'ldid-adhoc' ? 'ldid -SEntitlements.plist' : 'Skip ldid (unsigned)' },
                  { step: 6, name: '6. Upload Artifact', cmd: 'DLiPA_v1.4_iOS9_Compat.ipa' },
                ].map((item) => {
                  const done = ciStepIndex >= item.step;
                  const active = isCiRunning && ciStepIndex + 1 === item.step;
                  return (
                    <div
                      key={item.step}
                      className={`p-3 rounded-xl border text-xs transition-colors ${
                        done
                          ? 'bg-[#141E18] border-emerald-500/30 text-emerald-200'
                          : active
                            ? 'bg-[#131C2E] border-[#0A84FF] text-blue-200'
                            : 'bg-[#141416] border-white/[0.06] text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <span className="truncate">{item.name}</span>
                        {done && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </div>
                      <div className="font-mono text-[11px] opacity-80 truncate">{item.cmd}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Compatibility Matrix Table */}
            <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-slate-400">
                    <th className="py-3.5 px-4 font-semibold">Subsystem</th>
                    <th className="py-3.5 px-4 font-semibold">Original DLiPA (iOS 13+)</th>
                    <th className="py-3.5 px-4 font-semibold">Compatibility Layer (iOS 9.0+)</th>
                    <th className="py-3.5 px-4 font-semibold">Supported CPU Slices</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-slate-200">
                  <tr>
                    <td className="py-3 px-4 font-medium text-white">UI &amp; Navigation</td>
                    <td className="py-3 px-4 font-mono text-slate-400">SwiftUI NavigationStack / .insetGrouped</td>
                    <td className="py-3 px-4 font-mono text-blue-400">DLiPAInsetCardCell + NSLayoutAnchor (iOS 9.0)</td>
                    <td className="py-3 px-4 font-mono tabular-nums">armv7 · armv7s · arm64</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-white">Apple Store Auth Hashing</td>
                    <td className="py-3 px-4 font-mono text-slate-400">CryptoKit.SHA256 / HMAC</td>
                    <td className="py-3 px-4 font-mono text-blue-400">CommonCrypto (CC_SHA256 / CCHmac)</td>
                    <td className="py-3 px-4 font-mono tabular-nums">armv7 · arm64</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-white">Vector System Icons</td>
                    <td className="py-3 px-4 font-mono text-slate-400">UIImage(systemName:) (SF Symbols)</td>
                    <td className="py-3 px-4 font-mono text-blue-400">SFSymbolsLegacyFallback CoreGraphics Renderer</td>
                    <td className="py-3 px-4 font-mono tabular-nums">armv7 · arm64</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-white">Networking &amp; Concurrency</td>
                    <td className="py-3 px-4 font-mono text-slate-400">URLSession async/await + Combine</td>
                    <td className="py-3 px-4 font-mono text-blue-400">NSURLSessionDataTask + TLS 1.2 + libswiftCompatibility50</td>
                    <td className="py-3 px-4 font-mono tabular-nums">armv7 · arm64</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-white">Legacy Safari Web Client</td>
                    <td className="py-3 px-4 font-mono text-slate-400">ES2022 + CSS Grid</td>
                    <td className="py-3 px-4 font-mono text-blue-400">/legacy ES5 XMLHttpRequest + WebKit 601 Float Layout</td>
                    <td className="py-3 px-4 font-mono tabular-nums">iPhone 4S / iPad 2 (iOS 9.3.5)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Interactive Source Code Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 bg-[#1C1C1E] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.07] overflow-hidden">
                {COMPATIBILITY_LAYERS.map((mod) => {
                  const active = mod.id === selectedCompatModule.id;
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => setSelectedCompatModuleId(mod.id)}
                      className={`w-full p-4 text-left transition-colors ${
                        active ? 'bg-white/[0.08]' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="text-sm font-semibold text-white">{mod.title}</div>
                      <div className="text-xs text-slate-400 font-mono mt-1">
                        {mod.minIosOriginal} &rarr; {mod.backportedTo} · {mod.architectures}
                      </div>
                      <div className="text-xs text-slate-400 mt-1.5 line-clamp-2">{mod.summary}</div>
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-7 bg-[#1C1C1E] border border-white/[0.08] rounded-2xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/[0.08]">
                  <div>
                    <h2 className="text-base font-bold text-white">{selectedCompatModule.title}</h2>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {selectedCompatModule.filePath} · Replaces {selectedCompatModule.replacedApi}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        selectedCompatModule.code,
                        selectedCompatModule.filePath,
                        `code-${selectedCompatModule.id}`
                      )
                    }
                    className="px-3 py-1.5 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-xs font-medium text-white rounded-lg inline-flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Swift Source</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">{selectedCompatModule.summary}</p>

                <pre className="p-4 rounded-xl bg-[#0D0E12] border border-white/[0.07] text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                  <code>{selectedCompatModule.code}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: SETTINGS (Matches Screenshot 5 of DLiPA)                    */}
        {/* ================================================================= */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-white">{t.settings}</h1>

            {/* Search Limit Section (Matches Screenshot 5) */}
            <div>
              <div className="px-4 mb-2 text-xs font-medium text-[#8E8E93]">{t.search}</div>
              <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl px-4 py-3 flex items-center justify-between">
                <span className="text-[16px] text-white">Search Limit</span>
                <div className="flex items-center gap-4">
                  <span className="text-[16px] text-[#8E8E93] font-mono tabular-nums">{searchLimit}</span>
                  <div className="inline-flex items-center bg-[#2C2C2E] rounded-lg overflow-hidden divide-x divide-white/15">
                    <button
                      type="button"
                      onClick={() => setSearchLimit((v) => Math.max(0, v - 5))}
                      className="w-11 h-8 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                      aria-label="Decrease search limit"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchLimit((v) => Math.min(200, v + 5))}
                      className="w-11 h-8 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                      aria-label="Increase search limit"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="px-4 mt-2 text-xs text-[#8E8E93] leading-relaxed">
                Set the number of results to display. By default, a value of 0 displays all results.
              </p>
            </div>

            {/* GUID Section (Matches Screenshot 5) */}
            <div>
              <div className="px-4 mb-2 text-xs font-medium text-[#8E8E93]">GUID</div>
              <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.07]">
                <button
                  type="button"
                  onClick={() => {
                    const nextGuid = generateHardwareGuid();
                    setHardwareGuid(nextGuid);
                    triggerToast(`Generated new hardware MAC GUID: ${nextGuid}`);
                  }}
                  className="w-full px-4 py-3.5 text-left text-[16px] text-[#0A84FF] hover:bg-white/[0.03] transition-colors flex items-center justify-between"
                >
                  <span>{t.generateGuid}</span>
                  <span className="text-xs font-mono text-slate-400 tabular-nums">{hardwareGuid}</span>
                </button>
              </div>
              <p className="px-4 mt-2 text-xs text-[#8E8E93] leading-relaxed">
                An identifier is generated and used as a MAC address from your hardware to identify your device with
                Apple.
              </p>
            </div>

            {/* Multi-Language & Legacy iOS Target Defaults (DLiPA v1.4 + iOS 9 Rebuild) */}
            <div>
              <div className="px-4 mb-2 text-xs font-medium text-[#8E8E93]">
                Localization &amp; Legacy iOS Compatibility
              </div>
              <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.07]">
                <div className="px-4 py-3.5 flex items-center justify-between gap-4">
                  <span className="text-[16px] text-white">App Language (14 Languages)</span>
                  <select
                    value={language}
                    onChange={(e) => {
                      const nextLang = e.target.value as SupportedLanguage;
                      setLanguage(nextLang);
                      triggerToast(`Language switched to ${LANGUAGE_LABELS[nextLang].name}`);
                    }}
                    className="bg-[#2C2C2E] text-white text-sm rounded-lg px-3 py-1.5 border border-white/10 focus:outline-none focus:border-[#0A84FF]"
                  >
                    {(Object.keys(LANGUAGE_LABELS) as SupportedLanguage[]).map((code) => (
                      <option key={code} value={code}>
                        {LANGUAGE_LABELS[code].name} ({LANGUAGE_LABELS[code].native})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="px-4 py-3.5 flex items-center justify-between gap-4">
                  <span className="text-[16px] text-white">Default Target iOS Version</span>
                  <select
                    value={defaultLegacyIos}
                    onChange={(e) => setDefaultLegacyIos(e.target.value)}
                    className="bg-[#2C2C2E] text-white text-sm font-mono rounded-lg px-3 py-1.5 border border-white/10 focus:outline-none focus:border-[#0A84FF]"
                  >
                    <option value="9.3.5">iOS 9.3.5 / 9.3.6 (32-bit armv7)</option>
                    <option value="10.3.4">iOS 10.3.3 / 10.3.4 (Universal)</option>
                    <option value="11.4.1">iOS 11.4.1 (64-bit arm64)</option>
                    <option value="12.5.7">iOS 12.5.7 (64-bit arm64)</option>
                    <option value="13.7">iOS 13.7 (Original DLiPA Baseline)</option>
                    <option value="15.8">iOS 15.8.3</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reset All Section (Matches Screenshot 5) */}
            <div>
              <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl overflow-hidden">
                {!confirmResetOpen ? (
                  <button
                    type="button"
                    onClick={() => setConfirmResetOpen(true)}
                    className="w-full px-4 py-3.5 text-left text-[16px] text-[#FF453A] hover:bg-white/[0.03] transition-colors"
                  >
                    {t.resetAll}
                  </button>
                ) : (
                  <div className="p-4 flex flex-wrap items-center justify-between gap-3 bg-rose-950/30">
                    <span className="text-sm text-rose-200">
                      Confirm resetting all accounts, downloads, and settings?
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResetAll}
                        className="px-3 py-1.5 bg-[#FF453A] text-white text-xs font-semibold rounded-lg"
                      >
                        Confirm Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmResetOpen(false)}
                        className="px-3 py-1.5 bg-[#2C2C2E] text-white text-xs font-medium rounded-lg"
                      >
                        {t.cancel}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <p className="px-4 mt-2 text-xs text-[#8E8E93] leading-relaxed">
                Reset the app to its original state by deleting all data and settings.
              </p>
            </div>

            {/* Developer & Original Repository Section (Matches Screenshot 5 + Upstream Credits) */}
            <div>
              <div className="px-4 mb-2 text-xs font-medium text-[#8E8E93]">
                Developer &amp; Original Repository
              </div>
              <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.07] overflow-hidden">
                <a
                  href="https://github.com/AhmedBafkir/DLiPA"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3.5 flex items-center justify-between text-[16px] text-white hover:bg-white/[0.03] transition-colors"
                >
                  <div>
                    <div>Ahmed Bafkir</div>
                    <div className="text-xs text-[#8E8E93] font-mono mt-0.5">
                      github.com/AhmedBafkir/DLiPA (Original Author &amp; Repository)
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8E8E93] shrink-0" />
                </a>
                <a
                  href="https://github.com/AhmedBafkir/DLiPA/releases"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3.5 flex items-center justify-between text-[16px] text-white hover:bg-white/[0.03] transition-colors"
                >
                  <div>
                    <div>Official DLiPA Releases</div>
                    <div className="text-xs text-[#8E8E93] font-mono mt-0.5">
                      github.com/AhmedBafkir/DLiPA/releases
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8E8E93] shrink-0" />
                </a>
                <a
                  href="https://github.com/majd/ipatool"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3.5 flex items-center justify-between text-[16px] text-white hover:bg-white/[0.03] transition-colors"
                >
                  <div>
                    <div>Majd Alfhaily (ipatool)</div>
                    <div className="text-xs text-[#8E8E93] font-mono mt-0.5">
                      github.com/majd/ipatool (Core Concept &amp; Acknowledgements)
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8E8E93] shrink-0" />
                </a>
                <a
                  href="https://www.paypal.com/ncp/payment/RLKKWBYSKSPVU"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3.5 flex items-center justify-between text-[16px] text-white hover:bg-white/[0.03] transition-colors"
                >
                  <div>
                    <div>Support Me (Ahmed Bafkir)</div>
                    <div className="text-xs text-[#8E8E93] mt-0.5">
                      Support the original author&apos;s continuation and development of DLiPA via PayPal
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8E8E93] shrink-0" />
                </a>
              </div>
            </div>

            {/* About Section (Matches Screenshot 5) */}
            <div>
              <div className="px-4 mb-2 text-xs font-medium text-[#8E8E93]">About</div>
              <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl px-4 py-3.5 flex items-center justify-between">
                <span className="text-[16px] text-white">Version</span>
                <span className="text-[16px] text-[#8E8E93] font-mono tabular-nums">1.4.0 (iOS 9.0+ Compat)</span>
              </div>
              <p className="px-4 mt-2 text-xs text-[#8E8E93] leading-relaxed">
                Original application created by{' '}
                <a
                  href="https://github.com/AhmedBafkir/DLiPA"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0A84FF] hover:underline"
                >
                  Ahmed Bafkir (AhmedBafkir/DLiPA)
                </a>
                , inspired by the concept of{' '}
                <a
                  href="https://github.com/majd/ipatool"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0A84FF] hover:underline"
                >
                  ipatool by Majd Alfhaily
                </a>
                . Rebuilt with modern compatibility layers supporting legacy iOS versions dating back to iOS 9.0.
              </p>
            </div>
          </div>
        )}

        {/* Global Upstream Credit Footer across all tabs */}
        <footer className="mt-12 pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span>
              Original project by{' '}
              <a
                href="https://github.com/AhmedBafkir/DLiPA"
                target="_blank"
                rel="noreferrer"
                className="text-slate-200 hover:text-white font-medium underline decoration-white/20 hover:decoration-white"
              >
                Ahmed Bafkir (AhmedBafkir/DLiPA)
              </a>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Inspired by{' '}
              <a
                href="https://github.com/majd/ipatool"
                target="_blank"
                rel="noreferrer"
                className="text-slate-200 hover:text-white font-medium underline decoration-white/20 hover:decoration-white"
              >
                ipatool by Majd Alfhaily
              </a>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/AhmedBafkir/DLiPA/releases"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Original Releases
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://www.paypal.com/ncp/payment/RLKKWBYSKSPVU"
              target="_blank"
              rel="noreferrer"
              className="text-[#0A84FF] hover:underline font-medium"
            >
              Support Ahmed Bafkir ♡
            </a>
          </div>
        </footer>
      </main>

      {/* ================================================================= */}
      {/* FLOATING ACTIVE DOWNLOAD PROGRESS CARD (Matches Screenshot 3!)     */}
      {/* ================================================================= */}
      {activeDownload && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md bg-[#D1D1D6] text-black rounded-2xl p-3.5 shadow-2xl flex items-center gap-3.5 border border-white/40">
          <AppIcon src={activeDownload.app.artworkUrl} name={activeDownload.app.trackName} size="md" />
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold truncate">
              <span className="text-black">{activeDownload.app.trackName}</span>{' '}
              <span className="text-neutral-600 font-normal">(v{activeDownload.versionObj.version})</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-400/70 rounded-full overflow-hidden my-1.5">
              <div
                className="h-full bg-[#007AFF] transition-all duration-150"
                style={{
                  width: `${Math.min(100, Math.round((activeDownload.downloadedMB / activeDownload.totalMB) * 100))}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-600 font-mono tabular-nums">
              <span>
                {activeDownload.downloadedMB} MB of {activeDownload.totalMB} MB
              </span>
              <span>{activeDownload.stage}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveDownload(null);
              triggerToast('Download cancelled');
            }}
            className="p-2 text-neutral-700 hover:text-black"
            aria-label="Cancel download"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ================================================================= */}
      {/* MOBILE FIXED BOTTOM TAB BAR (Matches DLiPA Bottom Bar on Mobile)   */}
      {/* ================================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#121214]/95 backdrop-blur-md border-t border-white/[0.08] grid grid-cols-5 items-center h-16">
        <button
          type="button"
          onClick={() => {
            setActiveTab('search');
            setIsStorefrontPickerOpen(false);
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] ${
            activeTab === 'search' ? 'text-white' : 'text-[#8E8E93]'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1 whitespace-nowrap">{t.search}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('downloads');
            setIsStorefrontPickerOpen(false);
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] ${
            activeTab === 'downloads' ? 'text-white' : 'text-[#8E8E93]'
          }`}
        >
          <Download className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1 whitespace-nowrap">{t.downloads}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('accounts');
            setIsStorefrontPickerOpen(false);
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] ${
            activeTab === 'accounts' ? 'text-white' : 'text-[#8E8E93]'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1 whitespace-nowrap">{t.accounts}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('compat');
            setIsStorefrontPickerOpen(false);
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] ${
            activeTab === 'compat' ? 'text-white' : 'text-[#8E8E93]'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1 whitespace-nowrap">iOS 9</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('settings');
            setIsStorefrontPickerOpen(false);
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] ${
            activeTab === 'settings' ? 'text-white' : 'text-[#8E8E93]'
          }`}
        >
          <SettingsIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1 whitespace-nowrap">{t.settings}</span>
        </button>
      </nav>
    </div>
  );
}
