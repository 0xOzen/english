import { Flashcard, SrsRating, SrsSchedule, SrsSettings, VocabList } from '../types';

export const DEFAULT_SRS_SETTINGS: SrsSettings = {
  targetRetention: 0.9,
  newCardsPerDay: 12,
  reviewCardsPerDay: 80,
};

const DAY_MS = 24 * 60 * 60 * 1000;
const INITIAL_EASE = 2.5;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

function daysBetween(a: Date, b: Date): number {
  return Math.max(0, (a.getTime() - b.getTime()) / DAY_MS);
}

function retentionIntervalFactor(targetRetention: number): number {
  return clamp((1 - targetRetention) / (1 - DEFAULT_SRS_SETTINGS.targetRetention), 0.45, 1.8);
}

export function getInitialSrsSchedule(now = new Date()): SrsSchedule {
  return {
    dueDate: now.toISOString(),
    interval: 0,
    ease: INITIAL_EASE,
    difficulty: 0.3,
    retrievability: 1,
    reps: 0,
    lapses: 0,
    state: 'new',
  };
}

export function getCardSrs(card: Flashcard): SrsSchedule {
  return card.srs ?? getInitialSrsSchedule();
}

export function getRetrievability(schedule: SrsSchedule, now = new Date()): number {
  if (!schedule.lastReviewed || schedule.interval <= 0) {
    return schedule.state === 'new' ? 1 : 0;
  }

  const elapsedDays = daysBetween(now, new Date(schedule.lastReviewed));
  return clamp(Math.exp(-elapsedDays / Math.max(schedule.interval, 0.2)), 0, 1);
}

export function isDue(card: Flashcard, now = new Date()): boolean {
  const schedule = getCardSrs(card);
  return new Date(schedule.dueDate).getTime() <= now.getTime();
}

export function rateSrs(
  card: Flashcard,
  rating: SrsRating,
  settings: SrsSettings = DEFAULT_SRS_SETTINGS,
  now = new Date(),
): SrsSchedule {
  const current = getCardSrs(card);
  const easeDelta: Record<SrsRating, number> = {
    again: -0.2,
    hard: -0.1,
    good: 0,
    easy: 0.15,
  };
  const difficultyDelta: Record<SrsRating, number> = {
    again: 0.22,
    hard: 0.12,
    good: -0.03,
    easy: -0.08,
  };
  const nextEase = clamp(current.ease + easeDelta[rating], 1.3, 3.2);
  const nextDifficulty = clamp(current.difficulty + difficultyDelta[rating], 0, 1);
  const retentionFactor = retentionIntervalFactor(settings.targetRetention);

  let nextInterval: number;
  if (rating === 'again') {
    nextInterval = current.state === 'new' ? 0.04 : Math.max(0.04, current.interval * 0.25);
  } else if (rating === 'hard') {
    nextInterval = current.state === 'new' ? 1 : Math.max(1, current.interval * 1.2 * retentionFactor);
  } else if (rating === 'good') {
    nextInterval = current.state === 'new' ? 2 : Math.max(2, current.interval * nextEase * retentionFactor);
  } else {
    nextInterval = current.state === 'new' ? 4 : Math.max(4, current.interval * nextEase * 1.45 * retentionFactor);
  }

  const roundedInterval = Math.round(nextInterval * 10) / 10;

  return {
    dueDate: addDays(now, roundedInterval).toISOString(),
    interval: roundedInterval,
    ease: nextEase,
    difficulty: nextDifficulty,
    lastReviewed: now.toISOString(),
    retrievability: rating === 'again' ? 0.35 : rating === 'hard' ? 0.7 : rating === 'good' ? settings.targetRetention : 0.97,
    reps: current.reps + 1,
    lapses: current.lapses + (rating === 'again' ? 1 : 0),
    state: rating === 'again' ? 'learning' : 'review',
  };
}

export function flattenCards(lists: VocabList[]): Flashcard[] {
  const seen = new Set<string>();
  const cards: Flashcard[] = [];

  lists.forEach((list) => {
    list.words.forEach((card) => {
      if (seen.has(card.id)) return;
      seen.add(card.id);
      cards.push(card);
    });
  });

  return cards;
}

export function getDueCards(lists: VocabList[], settings: SrsSettings = DEFAULT_SRS_SETTINGS, now = new Date()) {
  const allCards = flattenCards(lists);
  const dueReview = allCards
    .filter((card) => {
      const schedule = getCardSrs(card);
      return schedule.state !== 'new' && isDue(card, now);
    })
    .sort((a, b) => new Date(getCardSrs(a).dueDate).getTime() - new Date(getCardSrs(b).dueDate).getTime())
    .slice(0, settings.reviewCardsPerDay);

  const newCards = allCards
    .filter((card) => getCardSrs(card).state === 'new')
    .slice(0, settings.newCardsPerDay);

  return {
    review: dueReview,
    new: newCards,
    queue: [...dueReview, ...newCards],
  };
}

export function getSrsSummary(lists: VocabList[], settings: SrsSettings = DEFAULT_SRS_SETTINGS, now = new Date()) {
  const allCards = flattenCards(lists);
  const due = getDueCards(lists, settings, now);
  const tomorrow = addDays(now, 1);
  const reviewCards = allCards.filter((card) => getCardSrs(card).state !== 'new');
  const weakCards = reviewCards.filter((card) => getRetrievability(getCardSrs(card), now) < settings.targetRetention);
  const dueTomorrow = reviewCards.filter((card) => {
    const dueTime = new Date(getCardSrs(card).dueDate).getTime();
    return dueTime > now.getTime() && dueTime <= tomorrow.getTime();
  });

  return {
    total: allCards.length,
    newCount: allCards.filter((card) => getCardSrs(card).state === 'new').length,
    learningCount: allCards.filter((card) => getCardSrs(card).state === 'learning').length,
    reviewCount: reviewCards.length,
    dueNew: due.new.length,
    dueReview: due.review.length,
    dueTotal: due.queue.length,
    dueTomorrow: dueTomorrow.length,
    weakCount: weakCards.length,
    estimatedDailyLoad: due.queue.length + dueTomorrow.length,
  };
}
