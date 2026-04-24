import { useState } from 'react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import { Flashcard } from '../types';
import { ChevronLeft, Plus, Trash2, Save, Sparkles, Rows3 } from 'lucide-react';
import WordEditorItem from './WordEditorItem';

export default function ListEditor({ listId, onNavigate }: { listId: string; onNavigate: (screen: Screen) => void }) {
  const { lists, addList, updateList, deleteList } = useApp();
  const existingList = lists.find((list) => list.id === listId);
  const isNew = listId === 'new';

  const [title, setTitle] = useState(existingList?.title || '');
  const [words, setWords] = useState<Flashcard[]>(existingList?.words || []);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const addWord = () =>
    setWords([
      ...words,
      {
        id: crypto.randomUUID(),
        term: '',
        translationTr: '',
        example: '',
        exampleTranslation: '',
      },
    ]);

  const updateWord = (id: string, field: keyof Flashcard, value: unknown) =>
    setWords(words.map((word) => (word.id === id ? { ...word, [field]: value } : word)));
  const removeWord = (id: string) => setWords(words.filter((word) => word.id !== id));

  const handleDeleteList = () => {
    deleteList(listId);
    onNavigate({ type: 'dashboard' });
  };

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }

    if (isNew) {
      addList(title, words);
    } else {
      updateList(listId, title, words);
    }

    onNavigate({ type: 'dashboard' });
  };

  return (
    <div className="mx-auto grid w-full max-w-[1440px] gap-4 px-3 pb-24 pt-3 sm:px-5 sm:py-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
      <section className="panel-surface min-w-0 rounded-[18px] p-3 sm:p-5">
        <div className="mb-5 flex flex-col gap-3 border-b border-claude-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => onNavigate({ type: 'dashboard' })} className="button-secondary h-9 px-3">
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Panele dön</span>
            </button>
            <div className="section-label">
              <Rows3 size={14} />
              {isNew ? 'Yeni liste' : 'Liste düzenleyici'}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {!existingList?.isDefault ? (
              <button onClick={addWord} className="button-secondary h-9 px-3">
                <Plus size={16} />
                Kelime ekle
              </button>
            ) : null}
            <button onClick={handleSave} className="button-primary h-9 px-3">
              <Save size={16} />
              Kaydet
            </button>
          </div>
        </div>

        <div className="mb-5">
          <label className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-claude-muted">Liste adı</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={existingList?.isDefault}
            className="mt-2 w-full border-b border-claude-border bg-transparent py-2 text-2xl font-semibold text-claude-text outline-none transition-colors placeholder:text-claude-muted focus:border-claude-accent disabled:opacity-50 sm:text-3xl"
            placeholder="Liste adı gir (örn: Seyahat)"
          />
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-claude-text">Kelimeler</div>
            <div className="text-xs text-claude-muted">{words.length} kayıt</div>
          </div>
        </div>

        <div className="space-y-3">
          {words.map((word) => (
            <WordEditorItem
              key={word.id}
              word={word}
              isDefault={existingList?.isDefault}
              onUpdate={updateWord}
              onRemove={removeWord}
            />
          ))}

          {words.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-claude-border bg-claude-surface px-5 py-10 text-center">
              <div className="text-xl font-semibold text-claude-text">Liste henüz boş</div>
              <p className="mt-2 text-sm leading-6 text-claude-subtle">İlk kelimeyi eklediğinde kart, test ve yazma modları bu listeyi kullanacak.</p>
              {!existingList?.isDefault ? (
                <button onClick={addWord} className="button-primary mt-5">
                  <Plus size={16} />
                  İlk kelimeyi ekle
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <aside className="space-y-4 lg:sticky lg:top-[76px] lg:self-start">
        <div className="panel-surface rounded-[18px] p-4">
          <div className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-claude-muted">Düzenleme özeti</div>
          <div className="mt-4 divide-y divide-claude-border text-sm">
            <div className="flex items-center justify-between py-2">
              <span className="text-claude-subtle">Kelime</span>
              <span className="font-semibold text-claude-text">{words.length}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-claude-subtle">Tür</span>
              <span className="font-semibold text-claude-text">{isNew ? 'Taslak' : existingList?.isDefault ? 'Sistem' : 'Özel'}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-claude-subtle">Başlık</span>
              <span className="max-w-36 truncate font-semibold text-claude-text">{title.trim() || 'İsimsiz'}</span>
            </div>
          </div>
        </div>

        <div className="panel-surface rounded-[18px] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-claude-text">
            <Sparkles size={16} className="text-claude-accent" />
            İyi pratik
          </div>
          <div className="mt-3 space-y-2 text-sm leading-6 text-claude-subtle">
            <p>Kısa ve net örnek cümleler kart yüzeyini güçlendirir.</p>
            <p>Fiil, sıfat ve ifade alanları doldukça çalışma modları daha zengin hale gelir.</p>
          </div>
        </div>

        {!isNew && !existingList?.isDefault ? (
          <div className="panel-surface rounded-[18px] p-4">
            <div className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-claude-muted">Tehlikeli alan</div>
            {showConfirmDelete ? (
              <div className="mt-3 space-y-3">
                <p className="text-sm leading-6 text-claude-subtle">Bu liste silinirse içindeki tüm özel kelimeler kaldırılır. Bu işlem geri alınamaz.</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={handleDeleteList} className="button-danger">
                    <Trash2 size={16} />
                    Evet, sil
                  </button>
                  <button onClick={() => setShowConfirmDelete(false)} className="button-secondary">
                    Vazgeç
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-sm leading-6 text-claude-subtle">Bu liste artık gerekmiyorsa buradan kaldırabilirsin.</p>
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="mt-3 inline-flex items-center gap-2 rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100"
                >
                  <Trash2 size={16} />
                  Listeyi sil
                </button>
              </div>
            )}
          </div>
        ) : null}

        <div className="panel-surface rounded-[18px] p-4">
          <div className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-claude-muted">Akış notu</div>
          <div className="mt-3 space-y-2 text-sm leading-6 text-claude-subtle">
            <p>Listeyi kaydettiğinde panelde anında görünecek.</p>
            <p>Zengin alanlar boş kalsa da kartlar çalışır.</p>
          </div>
        </div>
      </aside>

      <div className="fixed inset-x-3 bottom-3 z-30 flex gap-2 rounded-[14px] border border-claude-border bg-claude-panel/95 p-2 shadow-pop backdrop-blur sm:hidden">
        {!existingList?.isDefault ? (
          <button onClick={addWord} className="button-secondary min-h-11 flex-1">
            <Plus size={16} />
            Kelime ekle
          </button>
        ) : null}
        <button onClick={handleSave} className="button-primary min-h-11 flex-1">
          <Save size={16} />
          Kaydet
        </button>
      </div>
    </div>
  );
}
