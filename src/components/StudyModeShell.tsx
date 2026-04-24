import { ArrowDownUp, ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';

type StudyStat = {
  label: string;
  value: string;
};

type StudyModeShellProps = {
  modeLabel: string;
  title: string;
  description: string;
  listTitle: string;
  progress: number;
  currentIndex: number;
  total: number;
  onBack: () => void;
  directionLabel?: string;
  onToggleDirection?: () => void;
  accentClassName?: string;
  stats?: StudyStat[];
  progressNote?: string;
  children: ReactNode;
  footer?: ReactNode;
};

const progressBarMap: Record<string, string> = {
  teal: 'bg-claude-accent',
  emerald: 'bg-claude-success',
  amber: 'bg-claude-warning',
  rose: 'bg-claude-danger',
  sky: 'bg-claude-info',
};

export default function StudyModeShell({
  modeLabel,
  title,
  listTitle,
  progress,
  currentIndex,
  total,
  onBack,
  directionLabel,
  onToggleDirection,
  accentClassName = 'teal',
  stats = [],
  children,
  footer,
}: StudyModeShellProps) {
  const progressColor = progressBarMap[accentClassName] ?? progressBarMap.teal;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col gap-3 px-3 py-3 sm:px-5 sm:py-5 lg:px-8">
      <section className="workspace-toolbar rounded-[18px] px-3 py-3 sm:px-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <button onClick={onBack} className="button-secondary h-9 px-3">
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Panele dön</span>
              </button>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="section-label hidden sm:inline-flex">{modeLabel}</div>
                  <h1 className="truncate text-sm font-semibold text-claude-text sm:text-base">{title}</h1>
                </div>
                <div className="mt-0.5 truncate text-xs text-claude-muted">
                  {modeLabel} · {listTitle}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {onToggleDirection && directionLabel ? (
                <button onClick={onToggleDirection} className="button-secondary h-9 px-3">
                  <ArrowDownUp size={14} />
                  <span className="hidden sm:inline">{directionLabel}</span>
                </button>
              ) : null}
              <div className="rounded-[10px] border border-claude-border bg-claude-panel px-3 py-1.5 text-sm font-semibold text-claude-text">
                {Math.min(currentIndex + 1, total)}
                <span className="font-medium text-claude-muted"> / {total}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-claude-border/70">
              <div
                className={`h-full rounded-full ${progressColor} transition-all duration-300`}
                style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
              />
            </div>
            {stats.length > 0 ? (
              <div className="hidden shrink-0 items-center gap-2 md:flex">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-[10px] border border-claude-border bg-claude-surface px-2.5 py-1 text-xs text-claude-subtle">
                    <span className="text-claude-muted">{stat.label}</span> {stat.value}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="card rounded-[18px] p-3 sm:p-5">{children}</section>
      {footer ? <div className="card rounded-[18px] p-3 sm:p-4">{footer}</div> : null}
    </div>
  );
}
