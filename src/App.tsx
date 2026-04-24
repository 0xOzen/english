import { useEffect, useState } from 'react';
import {
  BookOpen,
  Brain,
  ChevronDown,
  Download,
  FileText,
  Pencil,
  Flame,
  LayoutDashboard,
  LibraryBig,
  Mic,
  Moon,
  PanelLeft,
  Plus,
  Search,
  Settings,
  Sun,
  Upload,
} from 'lucide-react';
import { useApp } from './AppContext';
import Dashboard from './screens/Dashboard';
import ListEditor from './screens/ListEditor';
import FlashcardMode from './screens/FlashcardMode';
import QuizMode from './screens/QuizMode';
import WriteMode from './screens/WriteMode';
import MatchMode from './screens/MatchMode';
import GrammarHub from './screens/GrammarHub';
import TodayReview from './screens/TodayReview';
import SpeakingLab from './screens/SpeakingLab';
import ContextImport from './screens/ContextImport';
import InstallBanner from './components/InstallBanner';
import SettingsModal from './components/SettingsModal';
import { useTheme } from './theme';
import { GRAMMAR_SECTIONS, GRAMMAR_TOPICS, getGrammarTopicsBySection } from './grammarData';
import { GrammarLevel, GrammarSection, GrammarTopic } from './types';

export type Screen =
  | { type: 'dashboard' }
  | { type: 'grammar' }
  | { type: 'review' }
  | { type: 'speaking' }
  | { type: 'import' }
  | { type: 'edit_list'; listId: string }
  | { type: 'study'; mode: 'flashcard' | 'quiz' | 'write' | 'match'; listId: string };

type GrammarSectionFilter = GrammarSection['id'] | 'ALL';
type GrammarLevelFilter = GrammarLevel | 'ALL';

function matchesGrammarTopicSearch(topic: GrammarTopic, query: string): boolean {
  if (!query.trim()) return true;

  const normalizedQuery = query.toLocaleLowerCase('tr-TR');
  const haystack = [topic.chapter.toString(), topic.title, topic.titleTr, topic.summary, ...topic.highlights, ...topic.pitfalls]
    .join(' ')
    .toLocaleLowerCase('tr-TR');

  return haystack.includes(normalizedQuery);
}

function getGrammarTopicOptions(sectionFilter: GrammarSectionFilter, levelFilter: GrammarLevelFilter, query: string) {
  const topics = sectionFilter === 'ALL' ? GRAMMAR_TOPICS : getGrammarTopicsBySection(sectionFilter);
  return topics.filter((topic) => {
    const levelMatches = levelFilter === 'ALL' ? true : topic.levels.includes(levelFilter);
    return levelMatches && matchesGrammarTopicSearch(topic, query);
  });
}

export default function App() {
  const {
    isHydrated,
    lists,
    aiModel,
    browserApiKey,
    clearBrowserApiKey,
    dismissInstallHint,
    exportBackup,
    importBackup,
    installHintDismissed,
    setBrowserApiKey,
    setAiModel,
    showInstallHint,
    getDifficultWordsList,
    getSrsSummary,
  } = useApp();
  const [currentScreen, setCurrentScreen] = useState<Screen>({ type: 'dashboard' });
  const [selectedListId, setSelectedListId] = useState('');
  const [grammarSectionFilter, setGrammarSectionFilter] = useState<GrammarSectionFilter>('ALL');
  const [grammarLevelFilter, setGrammarLevelFilter] = useState<GrammarLevelFilter>('ALL');
  const [grammarQuery, setGrammarQuery] = useState('');
  const [selectedGrammarTopicId, setSelectedGrammarTopicId] = useState(GRAMMAR_TOPICS[0]?.id ?? '');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };
  const isStudyScreen = currentScreen.type === 'study' || currentScreen.type === 'review';
  const difficultList = getDifficultWordsList();
  const srsSummary = getSrsSummary();
  const grammarTopicOptions = getGrammarTopicOptions(grammarSectionFilter, grammarLevelFilter, grammarQuery);

  const selectList = (listId: string) => {
    setSelectedListId(listId);
    navigate({ type: 'dashboard' });
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!grammarTopicOptions.length) return;

    const hasSelectedTopic = grammarTopicOptions.some((topic) => topic.id === selectedGrammarTopicId);
    if (!hasSelectedTopic) {
      setSelectedGrammarTopicId(grammarTopicOptions[0].id);
    }
  }, [grammarTopicOptions, selectedGrammarTopicId]);

  useEffect(() => {
    if (!lists.length) {
      setSelectedListId((current) => current || '');
      return;
    }

    setSelectedListId((current) => (current && lists.some((list) => list.id === current) ? current : lists[0].id));
  }, [lists]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 1199px)');
    const closeIfNarrow = () => {
      if (mediaQuery.matches) {
        setIsSidebarOpen(false);
      }
    };

    closeIfNarrow();
    mediaQuery.addEventListener('change', closeIfNarrow);
    return () => mediaQuery.removeEventListener('change', closeIfNarrow);
  }, []);

  const handleExportBackup = () => {
    const backup = exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);

    anchor.href = url;
    anchor.download = `english-deck-backup-${stamp}.json`;
    anchor.click();

    window.URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        importBackup(text);
      } catch (error) {
        console.error('Yedek içe aktarılamadı', error);
      }
    };
    input.click();
  };

  if (!isHydrated) {
    return (
      <div className="app-shell flex h-screen w-full items-center justify-center px-4 text-claude-text">
        <div className="card relative z-10 rounded-2xl px-8 py-6 text-center">
          <div className="section-label mb-4">English Deck</div>
          <div className="font-display text-2xl text-claude-text">Veriler hazırlanıyor...</div>
          <div className="mt-2 text-sm text-claude-muted">Yerel içerik ve öğrenme geçmişi geri yükleniyor.</div>
        </div>
      </div>
    );
  }

  const isActive = (predicate: boolean) => (predicate ? 'nav-item active' : 'nav-item');

  return (
    <div className="app-shell relative flex h-screen w-screen overflow-hidden text-claude-text">
      {!isStudyScreen && isSidebarOpen ? (
        <aside
          aria-label="Birincil navigasyon"
          className="sidebar-surface fixed inset-y-0 left-0 z-40 flex w-[min(20rem,calc(100vw-2rem))] translate-x-0 flex-col shadow-pop transition-transform duration-200 xl:relative xl:z-[2] xl:w-64 xl:flex-shrink-0 xl:shadow-none"
        >
          <div className="flex h-14 items-center justify-between px-4">
            <button
              onClick={() => navigate({ type: 'dashboard' })}
              className="flex items-center gap-2"
              aria-label="Ana panele dön"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-claude-accent text-sm font-bold text-white shadow-soft">
                W
              </div>
              <span className="text-[15px] font-semibold text-claude-text">English Deck</span>
            </button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="sidebar-toggle-btn"
              title="Sidebar'ı gizle"
              aria-label="Sidebar'ı gizle"
            >
              <PanelLeft size={16} />
            </button>
          </div>

          <div className="p-3">
            <button
              onClick={() => navigate({ type: 'edit_list', listId: 'new' })}
              className="flex w-full items-center gap-2 rounded-lg border border-claude-border bg-claude-panel px-3 py-2 text-[13px] font-medium text-claude-text transition-all hover:border-claude-accent/40 hover:shadow-soft"
            >
              <Plus size={16} className="text-claude-accent" />
              <span>Yeni liste</span>
            </button>
          </div>

          <nav className="custom-scroll flex-1 overflow-y-auto px-3 pb-3" aria-label="Ana navigasyon">
            <div className="mb-2 space-y-0.5">
              <button
                onClick={() => navigate({ type: 'dashboard' })}
                className={isActive(currentScreen.type === 'dashboard')}
                aria-current={currentScreen.type === 'dashboard' ? 'page' : undefined}
              >
                <LayoutDashboard className="nav-icon" />
                <span>Panel</span>
              </button>
              <button
                onClick={() => navigate({ type: 'grammar' })}
                className={isActive(currentScreen.type === 'grammar')}
                aria-current={currentScreen.type === 'grammar' ? 'page' : undefined}
              >
                <LibraryBig className="nav-icon" />
                <span>Grammar Lab</span>
              </button>
              <button
                onClick={() => navigate({ type: 'review' })}
                className={isActive(currentScreen.type === 'review')}
                aria-current={currentScreen.type === 'review' ? 'page' : undefined}
              >
                <div className="flex flex-1 items-center gap-3">
                  <Brain className="nav-icon" />
                  <span>Today's Review</span>
                </div>
                <span className="badge bg-claude-accentSoft text-claude-accent">{srsSummary.dueTotal}</span>
              </button>
              <button
                onClick={() => navigate({ type: 'speaking' })}
                className={isActive(currentScreen.type === 'speaking')}
                aria-current={currentScreen.type === 'speaking' ? 'page' : undefined}
              >
                <Mic className="nav-icon" />
                <span>Speaking Lab</span>
              </button>
              <button
                onClick={() => navigate({ type: 'import' })}
                className={isActive(currentScreen.type === 'import')}
                aria-current={currentScreen.type === 'import' ? 'page' : undefined}
              >
                <FileText className="nav-icon" />
                <span>Context Import</span>
              </button>
              {difficultList && difficultList.words.length > 0 ? (
                <button
                  onClick={() => selectList('difficult-words')}
                  className={isActive(
                    selectedListId === 'difficult-words' ||
                      (currentScreen.type === 'study' && currentScreen.listId === 'difficult-words'),
                  )}
                >
                  <div className="flex flex-1 items-center gap-3">
                    <Flame className="nav-icon" />
                    <span>Zor Kelimeler</span>
                  </div>
                  <span className="badge bg-claude-accentSoft text-claude-accent">{difficultList.words.length}</span>
                </button>
              ) : null}
            </div>

            {currentScreen.type === 'grammar' ? (
              <div className="mb-1 mt-2">
                <div className="nav-section-title">Grammar Topics</div>
                <div className="px-1 pb-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-claude-muted" size={14} />
                    <input
                      type="search"
                      value={grammarQuery}
                      onChange={(event) => setGrammarQuery(event.target.value)}
                      placeholder="conditionals, hedging..."
                      className="h-9 w-full rounded-[9px] border border-claude-border bg-claude-panel py-2 pl-8 pr-2 text-xs text-claude-text outline-none placeholder:text-claude-muted focus:border-claude-accent"
                    />
                  </div>
                  <select
                    value={grammarSectionFilter}
                    onChange={(event) => setGrammarSectionFilter(event.target.value as GrammarSectionFilter)}
                    className="mt-2 h-9 w-full rounded-[9px] border border-claude-border bg-claude-panel px-2 text-xs font-medium text-claude-text outline-none focus:border-claude-accent"
                  >
                    <option value="ALL">All sections</option>
                    {GRAMMAR_SECTIONS.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.title}
                      </option>
                    ))}
                  </select>
                  <div className="nav-level-filter mt-2" aria-label="Grammar level">
                    {(['ALL', 'B2', 'C1'] as GrammarLevelFilter[]).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setGrammarLevelFilter(level)}
                        className={grammarLevelFilter === level ? 'active' : ''}
                        aria-pressed={grammarLevelFilter === level}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-0.5">
                  {grammarTopicOptions.length === 0 ? (
                    <div className="px-2.5 py-4 text-[12px] text-claude-muted">Konu bulunamadı.</div>
                  ) : (
                    grammarTopicOptions.map((topic) => {
                      const active = topic.id === selectedGrammarTopicId;
                      return (
                        <button
                          key={topic.id}
                          onClick={() => setSelectedGrammarTopicId(topic.id)}
                          className={`nav-topic-item ${active ? 'active' : ''}`}
                          title={`Unit ${topic.chapter} · ${topic.title}`}
                        >
                          <span className="nav-topic-chapter">U.{topic.chapter}</span>
                          <span className="nav-topic-title">{topic.title}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="mb-1 mt-2">
                  <div className="nav-section-title">Study Lists</div>
                  {lists.length === 0 ? (
                    <div className="px-2.5 py-1.5 text-[12px] text-claude-muted">Henüz liste yok.</div>
                  ) : (
                    lists.map((list) => {
                      const active =
                        selectedListId === list.id ||
                        (currentScreen.type === 'edit_list' && currentScreen.listId === list.id) ||
                        (currentScreen.type === 'study' && currentScreen.listId === list.id);
                      return (
                        <div key={list.id} className={`nav-list-row ${active ? 'active' : ''}`}>
                          <button
                            onClick={() => selectList(list.id)}
                            className="nav-list-main"
                            title={`${list.title} listesini seç`}
                          >
                            <BookOpen className="nav-icon" />
                            <span className="flex-1 truncate">{list.title}</span>
                            <span className="text-[11px] text-claude-muted">{list.words.length}</span>
                          </button>
                          <button
                            onClick={() => navigate({ type: 'edit_list', listId: list.id })}
                            className="nav-list-edit"
                            title="Listeyi düzenle"
                            aria-label={`${list.title} listesini düzenle`}
                          >
                            <Pencil size={13} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mb-1 mt-2">
                  <div className="nav-section-title">Yedekleme</div>
                  <button onClick={handleExportBackup} className="nav-item">
                    <Download className="nav-icon" />
                    <span>Yedek indir</span>
                  </button>
                  <button onClick={handleImportClick} className="nav-item">
                    <Upload className="nav-icon" />
                    <span>Yedekten yükle</span>
                  </button>
                </div>
              </>
            )}
          </nav>

          <div className="border-t border-claude-border p-3">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex w-full items-center gap-2 rounded-lg p-2 text-left transition-colors hover:bg-claude-border/40"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-claude-accent to-claude-accentHover text-[13px] font-semibold text-white">
                O
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium text-claude-text">0xozen</div>
                <div className="truncate text-[11px] text-claude-muted">Learner · English B2-C1</div>
              </div>
              <ChevronDown size={14} className="text-claude-muted" />
            </button>
          </div>
        </aside>
      ) : null}

      <main className="main-surface relative z-[1] flex min-w-0 flex-1 flex-col">
        {!isStudyScreen && (
          <header className="topbar-surface sticky top-0 z-10 flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              {!isSidebarOpen ? (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="sidebar-toggle-btn"
                  title="Sidebar'ı göster"
                  aria-label="Sidebar'ı göster"
                >
                  <PanelLeft size={16} />
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                className="flex h-8 w-8 items-center justify-center rounded-md text-claude-muted transition-colors hover:bg-claude-border/60"
                title={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
                aria-label={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-claude-muted transition-colors hover:bg-claude-border/60"
                title="Ayarlar"
                aria-label="Ayarlar"
              >
                <Settings size={16} />
              </button>
            </div>
          </header>
        )}

        <div className="relative z-[1] flex-1 overflow-auto">
          {!installHintDismissed && !isStudyScreen ? <InstallBanner onDismiss={dismissInstallHint} /> : null}
          {currentScreen.type === 'dashboard' && (
            <Dashboard selectedListId={selectedListId} onSelectList={setSelectedListId} onNavigate={navigate} />
          )}
          {currentScreen.type === 'grammar' && (
            <GrammarHub
              selectedSectionFilter={grammarSectionFilter}
              selectedLevel={grammarLevelFilter}
              query={grammarQuery}
              selectedTopicId={selectedGrammarTopicId}
            />
          )}
          {currentScreen.type === 'review' && <TodayReview onNavigate={navigate} />}
          {currentScreen.type === 'speaking' && <SpeakingLab onNavigate={navigate} />}
          {currentScreen.type === 'import' && <ContextImport onNavigate={navigate} />}
          {currentScreen.type === 'edit_list' && <ListEditor listId={currentScreen.listId} onNavigate={navigate} />}
          {currentScreen.type === 'study' && currentScreen.mode === 'flashcard' && (
            <FlashcardMode listId={currentScreen.listId} onNavigate={navigate} />
          )}
          {currentScreen.type === 'study' && currentScreen.mode === 'quiz' && (
            <QuizMode listId={currentScreen.listId} onNavigate={navigate} />
          )}
          {currentScreen.type === 'study' && currentScreen.mode === 'write' && (
            <WriteMode listId={currentScreen.listId} onNavigate={navigate} />
          )}
          {currentScreen.type === 'study' && currentScreen.mode === 'match' && (
            <MatchMode listId={currentScreen.listId} onNavigate={navigate} />
          )}
        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        isOnline={isOnline}
        selectedModel={aiModel || 'gemini-3.1-flash-image-preview'}
        browserApiKey={browserApiKey || ''}
        onClose={() => setIsSettingsOpen(false)}
        onModelChange={setAiModel}
        onSaveBrowserApiKey={setBrowserApiKey}
        onClearBrowserApiKey={clearBrowserApiKey}
        onShowInstallHint={showInstallHint}
        onExportBackup={handleExportBackup}
        onImportBackup={importBackup}
      />
    </div>
  );
}
