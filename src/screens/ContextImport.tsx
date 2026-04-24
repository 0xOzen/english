import { useMemo, useState } from 'react';
import { FileText, Plus, Wand2 } from 'lucide-react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import { Flashcard } from '../types';

const stopWords = new Set([
  'about',
  'after',
  'again',
  'also',
  'because',
  'before',
  'between',
  'could',
  'first',
  'from',
  'have',
  'into',
  'more',
  'most',
  'other',
  'should',
  'that',
  'their',
  'there',
  'these',
  'they',
  'this',
  'through',
  'under',
  'what',
  'when',
  'where',
  'which',
  'while',
  'with',
  'would',
]);

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function extractCandidates(text: string, knownCards: Flashcard[]): Flashcard[] {
  const sentences = splitSentences(text);
  const normalizedText = text.toLowerCase();
  const knownMatches = knownCards
    .filter((card) => normalizedText.includes(card.term.toLowerCase()))
    .slice(0, 18)
    .map((card) => {
      const sentence = sentences.find((item) => item.toLowerCase().includes(card.term.toLowerCase())) || card.example || '';
      return {
        ...card,
        id: `import_${card.id}_${crypto.randomUUID()}`,
        example: sentence,
        sourceTags: Array.from(new Set([...(card.sourceTags || []), 'ContextImport'])),
      };
    });

  const terms = Array.from(new Set((text.toLowerCase().match(/\b[a-z][a-z'-]{6,}\b/g) || [])))
    .filter((term) => !stopWords.has(term))
    .slice(0, 12);
  const generated = terms.map((term) => {
    const sentence = sentences.find((item) => item.toLowerCase().includes(term)) || '';
    return {
      id: `import_${term}_${crypto.randomUUID()}`,
      term,
      translationTr: '',
      wordType: 'other',
      cardKind: 'meaning',
      level: 'B2',
      example: sentence,
      sourceTags: ['ContextImport', 'NeedsMeaning'],
      usageLinks: [
        { label: 'Cambridge', url: `https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(term)}` },
        { label: 'YouGlish', url: `https://youglish.com/pronounce/${encodeURIComponent(term)}/english` },
      ],
    } satisfies Flashcard;
  });

  const seen = new Set<string>();
  return [...knownMatches, ...generated].filter((card) => {
    const key = card.term.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function ContextImport({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { lists, updateList } = useApp();
  const [text, setText] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const knownCards = useMemo(() => lists.flatMap((list) => list.words), [lists]);
  const candidates = useMemo(() => extractCandidates(text, knownCards), [text, knownCards]);
  const myWordsList = lists.find((list) => list.id === 'my-new-words');

  const toggleCandidate = (id: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addSelected = () => {
    if (!myWordsList) return;
    const selected = candidates.filter((card) => selectedIds.has(card.id));
    updateList(myWordsList.id, myWordsList.title, [...selected, ...myWordsList.words]);
    setSelectedIds(new Set());
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-3 border-b border-claude-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="section-label">Context Import</div>
          <h1 className="mt-3 text-lg font-semibold text-claude-text">Metinden kart üret</h1>
          <div className="mt-1 text-sm text-claude-muted">Makale, transcript veya PDF metninden B2-C1 adayları ve bağlam cümleleri çıkar.</div>
        </div>
        <button onClick={() => onNavigate({ type: 'dashboard' })} className="button-secondary">
          Panele dön
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="codex-panel rounded-[14px] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-claude-text">
            <FileText size={16} className="text-claude-accent" />
            Kaynak metin
          </div>
          <textarea
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setSelectedIds(new Set());
            }}
            placeholder="YouTube transcript, makale veya kendi metnini yapıştır..."
            className="mt-4 min-h-[420px] w-full resize-y rounded-[14px] border border-claude-border bg-claude-surface px-4 py-3 text-sm leading-6 text-claude-text outline-none focus:border-claude-accent"
          />
        </section>

        <aside className="codex-panel rounded-[14px] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-claude-text">
              <Wand2 size={16} className="text-claude-accent" />
              Aday kartlar
            </div>
            <button onClick={addSelected} disabled={!selectedIds.size} className="button-primary h-9 px-3 disabled:opacity-50">
              <Plus size={15} />
              Ekle
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {candidates.length === 0 ? (
              <div className="rounded-[12px] border border-claude-border bg-claude-surface p-4 text-sm leading-6 text-claude-muted">
                Metin yapıştırınca adaylar burada görünür.
              </div>
            ) : (
              candidates.map((card) => (
                <button
                  key={card.id}
                  onClick={() => toggleCandidate(card.id)}
                  className={`w-full rounded-[12px] border p-3 text-left transition-colors ${
                    selectedIds.has(card.id)
                      ? 'border-claude-accent bg-claude-accentSoft'
                      : 'border-claude-border bg-claude-surface hover:border-claude-accent/40'
                  }`}
                >
                  <div className="text-sm font-semibold text-claude-text">{card.term}</div>
                  <div className="mt-1 line-clamp-2 text-xs leading-5 text-claude-muted">{card.example || card.translationTr || 'Anlam eklenecek'}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(card.sourceTags || []).map((tag) => (
                      <span key={tag} className="rounded-full border border-claude-border px-2 py-0.5 text-[10px] font-semibold text-claude-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
