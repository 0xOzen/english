# UI/UX Review Handoff

Date: 2026-04-24

Context: Continue from the current UI redesign review. The new desktop-style design is directionally better, but mobile and some legacy screens still need a focused cleanup pass.

## Findings To Fix

1. P1 - Mobile viewport is crushed by the desktop sidebar

File: `src/App.tsx`
Lines: around 139-146

Problem: At 390px mobile width, the sidebar still renders as `w-64`, leaving only a narrow strip for main content. The mobile screenshot confirmed the main pane is visibly clipped instead of using a drawer, overlay, or bottom navigation.

Suggested direction: Convert the primary sidebar to a mobile drawer or bottom navigation. On mobile, the app should open with the content area full width and navigation hidden behind a toggle.

2. P1 - Workspace sidebars are inaccessible on mobile

File: `src/components/WorkspaceView.tsx`
Lines: around 30-35

Problem: `WorkspaceView` hides both sidebars below `lg`, but the toolbar buttons only toggle width state. They cannot reveal the hidden sidebars. In `GrammarHub`, this removes search, level filters, section selection, and context on mobile.

Suggested direction: Give `WorkspaceView` a real mobile drawer/sheet for left and right sidebar content, or render mobile-specific filter/context panels above the main content.

3. P2 - Study shell still uses the unwanted top block pattern

File: `src/components/StudyModeShell.tsx`
Lines: around 65-132

Problem: `Quiz`, `Write`, and `Match` still show a large intro/stat/progress card before the task. This repeats the old "top block" issue on mobile.

Suggested direction: Make study modes task-first. Keep only a compact header, progress line, and minimal actions. Flashcard mode is already closer to the desired direction.

4. P2 - List editor is still in the old card-heavy visual language

File: `src/screens/ListEditor.tsx`
Lines: around 53-92

Problem: The editor still starts with a large gradient hero, oversized heading, summary callout, and nested cards. This conflicts with the desktop-app direction and pushes real editing fields down on mobile.

Suggested direction: Convert `ListEditor` to a compact editor workspace: toolbar at top, list title input immediately visible, word rows/cards below, summary/actions in a side panel or collapsible mobile section.

5. P2 - Dark theme is mixed with hard-coded light Tailwind colors

File: `src/screens/ListEditor.tsx`
Lines: around 68-73, but this pattern likely appears in other legacy screens too.

Problem: The new shell uses theme tokens, but several screens still hard-code `text-slate-*`, `bg-white`, and light gradients. In dark mode these sections can become visually inconsistent or low contrast.

Suggested direction: Replace legacy light-only styling with `claude-*` theme utilities or CSS variables. Audit `ListEditor`, `WordEditorItem`, `SettingsModal`, `InstallBanner`, and remaining study modes.

## Recommended Fix Order

1. Fix `App.tsx` mobile shell first: drawer or bottom nav.
2. Fix `WorkspaceView` mobile sidebars so atlas controls are reachable.
3. Simplify `StudyModeShell` for Quiz, Write, Match.
4. Redesign `ListEditor` and `WordEditorItem` into the compact app style.
5. Sweep hard-coded light colors and align dark/light theme tokens.

## Verification Notes

- `npm run build` passed during the review.
- A 390x844 mobile screenshot showed the sidebar consuming most of the viewport.
- Desktop looked directionally calmer, but mobile is currently the main blocker.
