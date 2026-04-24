import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import { CornerDownLeft } from 'lucide-react';
import StudyModeShell from '../components/StudyModeShell';
import StudyCompletionCard from '../components/StudyCompletionCard';

export default function WriteMode({ listId, onNavigate }: { listId: string; onNavigate: (screen: Screen) => void }) {
  const { lists, recordSuccess, recordFailure, studyDirection, toggleStudyDirection, getDifficultWordsList } = useApp();
  const list = listId === 'difficult-words' ? getDifficultWordsList() : lists.find((item) => item.id === listId);
  const words = list?.words || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (feedback === 'idle' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [feedback, currentIndex]);

  if (words.length === 0) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-xl items-center justify-center px-4 py-10">
        <div className="panel-surface-strong rounded-[30px] p-8 text-center">
          <div className="text-2xl font-semibold text-claude-text">Yazma için hazır kelime yok.</div>
          <p className="mt-3 text-sm leading-7 text-claude-subtle">Listeye kelime eklediğinde bu alan otomatik olarak aktif hale gelecek.</p>
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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!inputVal.trim() || feedback !== 'idle') {
      return;
    }

    const answer = getAnswerText(currentWord).toLowerCase().trim();
    const input = inputVal.toLowerCase().trim();

    const isCorrect = input === answer;

    if (isCorrect) {
      setFeedback('correct');
      setCorrectCount((previous) => previous + 1);
      recordSuccess(currentWord.id);
    } else {
      setFeedback('incorrect');
      setIncorrectCount((previous) => previous + 1);
      recordFailure(currentWord.id);
    }

    window.setTimeout(() => {
      setFeedback('idle');
      setInputVal('');

      if (currentIndex < words.length - 1) {
        setCurrentIndex((previous) => previous + 1);
      } else {
        setIsComplete(true);
      }
    }, 1100);
  };

  const progress = ((currentIndex + (isComplete ? 1 : 0)) / words.length) * 100;
  const answerPreview = getAnswerText(currentWord);

  return (
    <StudyModeShell
      modeLabel="Yazma"
      title="Pasif tanımayı aktif üretime çevir"
      description="Kelimenin karşılığını kendi başına yazarak gerçekten bellekte oturup oturmadığını test eder."
      listTitle={list?.title || 'Liste'}
      progress={progress}
      currentIndex={isComplete ? words.length - 1 : currentIndex}
      total={words.length}
      onBack={() => onNavigate({ type: 'dashboard' })}
      directionLabel={studyDirection === 'TR_TO_EN' ? 'TR → EN' : 'EN → TR'}
      onToggleDirection={toggleStudyDirection}
      accentClassName="amber"
      progressNote="Cevabı gönderdiğinde doğru ya da yanlış geri bildirimi anında görünür; ardından sıradaki kelimeye geçilir."
      stats={[
        { label: 'Doğru', value: `${correctCount}` },
        { label: 'Yanlış', value: `${incorrectCount}` },
        { label: 'Kalan', value: `${Math.max(words.length - currentIndex - (isComplete ? 1 : 0), 0)}` },
        { label: 'Liste', value: list?.title || '-' },
      ]}
      footer={
        <div className="text-sm leading-7 text-claude-subtle">
          Yazım sırasında küçük harf kontrolü yapıyoruz. İngilizce hedefte ifadeyi birebir üretmek aktif hatırlamayı güçlendirir.
        </div>
      }
    >
      {isComplete ? (
        <StudyCompletionCard
          title="Yazma turu tamamlandı"
          description="Bu tur artık daha üretken geçti. Aynı listeyi yeniden deneyebilir ya da test moduna geçip hızını ölçebilirsin."
          primaryLabel="Tekrar yaz"
          onPrimary={() => {
            setCurrentIndex(0);
            setInputVal('');
            setFeedback('idle');
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
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 py-2">
          <div className="text-center">
            <div className="section-label">Karşılığını yaz</div>
            <h2 className="mt-5 text-3xl font-semibold leading-tight text-claude-text sm:text-5xl">
              {getQuestionText(currentWord)}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(event) => setInputVal(event.target.value)}
                disabled={feedback !== 'idle'}
                autoComplete="off"
                placeholder="Cevabı yaz..."
                className={`w-full rounded-[16px] border px-6 py-5 text-center text-2xl font-semibold outline-none transition-all ${
                  feedback === 'idle'
                    ? 'border-claude-border bg-claude-surface text-claude-text shadow-soft focus:border-claude-warning focus:ring-4 focus:ring-claude-warning/10'
                    : feedback === 'correct'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-rose-300 bg-rose-50 text-rose-700'
                }`}
              />

              {feedback === 'idle' ? (
                <button type="submit" className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[12px] border border-claude-border bg-claude-panel text-claude-muted transition-colors hover:text-claude-text">
                  <CornerDownLeft size={18} />
                </button>
              ) : null}
            </div>

            <div className="mt-5 min-h-10 text-center">
              {feedback === 'correct' ? <div className="text-sm font-semibold text-emerald-700">Harika, cevap doğru.</div> : null}
              {feedback === 'incorrect' ? (
                <div className="text-sm font-semibold text-rose-600">
                  Doğrusu: <span className="text-claude-text">{answerPreview}</span>
                </div>
              ) : null}
            </div>
          </form>
        </div>
      )}
    </StudyModeShell>
  );
}
