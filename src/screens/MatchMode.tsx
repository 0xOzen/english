import { useEffect, useState } from 'react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import { Flashcard } from '../types';
import StudyModeShell from '../components/StudyModeShell';
import StudyCompletionCard from '../components/StudyCompletionCard';

type CardType = 'ENGLISH' | 'TURKISH';
type GridItem = {
  id: string;
  wordId: string;
  text: string;
  type: CardType;
  isMatched: boolean;
};

function createGrid(words: Flashcard[]): GridItem[] {
  const pool = [...words].sort(() => 0.5 - Math.random()).slice(0, 6);
  const initialCards: GridItem[] = [];

  pool.forEach((word) => {
    initialCards.push({ id: crypto.randomUUID(), wordId: word.id, text: word.term, type: 'ENGLISH', isMatched: false });
    initialCards.push({
      id: crypto.randomUUID(),
      wordId: word.id,
      text: word.translationTr || word.translationEn || word.translation || '',
      type: 'TURKISH',
      isMatched: false,
    });
  });

  return initialCards.sort(() => 0.5 - Math.random());
}

export default function MatchMode({ listId, onNavigate }: { listId: string; onNavigate: (screen: Screen) => void }) {
  const { lists, recordSuccess, recordFailure, getDifficultWordsList } = useApp();
  const list = listId === 'difficult-words' ? getDifficultWordsList() : lists.find((item) => item.id === listId);
  const words = list?.words || [];

  const [cards, setCards] = useState<GridItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (words.length < 2) {
      return;
    }

    setCards(createGrid(words));
    setSelectedIds([]);
    setIsProcessing(false);
    setMatchedPairs(0);
    setMistakes(0);
    setIsComplete(false);
  }, [words]);

  if (words.length < 2) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-xl items-center justify-center px-4 py-10">
        <div className="panel-surface-strong rounded-[30px] p-8 text-center">
          <div className="text-2xl font-semibold text-claude-text">Eşleştirme için en az 2 kelime gerekli.</div>
          <p className="mt-3 text-sm leading-7 text-claude-subtle">Küçük bir liste bile yeterli; birkaç kelime daha eklediğinde oyun akışı açılır.</p>
          <button onClick={() => onNavigate({ type: 'dashboard' })} className="button-primary mt-6">
            Panele dön
          </button>
        </div>
      </div>
    );
  }

  const totalPairs = cards.length / 2;
  const progress = totalPairs > 0 ? ((matchedPairs + (isComplete ? 0 : 0)) / totalPairs) * 100 : 0;

  const handleCardClick = (card: GridItem) => {
    if (isProcessing || card.isMatched || selectedIds.includes(card.id)) {
      return;
    }

    const newSelected = [...selectedIds, card.id];
    setSelectedIds(newSelected);

    if (newSelected.length === 2) {
      setIsProcessing(true);
      const firstCard = cards.find((item) => item.id === newSelected[0]);
      const secondCard = cards.find((item) => item.id === newSelected[1]);

      if (!firstCard || !secondCard) {
        setSelectedIds([]);
        setIsProcessing(false);
        return;
      }

      if (firstCard.wordId === secondCard.wordId && firstCard.type !== secondCard.type) {
        recordSuccess(firstCard.wordId);
        window.setTimeout(() => {
          setCards((previous) => previous.map((item) => (item.wordId === firstCard.wordId ? { ...item, isMatched: true } : item)));
          setMatchedPairs((previous) => {
            const nextValue = previous + 1;
            if (nextValue === totalPairs) {
              setIsComplete(true);
            }
            return nextValue;
          });
          setSelectedIds([]);
          setIsProcessing(false);
        }, 320);
      } else {
        recordFailure(firstCard.wordId);
        setMistakes((previous) => previous + 1);
        window.setTimeout(() => {
          setSelectedIds([]);
          setIsProcessing(false);
        }, 700);
      }
    }
  };

  return (
    <StudyModeShell
      modeLabel="Eşleştir"
      title="Kısa tur, yüksek tempo, oyun hissi"
      description="İngilizce ve Türkçe kartları eşleyerek özellikle hızlı tekrar ve dikkat tazeleme için güçlü bir mod oluşturur."
      listTitle={list?.title || 'Liste'}
      progress={progress}
      currentIndex={matchedPairs}
      total={Math.max(totalPairs, 1)}
      onBack={() => onNavigate({ type: 'dashboard' })}
      accentClassName="rose"
      progressNote="Doğru eşleşmeler sahneden kalkar; yanlış seçimler kısa bir gecikmeyle geri kapanır ve tempo korunur."
      stats={[
        { label: 'Çift', value: `${matchedPairs}/${totalPairs}` },
        { label: 'Hata', value: `${mistakes}` },
        { label: 'Kart', value: `${cards.length}` },
        { label: 'Liste', value: list?.title || '-' },
      ]}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm leading-7 text-claude-subtle">Önce İngilizce ya da Türkçe fark etmez; iki kart açtığında eşleşme varsa kartlar sahneden çıkar.</div>
          <button
            onClick={() => {
              setCards(createGrid(words));
              setSelectedIds([]);
              setIsProcessing(false);
              setMatchedPairs(0);
              setMistakes(0);
              setIsComplete(false);
            }}
            className="button-secondary self-start"
          >
            Turu yenile
          </button>
        </div>
      }
    >
      {isComplete ? (
        <StudyCompletionCard
          title="Eşleştirme turu bitti"
          description="Hızlı tekrar başarıyla tamamlandı. İstersen yeni bir karışım açabilir ya da kart moduna geçip derin tekrar yapabilirsin."
          primaryLabel="Yeni tur"
          onPrimary={() => {
            setCards(createGrid(words));
            setSelectedIds([]);
            setIsProcessing(false);
            setMatchedPairs(0);
            setMistakes(0);
            setIsComplete(false);
          }}
          secondaryLabel="Panele dön"
          onSecondary={() => onNavigate({ type: 'dashboard' })}
          summary={[
            { label: 'Çift', value: `${totalPairs}` },
            { label: 'Hata', value: `${mistakes}` },
            { label: 'Kart', value: `${cards.length}` },
          ]}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {cards.map((card) => {
            const isSelected = selectedIds.includes(card.id);
            let buttonClassName = 'border-claude-border bg-claude-surface text-claude-text hover:border-claude-accent/50 hover:-translate-y-0.5';

            if (card.isMatched) {
              buttonClassName = 'pointer-events-none border-emerald-200 bg-emerald-100/70 text-emerald-700 opacity-50';
            } else if (isSelected) {
              if (selectedIds.length === 2) {
                const firstCard = cards.find((item) => item.id === selectedIds[0]);
                const secondCard = cards.find((item) => item.id === selectedIds[1]);
                if (firstCard && secondCard && firstCard.wordId === secondCard.wordId) {
                  buttonClassName = 'border-emerald-300 bg-emerald-500 text-white shadow-[0_18px_40px_rgba(16,185,129,0.22)]';
                } else {
                  buttonClassName = 'border-rose-300 bg-rose-500 text-white shadow-[0_18px_40px_rgba(244,63,94,0.22)]';
                }
              } else {
                  buttonClassName = 'border-sky-200 bg-sky-50 text-sky-700';
              }
            }

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`flex min-h-32 items-center justify-center rounded-[16px] border px-4 py-5 text-center text-lg font-semibold transition-all ${buttonClassName}`}
              >
                <span className="line-clamp-3">{card.text}</span>
              </button>
            );
          })}
        </div>
      )}
    </StudyModeShell>
  );
}
