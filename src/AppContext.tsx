import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, Flashcard, SrsRating, SrsSettings, VocabList } from './types';
import { createDefaultAppState, migrateAppState } from './lib/appState';
import { loadPersistedAppState, savePersistedAppState } from './lib/persistence';
import { DEFAULT_SRS_SETTINGS, getDueCards, getSrsSummary as summarizeSrs, rateSrs } from './lib/srs';

interface AppContextType extends AppState {
  isHydrated: boolean;
  addList: (title: string, words?: Flashcard[]) => void;
  updateList: (id: string, title: string, words: Flashcard[]) => void;
  deleteList: (id: string) => void;
  recordSuccess: (wordId: string) => void;
  recordFailure: (wordId: string) => void;
  rateCard: (wordId: string, rating: SrsRating) => void;
  getTodaysReviewList: () => VocabList;
  getSrsSummary: () => ReturnType<typeof summarizeSrs>;
  updateSrsSettings: (settings: Partial<SrsSettings>) => void;
  getOverallProgress: () => { totalStudied: number; accuracy: number };
  getDifficultWordsList: () => VocabList | null;
  toggleStudyDirection: () => void;
  setAiModel: (model: NonNullable<AppState['aiModel']>) => void;
  setBrowserApiKey: (apiKey: string) => void;
  clearBrowserApiKey: () => void;
  dismissInstallHint: () => void;
  showInstallHint: () => void;
  exportBackup: () => AppState;
  importBackup: (raw: string) => { ok: boolean; message: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => createDefaultAppState());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    void (async () => {
      try {
        const persistedState = await loadPersistedAppState();
        if (isCancelled) {
          return;
        }

        setState(persistedState);
      } catch (error) {
        console.error('App state could not be restored:', error);
      } finally {
        if (!isCancelled) {
          setIsHydrated(true);
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    void savePersistedAppState(state);
  }, [isHydrated, state]);

  const addList = (title: string, customWords: Flashcard[] = []) => {
    setState(prev => ({
      ...prev,
      lists: [...prev.lists, { id: crypto.randomUUID(), title, words: customWords }]
    }));
  };

  const updateList = (id: string, title: string, words: Flashcard[]) => {
    setState(prev => ({
      ...prev,
      lists: prev.lists.map(list => list.id === id ? { ...list, title, words } : list)
    }));
  };

  const deleteList = (id: string) => {
    setState(prev => ({
      ...prev,
      lists: prev.lists.filter(list => list.id !== id)
    }));
  };

  const recordSuccess = (wordId: string) => {
    setState(prev => {
      const wordStats = prev.stats[wordId] || { correct: 0, incorrect: 0 };
      return {
        ...prev,
        stats: {
          ...prev.stats,
          [wordId]: { ...wordStats, correct: wordStats.correct + 1 }
        }
      };
    });
  };

  const recordFailure = (wordId: string) => {
    setState(prev => {
      const wordStats = prev.stats[wordId] || { correct: 0, incorrect: 0 };
      return {
        ...prev,
        stats: {
          ...prev.stats,
          [wordId]: { ...wordStats, incorrect: wordStats.incorrect + 1 }
        }
      };
    });
  };

  const rateCard = (wordId: string, rating: SrsRating) => {
    setState(prev => {
      const settings = prev.srsSettings ?? DEFAULT_SRS_SETTINGS;
      const wordStats = prev.stats[wordId] || { correct: 0, incorrect: 0 };
      const nextStats =
        rating === 'again'
          ? { ...wordStats, incorrect: wordStats.incorrect + 1 }
          : { ...wordStats, correct: wordStats.correct + 1 };

      return {
        ...prev,
        lists: prev.lists.map(list => ({
          ...list,
          words: list.words.map(word =>
            word.id === wordId
              ? {
                  ...word,
                  srs: rateSrs(word, rating, settings),
                }
              : word,
          ),
        })),
        stats: {
          ...prev.stats,
          [wordId]: nextStats,
        },
      };
    });
  };

  const updateSrsSettings = (settings: Partial<SrsSettings>) => {
    setState(prev => ({
      ...prev,
      srsSettings: {
        ...(prev.srsSettings ?? DEFAULT_SRS_SETTINGS),
        ...settings,
      },
    }));
  };

  const getOverallProgress = () => {
    let totalCorrect = 0;
    let totalAttempts = 0;
    const studiedWordIds = Object.keys(state.stats);

    studiedWordIds.forEach(id => {
      totalCorrect += state.stats[id].correct;
      totalAttempts += state.stats[id].correct + state.stats[id].incorrect;
    });

    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    
    return {
      totalStudied: studiedWordIds.length,
      accuracy
    };
  };

  const toggleStudyDirection = () => {
    setState(prev => ({
      ...prev,
      studyDirection: prev.studyDirection === 'TR_TO_EN' ? 'EN_TO_TR' : 'TR_TO_EN'
    }));
  };

  const setAiModel = (model: NonNullable<AppState['aiModel']>) => {
    setState(prev => ({
      ...prev,
      aiModel: model,
    }));
  };

  const setBrowserApiKey = (apiKey: string) => {
    setState(prev => ({
      ...prev,
      browserApiKey: apiKey.trim(),
    }));
  };

  const clearBrowserApiKey = () => {
    setState(prev => ({
      ...prev,
      browserApiKey: '',
    }));
  };

  const dismissInstallHint = () => {
    setState(prev => ({
      ...prev,
      installHintDismissed: true,
    }));
  };

  const showInstallHint = () => {
    setState(prev => ({
      ...prev,
      installHintDismissed: false,
    }));
  };

  const exportBackup = () => state;

  const importBackup = (raw: string) => {
    try {
      const parsed = JSON.parse(raw);
      const migrated = migrateAppState(parsed);
      setState(migrated);
      return {
        ok: true,
        message: 'Yedek başarıyla içe aktarıldı.',
      };
    } catch (error) {
      console.error('Backup import failed:', error);
      return {
        ok: false,
        message: 'Yedek dosyası okunamadı. Geçerli bir JSON dosyası seç.',
      };
    }
  };

  const getDifficultWordsList = (): VocabList | null => {
    const difficultIds = Object.keys(state.stats).filter(id => {
      const s = state.stats[id];
      // Condition for difficult word: at least 1 failure, and error rate > 30% or more failures than successes
      const total = s.correct + s.incorrect;
      if (total === 0) return false;
      const errorRate = s.incorrect / total;
      return s.incorrect > 0 && errorRate > 0.3;
    });

    if (difficultIds.length === 0) return null;

    const allWords = state.lists.flatMap(l => l.words);
    const uniqueMap = new Map<string, Flashcard>();
    
    difficultIds.forEach(id => {
      const word = allWords.find(w => w.id === id);
      if (word && !uniqueMap.has(id)) {
        uniqueMap.set(id, word);
      }
    });

    const difficultWords = Array.from(uniqueMap.values());
    if (difficultWords.length === 0) return null;

    // Sort by most incorrect
    difficultWords.sort((a, b) => state.stats[b.id].incorrect - state.stats[a.id].incorrect);

    return {
      id: 'difficult-words',
      title: 'Zorlandıklarım',
      isDefault: true,
      words: difficultWords
    };
  };

  const getTodaysReviewList = (): VocabList => {
    const due = getDueCards(state.lists, state.srsSettings ?? DEFAULT_SRS_SETTINGS);
    return {
      id: 'today-review',
      title: "Today's Review",
      isDefault: true,
      words: due.queue,
    };
  };

  const getSrsSummary = () => summarizeSrs(state.lists, state.srsSettings ?? DEFAULT_SRS_SETTINGS);

  return (
    <AppContext.Provider value={{
      ...state,
      isHydrated,
      addList,
      updateList,
      deleteList,
      recordSuccess,
      recordFailure,
      rateCard,
      getTodaysReviewList,
      getSrsSummary,
      updateSrsSettings,
      getOverallProgress,
      getDifficultWordsList,
      toggleStudyDirection,
      setAiModel,
      setBrowserApiKey,
      clearBrowserApiKey,
      dismissInstallHint,
      showInstallHint,
      exportBackup,
      importBackup
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
