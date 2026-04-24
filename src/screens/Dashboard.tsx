import { ArrowRight, BookOpen, Edit2, Flame, Grid2X2, LibraryBig, PenLine, Plus, RefreshCw } from 'lucide-react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import { VocabList } from '../types';

type ListInsight = {
  studiedCount: number;
  accuracy: number;
  totalAttempts: number;
};

function getListInsight(list: VocabList, stats: Record<string, { correct: number; incorrect: number }>): ListInsight {
  let studiedCount = 0;
  let totalCorrect = 0;
  let totalAttempts = 0;

  list.words.forEach((word) => {
    const wordStats = stats[word.id];
    if (!wordStats) return;

    studiedCount += 1;
    totalCorrect += wordStats.correct;
    totalAttempts += wordStats.correct + wordStats.incorrect;
  });

  return {
    studiedCount,
    accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
    totalAttempts,
  };
}

type DashboardProps = {
  selectedListId: string;
  onSelectList: (listId: string) => void;
  onNavigate: (screen: Screen) => void;
};

export default function Dashboard({ selectedListId, onSelectList, onNavigate }: DashboardProps) {
  const { lists, stats, studyDirection, toggleStudyDirection, getOverallProgress, getDifficultWordsList } = useApp();
  const { totalStudied, accuracy } = getOverallProgress();
  const difficultList = getDifficultWordsList();
  const selectableLists = difficultList ? [difficultList, ...lists] : lists;
  const primaryList =
    selectableLists.find((list) => list.id === selectedListId) ??
    lists.find((list) => list.id === selectedListId) ??
    lists[0] ??
    difficultList ??
    null;
  const primaryInsight = primaryList ? getListInsight(primaryList, stats) : null;
  const totalWords = lists.reduce((sum, list) => sum + list.words.length, 0);
  const directionLabel = studyDirection === 'TR_TO_EN' ? 'TR -> EN' : 'EN -> TR';

  if (!primaryList) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-3xl items-center px-5 py-8">
        <section className="codex-panel w-full rounded-[14px] p-5">
          <div className="text-sm font-semibold text-claude-text">English Deck</div>
          <div className="mt-2 text-sm text-claude-muted">Henüz liste yok.</div>
          <button onClick={() => onNavigate({ type: 'edit_list', listId: 'new' })} className="button-primary mt-5">
            <Plus size={15} />
            İlk listeyi oluştur
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between border-b border-claude-border pb-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-claude-text">English Deck</h1>
          <div className="mt-1 text-sm text-claude-muted">{lists.length} liste · {totalWords} kelime</div>
        </div>
        <button
          onClick={toggleStudyDirection}
          className="inline-flex items-center gap-2 rounded-[10px] border border-claude-border bg-claude-panel px-3 py-2 text-xs font-medium text-claude-subtle transition-colors hover:border-claude-accent/40 hover:text-claude-text"
        >
          <RefreshCw size={14} />
          {directionLabel}
        </button>
      </div>

      <button
        onClick={() => onNavigate({ type: 'study', mode: 'write', listId: primaryList.id })}
        className="mb-4 flex w-full items-center gap-3 rounded-[14px] border border-claude-border bg-claude-panel/80 px-4 py-4 text-left shadow-soft transition-colors hover:border-claude-accent/40 hover:bg-claude-panel"
      >
        <span className="codex-action-icon">
          <PenLine size={16} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-claude-text">Devam et</span>
          <span className="mt-0.5 block truncate text-xs text-claude-muted">{primaryList.title} · Yazma pratiği</span>
        </span>
        <ArrowRight size={16} className="text-claude-muted" />
      </button>

      <section className="codex-panel overflow-hidden rounded-[14px]">
        <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center">
          <span className="codex-action-icon">
            {primaryList.id === 'difficult-words' ? <Flame size={16} /> : <BookOpen size={16} />}
          </span>
          <div className="min-w-0 flex-1">
            <label htmlFor="study-list-select" className="text-xs text-claude-muted">
              Çalışılacak liste
            </label>
            <select
              id="study-list-select"
              value={primaryList.id}
              onChange={(event) => onSelectList(event.target.value)}
              className="mt-1 w-full rounded-[10px] border border-claude-border bg-claude-panel px-3 py-2 text-base font-semibold text-claude-text outline-none transition-colors focus:border-claude-accent"
            >
              {selectableLists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.title} · {list.words.length} kelime
                </option>
              ))}
            </select>
            <div className="mt-2 text-xs text-claude-muted">
              {primaryList.words.length} kelime · {primaryInsight?.accuracy ?? 0}% doğruluk
            </div>
          </div>
        </div>

        <div className="codex-divider" />

        <div className="grid divide-y divide-claude-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-4 py-3">
            <div className="text-xs text-claude-muted">Çalışılan</div>
            <div className="mt-1 text-base font-semibold text-claude-text">{totalStudied}</div>
          </div>
          <div className="px-4 py-3">
            <div className="text-xs text-claude-muted">Doğruluk</div>
            <div className="mt-1 text-base font-semibold text-claude-text">{accuracy}%</div>
          </div>
          <div className="px-4 py-3">
            <div className="text-xs text-claude-muted">Deneme</div>
            <div className="mt-1 text-base font-semibold text-claude-text">{primaryInsight?.totalAttempts ?? 0}</div>
          </div>
        </div>
      </section>

      <section className="mt-4 codex-panel overflow-hidden rounded-[14px]">
        <button onClick={() => onNavigate({ type: 'study', mode: 'flashcard', listId: primaryList.id })} className="codex-action-row">
          <span className="codex-action-icon">
            <BookOpen size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-claude-text">Kartlar</span>
            <span className="mt-0.5 block text-xs text-claude-muted">{primaryList.title}</span>
          </span>
          <ArrowRight size={16} className="text-claude-muted" />
        </button>
        <div className="codex-divider" />
        <button onClick={() => onNavigate({ type: 'study', mode: 'quiz', listId: primaryList.id })} className="codex-action-row">
          <span className="codex-action-icon">
            <ArrowRight size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-claude-text">Test</span>
            <span className="mt-0.5 block text-xs text-claude-muted">Seçmeli tekrar</span>
          </span>
        </button>
        <div className="codex-divider" />
        <button onClick={() => onNavigate({ type: 'study', mode: 'write', listId: primaryList.id })} className="codex-action-row">
          <span className="codex-action-icon">
            <PenLine size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-claude-text">Yazma</span>
            <span className="mt-0.5 block text-xs text-claude-muted">Aktif hatırlama</span>
          </span>
        </button>
        <div className="codex-divider" />
        <button onClick={() => onNavigate({ type: 'study', mode: 'match', listId: primaryList.id })} className="codex-action-row">
          <span className="codex-action-icon">
            <Grid2X2 size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-claude-text">Eşleştir</span>
            <span className="mt-0.5 block text-xs text-claude-muted">Hızlı çift bulma</span>
          </span>
        </button>
      </section>

      <section className="mt-4 codex-panel overflow-hidden rounded-[14px]">
        <button onClick={() => onNavigate({ type: 'edit_list', listId: 'new' })} className="codex-action-row">
          <span className="codex-action-icon">
            <Plus size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-claude-text">Yeni liste</span>
            <span className="mt-0.5 block text-xs text-claude-muted">Kendi kelimelerin</span>
          </span>
        </button>
        <div className="codex-divider" />
        <button
          onClick={() => onNavigate({ type: 'edit_list', listId: primaryList.id === 'difficult-words' ? lists[0]?.id ?? 'new' : primaryList.id })}
          className="codex-action-row"
        >
          <span className="codex-action-icon">
            <Edit2 size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-claude-text">Düzenle</span>
            <span className="mt-0.5 block text-xs text-claude-muted">Liste içeriği</span>
          </span>
        </button>
        <div className="codex-divider" />
        <button onClick={() => onNavigate({ type: 'grammar' })} className="codex-action-row">
          <span className="codex-action-icon">
            <LibraryBig size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-claude-text">Grammar Lab</span>
            <span className="mt-0.5 block text-xs text-claude-muted">Konu ve örnekler</span>
          </span>
        </button>
      </section>
    </div>
  );
}
