import { Flashcard } from './types';

const COMMON_VERB_ROWS = `
be|olmak
have|sahip olmak
do|yapmak
say|söylemek
go|gitmek
get|almak, edinmek
make|yapmak, üretmek
know|bilmek
think|düşünmek
take|almak
see|görmek
come|gelmek
want|istemek
look|bakmak, görünmek
use|kullanmak
find|bulmak
give|vermek
tell|anlatmak, söylemek
work|çalışmak
call|aramak, çağırmak
try|denemek
ask|sormak, istemek
need|ihtiyaç duymak
feel|hissetmek
become|olmak, dönüşmek
leave|ayrılmak, bırakmak
put|koymak
mean|anlamına gelmek
keep|tutmak, sürdürmek
let|izin vermek
begin|başlamak
seem|görünmek
help|yardım etmek
talk|konuşmak
turn|dönmek, çevirmek
start|başlamak
show|göstermek
hear|duymak
play|oynamak
run|koşmak, işletmek
move|hareket etmek
like|beğenmek, hoşlanmak
live|yaşamak
believe|inanmak
hold|tutmak
bring|getirmek
happen|olmak, meydana gelmek
write|yazmak
provide|sağlamak
sit|oturmak
stand|ayakta durmak
lose|kaybetmek
pay|ödemek
meet|tanışmak, buluşmak
include|içermek
continue|devam etmek
set|ayarlamak, koymak
learn|öğrenmek
change|değiştirmek
lead|öncülük etmek, yol açmak
understand|anlamak
watch|izlemek
follow|takip etmek
stop|durmak, durdurmak
create|yaratmak, oluşturmak
speak|konuşmak
read|okumak
allow|izin vermek
add|eklemek
spend|harcamak, geçirmek
grow|büyümek
open|açmak
walk|yürümek
win|kazanmak
offer|teklif etmek, sunmak
remember|hatırlamak
love|sevmek
consider|düşünmek, değerlendirmek
appear|ortaya çıkmak, görünmek
buy|satın almak
wait|beklemek
serve|hizmet etmek, sunmak
die|ölmek
send|göndermek
expect|beklemek, ummak
build|inşa etmek
stay|kalmak
fall|düşmek
cut|kesmek
reach|ulaşmak
kill|öldürmek
remain|kalmak
suggest|önermek
raise|yükseltmek, artırmak
pass|geçmek, geçirmek
sell|satmak
require|gerektirmek
report|rapor etmek
decide|karar vermek
pull|çekmek
return|geri dönmek, iade etmek
explain|açıklamak
hope|ummak
develop|geliştirmek, gelişmek
carry|taşımak
break|kırmak, bozmak
receive|almak
agree|katılmak, anlaşmak
support|desteklemek
hit|vurmak
produce|üretmek
eat|yemek
cover|örtmek, kapsamak
catch|yakalamak
draw|çizmek, çekmek
choose|seçmek
cause|sebep olmak
point|işaret etmek
listen|dinlemek
realize|farkına varmak
place|yerleştirmek
close|kapatmak
involve|içermek, dahil etmek
increase|artırmak, artmak
reduce|azaltmak
save|kurtarmak, kaydetmek
protect|korumak
identify|tanımlamak, belirlemek
manage|yönetmek, başarmak
thank|teşekkür etmek
compare|karşılaştırmak
announce|duyurmak
obtain|elde etmek
note|not etmek, belirtmek
forget|unutmak
indicate|göstermek, belirtmek
wonder|merak etmek
maintain|sürdürmek, bakımını yapmak
publish|yayınlamak
suffer|acı çekmek, uğramak
avoid|kaçınmak
express|ifade etmek
suppose|varsaymak
finish|bitirmek
determine|belirlemek
design|tasarlamak
tend|eğiliminde olmak
treat|muamele etmek, tedavi etmek
control|kontrol etmek
share|paylaşmak
remove|kaldırmak
throw|atmak, fırlatmak
visit|ziyaret etmek
exist|var olmak
encourage|teşvik etmek
force|zorlamak
reflect|yansıtmak
admit|kabul etmek, itiraf etmek
assume|varsaymak
smile|gülümsemek
prepare|hazırlamak
replace|yerine koymak
fill|doldurmak
improve|iyileştirmek
mention|bahsetmek
fight|kavga etmek, mücadele etmek
intend|niyet etmek
miss|kaçırmak, özlemek
discover|keşfetmek
drop|düşürmek, düşmek
push|itmek
prevent|önlemek
refuse|reddetmek
regard|saymak, değerlendirmek
lay|sermek, koymak
reveal|ortaya çıkarmak
teach|öğretmek
answer|cevaplamak
operate|işletmek, çalıştırmak
state|belirtmek
depend|bağlı olmak
enable|olanak sağlamak
record|kaydetmek
check|kontrol etmek
complete|tamamlamak
cost|mal olmak
sound|ses çıkarmak, görünmek
laugh|gülmek
realise|farkına varmak
extend|uzatmak, genişletmek
arise|ortaya çıkmak
notice|fark etmek
define|tanımlamak
examine|incelemek
fit|uymak
study|çalışmak, incelemek
bear|katlanmak, taşımak
hang|asmak, takılmak
recognize|tanımak, fark etmek
shake|sallamak
sign|imzalamak
attend|katılmak
fly|uçmak
gain|kazanmak, elde etmek
perform|gerçekleştirmek
result|sonuçlanmak
travel|seyahat etmek
adopt|benimsemek
confirm|doğrulamak
demand|talep etmek
stare|dik dik bakmak
imagine|hayal etmek
attempt|girişimde bulunmak
beat|yenmek, vurmak
associate|ilişkilendirmek
care|önemsemek, bakmak
marry|evlenmek
collect|toplamak
voice|dile getirmek
employ|istihdam etmek, kullanmak
issue|yayınlamak, çıkarmak
release|serbest bırakmak, yayınlamak
emerge|ortaya çıkmak
mind|önemsemek
aim|amaçlamak
deny|inkar etmek
mark|işaretlemek
shoot|ateş etmek, çekmek
appoint|atamak
order|sipariş etmek, emretmek
supply|tedarik etmek
drink|içmek
observe|gözlemlemek
reply|cevap vermek
ignore|görmezden gelmek
link|bağlamak
propose|önermek
ring|çalmak, aramak
settle|yerleşmek, çözmek
strike|vurmak, grev yapmak
press|basmak
respond|yanıtlamak
arrange|düzenlemek
survive|hayatta kalmak
concentrate|odaklanmak
lift|kaldırmak
approach|yaklaşmak
cross|geçmek, çaprazlamak
test|test etmek
charge|ücretlendirmek, suçlamak
experience|deneyimlemek
touch|dokunmak
acquire|edinmek
commit|taahhüt etmek, işlemek
demonstrate|göstermek
grant|vermek, tanımak
prefer|tercih etmek
repeat|tekrarlamak
sleep|uyumak
threaten|tehdit etmek
feed|beslemek
insist|ısrar etmek
launch|başlatmak
limit|sınırlamak
promote|teşvik etmek, terfi ettirmek
deliver|teslim etmek
measure|ölçmek
own|sahip olmak
retain|elde tutmak
assess|değerlendirmek
attract|çekmek
belong|ait olmak
consist|oluşmak
contribute|katkıda bulunmak
hide|saklamak
promise|söz vermek
reject|reddetmek
cry|ağlamak
impose|dayatmak
invite|davet etmek
sing|şarkı söylemek
vary|değişiklik göstermek
warn|uyarmak
address|ele almak, hitap etmek
declare|ilan etmek
destroy|yok etmek
worry|endişelenmek
divide|bölmek
head|yönelmek, başını çekmek
name|adlandırmak
stick|yapışmak, saplamak
nod|başını sallamak
train|eğitmek
attack|saldırmak
clear|temizlemek, netleştirmek
combine|birleştirmek
handle|ele almak, idare etmek
influence|etkilemek
recommend|tavsiye etmek
shout|bağırmak
spread|yaymak, yayılmak
undertake|üstlenmek
account|açıklamak, hesabını vermek
select|seçmek
climb|tırmanmak
contact|iletişime geçmek
recall|hatırlamak
secure|güvenceye almak
step|adım atmak
transfer|aktarmak
welcome|karşılamak
conclude|sonuçlandırmak
disappear|kaybolmak
display|sergilemek, göstermek
dress|giyinmek
illustrate|örneklemek
imply|ima etmek
organize|organize etmek
direct|yönlendirmek
escape|kaçmak
generate|üretmek
investigate|araştırmak
remind|hatırlatmak
advise|tavsiye etmek
afford|gücü yetmek
earn|kazanmak
hand|uzatmak, vermek
inform|bilgilendirmek
rely|güvenmek, dayanmak
succeed|başarmak
approve|onaylamak
burn|yakmak, yanmak
fear|korkmak
vote|oy vermek
conduct|yürütmek
cope|başa çıkmak
derive|türetmek, kaynaklanmak
elect|seçmek
gather|toplamak
jump|zıplamak
last|sürmek
match|eşleşmek
matter|önemli olmak
persuade|ikna etmek
ride|binmek, sürmek
shut|kapatmak
blow|üflemek, esmek
estimate|tahmin etmek
recover|iyileşmek, geri kazanmak
score|puan almak
slip|kaymak
count|saymak
hate|nefret etmek
attach|eklemek, iliştirmek
exercise|egzersiz yapmak, uygulamak
house|barındırmak
lean|yaslanmak, eğilmek
roll|yuvarlanmak
wash|yıkamak
accompany|eşlik etmek
accuse|suçlamak
bind|bağlamak
explore|keşfetmek, araştırmak
judge|yargılamak, değerlendirmek
rest|dinlenmek
steal|çalmak
comment|yorum yapmak
exclude|hariç tutmak
focus|odaklanmak
hurt|incitmek, acımak
stretch|germek, uzatmak
withdraw|geri çekmek
back|desteklemek
fix|tamir etmek, sabitlemek
justify|haklı göstermek
knock|vurmak, çalmak
pursue|peşinden gitmek
switch|değiştirmek
appreciate|takdir etmek
benefit|faydalanmak
lack|eksik olmak
list|listelemek
occupy|işgal etmek, meşgul etmek
permit|izin vermek
surround|çevrelemek
abandon|terk etmek
blame|suçlamak
complain|şikayet etmek
connect|bağlamak
construct|inşa etmek
dominate|hakim olmak
engage|meşgul olmak, dahil etmek
paint|boyamak
quote|alıntı yapmak
view|görmek, değerlendirmek
acknowledge|kabul etmek
dismiss|reddetmek, kovmak
incorporate|dahil etmek
interpret|yorumlamak
proceed|ilerlemek
search|aramak
separate|ayırmak
stress|vurgulamak
alter|değiştirmek
analyse|analiz etmek
arrest|tutuklamak
bother|rahatsız etmek
defend|savunmak
expand|genişletmek
implement|uygulamak
possess|sahip olmak
review|gözden geçirmek
suit|uygun olmak
tie|bağlamak
assist|yardım etmek
calculate|hesaplamak
glance|göz atmak
mix|karıştırmak
question|sorgulamak
resolve|çözmek
rule|hükmetmek, karar vermek
suspect|şüphelenmek
wake|uyanmak, uyandırmak
appeal|çekici gelmek, başvurmak
challenge|meydan okumak, sorgulamak
clean|temizlemek
damage|zarar vermek
guess|tahmin etmek
reckon|sanmak, hesaplamak
restore|geri yüklemek
restrict|sınırlamak
specify|belirtmek
constitute|oluşturmak
convert|dönüştürmek
distinguish|ayırt etmek
submit|sunmak, teslim etmek
trust|güvenmek
urge|ısrarla istemek
feature|yer vermek, özellik olarak taşımak
land|inmek, karaya çıkmak
locate|yerini belirlemek
predict|tahmin etmek
preserve|korumak
solve|çözmek
sort|sıralamak, ayırmak
struggle|mücadele etmek
cast|atamak, fırlatmak
cook|pişirmek
dance|dans etmek
invest|yatırım yapmak
lock|kilitlemek
owe|borçlu olmak
pour|dökmek
shift|kaydırmak, değişmek
kick|tekmelemek
kiss|öpmek
light|yakmak, aydınlatmak
purchase|satın almak
race|yarışmak
retire|emekli olmak
bend|bükmek, eğilmek
breathe|nefes almak
celebrate|kutlamak
date|tarihle belirtmek, çıkmak
fire|ateşlemek, işten çıkarmak
monitor|izlemek
print|yazdırmak
register|kaydolmak, kaydetmek
resist|direnmek
behave|davranmak
comprise|oluşmak, kapsamak
decline|azalmak, reddetmek
detect|tespit etmek
finance|finanse etmek
organise|organize etmek
overcome|üstesinden gelmek
range|değişmek, sıralanmak
signal|işaret etmek
transport|taşımak
`.trim();

const IRREGULAR_FORMS: Record<string, [string, string]> = {
  arise: ['arose', 'arisen'],
  be: ['was/were', 'been'],
  bear: ['bore', 'borne'],
  beat: ['beat', 'beaten'],
  become: ['became', 'become'],
  begin: ['began', 'begun'],
  bend: ['bent', 'bent'],
  bind: ['bound', 'bound'],
  blow: ['blew', 'blown'],
  break: ['broke', 'broken'],
  bring: ['brought', 'brought'],
  build: ['built', 'built'],
  burn: ['burnt/burned', 'burnt/burned'],
  buy: ['bought', 'bought'],
  cast: ['cast', 'cast'],
  catch: ['caught', 'caught'],
  choose: ['chose', 'chosen'],
  come: ['came', 'come'],
  cost: ['cost', 'cost'],
  cut: ['cut', 'cut'],
  do: ['did', 'done'],
  draw: ['drew', 'drawn'],
  drink: ['drank', 'drunk'],
  eat: ['ate', 'eaten'],
  fall: ['fell', 'fallen'],
  feed: ['fed', 'fed'],
  feel: ['felt', 'felt'],
  fight: ['fought', 'fought'],
  find: ['found', 'found'],
  fit: ['fit/fitted', 'fit/fitted'],
  fly: ['flew', 'flown'],
  forget: ['forgot', 'forgotten'],
  get: ['got', 'gotten/got'],
  give: ['gave', 'given'],
  go: ['went', 'gone'],
  grow: ['grew', 'grown'],
  hang: ['hung', 'hung'],
  have: ['had', 'had'],
  hear: ['heard', 'heard'],
  hide: ['hid', 'hidden'],
  hit: ['hit', 'hit'],
  hold: ['held', 'held'],
  hurt: ['hurt', 'hurt'],
  keep: ['kept', 'kept'],
  know: ['knew', 'known'],
  lay: ['laid', 'laid'],
  lead: ['led', 'led'],
  lean: ['leant/leaned', 'leant/leaned'],
  learn: ['learnt/learned', 'learnt/learned'],
  leave: ['left', 'left'],
  let: ['let', 'let'],
  light: ['lit/lighted', 'lit/lighted'],
  lose: ['lost', 'lost'],
  make: ['made', 'made'],
  mean: ['meant', 'meant'],
  meet: ['met', 'met'],
  overcome: ['overcame', 'overcome'],
  pay: ['paid', 'paid'],
  put: ['put', 'put'],
  read: ['read', 'read'],
  ride: ['rode', 'ridden'],
  ring: ['rang', 'rung'],
  rise: ['rose', 'risen'],
  run: ['ran', 'run'],
  say: ['said', 'said'],
  see: ['saw', 'seen'],
  sell: ['sold', 'sold'],
  send: ['sent', 'sent'],
  set: ['set', 'set'],
  shake: ['shook', 'shaken'],
  shoot: ['shot', 'shot'],
  shut: ['shut', 'shut'],
  sing: ['sang', 'sung'],
  sit: ['sat', 'sat'],
  sleep: ['slept', 'slept'],
  slip: ['slipped', 'slipped'],
  speak: ['spoke', 'spoken'],
  spend: ['spent', 'spent'],
  spread: ['spread', 'spread'],
  stand: ['stood', 'stood'],
  steal: ['stole', 'stolen'],
  stick: ['stuck', 'stuck'],
  strike: ['struck', 'struck'],
  take: ['took', 'taken'],
  teach: ['taught', 'taught'],
  tell: ['told', 'told'],
  think: ['thought', 'thought'],
  throw: ['threw', 'thrown'],
  undertake: ['undertook', 'undertaken'],
  understand: ['understood', 'understood'],
  wake: ['woke', 'woken'],
  win: ['won', 'won'],
  withdraw: ['withdrew', 'withdrawn'],
  write: ['wrote', 'written'],
};

const THIRD_PERSON_OVERRIDES: Record<string, string> = {
  be: 'is',
  have: 'has',
};

const GERUND_OVERRIDES: Record<string, string> = {
  be: 'being',
  die: 'dying',
  lie: 'lying',
  tie: 'tying',
};

const DOUBLE_FINAL_CONSONANT = new Set([
  'admit',
  'commit',
  'drop',
  'fit',
  'nod',
  'permit',
  'prefer',
  'refer',
  'regret',
  'run',
  'set',
  'shut',
  'sit',
  'slip',
  'stop',
  'submit',
  'transfer',
]);

function isConsonantY(verb: string): boolean {
  return /[^aeiou]y$/.test(verb);
}

function getThirdPerson(verb: string): string {
  if (THIRD_PERSON_OVERRIDES[verb]) return THIRD_PERSON_OVERRIDES[verb];
  if (isConsonantY(verb)) return `${verb.slice(0, -1)}ies`;
  if (/(s|sh|ch|x|z|o)$/.test(verb)) return `${verb}es`;
  return `${verb}s`;
}

function getGerund(verb: string): string {
  if (GERUND_OVERRIDES[verb]) return GERUND_OVERRIDES[verb];
  if (verb.endsWith('ie')) return `${verb.slice(0, -2)}ying`;
  if (verb.endsWith('e') && !/(ee|ye|oe)$/.test(verb)) return `${verb.slice(0, -1)}ing`;
  if (DOUBLE_FINAL_CONSONANT.has(verb)) return `${verb}${verb.at(-1)}ing`;
  return `${verb}ing`;
}

function getRegularPast(verb: string): string {
  if (verb.endsWith('e')) return `${verb}d`;
  if (isConsonantY(verb)) return `${verb.slice(0, -1)}ied`;
  if (DOUBLE_FINAL_CONSONANT.has(verb)) return `${verb}${verb.at(-1)}ed`;
  return `${verb}ed`;
}

function parseRows(): Array<{ term: string; translationTr: string }> {
  const seen = new Set<string>();

  return COMMON_VERB_ROWS.split('\n')
    .map((line) => {
      const [term, translationTr] = line.split('|');
      return { term: term.trim(), translationTr: translationTr.trim() };
    })
    .filter((row) => {
      if (!row.term || seen.has(row.term)) return false;
      seen.add(row.term);
      return true;
    })
    .slice(0, 400);
}

export function createCommonVerbCards(): Flashcard[] {
  return parseRows().map((row, index) => {
    const irregularForms = IRREGULAR_FORMS[row.term];
    const pastSimple = irregularForms?.[0] ?? getRegularPast(row.term);
    const pastParticiple = irregularForms?.[1] ?? pastSimple;
    const lookupTerm = encodeURIComponent(row.term);

    return {
      id: `common_verb_${String(index + 1).padStart(3, '0')}_${row.term}`,
      term: row.term,
      translationTr: row.translationTr,
      wordType: 'verb',
      cardKind: 'production',
      level: index < 120 ? 'A1-A2' : index < 280 ? 'B1-B2' : 'B2-C1',
      prompt: row.translationTr,
      answer: row.term,
      example: `Core verb for production practice: ${row.term}.`,
      exampleTranslation: `Üretim pratiği için temel fiil: ${row.translationTr}.`,
      note: irregularForms ? 'Irregular verb' : 'Regular verb',
      verbForms: {
        baseForm: row.term,
        thirdPerson: getThirdPerson(row.term),
        pastSimple,
        pastParticiple,
        gerund: getGerund(row.term),
        usagePattern: `${row.term} + object/context`,
      },
      sourceTags: ['CommonVerbs', 'VerbForms', 'Production'],
      usageLinks: [
        {
          label: 'Cambridge',
          url: `https://dictionary.cambridge.org/dictionary/english/${lookupTerm}`,
        },
        {
          label: 'YouGlish',
          url: `https://youglish.com/pronounce/${lookupTerm}/english`,
        },
      ],
    };
  });
}
