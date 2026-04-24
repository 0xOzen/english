import { useMemo, useState } from 'react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import StudyModeShell from '../components/StudyModeShell';
import StudyCompletionCard from '../components/StudyCompletionCard';

export default function QuizMode({ listId, onNavigate }: { listId: string; onNavigate: (screen: Screen) => void }) {
  const { lists, recordSuccess, recordFailure, studyDirection, toggleStudyDirection, getDifficultWordsList } = useApp();
  const list = listId === 'difficult-words' ? getDifficultWordsList() : lists.find((item) => item.id === listId);
  const words = list?.words || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  if (words.length < 4) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-xl items-center justify-center px-4 py-10">
        <div className="panel-surface-strong rounded-[30px] p-8 text-center">
          <div className="text-2xl font-semibold text-claude-text">Test modu için en az 4 kelime gerekli.</div>
          <p className="mt-3 text-sm leading-7 text-claude-subtle">Bu listeyi biraz daha büyüttüğümüzde çeldiricili test deneyimi çok daha güçlü çalışır.</p>
          <button onClick={() => onNavigate({ type: 'dashboard' })} className="button-primary mt-6">
            Panele dön
          </button>
        </div>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  const getQuestionText = (word: (typeof words)[number]) =>
    studyDirection === 'TR_TO_EN' ? word.translationTr || word.translationEn || word.translation || '' : word.term;
  const getAnswerText = (word: (typeof words)[number]) =>
    studyDirection === 'TR_TO_EN' ? word.term : word.translationTr || word.translationEn || word.translation || '';

  const options = useMemo(() => {
    const wrongOptions = words
      .filter((word) => word.id !== currentWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((word) => getAnswerText(word));

    return [getAnswerText(currentWord), ...wrongOptions].sort(() => 0.5 - Math.random());
  }, [currentIndex, words, currentWord, studyDirection]);

  const correctOption = getAnswerText(currentWord);
  const progress = ((currentIndex + (isComplete ? 1 : 0)) / words.length) * 100;

  const handleSelect = (option: string) => {
    if (selectedAnswer) {
      return;
    }

    setSelectedAnswer(option);

    if (option === correctOption) {
      recordSuccess(currentWord.id);
      setCorrectCount((previous) => previous + 1);
    } else {
      recordFailure(currentWord.id);
      setIncorrectCount((previous) => previous + 1);
    }

    window.setTimeout(() => {
      setSelectedAnswer(null);

      if (currentIndex < words.length - 1) {
        setCurrentIndex((previous) => previous + 1);
      } else {
        setIsComplete(true);
      }
    }, 950);
  };

  return (
    <StudyModeShell
      modeLabel="Test"
      title="Hızlı karar ve doğru çağırma pratiği"
      description="Çeldiriciler arasından doğru karşılığı seçerek kelimeyi gerçekten ayırt edip edemediğini ölçer."
      listTitle={list?.title || 'Liste'}
      progress={progress}
      currentIndex={isComplete ? words.length - 1 : currentIndex}
      total={words.length}
      onBack={() => onNavigate({ type: 'dashboard' })}
      directionLabel={studyDirection === 'TR_TO_EN' ? 'TR → EN' : 'EN → TR'}
      onToggleDirection={toggleStudyDirection}
      accentClassName="emerald"
      progressNote="Her soruda dört seçenek geliyor; kısa bekleme sonrası sistem seni otomatik olarak sonraki soruya taşıyor."
      stats={[
        { label: 'Doğru', value: `${correctCount}` },
        { label: 'Yanlış', value: `${incorrectCount}` },
        { label: 'Kalan', value: `${Math.max(words.length - currentIndex - (isComplete ? 1 : 0), 0)}` },
        { label: 'Liste', value: list?.title || '-' },
      ]}
    >
      {isComplete ? (
        <StudyCompletionCard
          title="Test tamamlandı"
          description="Çeldiricili tur bitti. İstersen aynı listeyi yeniden çözebilir ya da yazma moduna geçerek aktif üretimi deneyebilirsin."
          primaryLabel="Tekrar çöz"
          onPrimary={() => {
            setCurrentIndex(0);
            setSelectedAnswer(null);
            setCorrectCount(0);
            setIncorrectCount(0);
            setIsComplete(false);
          }}
          secondaryLabel="Panele dön"
          onSecondary={() => onNavigate({ type: 'dashboard' })}
          summary={[
            { label: 'Toplam soru', value: `${words.length}` },
            { label: 'Doğru', value: `${correctCount}` },
            { label: 'Yanlış', value: `${incorrectCount}` },
          ]}
        />
      ) : (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-2">
          <div className="text-center">
            <div className="section-label">{studyDirection === 'TR_TO_EN' ? 'İngilizce karşılığı nedir?' : 'Türkçe karşılığı nedir?'}</div>
            <h2 className="mt-5 text-3xl font-semibold leading-tight text-claude-text sm:text-5xl">
              {getQuestionText(currentWord)}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {options.map((option) => {
              let buttonClassName = 'border-claude-border bg-claude-surface text-claude-text hover:border-claude-accent/50 hover:-translate-y-0.5';

              if (selectedAnswer) {
                if (option === correctOption) {
                  buttonClassName = 'border-emerald-300 bg-emerald-500 text-white shadow-[0_18px_40px_rgba(16,185,129,0.24)]';
                } else if (option === selectedAnswer) {
                  buttonClassName = 'border-rose-300 bg-rose-500 text-white shadow-[0_18px_40px_rgba(244,63,94,0.2)]';
                } else {
                  buttonClassName = 'border-claude-border bg-claude-surface text-claude-muted opacity-60';
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  disabled={selectedAnswer !== null}
                  className={`rounded-[16px] border px-4 py-5 text-left text-lg font-semibold transition-all ${buttonClassName}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </StudyModeShell>
  );
}
