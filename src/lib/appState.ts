import { AppState, Flashcard, VocabList, WordStats } from '../types';
import { DEFAULT_SRS_SETTINGS, getInitialSrsSchedule } from './srs';
import {
  LIST_B2_VOCAB,
  LIST_C1_VOCAB,
  LIST_COLLOCATIONS,
  LIST_COMMON_VERBS,
  LIST_IDIOMS,
  LIST_MY_NEW_WORDS,
  LIST_PHRASAL_VERBS,
  LIST_SPEAKING_PATTERNS,
} from '../extendedLists';

const DEFAULT_DIRECTION: AppState['studyDirection'] = 'EN_TO_TR';
const DEFAULT_AI_MODEL: NonNullable<AppState['aiModel']> = 'gemini-3.1-flash-image-preview';

const ALL_DEFAULT_LISTS: VocabList[] = [
  LIST_COMMON_VERBS,
  LIST_B2_VOCAB,
  LIST_C1_VOCAB,
  LIST_PHRASAL_VERBS,
  LIST_IDIOMS,
  LIST_COLLOCATIONS,
  LIST_SPEAKING_PATTERNS,
  LIST_MY_NEW_WORDS,
];

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createDefaultLists(): VocabList[] {
  return cloneValue(ALL_DEFAULT_LISTS);
}

export function createDefaultAppState(): AppState {
  return {
    lists: createDefaultLists(),
    stats: {},
    srsSettings: DEFAULT_SRS_SETTINGS,
    studyDirection: DEFAULT_DIRECTION,
    aiModel: DEFAULT_AI_MODEL,
    browserApiKey: '',
    installHintDismissed: false,
  };
}

function migrateWord(rawWord: unknown): Flashcard {
  const word = (rawWord ?? {}) as Record<string, unknown>;
  const rawSrs = typeof word.srs === 'object' && word.srs !== null ? (word.srs as Record<string, unknown>) : null;
  const rawUsageLinks = Array.isArray(word.usageLinks) ? word.usageLinks : [];
  const rawSourceTags = Array.isArray(word.sourceTags) ? word.sourceTags : [];

  return {
    ...word,
    id: String(word.id ?? crypto.randomUUID()),
    term: String(word.term || word.german || ''),
    translationEn: typeof word.translationEn === 'string' ? word.translationEn : undefined,
    translationTr: String(word.translationTr || word.turkish || word.translation || ''),
    translation: typeof word.translation === 'string' ? word.translation : undefined,
    example: String(word.example || word.exampleGerman || ''),
    exampleTranslation: String(word.exampleTranslation || word.exampleTurkish || ''),
    note: typeof word.note === 'string' ? word.note : undefined,
    wordType: typeof word.wordType === 'string' ? (word.wordType as Flashcard['wordType']) : undefined,
    cardKind: typeof word.cardKind === 'string' ? (word.cardKind as Flashcard['cardKind']) : undefined,
    prompt: typeof word.prompt === 'string' ? word.prompt : undefined,
    answer: typeof word.answer === 'string' ? word.answer : undefined,
    distractors: Array.isArray(word.distractors) ? word.distractors.map(String) : undefined,
    register:
      word.register === 'informal' || word.register === 'neutral' || word.register === 'formal'
        ? word.register
        : undefined,
    sourceTags: rawSourceTags.map(String),
    usageLinks: rawUsageLinks
      .map((link) => {
        const item = (link ?? {}) as Record<string, unknown>;
        return typeof item.label === 'string' && typeof item.url === 'string'
          ? { label: item.label, url: item.url }
          : null;
      })
      .filter((link): link is NonNullable<Flashcard['usageLinks']>[number] => link !== null),
    pronunciationVariant: word.pronunciationVariant === 'uk' ? 'uk' : word.pronunciationVariant === 'us' ? 'us' : undefined,
    userPronunciationUrl: typeof word.userPronunciationUrl === 'string' ? word.userPronunciationUrl : undefined,
    srs: rawSrs
      ? {
          ...getInitialSrsSchedule(),
          dueDate: typeof rawSrs.dueDate === 'string' ? rawSrs.dueDate : new Date().toISOString(),
          interval: Number(rawSrs.interval ?? 0),
          ease: Number(rawSrs.ease ?? 2.5),
          difficulty: Number(rawSrs.difficulty ?? 0.3),
          lastReviewed: typeof rawSrs.lastReviewed === 'string' ? rawSrs.lastReviewed : undefined,
          retrievability: Number(rawSrs.retrievability ?? 1),
          reps: Number(rawSrs.reps ?? 0),
          lapses: Number(rawSrs.lapses ?? 0),
          state: rawSrs.state === 'learning' || rawSrs.state === 'review' ? rawSrs.state : 'new',
        }
      : undefined,
    article: typeof word.article === 'string' ? word.article : undefined,
    plural: typeof word.plural === 'string' ? word.plural : undefined,
    level: typeof word.level === 'string' ? word.level : undefined,
    verbForms:
      typeof word.verbForms === 'object' && word.verbForms !== null
        ? (word.verbForms as Flashcard['verbForms'])
        : word.wordType === 'verb'
          ? {
              thirdPerson: String(word.verbThirdPerson || ''),
              pastSimple: String(word.verbPastSimple || word.verbPrateritum || ''),
              pastParticiple: String(word.verbPastParticiple || word.verbPerfekt || ''),
              usagePattern: String(word.verbPattern || ''),
            }
          : undefined,
    adjectiveForms:
      typeof word.adjectiveForms === 'object' && word.adjectiveForms !== null
        ? (word.adjectiveForms as Flashcard['adjectiveForms'])
        : word.wordType === 'adjective'
          ? {
              comparative: String(word.adjComparative || ''),
              superlative: String(word.adjSuperlative || ''),
            }
          : undefined,
    phraseForms:
      typeof word.phraseForms === 'object' && word.phraseForms !== null
        ? (word.phraseForms as Flashcard['phraseForms'])
        : undefined,
    imageUrl: typeof word.imageUrl === 'string' ? word.imageUrl : undefined,
  };
}

function migrateList(rawList: unknown): VocabList | null {
  const list = (rawList ?? {}) as Record<string, unknown>;
  const words = Array.isArray(list.words) ? list.words.map(migrateWord) : [];

  if (!list.id || !list.title) {
    return null;
  }

  return {
    id: String(list.id),
    title: String(list.title),
    isDefault: Boolean(list.isDefault),
    words,
  };
}

function migrateStats(rawStats: unknown): Record<string, WordStats> {
  if (!rawStats || typeof rawStats !== 'object') {
    return {};
  }

  return Object.fromEntries(
    Object.entries(rawStats as Record<string, unknown>).map(([wordId, value]) => {
      const stats = (value ?? {}) as Record<string, unknown>;
      return [
        wordId,
        {
          correct: Number(stats.correct ?? 0),
          incorrect: Number(stats.incorrect ?? 0),
        },
      ];
    }),
  );
}

export function migrateAppState(rawState: unknown): AppState {
  const base = createDefaultAppState();
  const parsed = (rawState ?? {}) as Record<string, unknown>;
  const incomingLists = Array.isArray(parsed.lists) ? parsed.lists : [];

  const migratedLists = incomingLists
    .map(migrateList)
    .filter((list): list is VocabList => list !== null)
    .filter((list) => list.id !== 'default' && list.id !== 'phrases-daily');

  const latestDefaultLists = createDefaultLists();

  latestDefaultLists.forEach((defaultList) => {
    const existingIndex = migratedLists.findIndex((list) => list.id === defaultList.id);
    if (existingIndex === -1) {
      migratedLists.push(defaultList);
      return;
    }

    migratedLists[existingIndex] = defaultList;
  });

  const studyDirection =
    parsed.studyDirection === 'TR_TO_EN' || parsed.studyDirection === 'EN_TO_TR'
      ? parsed.studyDirection
      : parsed.studyDirection === 'TR_TO_DE'
        ? 'TR_TO_EN'
        : parsed.studyDirection === 'DE_TO_TR'
          ? 'EN_TO_TR'
          : base.studyDirection;

  const aiModel =
    parsed.aiModel === 'gemini-3.1-flash-image-preview' ||
    parsed.aiModel === 'gemini-2.5-flash-image' ||
    parsed.aiModel === 'gemini-3-pro-image-preview'
      ? parsed.aiModel
      : base.aiModel;
  const rawSrsSettings =
    typeof parsed.srsSettings === 'object' && parsed.srsSettings !== null
      ? (parsed.srsSettings as Record<string, unknown>)
      : {};

  return {
    lists: migratedLists,
    stats: migrateStats(parsed.stats),
    srsSettings: {
      targetRetention: Number(rawSrsSettings.targetRetention ?? base.srsSettings?.targetRetention ?? DEFAULT_SRS_SETTINGS.targetRetention),
      newCardsPerDay: Number(rawSrsSettings.newCardsPerDay ?? base.srsSettings?.newCardsPerDay ?? DEFAULT_SRS_SETTINGS.newCardsPerDay),
      reviewCardsPerDay: Number(rawSrsSettings.reviewCardsPerDay ?? base.srsSettings?.reviewCardsPerDay ?? DEFAULT_SRS_SETTINGS.reviewCardsPerDay),
    },
    studyDirection,
    aiModel,
    browserApiKey: typeof parsed.browserApiKey === 'string' ? parsed.browserApiKey : base.browserApiKey,
    installHintDismissed: Boolean(parsed.installHintDismissed),
  };
}
