import { Share, SquarePlus, X } from 'lucide-react';

type InstallBannerProps = {
  onDismiss: () => void;
};

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function isAppleTouchDevice(): boolean {
  const ua = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const touchMac = platform === 'MacIntel' && window.navigator.maxTouchPoints > 1;
  return /iPad|iPhone|iPod/.test(ua) || touchMac;
}

export default function InstallBanner({ onDismiss }: InstallBannerProps) {
  if (typeof window === 'undefined') {
    return null;
  }

  if (isStandalone() || !isAppleTouchDevice()) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 lg:px-8">
      <div className="panel-surface-strong rounded-[18px] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-sky-700">iPad kurulum</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-claude-text">Ana ekrana ekleyip gerçek bir uygulama gibi kullanabilirsin</h2>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-claude-subtle">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-claude-border bg-claude-surface px-3 py-1.5">
                <Share size={14} className="text-blue-500" />
                Paylaş
              </span>
              <span className="text-claude-muted">→</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-claude-border bg-claude-surface px-3 py-1.5">
                <SquarePlus size={14} className="text-blue-500" />
                Ana ekrana ekle
              </span>
              <span className="text-claude-muted">→</span>
              <span className="inline-flex items-center rounded-full border border-claude-border bg-claude-surface px-3 py-1.5 font-semibold text-claude-text">
                English Deck
              </span>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="rounded-full border border-claude-border bg-claude-surface p-2 text-claude-muted transition-colors hover:text-claude-text"
            aria-label="Kurulum bannerini kapat"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
