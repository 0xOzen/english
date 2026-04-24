import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AppProvider } from './AppContext.tsx';
import './index.css';
import { initTheme } from './theme.ts';
import { registerPwa } from './pwa.ts';

// Set data-theme on <html> before React mounts so the first paint matches.
initTheme();
registerPwa();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
);
