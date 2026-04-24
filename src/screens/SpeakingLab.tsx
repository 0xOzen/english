import { useMemo, useRef, useState } from 'react';
import { Mic, Square, Wand2 } from 'lucide-react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import { Flashcard } from '../types';

const discourseMarkers = [
  'to some extent',
  'on the other hand',
  'that said',
  'however',
  'nevertheless',
  'for instance',
  'in other words',
  'as far as i can tell',
  'i would argue',
];

function getSpeakingCards(cards: Flashcard[]): Flashcard[] {
  return cards.filter((card) => card.cardKind === 'speakingFunction' || card.wordType === 'phrase' || card.phraseForms?.usageIntent);
}

function analyzeResponse(text: string, target: Flashcard) {
  const normalized = text.toLowerCase();
  const tokens = normalized.match(/[a-z']+/g) ?? [];
  const tokenCounts = new Map<string, number>();
  tokens.forEach((token) => {
    if (token.length < 4) return;
    tokenCounts.set(token, (tokenCounts.get(token) ?? 0) + 1);
  });
  const repeated = Array.from(tokenCounts)
    .filter(([, count]) => count >= 3)
    .slice(0, 5);
  const usedMarkers = discourseMarkers.filter((marker) => normalized.includes(marker));
  const targetPattern = target.term.toLowerCase();
  const usedTarget = normalized.includes(targetPattern);

  return {
    usedMarkers,
    repeated,
    usedTarget,
    wordCount: tokens.length,
  };
}

export default function SpeakingLab({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { lists } = useApp();
  const cards = useMemo(() => getSpeakingCards(lists.flatMap((list) => list.words)), [lists]);
  const [selectedId, setSelectedId] = useState(cards[0]?.id ?? '');
  const [responseText, setResponseText] = useState('');
  const [recordingUrl, setRecordingUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const selectedCard = cards.find((card) => card.id === selectedId) ?? cards[0];
  const feedback = selectedCard && responseText.trim() ? analyzeResponse(responseText, selectedCard) : null;

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      setRecordingUrl(URL.createObjectURL(blob));
      stream.getTracks().forEach((track) => track.stop());
    };
    mediaRecorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  if (!selectedCard) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-3xl items-center px-5 py-8">
        <section className="codex-panel w-full rounded-[14px] p-5 text-center">
          <div className="text-lg font-semibold text-claude-text">Speaking Lab için hazır pattern yok.</div>
          <button onClick={() => onNavigate({ type: 'dashboard' })} className="button-primary mt-5">
            Panele dön
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-3 border-b border-claude-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="section-label">Speaking Lab</div>
          <h1 className="mt-3 text-lg font-semibold text-claude-text">30-60 saniyelik cevap üret</h1>
          <div className="mt-1 text-sm text-claude-muted">Kalıp, discourse marker ve tekrar eden kelime sinyallerine göre geri bildirim al.</div>
        </div>
        <button onClick={() => onNavigate({ type: 'dashboard' })} className="button-secondary">
          Panele dön
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="codex-panel rounded-[14px] p-4">
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-claude-muted">Görev</label>
          <select
            value={selectedCard.id}
            onChange={(event) => setSelectedId(event.target.value)}
            className="mt-2 w-full rounded-[10px] border border-claude-border bg-claude-panel px-3 py-2 text-sm font-semibold text-claude-text outline-none"
          >
            {cards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.term}
              </option>
            ))}
          </select>

          <div className="mt-5 rounded-[14px] border border-claude-border bg-claude-surface p-4">
            <div className="text-sm font-semibold text-claude-text">{selectedCard.prompt || selectedCard.phraseForms?.usageIntent || selectedCard.term}</div>
            <div className="mt-2 text-sm leading-6 text-claude-muted">{selectedCard.example}</div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={isRecording ? stopRecording : startRecording} className={isRecording ? 'button-danger' : 'button-primary'}>
              {isRecording ? <Square size={16} /> : <Mic size={16} />}
              {isRecording ? 'Kaydı durdur' : 'Ses kaydı al'}
            </button>
            {recordingUrl ? <audio src={recordingUrl} controls className="h-10" /> : null}
          </div>

          <textarea
            value={responseText}
            onChange={(event) => setResponseText(event.target.value)}
            placeholder="Konuşmanı kısa not olarak yaz veya kayıttan sonra transkriptini buraya ekle..."
            className="mt-4 min-h-40 w-full resize-y rounded-[14px] border border-claude-border bg-claude-surface px-4 py-3 text-sm leading-6 text-claude-text outline-none focus:border-claude-accent"
          />
        </section>

        <aside className="codex-panel rounded-[14px] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-claude-text">
            <Wand2 size={16} className="text-claude-accent" />
            Feedback
          </div>
          {feedback ? (
            <div className="mt-4 space-y-3 text-sm leading-6 text-claude-subtle">
              <div className="rounded-[12px] border border-claude-border bg-claude-surface p-3">
                <div className="text-xs text-claude-muted">Target pattern</div>
                <div className="font-semibold text-claude-text">{feedback.usedTarget ? 'Kullandın' : 'Henüz görünmüyor'}</div>
              </div>
              <div className="rounded-[12px] border border-claude-border bg-claude-surface p-3">
                <div className="text-xs text-claude-muted">Discourse markers</div>
                <div className="font-semibold text-claude-text">{feedback.usedMarkers.join(', ') || 'Bir bağlayıcı ekle'}</div>
              </div>
              <div className="rounded-[12px] border border-claude-border bg-claude-surface p-3">
                <div className="text-xs text-claude-muted">Tekrar eden kelimeler</div>
                <div className="font-semibold text-claude-text">{feedback.repeated.map(([word, count]) => `${word} (${count})`).join(', ') || 'Belirgin tekrar yok'}</div>
              </div>
              <div className="rounded-[12px] border border-claude-border bg-claude-surface p-3">
                <div className="text-xs text-claude-muted">Doğal alternatif</div>
                <div className="font-semibold text-claude-text">{selectedCard.phraseForms?.formalVariant || selectedCard.phraseForms?.naturalVariant || selectedCard.term}</div>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-sm leading-6 text-claude-muted">Cevap metni eklediğinde rubrik burada görünür.</div>
          )}
        </aside>
      </div>
    </div>
  );
}
