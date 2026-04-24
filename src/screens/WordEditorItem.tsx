import { useState, type ReactNode } from 'react';
import { CardKind, Flashcard, WordType } from '../types';
import { ChevronDown, Trash2, ImagePlus, Loader2 } from 'lucide-react';
import { generateImageMnemonic } from '../services/gemini';
import { useApp } from '../AppContext';

interface WordEditorItemProps {
  key?: string;
  word: Flashcard;
  isDefault?: boolean;
  onUpdate: (id: string, field: keyof Flashcard, value: unknown) => void;
  onRemove: (id: string) => void;
}

const Label = ({ children }: { children: ReactNode }) => (
  <label className="mb-2 block pl-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-claude-muted">{children}</label>
);

const inputClassName =
  'w-full rounded-[12px] border border-claude-border bg-claude-surface px-3 py-2.5 text-[15px] font-medium text-claude-text outline-none transition-all placeholder:font-normal placeholder:text-claude-muted focus:border-claude-accent focus:ring-4 focus:ring-claude-accent/10 disabled:opacity-50';

const textareaClassName = `${inputClassName} min-h-[96px] resize-y`;

export default function WordEditorItem({ word, isDefault, onUpdate, onRemove }: WordEditorItemProps) {
  const hasAdvancedFields = Boolean(
    word.article ||
      word.plural ||
      word.verbForms ||
      word.adjectiveForms ||
      word.phraseForms ||
      word.example ||
      word.exampleTranslation ||
      word.note ||
      word.prompt ||
      word.answer ||
      word.register ||
      word.sourceTags?.length ||
      word.usageLinks?.length ||
      word.userPronunciationUrl ||
      word.imageUrl,
  );
  const [showDetails, setShowDetails] = useState(hasAdvancedFields);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const { aiModel, browserApiKey } = useApp();

  const handleGenerateImage = async () => {
    if (!word.term) {
      setImageError('Lütfen önce terimi gir.');
      return;
    }

    const safeTranslation = word.translationTr || word.translationEn || word.translation || '';
    setIsGenerating(true);
    setImageError(null);

    const result = await generateImageMnemonic(
      word.term,
      safeTranslation,
      aiModel || 'gemini-3.1-flash-image-preview',
      browserApiKey || '',
    );

    if (result.ok) {
      onUpdate(word.id, 'imageUrl', result.imageUrl);
    } else if ('error' in result) {
      setImageError(result.error);
    }

    setIsGenerating(false);
  };

  const updateVerbForm = (field: string, value: string) => {
    const updated = { ...(word.verbForms || {}), [field]: value };
    onUpdate(word.id, 'verbForms', updated);
  };

  const updateAdjForm = (field: string, value: string) => {
    const updated = { ...(word.adjectiveForms || {}), [field]: value };
    onUpdate(word.id, 'adjectiveForms', updated);
  };

  const updatePhraseForm = (field: string, value: string) => {
    const updated = { ...(word.phraseForms || {}), [field]: value };
    onUpdate(word.id, 'phraseForms', updated);
  };

  const updateSourceTags = (value: string) => {
    onUpdate(
      word.id,
      'sourceTags',
      value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    );
  };

  const updateUsageLinks = (value: string) => {
    onUpdate(
      word.id,
      'usageLinks',
      value
        .split('\n')
        .map((line) => {
          const [label, ...urlParts] = line.split('|');
          const url = urlParts.join('|').trim();
          return label?.trim() && url ? { label: label.trim(), url } : null;
        })
        .filter((link): link is NonNullable<Flashcard['usageLinks']>[number] => link !== null),
    );
  };

  const termLabel =
    word.wordType === 'noun'
      ? 'İngilizce isim'
      : word.wordType === 'verb'
        ? 'İngilizce fiil'
        : word.wordType === 'adjective'
          ? 'İngilizce sıfat'
          : word.wordType === 'adverb'
            ? 'İngilizce zarf'
            : word.wordType === 'phrasalVerb'
              ? 'Phrasal verb'
              : word.wordType === 'idiom'
                ? 'Idiom'
                : word.wordType === 'collocation'
                  ? 'Collocation'
                  : word.wordType === 'phrase'
                    ? 'İngilizce ifade'
                    : 'İngilizce terim';

  const glossLabel = word.wordType === 'phrase' ? 'Türkçe anlam' : 'Türkçe karşılık';

  return (
    <div className="group relative overflow-hidden rounded-[18px] border border-claude-border bg-claude-panel p-4 shadow-soft transition-all hover:border-claude-border sm:p-5">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-4 sm:grid-cols-[220px_190px_140px]">
          <div>
            <Label>Kart türü</Label>
            <select
              value={word.wordType || 'other'}
              onChange={(event) => onUpdate(word.id, 'wordType', event.target.value as WordType)}
              disabled={isDefault}
              className={inputClassName}
            >
              <option value="other">Seç...</option>
              <option value="noun">İsim</option>
              <option value="verb">Fiil</option>
              <option value="adjective">Sıfat</option>
              <option value="adverb">Zarf</option>
              <option value="phrase">İfade</option>
              <option value="phrasalVerb">Phrasal verb</option>
              <option value="idiom">Idiom</option>
              <option value="collocation">Collocation</option>
            </select>
          </div>
          <div>
            <Label>Çalışma tipi</Label>
            <select
              value={word.cardKind || 'meaning'}
              onChange={(event) => onUpdate(word.id, 'cardKind', event.target.value as CardKind)}
              disabled={isDefault}
              className={inputClassName}
            >
              <option value="meaning">Meaning</option>
              <option value="production">Production</option>
              <option value="collocation">Collocation</option>
              <option value="register">Register</option>
              <option value="sentenceTransformation">Sentence transformation</option>
              <option value="speakingFunction">Speaking function</option>
              <option value="errorCorrection">Error correction</option>
              <option value="pronunciation">Pronunciation</option>
            </select>
          </div>
          <div>
            <Label>Seviye</Label>
            <select value={word.level || ''} onChange={(event) => onUpdate(word.id, 'level', event.target.value)} disabled={isDefault} className={inputClassName}>
              <option value="">Yok</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>
          </div>
        </div>

        {!isDefault ? (
          <button
            onClick={() => onRemove(word.id)}
            className="inline-flex items-center gap-2 self-start rounded-[10px] border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 opacity-100 transition-colors hover:bg-rose-100 lg:opacity-0 lg:group-hover:opacity-100"
          >
            <Trash2 size={15} />
            Kaldır
          </button>
        ) : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <Label>{termLabel}</Label>
          <input value={word.term || ''} onChange={(event) => onUpdate(word.id, 'term', event.target.value)} disabled={isDefault} className={inputClassName} />
        </div>
        <div>
          <Label>{glossLabel}</Label>
          <input
            value={word.translationTr || word.translation || ''}
            onChange={(event) => onUpdate(word.id, 'translationTr', event.target.value)}
            disabled={isDefault}
            className={inputClassName}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowDetails((previous) => !previous)}
        className="mt-5 flex w-full items-center justify-between rounded-[12px] border border-claude-border bg-claude-surface px-3 py-2.5 text-left text-sm font-semibold text-claude-subtle transition-colors hover:text-claude-text"
        aria-expanded={showDetails}
      >
        <span>Detaylar</span>
        <ChevronDown size={16} className={`transition-transform ${showDetails ? 'rotate-180' : ''}`} />
      </button>

      {showDetails ? (
        <>
      <div className="mt-5 border-t border-claude-border pt-5">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-baseline md:gap-4">
          <h4 className="text-lg font-semibold tracking-tight text-claude-text">Aktif üretim</h4>
          <p className="text-sm leading-6 text-claude-muted">Production, collocation, register ve Use of English kartları bu alanları kullanır.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Prompt</Label>
            <textarea
              value={word.prompt || ''}
              onChange={(event) => onUpdate(word.id, 'prompt', event.target.value)}
              disabled={isDefault}
              placeholder="örn. pose a ___ / Fikri yumuşatarak itiraz et"
              className={textareaClassName}
            />
          </div>
          <div>
            <Label>Beklenen cevap</Label>
            <textarea
              value={word.answer || ''}
              onChange={(event) => onUpdate(word.id, 'answer', event.target.value)}
              disabled={isDefault}
              placeholder="örn. risk / I see your point, but..."
              className={textareaClassName}
            />
          </div>
          <div>
            <Label>Register</Label>
            <select
              value={word.register || ''}
              onChange={(event) => onUpdate(word.id, 'register', event.target.value || undefined)}
              disabled={isDefault}
              className={inputClassName}
            >
              <option value="">Yok</option>
              <option value="informal">Informal</option>
              <option value="neutral">Neutral</option>
              <option value="formal">Formal</option>
            </select>
          </div>
          <div>
            <Label>Telaffuz varyantı</Label>
            <select
              value={word.pronunciationVariant || ''}
              onChange={(event) => onUpdate(word.id, 'pronunciationVariant', event.target.value || undefined)}
              disabled={isDefault}
              className={inputClassName}
            >
              <option value="">Otomatik</option>
              <option value="us">American</option>
              <option value="uk">British</option>
            </select>
          </div>
        </div>
      </div>

      {word.wordType === 'verb' || word.wordType === 'phrasalVerb' ? (
        <div className="mt-5 border-t border-claude-border pt-5">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-baseline md:gap-4">
            <h4 className="text-lg font-semibold tracking-tight text-claude-text">Verb details</h4>
            <p className="text-sm leading-6 text-claude-muted">Temel biçimler ve kullanım kalıbı kartı daha üretilebilir hale getirir.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div>
              <Label>Base form</Label>
              <input value={word.verbForms?.baseForm || ''} onChange={(event) => updateVerbForm('baseForm', event.target.value)} disabled={isDefault} placeholder="go / bring up" className={inputClassName} />
            </div>
            <div>
              <Label>3rd person</Label>
              <input value={word.verbForms?.thirdPerson || ''} onChange={(event) => updateVerbForm('thirdPerson', event.target.value)} disabled={isDefault} placeholder="goes / brings up" className={inputClassName} />
            </div>
            <div>
              <Label>Past simple</Label>
              <input value={word.verbForms?.pastSimple || ''} onChange={(event) => updateVerbForm('pastSimple', event.target.value)} disabled={isDefault} placeholder="went / brought up" className={inputClassName} />
            </div>
            <div>
              <Label>Past participle</Label>
              <input value={word.verbForms?.pastParticiple || ''} onChange={(event) => updateVerbForm('pastParticiple', event.target.value)} disabled={isDefault} placeholder="gone / brought up" className={inputClassName} />
            </div>
            <div>
              <Label>Gerund</Label>
              <input value={word.verbForms?.gerund || ''} onChange={(event) => updateVerbForm('gerund', event.target.value)} disabled={isDefault} placeholder="going / bringing up" className={inputClassName} />
            </div>
            <div>
              <Label>Kullanım kalıbı</Label>
              <input value={word.verbForms?.usagePattern || ''} onChange={(event) => updateVerbForm('usagePattern', event.target.value)} disabled={isDefault} placeholder="bring up an issue" className={inputClassName} />
            </div>
          </div>
        </div>
      ) : null}

      {word.wordType === 'adjective' ? (
        <div className="mt-5 border-t border-claude-border pt-5">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-baseline md:gap-4">
            <h4 className="text-lg font-semibold tracking-tight text-claude-text">Sıfat biçimleri</h4>
            <p className="text-sm leading-6 text-claude-muted">Karşılaştırma ve kullanım bilgileri burada dursun.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Komparativ</Label>
              <input value={word.adjectiveForms?.comparative || ''} onChange={(event) => updateAdjForm('comparative', event.target.value)} disabled={isDefault} placeholder="wichtiger" className={inputClassName} />
            </div>
            <div>
              <Label>Superlativ</Label>
              <input value={word.adjectiveForms?.superlative || ''} onChange={(event) => updateAdjForm('superlative', event.target.value)} disabled={isDefault} placeholder="am wichtigsten" className={inputClassName} />
            </div>
            <div>
              <Label>Kullanım kalıbı</Label>
              <input value={word.adjectiveForms?.usage || ''} onChange={(event) => updateAdjForm('usage', event.target.value)} disabled={isDefault} placeholder="wichtig für + Akk" className={inputClassName} />
            </div>
          </div>
        </div>
      ) : null}

      {word.wordType === 'phrase' || word.wordType === 'idiom' || word.wordType === 'collocation' ? (
        <div className="mt-5 border-t border-claude-border pt-5">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-baseline md:gap-4">
            <h4 className="text-lg font-semibold tracking-tight text-claude-text">İfade detayları</h4>
            <p className="text-sm leading-6 text-claude-muted">Kullanım amacı, doğal varyant ve daha resmi alternatif burada saklanır.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Kullanım amacı</Label>
              <textarea value={word.phraseForms?.usageIntent || ''} onChange={(event) => updatePhraseForm('usageIntent', event.target.value)} disabled={isDefault} placeholder="örn. fikri yumuşatmak, itiraz etmek..." className={textareaClassName} />
            </div>
            <div>
              <Label>Doğal varyant</Label>
              <textarea value={word.phraseForms?.naturalVariant || ''} onChange={(event) => updatePhraseForm('naturalVariant', event.target.value)} disabled={isDefault} placeholder="örn. I mean... / still..." className={textareaClassName} />
            </div>
            <div>
              <Label>Resmi alternatif</Label>
              <textarea value={word.phraseForms?.formalVariant || ''} onChange={(event) => updatePhraseForm('formalVariant', event.target.value)} disabled={isDefault} placeholder="örn. nevertheless / in this regard..." className={textareaClassName} />
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-5 border-t border-claude-border pt-5">
        <div className="grid gap-5">
          <div>
            <Label>Örnek cümle</Label>
            <textarea value={word.example || ''} onChange={(event) => onUpdate(word.id, 'example', event.target.value)} disabled={isDefault} className={textareaClassName} />
          </div>
          <div>
            <Label>Örnek çeviri</Label>
            <input value={word.exampleTranslation || ''} onChange={(event) => onUpdate(word.id, 'exampleTranslation', event.target.value)} disabled={isDefault} className={inputClassName} />
          </div>
          <div>
            <Label>Dilbilgisi notu</Label>
            <textarea value={word.note || ''} onChange={(event) => onUpdate(word.id, 'note', event.target.value)} disabled={isDefault} className={textareaClassName} />
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-claude-border pt-5">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-baseline md:gap-4">
          <h4 className="text-lg font-semibold tracking-tight text-claude-text">Kaynak ve doğal kullanım</h4>
          <p className="text-sm leading-6 text-claude-muted">Kart içeriği özgün kalır; sözlük ve gerçek kullanım kaynakları lookup olarak bağlanır.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Source tags</Label>
            <input
              value={(word.sourceTags || []).join(', ')}
              onChange={(event) => updateSourceTags(event.target.value)}
              disabled={isDefault}
              placeholder="Oxford5000, CambridgeC1, Collocation"
              className={inputClassName}
            />
          </div>
          <div>
            <Label>Kendi telaffuz kaydı URL</Label>
            <input
              value={word.userPronunciationUrl || ''}
              onChange={(event) => onUpdate(word.id, 'userPronunciationUrl', event.target.value)}
              disabled={isDefault}
              placeholder="blob veya dosya URL"
              className={inputClassName}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Lookup linkleri</Label>
            <textarea
              value={(word.usageLinks || []).map((link) => `${link.label} | ${link.url}`).join('\n')}
              onChange={(event) => updateUsageLinks(event.target.value)}
              disabled={isDefault}
              placeholder="Cambridge | https://dictionary.cambridge.org/...\nYouGlish | https://youglish.com/pronounce/..."
              className={textareaClassName}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t border-claude-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {word.imageUrl ? (
            <div className="h-16 w-16 overflow-hidden rounded-[14px] border border-claude-border bg-claude-surface shadow-sm">
              <img src={word.imageUrl} alt="Hatırlatıcı görsel" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
            </div>
          ) : null}
          <button
            onClick={handleGenerateImage}
            disabled={isGenerating}
            className="button-secondary"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
            AI görsel oluştur
          </button>
        </div>

        <div className="text-sm leading-6 text-claude-muted">Terim ve çeviri doluysa hatırlatıcı görsel üretebilirsin.</div>
      </div>

      {imageError ? <div className="mt-4 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{imageError}</div> : null}
        </>
      ) : null}
    </div>
  );
}
