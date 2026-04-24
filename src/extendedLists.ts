import { Flashcard, VocabList, WordType } from './types';

type SeedCard = {
  term: string;
  tr: string;
  type: WordType;
  level: 'B2' | 'C1';
  example: string;
  exampleTr: string;
  note?: string;
  pattern?: string;
  natural?: string;
  formal?: string;
  intent?: string;
  synonyms?: string;
  collocations?: string;
};

function card(seed: SeedCard, index: number, prefix: string): Flashcard {
  const isPhraseLike = ['phrase', 'phrasalVerb', 'idiom', 'collocation'].includes(seed.type);

  return {
    id: `${prefix}_${index}`,
    term: seed.term,
    translationTr: seed.tr,
    wordType: seed.type,
    level: seed.level,
    example: seed.example,
    exampleTranslation: seed.exampleTr,
    note: [seed.note, seed.synonyms ? `Synonyms: ${seed.synonyms}` : '', seed.collocations ? `Collocations: ${seed.collocations}` : '']
      .filter(Boolean)
      .join('\n'),
    phraseForms: isPhraseLike
      ? {
          pattern: seed.pattern || seed.term,
          naturalVariant: seed.natural || '',
          formalVariant: seed.formal || '',
          usageIntent: seed.intent || '',
        }
      : undefined,
    verbForms:
      seed.type === 'verb' || seed.type === 'phrasalVerb'
        ? {
            baseForm: seed.term,
            usagePattern: seed.pattern || '',
          }
        : undefined,
    adjectiveForms:
      seed.type === 'adjective'
        ? {
            usage: seed.pattern || '',
          }
        : undefined,
  };
}

function mapCards(prefix: string, seeds: SeedCard[]): Flashcard[] {
  return seeds.map((seed, index) => card(seed, index, prefix));
}

const b2Vocabulary: SeedCard[] = [
  {
    term: 'substantial',
    tr: 'önemli, kayda değer, büyük miktarda',
    type: 'adjective',
    level: 'B2',
    pattern: 'a substantial increase / amount / difference',
    example: 'The new policy led to a substantial increase in applications.',
    exampleTr: 'Yeni politika başvurularda kayda değer bir artışa yol açtı.',
    synonyms: 'considerable, significant',
    collocations: 'substantial evidence, substantial progress',
  },
  {
    term: 'reluctant',
    tr: 'isteksiz, gönülsüz',
    type: 'adjective',
    level: 'B2',
    pattern: 'reluctant to do something',
    example: 'She was reluctant to commit to a deadline before seeing the full scope.',
    exampleTr: 'Tüm kapsamı görmeden teslim tarihine bağlanma konusunda isteksizdi.',
    synonyms: 'hesitant, unwilling',
  },
  {
    term: 'mitigate',
    tr: 'hafifletmek, azaltmak',
    type: 'verb',
    level: 'B2',
    pattern: 'mitigate a risk / impact / problem',
    example: 'We need a backup plan to mitigate the risk of delays.',
    exampleTr: 'Gecikme riskini azaltmak için bir yedek plana ihtiyacımız var.',
    synonyms: 'reduce, soften, alleviate',
  },
  {
    term: 'constraint',
    tr: 'kısıt, sınırlama',
    type: 'noun',
    level: 'B2',
    example: 'Budget constraints forced the team to simplify the launch plan.',
    exampleTr: 'Bütçe kısıtları ekibi lansman planını sadeleştirmeye zorladı.',
    collocations: 'time constraints, budget constraints, technical constraints',
  },
  {
    term: 'trade-off',
    tr: 'denge tercihi, bir şeyden vazgeçip diğerini seçme durumu',
    type: 'noun',
    level: 'B2',
    example: 'There is always a trade-off between speed and accuracy.',
    exampleTr: 'Hız ile doğruluk arasında her zaman bir denge tercihi vardır.',
    collocations: 'make a trade-off, an acceptable trade-off',
  },
  {
    term: 'to some extent',
    tr: 'bir ölçüde, kısmen',
    type: 'phrase',
    level: 'B2',
    intent: 'Fikrini yumuşatmak veya genellemeyi sınırlamak',
    example: 'I agree with the proposal to some extent, but the timeline is unrealistic.',
    exampleTr: 'Teklife bir ölçüde katılıyorum ama zaman planı gerçekçi değil.',
  },
];

const c1Vocabulary: SeedCard[] = [
  {
    term: 'nuanced',
    tr: 'nüanslı, ince ayrımları olan',
    type: 'adjective',
    level: 'C1',
    pattern: 'a nuanced view / argument / understanding',
    example: 'The article offers a nuanced view of remote work rather than a simple yes-or-no answer.',
    exampleTr: 'Makale uzaktan çalışma hakkında basit bir evet-hayır cevabı yerine nüanslı bir bakış sunuyor.',
    synonyms: 'subtle, refined',
  },
  {
    term: 'scrutinize',
    tr: 'dikkatle incelemek, mercek altına almak',
    type: 'verb',
    level: 'C1',
    pattern: 'scrutinize a claim / report / decision',
    example: 'The committee will scrutinize the report before approving the budget.',
    exampleTr: 'Komite bütçeyi onaylamadan önce raporu dikkatle inceleyecek.',
    synonyms: 'examine closely, inspect',
  },
  {
    term: 'shortcomings',
    tr: 'eksiklikler, kusurlar',
    type: 'noun',
    level: 'C1',
    example: 'The prototype works, but its shortcomings become clear under heavy use.',
    exampleTr: 'Prototip çalışıyor ama yoğun kullanımda eksiklikleri ortaya çıkıyor.',
    collocations: 'address shortcomings, serious shortcomings',
  },
  {
    term: 'counterproductive',
    tr: 'ters etki yaratan, amaca zarar veren',
    type: 'adjective',
    level: 'C1',
    example: 'Adding more meetings may be counterproductive if the team needs focus time.',
    exampleTr: 'Ekip odaklanma zamanına ihtiyaç duyuyorsa daha fazla toplantı eklemek ters etki yaratabilir.',
    synonyms: 'harmful, self-defeating',
  },
  {
    term: 'by and large',
    tr: 'genel olarak, büyük ölçüde',
    type: 'phrase',
    level: 'C1',
    intent: 'Genel değerlendirme yapmak',
    example: 'By and large, the migration went smoothly.',
    exampleTr: 'Genel olarak geçiş sorunsuz ilerledi.',
  },
  {
    term: 'arguably',
    tr: 'denebilir ki, tartışmalı olsa da muhtemelen',
    type: 'adverb',
    level: 'C1',
    example: 'This is arguably the most important decision we have made this year.',
    exampleTr: 'Bu, denebilir ki bu yıl aldığımız en önemli karar.',
    note: 'Kesin iddia yerine güçlü ama tartışmaya açık bir iddia kurar.',
  },
];

const phrasalVerbs: SeedCard[] = [
  {
    term: 'bring up',
    tr: 'konuyu açmak, gündeme getirmek',
    type: 'phrasalVerb',
    level: 'B2',
    pattern: 'bring up an issue / point / concern',
    example: 'I did not want to bring up the budget issue during the client call.',
    exampleTr: 'Müşteri görüşmesinde bütçe konusunu gündeme getirmek istemedim.',
    natural: 'mention',
  },
  {
    term: 'figure out',
    tr: 'çözmek, anlamak',
    type: 'phrasalVerb',
    level: 'B2',
    pattern: 'figure out how / why / what',
    example: 'We need to figure out why users drop off after onboarding.',
    exampleTr: 'Kullanıcıların onboarding sonrası neden ayrıldığını anlamamız gerekiyor.',
    formal: 'determine',
  },
  {
    term: 'phase out',
    tr: 'kademeli olarak kullanımdan kaldırmak',
    type: 'phrasalVerb',
    level: 'C1',
    pattern: 'phase out a system / product / practice',
    example: 'The company plans to phase out the old dashboard by September.',
    exampleTr: 'Şirket eski paneli eylül ayına kadar kademeli olarak kaldırmayı planlıyor.',
  },
  {
    term: 'push back on',
    tr: 'itiraz etmek, karşı çıkmak',
    type: 'phrasalVerb',
    level: 'C1',
    pattern: 'push back on a proposal / assumption / deadline',
    example: 'The engineers pushed back on the deadline because the scope had changed.',
    exampleTr: 'Mühendisler kapsam değiştiği için teslim tarihine itiraz etti.',
  },
];

const idioms: SeedCard[] = [
  {
    term: 'a blessing in disguise',
    tr: 'ilk başta kötü görünüp sonradan iyi sonuç veren şey',
    type: 'idiom',
    level: 'B2',
    example: 'Losing that client was a blessing in disguise; it gave us time to fix the product.',
    exampleTr: 'O müşteriyi kaybetmek sonradan iyiye döndü; ürünü düzeltmek için bize zaman verdi.',
  },
  {
    term: 'the tip of the iceberg',
    tr: 'buzdağının görünen kısmı',
    type: 'idiom',
    level: 'B2',
    example: 'The reported bugs are just the tip of the iceberg.',
    exampleTr: 'Raporlanan hatalar buzdağının sadece görünen kısmı.',
  },
  {
    term: 'move the needle',
    tr: 'gerçek bir fark yaratmak',
    type: 'idiom',
    level: 'C1',
    example: 'Changing the button color will not move the needle; we need to improve activation.',
    exampleTr: 'Buton rengini değiştirmek gerçek fark yaratmaz; aktivasyonu iyileştirmemiz gerekiyor.',
  },
  {
    term: 'read between the lines',
    tr: 'satır aralarını okumak, ima edileni anlamak',
    type: 'idiom',
    level: 'C1',
    example: 'If you read between the lines, the message is that the project is at risk.',
    exampleTr: 'Satır aralarını okursan mesaj şu: proje risk altında.',
  },
];

const collocations: SeedCard[] = [
  {
    term: 'raise awareness',
    tr: 'farkındalık yaratmak',
    type: 'collocation',
    level: 'B2',
    example: 'The campaign aims to raise awareness about data privacy.',
    exampleTr: 'Kampanya veri gizliliği konusunda farkındalık yaratmayı amaçlıyor.',
  },
  {
    term: 'draw a distinction',
    tr: 'ayrım yapmak',
    type: 'collocation',
    level: 'C1',
    example: 'It is important to draw a distinction between correlation and causation.',
    exampleTr: 'Korelasyon ile nedensellik arasında ayrım yapmak önemlidir.',
  },
  {
    term: 'pose a challenge',
    tr: 'zorluk teşkil etmek',
    type: 'collocation',
    level: 'B2',
    example: 'Limited data poses a challenge for accurate forecasting.',
    exampleTr: 'Sınırlı veri doğru tahminleme için zorluk teşkil eder.',
  },
  {
    term: 'reach a consensus',
    tr: 'uzlaşmaya varmak',
    type: 'collocation',
    level: 'C1',
    example: 'After a long discussion, the team reached a consensus.',
    exampleTr: 'Uzun bir tartışmadan sonra ekip uzlaşmaya vardı.',
  },
];

const speakingPatterns: SeedCard[] = [
  {
    term: 'What I am trying to say is...',
    tr: 'Söylemeye çalıştığım şey şu...',
    type: 'phrase',
    level: 'B2',
    intent: 'Kendini açıklamak veya cümleyi toparlamak',
    example: 'What I am trying to say is that we should test the idea before scaling it.',
    exampleTr: 'Söylemeye çalıştığım şey şu: fikri büyütmeden önce test etmeliyiz.',
    natural: 'I mean...',
  },
  {
    term: 'That being said,...',
    tr: 'Bununla birlikte..., yine de...',
    type: 'phrase',
    level: 'B2',
    intent: 'Önceki fikri dengelemek',
    example: 'The product is promising. That being said, the onboarding still needs work.',
    exampleTr: 'Ürün umut verici. Bununla birlikte onboarding hâlâ çalışılmalı.',
    formal: 'Nevertheless,...',
  },
  {
    term: 'I would frame it slightly differently.',
    tr: 'Bunu biraz farklı çerçevelendirirdim.',
    type: 'phrase',
    level: 'C1',
    intent: 'Nazikçe karşı çıkmak veya bakış açısını değiştirmek',
    example: 'I would frame it slightly differently: the issue is not speed, but clarity.',
    exampleTr: 'Bunu biraz farklı çerçevelendirirdim: sorun hız değil, netlik.',
  },
  {
    term: 'Could you elaborate on that?',
    tr: 'Bunu biraz açabilir misin?',
    type: 'phrase',
    level: 'B2',
    intent: 'Daha fazla açıklama istemek',
    example: 'Could you elaborate on that? I want to understand the reasoning behind the decision.',
    exampleTr: 'Bunu biraz açabilir misin? Kararın arkasındaki mantığı anlamak istiyorum.',
  },
  {
    term: 'I see where you are coming from, but...',
    tr: 'Ne demek istediğini anlıyorum ama...',
    type: 'phrase',
    level: 'C1',
    intent: 'Karşı tarafı kabul ederek itiraz etmek',
    example: 'I see where you are coming from, but I do not think the data supports that conclusion.',
    exampleTr: 'Ne demek istediğini anlıyorum ama verinin bu sonucu desteklediğini düşünmüyorum.',
  },
];

export const LIST_B2_VOCAB: VocabList = {
  id: 'b2-core-vocabulary',
  title: 'B2 Core Vocabulary',
  isDefault: true,
  words: mapCards('b2_vocab', b2Vocabulary),
};

export const LIST_C1_VOCAB: VocabList = {
  id: 'c1-advanced-vocabulary',
  title: 'C1 Advanced Vocabulary',
  isDefault: true,
  words: mapCards('c1_vocab', c1Vocabulary),
};

export const LIST_PHRASAL_VERBS: VocabList = {
  id: 'phrasal-verbs',
  title: 'Phrasal Verbs',
  isDefault: true,
  words: mapCards('phrasal', phrasalVerbs),
};

export const LIST_IDIOMS: VocabList = {
  id: 'idioms-natural-english',
  title: 'Idioms & Natural English',
  isDefault: true,
  words: mapCards('idiom', idioms),
};

export const LIST_COLLOCATIONS: VocabList = {
  id: 'collocations',
  title: 'Collocations',
  isDefault: true,
  words: mapCards('collocation', collocations),
};

export const LIST_SPEAKING_PATTERNS: VocabList = {
  id: 'speaking-patterns',
  title: 'Speaking Patterns',
  isDefault: true,
  words: mapCards('speaking', speakingPatterns),
};

export const LIST_MY_NEW_WORDS: VocabList = {
  id: 'my-new-words',
  title: 'My New Words',
  isDefault: true,
  words: [],
};
