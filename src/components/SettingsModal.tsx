import { Bot, Download, FolderUp, KeyRound, ShieldAlert, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { AppState } from '../types';

type SettingsModalProps = {
  isOpen: boolean;
  isOnline: boolean;
  selectedModel: NonNullable<AppState['aiModel']>;
  browserApiKey: string;
  onClose: () => void;
  onModelChange: (model: NonNullable<AppState['aiModel']>) => void;
  onSaveBrowserApiKey: (apiKey: string) => void;
  onClearBrowserApiKey: () => void;
  onShowInstallHint: () => void;
  onExportBackup: () => void;
  onImportBackup: (raw: string) => { ok: boolean; message: string };
};

const MODEL_OPTIONS: Array<{
  id: NonNullable<AppState['aiModel']>;
  title: string;
  description: string;
}> = [
  {
    id: 'gemini-3.1-flash-image-preview',
    title: 'Nano Banana 2',
    description: 'Genel kullanım için hızlı ve kaliteli varsayılan seçim.',
  },
  {
    id: 'gemini-2.5-flash-image',
    title: 'Nano Banana',
    description: 'Daha ekonomik ve hız odaklı seçenek.',
  },
  {
    id: 'gemini-3-pro-image-preview',
    title: 'Nano Banana Pro',
    description: 'Daha ağır ama daha yüksek kalite ve talimat takibi.',
  },
];

export default function SettingsModal({
  isOpen,
  isOnline,
  selectedModel,
  browserApiKey,
  onClose,
  onModelChange,
  onSaveBrowserApiKey,
  onClearBrowserApiKey,
  onShowInstallHint,
  onExportBackup,
  onImportBackup,
}: SettingsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);
  const [browserKeyDraft, setBrowserKeyDraft] = useState(browserApiKey);

  useEffect(() => {
    setBrowserKeyDraft(browserApiKey);
  }, [browserApiKey, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const raw = await file.text();
    const result = onImportBackup(raw);
    setBackupMessage(result.message);
    event.target.value = '';
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="panel-surface-strong max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-hidden rounded-[18px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-claude-border px-6 py-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-teal-700">Ayarlar</p>
            <h2 id="settings-title" className="mt-2 text-3xl font-semibold tracking-tight text-claude-text">AI ve kurulum</h2>
          </div>
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="rounded-full border border-claude-border bg-claude-surface p-2 text-claude-muted transition-colors hover:text-claude-text"
              aria-label="Ayarları kapat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="custom-scroll max-h-[calc(100vh-9rem)] space-y-6 overflow-y-auto px-6 py-6">
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Bot size={18} className="text-teal-600" />
              <h3 className="text-lg font-semibold tracking-tight text-claude-text">YZ Görsel Modeli</h3>
            </div>
            <div className={`mb-4 rounded-[22px] border px-4 py-3 text-sm ${
              isOnline ? 'border-emerald-200 bg-emerald-50/80 text-emerald-700' : 'border-amber-200 bg-amber-50/80 text-amber-700'
            }`}>
              {isOnline
                ? 'AI görsel üretimi için bağlantı hazır.'
                : 'Çevrimdışısın. Kelime verileri lokal çalışır, AI görsel üretimi beklemeye alınmalı.'}
            </div>
            <div className="space-y-3">
              {MODEL_OPTIONS.map((option) => {
                const isSelected = option.id === selectedModel;
                return (
                  <button
                    key={option.id}
                    onClick={() => onModelChange(option.id)}
                    className={`w-full rounded-[24px] border px-4 py-4 text-left transition-all ${
                      isSelected
                        ? 'border-teal-300 bg-teal-50/70 shadow-[0_14px_32px_rgba(13,148,136,0.1)]'
                        : 'border-claude-border bg-claude-surface hover:border-claude-accent/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-base font-semibold text-claude-text">{option.title}</div>
                        <div className="mt-1 text-sm text-claude-muted">{option.description}</div>
                      </div>
                      {isSelected && (
                        <span className="rounded-full bg-teal-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                          Seçili
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-claude-muted">{option.id}</div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[18px] border border-claude-border bg-claude-surface p-5">
            <div className="mb-2 flex items-center gap-2">
              <KeyRound size={18} className="text-sky-600" />
              <h3 className="text-lg font-semibold tracking-tight text-claude-text">Kolay Mod: Tarayıcı API Anahtarı</h3>
            </div>
            <p className="text-sm leading-6 text-claude-subtle">
              Buraya kendi Gemini API anahtarını girersen YZ görsel üretimi doğrudan tarayıcı üzerinden çalışır. Bu, sunucu kurmadan kullanmanın en kolay yoludur.
            </p>
            <div className="mt-4 rounded-[22px] border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-800">
              <div className="flex items-start gap-2">
                <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                <span>Bu mod sadece kişisel kullanım için uygundur. Anahtar bu cihazda lokal saklanır ve production güvenliği sağlamaz.</span>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <input
                type="password"
                value={browserKeyDraft}
                onChange={(event) => setBrowserKeyDraft(event.target.value)}
                placeholder="Gemini API anahtarı"
                className="w-full rounded-[12px] border border-claude-border bg-claude-panel px-4 py-3 text-sm font-medium text-claude-text outline-none transition-all focus:border-claude-accent focus:ring-4 focus:ring-claude-accent/10"
              />
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onSaveBrowserApiKey(browserKeyDraft)}
                  className="button-primary"
                >
                  Anahtarı Kaydet
                </button>
                <button
                  onClick={() => {
                    setBrowserKeyDraft('');
                    onClearBrowserApiKey();
                  }}
                  className="button-secondary"
                >
                  Tarayıcı Anahtarını Temizle
                </button>
              </div>
              <div className="text-xs text-claude-muted">
                {browserApiKey
                  ? 'Şu an tarayıcı anahtarı modu aktif. YZ görselleri sunucu yerine bu cihazdaki anahtar ile üretilir.'
                  : 'Tarayıcı anahtarı kayıtlı değil. Kayıtlı değilse uygulama proxy/sunucu yolunu kullanır.'}
              </div>
            </div>
          </section>

          <section className="rounded-[18px] border border-claude-border bg-claude-surface p-5">
            <div className="mb-2 flex items-center gap-2">
              <FolderUp size={18} className="text-teal-600" />
              <h3 className="text-lg font-semibold tracking-tight text-claude-text">Lokal Yedek</h3>
            </div>
            <p className="text-sm leading-6 text-claude-subtle">
              Tüm listelerini, istatistiklerini ve ayarlarını JSON dosyası olarak dışa aktarabilir veya daha önce aldığın bir yedeği geri yükleyebilirsin.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  onExportBackup();
                  setBackupMessage('Yedek dosyası indirildi.');
                }}
                className="button-primary"
              >
                <Download size={16} />
                Yedeği indir
              </button>
              <button
                onClick={handleImportClick}
                className="button-secondary"
              >
                <FolderUp size={16} />
                Yedek içe aktar
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleFileChange}
            />
            {backupMessage && (
              <div className="mt-4 rounded-[12px] border border-claude-border bg-claude-panel px-4 py-3 text-sm font-medium text-claude-text">
                {backupMessage}
              </div>
            )}
          </section>

          <section className="rounded-[18px] border border-claude-border bg-claude-surface p-5">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <h3 className="text-lg font-semibold tracking-tight text-claude-text">iPad kurulum yardımı</h3>
            </div>
            <p className="text-sm leading-6 text-claude-subtle">
              Bannerı tekrar göstermek veya kullanıcıya ana ekrana ekleme akışını hatırlatmak için bu düğmeyi kullanabilirsin.
            </p>
            <button
              onClick={onShowInstallHint}
              className="button-secondary mt-4"
            >
              Kurulum yardımını tekrar göster
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
