import { motion } from 'motion/react';
import { useState, type KeyboardEvent, type MouseEvent } from 'react';
import { RefreshCcw, Volume2 } from 'lucide-react';
import { Flashcard as FlashcardType, StudyDirection } from './types';

interface FlashcardProps {
  card: FlashcardType;
  studyDirection?: StudyDirection;
}

function getLevelClassName(level?: string): string {
  if (!level) {
    return 'bg-slate-100 text-slate-500';
  }

  if (level.includes('B2')) {
    return 'bg-indigo-100 text-indigo-700';
  }

  if (level.includes('C1')) {
    return 'bg-purple-100 text-purple-700';
  }

  if (level.includes('C2')) {
    return 'bg-rose-100 text-rose-700';
  }

  return 'bg-slate-100 text-slate-500';
}

export default function Flashcard({ card, studyDirection = 'EN_TO_TR' }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const displayTranslation = card.translationTr || card.translationEn || card.translation || '';
  const toggleCard = () => setIsFlipped((previous) => !previous);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleCard();
    }
  };

  const playAudioTerm = (event: MouseEvent) => {
    event.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(card.term);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const frontText = studyDirection === 'TR_TO_EN' ? displayTranslation : card.term;
  const backText = studyDirection === 'TR_TO_EN' ? card.term : displayTranslation;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={`${frontText} kartını çevir`}
      className="group relative mx-auto aspect-[4/5] w-full max-w-sm cursor-pointer select-none outline-none [perspective:1000px] focus-visible:ring-2 focus-visible:ring-claude-accent focus-visible:ring-offset-2 focus-visible:ring-offset-claude-bg"
      onClick={toggleCard}
      onKeyDown={handleKeyDown}
    >
      <motion.div
        className="relative h-full w-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-claude-border bg-claude-panel p-5 shadow-soft sm:p-6"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {card.imageUrl && studyDirection !== 'TR_TO_EN' ? (
            <div className="mb-4 h-32 w-full shrink-0 overflow-hidden rounded-[16px] border border-claude-border bg-claude-surface">
              <img src={card.imageUrl} alt="Hatırlatıcı görsel" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="flex-1" />
          )}

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            {card.level ? (
              <div className="mb-3 flex gap-2">
                <span className={`rounded-[6px] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getLevelClassName(card.level)}`}>
                  {card.level}
                </span>
              </div>
            ) : null}

            <div className="relative mb-2 flex flex-wrap items-baseline justify-center gap-2">
              <h2 className="break-words text-3xl font-semibold tracking-tight text-claude-text sm:text-4xl">{frontText}</h2>
              {studyDirection === 'EN_TO_TR' ? (
                <button
                  onClick={playAudioTerm}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-claude-muted transition-all hover:bg-claude-accentSoft hover:text-claude-accent active:scale-95"
                  title="Telaffuzu dinle"
                  aria-label={`${card.term} telaffuzunu dinle`}
                >
                  <Volume2 size={21} strokeWidth={2.3} />
                </button>
              ) : null}
            </div>

            <div className="mt-4 flex w-full flex-col px-2">
              {card.wordType === 'verb' && card.verbForms ? (
                <div className="mt-2 flex w-full flex-col space-y-2">
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="rounded-xl border border-claude-border bg-claude-surface p-2.5">
                      <div className="mb-1.5 ml-0.5 mt-0.5 text-[9px] font-bold uppercase tracking-widest text-claude-muted">3rd Person</div>
                      <div className="px-0.5 text-[13px] font-medium text-claude-text">{card.verbForms.thirdPerson || card.verbForms.present || '-'}</div>
                    </div>
                    <div className="rounded-xl border border-claude-border bg-claude-surface p-2.5">
                      <div className="mb-1.5 ml-0.5 mt-0.5 text-[9px] font-bold uppercase tracking-widest text-claude-muted">Past Simple</div>
                      <div className="px-0.5 text-[13px] font-medium text-claude-text">{card.verbForms.pastSimple || card.verbForms.preterite || '-'}</div>
                    </div>
                    <div className="rounded-xl border border-claude-border bg-claude-surface p-2.5">
                      <div className="mb-1.5 ml-0.5 mt-0.5 text-[9px] font-bold uppercase tracking-widest text-claude-muted">Past Participle</div>
                      <div className="px-0.5 text-[13px] font-medium text-claude-text">{card.verbForms.pastParticiple || card.verbForms.participle || '-'}</div>
                    </div>
                    <div className="rounded-xl border border-claude-border bg-claude-surface p-2.5">
                      <div className="mb-1.5 ml-0.5 mt-0.5 text-[9px] font-bold uppercase tracking-widest text-claude-muted">Gerund</div>
                      <div className="px-0.5 text-[13px] font-medium text-claude-text">{card.verbForms.gerund || '-'}</div>
                    </div>
                  </div>
                  {card.verbForms.usagePattern ? (
                    <div className="rounded-xl border border-claude-accent/20 bg-claude-accentSoft p-2.5 text-left">
                      <div className="mb-1.5 ml-0.5 mt-0.5 text-[9px] font-bold uppercase tracking-widest text-claude-accent">Kalıp</div>
                      <div className="px-0.5 text-[13px] font-medium text-claude-text">{card.verbForms.usagePattern}</div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {card.wordType === 'adjective' && card.adjectiveForms ? (
                <div className="mt-2 flex w-full flex-col items-center gap-1.5">
                  <div className="flex w-full justify-between border-t border-claude-border py-2">
                    <span className="self-center text-[10px] font-bold uppercase tracking-widest text-claude-muted">Komp.</span>
                    <span className="text-[14px] font-medium text-claude-text">{card.adjectiveForms.comparative || '-'}</span>
                  </div>
                  <div className="flex w-full justify-between border-t border-claude-border py-2">
                    <span className="self-center text-[10px] font-bold uppercase tracking-widest text-claude-muted">Superlativ</span>
                    <span className="text-[14px] font-medium text-claude-text">{card.adjectiveForms.superlative || '-'}</span>
                  </div>
                  {card.adjectiveForms.usage ? (
                    <div className="flex w-full justify-between border-t border-claude-border py-2 text-left">
                      <span className="self-center text-[10px] font-bold uppercase tracking-widest text-claude-muted">Kullanım</span>
                      <span className="text-right text-[14px] font-medium text-claude-text">{card.adjectiveForms.usage}</span>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {card.wordType === 'phrase' && card.phraseForms ? (
                <div className="mt-2 flex w-full flex-col space-y-2">
                  {card.phraseForms.usageIntent ? (
                    <div className="rounded-xl border border-claude-border bg-claude-surface p-3 text-left">
                      <div className="mb-1.5 ml-0.5 mt-0.5 text-[9px] font-bold uppercase tracking-widest text-orange-400">Use</div>
                      <div className="whitespace-pre-line px-0.5 text-[13px] font-medium leading-relaxed text-claude-text">{card.phraseForms.usageIntent}</div>
                    </div>
                  ) : null}
                  {(card.phraseForms.naturalVariant || card.phraseForms.formalVariant || card.phraseForms.redemittel || card.phraseForms.alltagssprache) ? (
                    <div className="rounded-xl border border-claude-border bg-claude-surface p-3 text-left">
                      <div className="mb-1.5 ml-0.5 mt-0.5 text-[9px] font-bold uppercase tracking-widest text-pink-400">Variants</div>
                      <div className="whitespace-pre-line px-0.5 text-[13px] font-medium leading-relaxed text-claude-text">
                        {[card.phraseForms.naturalVariant, card.phraseForms.formalVariant, card.phraseForms.redemittel, card.phraseForms.alltagssprache].filter(Boolean).join('\n')}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-auto flex w-full shrink-0 justify-center pb-2 pt-4 opacity-40 transition-opacity group-hover:opacity-100">
            <RefreshCcw size={20} className="text-claude-muted" />
          </div>
        </div>

        <div
          className="absolute flex h-full w-full flex-col items-center justify-center rounded-[22px] border border-claude-border bg-claude-panel p-6 shadow-soft sm:p-8"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
            <div className="mb-6 flex gap-2 rounded-full border border-claude-border px-3 py-1 text-xs font-semibold uppercase tracking-widest text-claude-muted">
              <span>{studyDirection === 'TR_TO_EN' ? 'ENGLISH' : 'TÜRKÇE'}</span>
            </div>

            <div className="relative mb-8 flex flex-wrap items-baseline justify-center gap-2">
              <h2 className="break-words text-3xl font-semibold tracking-tight text-claude-text sm:text-4xl">{backText}</h2>
              {studyDirection === 'TR_TO_EN' ? (
                <button
                  onClick={playAudioTerm}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-claude-muted transition-all hover:bg-claude-accentSoft hover:text-claude-accent active:scale-95"
                  title="Telaffuzu dinle"
                  aria-label={`${card.term} telaffuzunu dinle`}
                >
                  <Volume2 size={21} strokeWidth={2.3} />
                </button>
              ) : null}
            </div>

            {card.example || card.exampleTranslation ? (
              <div className="mt-2 w-full space-y-4">
                {card.example ? <p className="text-[15px] font-medium leading-relaxed text-claude-subtle">"{card.example}"</p> : null}
                {card.exampleTranslation ? <p className="text-sm text-claude-muted">{card.exampleTranslation}</p> : null}
              </div>
            ) : null}

            {card.note ? (
              <div className="mt-6 w-full rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-left">
                <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-500/80">Not</div>
                <p className="text-sm font-medium leading-relaxed text-amber-200/90">{card.note}</p>
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
