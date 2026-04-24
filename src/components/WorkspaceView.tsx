import { type ReactNode, useState } from 'react';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, X } from 'lucide-react';

type WorkspaceViewProps = {
  title: string;
  subtitle?: string;
  toolbar?: ReactNode;
  leftSidebar: ReactNode;
  rightSidebar: ReactNode;
  children: ReactNode;
  initialLeftOpen?: boolean;
  initialRightOpen?: boolean;
};

export default function WorkspaceView({
  title,
  subtitle,
  toolbar,
  leftSidebar,
  rightSidebar,
  children,
  initialLeftOpen = true,
  initialRightOpen = true,
}: WorkspaceViewProps) {
  const [isLeftOpen, setIsLeftOpen] = useState(initialLeftOpen);
  const [isRightOpen, setIsRightOpen] = useState(initialRightOpen);
  const [mobileSheet, setMobileSheet] = useState<'left' | 'right' | null>(null);
  const isMobileViewport = () => typeof window !== 'undefined' && !window.matchMedia('(min-width: 1024px)').matches;
  const openLeftPanel = () => (isMobileViewport() ? setMobileSheet('left') : setIsLeftOpen((current) => !current));
  const openRightPanel = () => (isMobileViewport() ? setMobileSheet('right') : setIsRightOpen((current) => !current));

  return (
    <div className="mx-auto flex min-h-[calc(100vh-92px)] w-full max-w-[1600px] gap-3 px-4 pb-4 sm:px-6 lg:px-8">
      <aside
        className={`workspace-sidebar hidden min-h-0 shrink-0 overflow-hidden rounded-[18px] transition-all duration-200 lg:flex ${
          isLeftOpen ? 'w-[280px]' : 'w-0 border-transparent'
        }`}
      >
        <div className={`flex w-[280px] min-w-[280px] flex-col ${isLeftOpen ? 'opacity-100' : 'opacity-0'}`}>{leftSidebar}</div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="workspace-toolbar flex flex-wrap items-center justify-between gap-3 rounded-[18px] px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <button
              onClick={openLeftPanel}
              className="workspace-icon-button h-9 w-9 rounded-[10px]"
              aria-label={isLeftOpen ? 'Sol paneli gizle' : 'Sol paneli goster'}
            >
              {isLeftOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            </button>
            <button
              onClick={openRightPanel}
              className="workspace-icon-button h-9 w-9 rounded-[10px] lg:hidden"
              aria-label="Sag paneli ac"
            >
              <PanelRightOpen size={16} />
            </button>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-claude-text">{title}</div>
              {subtitle ? <div className="truncate text-xs text-claude-muted">{subtitle}</div> : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {toolbar}
            <button
              onClick={openRightPanel}
              className="workspace-icon-button hidden h-9 w-9 rounded-[10px] lg:inline-flex"
              aria-label={isRightOpen ? 'Sag paneli gizle' : 'Sag paneli goster'}
            >
              {isRightOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 gap-3">
          <main className="workspace-main min-w-0 flex-1 overflow-auto rounded-[18px] p-4">{children}</main>

          <aside
            className={`workspace-sidebar hidden min-h-0 shrink-0 overflow-hidden rounded-[18px] transition-all duration-200 lg:flex ${
              isRightOpen ? 'w-[320px]' : 'w-0 border-transparent'
            }`}
          >
            <div className={`flex w-[320px] min-w-[320px] flex-col ${isRightOpen ? 'opacity-100' : 'opacity-0'}`}>{rightSidebar}</div>
          </aside>
        </div>
      </div>

      {mobileSheet ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/35 backdrop-blur-[1px]"
            aria-label="Paneli kapat"
            onClick={() => setMobileSheet(null)}
          />
          <aside className="workspace-sidebar absolute inset-y-3 left-3 right-3 flex min-h-0 flex-col overflow-hidden rounded-[18px] sm:left-auto sm:w-[380px]">
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-claude-border px-4">
              <div className="text-sm font-semibold text-claude-text">{mobileSheet === 'left' ? 'Filtreler' : 'Bağlam'}</div>
              <button
                type="button"
                onClick={() => setMobileSheet(null)}
                className="workspace-icon-button h-8 w-8 rounded-[10px]"
                aria-label="Paneli kapat"
              >
                <X size={16} />
              </button>
            </div>
            <div className="custom-scroll min-h-0 flex-1 overflow-auto">{mobileSheet === 'left' ? leftSidebar : rightSidebar}</div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
