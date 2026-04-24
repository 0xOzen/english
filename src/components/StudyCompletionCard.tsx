type StudyCompletionCardProps = {
  title: string;
  description: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel: string;
  onSecondary: () => void;
  summary?: Array<{ label: string; value: string }>;
};

export default function StudyCompletionCard({
  title,
  description,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  summary = [],
}: StudyCompletionCardProps) {
  return (
    <div className="card fade-in mx-auto flex max-w-2xl flex-col items-center rounded-3xl px-6 py-10 text-center">
      <div className="section-label">Seans Tamamlandı</div>
      <h2 className="font-display mt-5 text-3xl font-semibold text-claude-text sm:text-4xl">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-claude-subtle sm:text-base">{description}</p>

      {summary.length > 0 ? (
        <div className="mt-7 grid w-full gap-3 sm:grid-cols-3">
          {summary.map((item) => (
            <div key={item.label} className="stat-chip text-left">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-claude-muted">{item.label}</div>
              <div className="mt-2 text-xl font-semibold text-claude-text">{item.value}</div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={onPrimary} className="button-primary">
          {primaryLabel}
        </button>
        <button onClick={onSecondary} className="button-secondary">
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
}
