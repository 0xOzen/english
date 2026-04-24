import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Shuffle, Undo2, X } from 'lucide-react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import Flashcard from '../Flashcard';
import StudyModeShell from '../components/StudyModeShell';
import StudyCompletionCard from '../components/StudyCompletionCard';

export default function FlashcardMode({ listId, onNavigate }: { listId: string; onNavigate: (screen: Screen) => void }) {
  const { lists, recordSuccess, recordFailure, studyDirection, toggleStudyDirection, getDifficultWordsList } = useApp();
  const list = listId === 'difficult-words' ? getDifficultWordsList() : lists.find((item) => item.id === listId);
  const initialWords = list?.words || [];

  const [deck, setDeck] = useState(initialWords);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [knownCount, setKnownCount] = useState(0);
  const [unknownCount, setUnknownCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentCard = deck[currentIndex];
  const progress = deck.length > 0 ? ((currentIndex + (isComplete ? 1 : 0)) / deck.length) * 100 : 0;

  const resetSession = (nextDeck = initialWords) => {
    setDeck(nextDeck);
    setCurrentIndex(0);
    setKnownCount(0);
    setUnknownCount(0);
    setIsComplete(false);
  };

  const actions = useMemo(
    () => ({
      shuffle: () => resetSession([...initialWords].sort(() => Math.random() - 0.5)),
      reset: () => resetSession(initialWords),
    }),
    [initialWords],
  );

  if (!list || deck.length === 0) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-sm flex-col items-center justify-center px-6 py-12 text-center">
        <p className="text-lg font-medium text-stone-400">Bu listede çalışılacak kelime yok.</p>
        <button onClick={() => onNavigate({ type: 'dashboard' })} className="button-primary mt-6">
          Panele dön
        </button>
      </div>
    );
  }

  const goNext = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((previous) => previous + 1);
      return;
    }

    setIsComplete(true);
  };

  const handleKnown = () => {
    recordSuccess(currentCard.id);
    setKnownCount((previous) => previous + 1);
    goNext();
  };

  const handleUnknown = () => {
    recordFailure(currentCard.id);
    setUnknownCount((previous) => previous + 1);
    goNext();
  };

  return (
    <StudyModeShell
      modeLabel="Kartlar"
      title="Kartla hızlı hatırlama"
      description="Kartı çevir, cevabı gör ve kelimeyi bildiğini ya da zorlandığını işaretle."
      listTitle={list.title}
      progress={progress}
      currentIndex={isComplete ? deck.length - 1 : currentIndex}
      total={deck.length}
      onBack={() => onNavigate({ type: 'dashboard' })}
      directionLabel={studyDirection === 'TR_TO_EN' ? 'TR → EN' : 'EN → TR'}
      onToggleDirection={toggleStudyDirection}
      accentClassName="teal"
      stats={[
        { label: 'Bilinen', value: `${knownCount}` },
        { label: 'Zorlanan', value: `${unknownCount}` },
        { label: 'Liste', value: list.title },
      ]}
      footer={
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-between">
          <div className="text-sm leading-7 text-claude-subtle">Kartı tıklayarak veya klavyede Enter/Space ile çevirebilirsin.</div>
          <div className="flex items-center gap-2">
            <button onClick={actions.shuffle} className="button-secondary" title="Karıştır">
              <Shuffle size={16} />
              Karıştır
            </button>
            <button onClick={actions.reset} className="button-secondary" title="Baştan al">
              <Undo2 size={16} />
              Baştan al
            </button>
          </div>
        </div>
      }
    >
      {isComplete ? (
        <StudyCompletionCard
          title="Kart turu tamamlandı"
          description="Bu turdaki kartları bitirdin. Zorlandıkların otomatik olarak zor kelimeler listesine yaklaşır."
          primaryLabel="Baştan al"
          onPrimary={actions.reset}
          secondaryLabel="Panele dön"
          onSecondary={() => onNavigate({ type: 'dashboard' })}
          summary={[
            { label: 'Bilinen', value: `${knownCount}` },
            { label: 'Zorlanan', value: `${unknownCount}` },
            { label: 'Toplam', value: `${deck.length}` },
          ]}
        />
      ) : (
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-7 py-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentCard.id}-${currentIndex}-${studyDirection || ''}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <Flashcard card={currentCard} studyDirection={studyDirection} />
            </motion.div>
          </AnimatePresence>

          <div className="flex w-full max-w-sm items-center justify-center gap-4">
            <button
              onClick={handleUnknown}
              className="flex h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-[14px] border border-claude-border bg-claude-panel px-4 text-sm font-semibold text-claude-subtle transition-colors hover:border-claude-danger/50 hover:text-claude-danger"
            >
              <X size={18} />
              Zorlandım
            </button>
            <button
              onClick={handleKnown}
              className="flex h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-[14px] border border-claude-border bg-claude-panel px-4 text-sm font-semibold text-claude-subtle transition-colors hover:border-claude-success/50 hover:text-claude-success"
            >
              <Check size={18} />
              Bildim
            </button>
          </div>
        </div>
      )}
    </StudyModeShell>
  );
}
