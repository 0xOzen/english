import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlarmClock, Brain, CheckCircle2, Gauge, RotateCcw, Zap } from 'lucide-react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import Flashcard from '../Flashcard';
import StudyModeShell from '../components/StudyModeShell';
import StudyCompletionCard from '../components/StudyCompletionCard';
import { getCardSrs, getRetrievability } from '../lib/srs';
import { Flashcard as FlashcardType, SrsRating } from '../types';

const ratingConfig: Record<SrsRating, { label: string; hint: string; className: string }> = {
  again: {
    label: 'Again',
    hint: 'Tekrar yakına al',
    className: 'hover:border-claude-danger/50 hover:text-claude-danger',
  },
  hard: {
    label: 'Hard',
    hint: 'Zor, ama çıktı',
    className: 'hover:border-claude-warning/50 hover:text-claude-warning',
  },
  good: {
    label: 'Good',
    hint: 'Beklenen tekrar',
    className: 'hover:border-claude-success/50 hover:text-claude-success',
  },
  easy: {
    label: 'Easy',
    hint: 'Aralığı aç',
    className: 'hover:border-claude-accent/50 hover:text-claude-accent',
  },
};

function buildSessionQueue(cards: FlashcardType[]): FlashcardType[] {
  return [...cards].sort((a, b) => {
    const aSrs = getCardSrs(a);
    const bSrs = getCardSrs(b);
    if (aSrs.state === 'new' && bSrs.state !== 'new') return 1;
    if (aSrs.state !== 'new' && bSrs.state === 'new') return -1;
    return new Date(aSrs.dueDate).getTime() - new Date(bSrs.dueDate).getTime();
  });
}

export default function TodayReview({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { getTodaysReviewList, getSrsSummary, rateCard, srsSettings, studyDirection, toggleStudyDirection } = useApp();
  const reviewList = getTodaysReviewList();
  const initialQueue = useMemo(() => buildSessionQueue(reviewList.words), [reviewList.words]);
  const summary = getSrsSummary();
  const [queue, setQueue] = useState(initialQueue);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<SrsRating, number>>({ again: 0, hard: 0, good: 0, easy: 0 });
  const [isComplete, setIsComplete] = useState(initialQueue.length === 0);

  const currentCard = queue[currentIndex];
  const progress = queue.length > 0 ? ((currentIndex + (isComplete ? 1 : 0)) / queue.length) * 100 : 100;
  const currentSrs = currentCard ? getCardSrs(currentCard) : null;
  const currentRetrievability = currentSrs ? Math.round(getRetrievability(currentSrs) * 100) : 0;

  const resetSession = () => {
    const nextQueue = buildSessionQueue(getTodaysReviewList().words);
    setQueue(nextQueue);
    setCurrentIndex(0);
    setRatings({ again: 0, hard: 0, good: 0, easy: 0 });
    setIsComplete(nextQueue.length === 0);
  };

  const handleRate = (rating: SrsRating) => {
    if (!currentCard) return;

    rateCard(currentCard.id, rating);
    setRatings((previous) => ({ ...previous, [rating]: previous[rating] + 1 }));

    if (currentIndex < queue.length - 1) {
      setCurrentIndex((previous) => previous + 1);
      return;
    }

    setIsComplete(true);
  };

  if (queue.length === 0 || isComplete) {
    return (
      <StudyModeShell
        modeLabel="Review"
        title="Bugünün tekrarı"
        description="Günü gelen tekrar ve yeni kartlar"
        listTitle="SRS"
        progress={100}
        currentIndex={0}
        total={Math.max(queue.length, 1)}
        onBack={() => onNavigate({ type: 'dashboard' })}
        accentClassName="emerald"
        stats={[
          { label: 'Review', value: `${summary.dueReview}` },
          { label: 'Yeni', value: `${summary.dueNew}` },
          { label: 'Yük', value: `${summary.estimatedDailyLoad}` },
        ]}
        footer={
          <button onClick={resetSession} className="button-secondary">
            <RotateCcw size={16} />
            Kuyruğu yenile
          </button>
        }
      >
        <StudyCompletionCard
          title="Bugünün SRS turu tamam"
          description="Tekrar kararların kartların sonraki görünme zamanını güncelledi. Hedef retention yükseldikçe günlük yük de artar."
          primaryLabel="Kuyruğu yenile"
          onPrimary={resetSession}
          secondaryLabel="Panele dön"
          onSecondary={() => onNavigate({ type: 'dashboard' })}
          summary={[
            { label: 'Again', value: `${ratings.again}` },
            { label: 'Hard', value: `${ratings.hard}` },
            { label: 'Good', value: `${ratings.good}` },
            { label: 'Easy', value: `${ratings.easy}` },
          ]}
        />
      </StudyModeShell>
    );
  }

  return (
    <StudyModeShell
      modeLabel="Review"
      title="Bugünün tekrarı"
      description="Günü gelen tekrar ve yeni kartlar"
      listTitle={`${summary.dueReview} tekrar · ${summary.dueNew} yeni`}
      progress={progress}
      currentIndex={currentIndex}
      total={queue.length}
      onBack={() => onNavigate({ type: 'dashboard' })}
      directionLabel={studyDirection === 'TR_TO_EN' ? 'TR → EN' : 'EN → TR'}
      onToggleDirection={toggleStudyDirection}
      accentClassName="emerald"
      stats={[
        { label: 'Retention', value: `${Math.round((srsSettings?.targetRetention ?? 0.9) * 100)}%` },
        { label: 'Tahmini yük', value: `${summary.estimatedDailyLoad}` },
        { label: 'Zayıf', value: `${summary.weakCount}` },
      ]}
      footer={
        <div className="grid gap-2 text-sm text-claude-subtle sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-[12px] border border-claude-border bg-claude-panel px-3 py-2">
            <AlarmClock size={15} className="text-claude-muted" />
            Yarın gelebilir: {summary.dueTomorrow}
          </div>
          <div className="flex items-center gap-2 rounded-[12px] border border-claude-border bg-claude-panel px-3 py-2">
            <Gauge size={15} className="text-claude-muted" />
            Retrievability: {currentRetrievability}%
          </div>
          <div className="flex items-center gap-2 rounded-[12px] border border-claude-border bg-claude-panel px-3 py-2">
            <Brain size={15} className="text-claude-muted" />
            Durum: {currentSrs?.state ?? 'new'}
          </div>
        </div>
      }
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 py-2">
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

        <div className="grid w-full gap-2 sm:grid-cols-4">
          {(Object.keys(ratingConfig) as SrsRating[]).map((rating) => {
            const config = ratingConfig[rating];
            return (
              <button
                key={rating}
                onClick={() => handleRate(rating)}
                className={`flex min-h-16 flex-col items-center justify-center rounded-[14px] border border-claude-border bg-claude-panel px-3 text-sm font-semibold text-claude-subtle transition-colors ${config.className}`}
              >
                <span className="flex items-center gap-2 text-base text-claude-text">
                  {rating === 'easy' ? <Zap size={16} /> : rating === 'good' ? <CheckCircle2 size={16} /> : null}
                  {config.label}
                </span>
                <span className="mt-1 text-xs font-medium text-claude-muted">{config.hint}</span>
              </button>
            );
          })}
        </div>
      </div>
    </StudyModeShell>
  );
}
