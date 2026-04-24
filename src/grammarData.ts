import { GrammarSection, GrammarSectionId, GrammarSource, GrammarTopic } from './types';

export const GRAMMAR_SOURCES: GrammarSource[] = [
  {
    id: 'cambridge-b2',
    title: 'B2 Grammar Reference',
    provider: 'Cambridge English',
    url: 'https://www.cambridgeenglish.org/learning-english/activities-for-learners/?skill=grammar&level=independent',
  },
  {
    id: 'cambridge-c1',
    title: 'C1 Grammar Reference',
    provider: 'Cambridge English',
    url: 'https://www.cambridgeenglish.org/learning-english/activities-for-learners/?skill=grammar&level=proficient',
  },
  {
    id: 'british-council',
    title: 'Grammar: B2-C1',
    provider: 'British Council',
    url: 'https://learnenglish.britishcouncil.org/grammar',
  },
];

export const GRAMMAR_SECTIONS: GrammarSection[] = [
  {
    id: 'advanced-grammar',
    title: 'Advanced Grammar',
    titleTr: 'İleri gramer yapıları',
    color: 'indigo',
    accentClassName: 'indigo',
    summary: 'B2-C1 seviyesinde anlamı incelten, koşul, vurgu, varsayım ve resmiyet taşıyan yapılar.',
    sourceIds: ['cambridge-b2', 'cambridge-c1', 'british-council'],
  },
  {
    id: 'speaking-functions',
    title: 'Speaking Functions',
    titleTr: 'Konuşma işlevleri',
    color: 'teal',
    accentClassName: 'teal',
    summary: 'Fikir belirtme, katılma, itiraz etme, açıklama isteme ve konuşmayı doğal biçimde yönlendirme kalıpları.',
    sourceIds: ['cambridge-b2', 'british-council'],
  },
  {
    id: 'sentence-building',
    title: 'Sentence Building',
    titleTr: 'Cümle kurma ve bağlama',
    color: 'amber',
    accentClassName: 'amber',
    summary: 'Uzun cümleleri okunur tutmak, fikirleri bağlamak ve akıcı paragraf üretmek için yapılar.',
    sourceIds: ['cambridge-c1', 'british-council'],
  },
  {
    id: 'precision-style',
    title: 'Precision & Style',
    titleTr: 'Kesinlik, üslup ve ton',
    color: 'rose',
    accentClassName: 'rose',
    summary: 'Hedging, register, nominalization ve daha profesyonel ifade kurma becerileri.',
    sourceIds: ['cambridge-c1'],
  },
  {
    id: 'error-patterns',
    title: 'Error Patterns',
    titleTr: 'Türkçe konuşanlar için sık hatalar',
    color: 'emerald',
    accentClassName: 'emerald',
    summary: 'Türkçeden İngilizceye aktarım sırasında sık görülen article, preposition, tense ve kelime dizimi hataları.',
    sourceIds: ['british-council'],
  },
];

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: 'mixed-conditionals',
    chapter: 1,
    sectionId: 'advanced-grammar',
    title: 'Mixed Conditionals',
    titleTr: 'Karışık koşul cümleleri',
    levels: ['B2', 'C1'],
    summary:
      'Mixed conditional yapıları geçmişteki bir durumun bugünkü sonucunu ya da bugünkü bir özelliğin geçmişteki sonucu nasıl etkilediğini anlatır.',
    pattern: 'If + past perfect, would + base verb\nIf + past simple, would have + past participle',
    highlights: [
      'Zamanlar gerçek zamandan çok varsayımsal ilişkiyi gösterir.',
      'B2 seviyesinde anlamı çözmek, C1 seviyesinde doğal üretmek hedeflenir.',
    ],
    examples: [
      {
        en: 'If I had saved the file, I would not be rewriting it now.',
        tr: 'Dosyayı kaydetmiş olsaydım, şimdi yeniden yazıyor olmazdım.',
      },
      {
        en: 'If she were more careful, she would not have missed that detail.',
        tr: 'Daha dikkatli biri olsaydı, o detayı kaçırmazdı.',
      },
    ],
    pitfalls: [
      'Türkçedeki tek bir şart kipi İngilizcede farklı zaman kombinasyonlarına ayrılır.',
      'Would ifadesini if tarafında gereksiz kullanmak yaygın bir hatadır.',
    ],
  },
  {
    id: 'inversion-for-emphasis',
    chapter: 2,
    sectionId: 'advanced-grammar',
    title: 'Inversion for Emphasis',
    titleTr: 'Vurgu için devrik yapı',
    levels: ['C1'],
    summary:
      'Negative veya limiting ifadeler cümlenin başına geldiğinde yardımcı fiil öznenin önüne geçer. Bu yapı özellikle yazılı ve resmi İngilizcede güçlü vurgu sağlar.',
    pattern: 'Never / Rarely / Not only / Under no circumstances + auxiliary + subject + verb',
    highlights: ['C1 yazı ve sunum dilinde argümanı daha güçlü gösterebilir.', 'Yapı doğal ama fazla kullanılırsa dramatik durur.'],
    examples: [
      {
        en: 'Rarely have we seen such a clear improvement in user retention.',
        tr: 'Kullanıcı tutmada bu kadar net bir iyileşmeyi nadiren gördük.',
      },
      {
        en: 'Not only did the update fix the bug, but it also improved performance.',
        tr: 'Güncelleme sadece hatayı düzeltmekle kalmadı, performansı da iyileştirdi.',
      },
    ],
    pitfalls: ['Yardımcı fiili unutmak cümleyi bozar.', 'Gündelik konuşmada daha basit yapı çoğu zaman daha doğaldır.'],
  },
  {
    id: 'hedging',
    chapter: 3,
    sectionId: 'precision-style',
    title: 'Hedging',
    titleTr: 'İddianı yumuşatma ve akademik ton',
    levels: ['B2', 'C1'],
    summary:
      'Hedging, kesin konuşmak yerine olasılık ve sınırlılık belirtmeni sağlar. Akademik, profesyonel ve diplomatik İngilizcede çok önemlidir.',
    pattern: 'It seems that...\nThis may suggest that...\nIt is likely to...\nArguably,...',
    highlights: [
      'Kesin bilgi yoksa iddiayı yumuşatır.',
      'Konuşmada daha nazik ve işbirlikçi bir ton yaratır.',
    ],
    examples: [
      {
        en: 'This may suggest that users need more guidance during onboarding.',
        tr: 'Bu, kullanıcıların onboarding sırasında daha fazla yönlendirmeye ihtiyaç duyduğunu gösterebilir.',
      },
      {
        en: 'Arguably, the main issue is not price but trust.',
        tr: 'Denebilir ki ana sorun fiyat değil, güven.',
      },
    ],
    pitfalls: ['Her cümleyi yumuşatmak kararsız görünmene neden olabilir.', 'Maybe her bağlamda yeterince profesyonel değildir.'],
  },
  {
    id: 'participle-clauses',
    chapter: 4,
    sectionId: 'sentence-building',
    title: 'Participle Clauses',
    titleTr: 'Participle clause ile cümle kısaltma',
    levels: ['C1'],
    summary:
      'Participle clause, özellikle yazılı İngilizcede bilgiyi daha sıkı ve akıcı vermek için kullanılır. Aynı özneye bağlı ek bilgileri sadeleştirir.',
    pattern: 'Having + past participle, ...\nVerb-ing, ...\nPast participle, ...',
    highlights: ['Cümleyi daha C1 seviyesinde ve kompakt hale getirir.', 'Özne ilişkisi net değilse anlam bulanıklaşır.'],
    examples: [
      {
        en: 'Having reviewed the data, we decided to postpone the launch.',
        tr: 'Veriyi inceledikten sonra lansmanı ertelemeye karar verdik.',
      },
      {
        en: 'Designed for beginners, the course still includes advanced examples.',
        tr: 'Yeni başlayanlar için tasarlanmış olsa da kurs ileri örnekler de içerir.',
      },
    ],
    pitfalls: ['Dangling participle hatasına dikkat et: eylemi yapan özne net olmalı.'],
  },
  {
    id: 'disagreeing-politely',
    chapter: 5,
    sectionId: 'speaking-functions',
    title: 'Disagreeing Politely',
    titleTr: 'Nazikçe karşı çıkma',
    levels: ['B2', 'C1'],
    summary:
      'B2-C1 konuşmada hedef sadece doğru cümle değil, doğru tonla itiraz etmektir. Önce karşı tarafı anladığını gösterip sonra kendi pozisyonunu kurmak daha doğal duyulur.',
    pattern: 'I see your point, but...\nI would frame it slightly differently.\nI am not entirely convinced that...',
    highlights: ['But öncesindeki kabul cümlesi tonu yumuşatır.', 'C1 seviyesinde direkt itiraz yerine çerçeve değiştirme çok işe yarar.'],
    examples: [
      {
        en: 'I see your point, but I am not entirely convinced that this solves the root problem.',
        tr: 'Ne demek istediğini anlıyorum ama bunun kök problemi çözdüğüne tam ikna olmadım.',
      },
      {
        en: 'I would frame it slightly differently: the problem is clarity, not motivation.',
        tr: 'Bunu biraz farklı çerçevelendirirdim: sorun motivasyon değil, netlik.',
      },
    ],
    pitfalls: ['You are wrong gibi doğrudan ifadeler profesyonel bağlamda gereksiz sert olabilir.'],
  },
  {
    id: 'article-errors',
    chapter: 6,
    sectionId: 'error-patterns',
    title: 'Articles in Abstract Contexts',
    titleTr: 'Soyut bağlamlarda article kullanımı',
    levels: ['B2', 'C1'],
    summary:
      'Türkçede article olmadığı için İngilizcede a, the veya sıfır article seçimi sık hata üretir. B2-C1 seviyesinde özellikle soyut isimlerde bağlam belirleyicidir.',
    pattern: 'a solution / the solution / solutions\ntrust / the trust between teams',
    highlights: ['İlk kez tanıtılan tekil sayılabilir isim çoğunlukla a/an ister.', 'Genel soyut kavramlarda çoğu zaman article kullanılmaz.'],
    examples: [
      {
        en: 'We need a solution that works for small teams.',
        tr: 'Küçük ekipler için işe yarayan bir çözüme ihtiyacımız var.',
      },
      {
        en: 'Trust is difficult to build and easy to lose.',
        tr: 'Güven inşa etmesi zor, kaybetmesi kolay bir şeydir.',
      },
    ],
    pitfalls: ['Problem, solution, idea gibi tekil sayılabilir isimleri articlesız bırakmak yaygındır.'],
  },
];

export function getGrammarSection(sectionId: GrammarSectionId): GrammarSection | undefined {
  return GRAMMAR_SECTIONS.find((section) => section.id === sectionId);
}

export function getGrammarSources(sourceIds: string[]): GrammarSource[] {
  return sourceIds
    .map((sourceId) => GRAMMAR_SOURCES.find((source) => source.id === sourceId))
    .filter((source): source is GrammarSource => Boolean(source));
}

export function getGrammarTopicsBySection(sectionId: GrammarSectionId): GrammarTopic[] {
  return GRAMMAR_TOPICS.filter((topic) => topic.sectionId === sectionId);
}
