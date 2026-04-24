export type WordType =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'phrase'
  | 'phrasalVerb'
  | 'idiom'
  | 'collocation'
  | 'other';

export type StudyDirection = 'EN_TO_TR' | 'TR_TO_EN';

export type CardKind =
  | 'meaning'
  | 'production'
  | 'collocation'
  | 'register'
  | 'sentenceTransformation'
  | 'speakingFunction'
  | 'errorCorrection'
  | 'pronunciation';

export type SrsRating = 'again' | 'hard' | 'good' | 'easy';

export type SrsState = 'new' | 'learning' | 'review';

export type SrsSchedule = {
  dueDate: string;
  interval: number;
  ease: number;
  difficulty: number;
  lastReviewed?: string;
  retrievability: number;
  reps: number;
  lapses: number;
  state: SrsState;
};

export type UsageResource = {
  label: string;
  url: string;
};

export type Flashcard = {
  id: string;
  term: string;
  translationEn?: string;
  translationTr?: string;
  translation?: string; // Fallback
  
  level?: string;
  example?: string;
  exampleTranslation?: string;
  note?: string;

  wordType?: WordType;
  cardKind?: CardKind;
  prompt?: string;
  answer?: string;
  distractors?: string[];
  register?: 'informal' | 'neutral' | 'formal';
  sourceTags?: string[];
  usageLinks?: UsageResource[];
  pronunciationVariant?: 'us' | 'uk';
  userPronunciationUrl?: string;
  srs?: SrsSchedule;
  
  // Legacy German noun fields. Kept so old backups can still be imported safely.
  article?: string;
  plural?: string;
  
  // English verb / phrase detail fields
  verbForms?: {
    baseForm?: string;
    thirdPerson?: string;
    pastSimple?: string;
    pastParticiple?: string;
    gerund?: string;
    auxiliary?: string;
    present?: string;
    conjugation?: string;
    preterite?: string;
    participle?: string;
    imperative?: string;
    usagePattern?: string;
  };
  
  // Adjective
  adjectiveForms?: {
    comparative?: string;
    superlative?: string;
    usage?: string;
  };

  // Phrase
  phraseForms?: {
    pattern?: string;
    naturalVariant?: string;
    formalVariant?: string;
    usageIntent?: string;
    redemittel?: string;
    alltagssprache?: string;
  };

  imageUrl?: string;
};

export type VocabList = {
  id: string;
  title: string;
  isDefault?: boolean;
  words: Flashcard[];
};

export type WordStats = {
  correct: number;
  incorrect: number;
};

export type SrsSettings = {
  targetRetention: number;
  newCardsPerDay: number;
  reviewCardsPerDay: number;
};

export type AppState = {
  lists: VocabList[];
  stats: Record<string, WordStats>;
  srsSettings?: SrsSettings;
  studyDirection?: StudyDirection;
  aiModel?: 'gemini-3.1-flash-image-preview' | 'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview';
  browserApiKey?: string;
  installHintDismissed?: boolean;
};

export type GrammarLevel = 'B2' | 'C1';

export type GrammarSectionId =
  | 'advanced-grammar'
  | 'speaking-functions'
  | 'sentence-building'
  | 'precision-style'
  | 'error-patterns';

export type GrammarSource = {
  id: string;
  title: string;
  url: string;
  provider: string;
};

export type GrammarTopicExample = {
  en: string;
  de?: string;
  tr: string;
};

export type GrammarTopic = {
  id: string;
  chapter: number;
  sectionId: GrammarSectionId;
  title: string;
  titleTr: string;
  levels: GrammarLevel[];
  summary: string;
  pattern?: string;
  highlights: string[];
  examples: GrammarTopicExample[];
  pitfalls: string[];
};

export type GrammarSection = {
  id: GrammarSectionId;
  title: string;
  titleTr: string;
  color: string;
  accentClassName: string;
  summary: string;
  sourceIds: string[];
};
