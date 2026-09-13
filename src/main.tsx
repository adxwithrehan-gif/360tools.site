import './compat.ts';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';
import { initGSCVerification } from './config/gscConfig.ts';
import { initAdSenseScript } from './config/adsConfig.ts';

// Initialize Google Search Console verification meta tag & AdSense SDK safely
try {
  initGSCVerification();
} catch (e) {
  console.warn('GSC init notice:', e);
}

try {
  initAdSenseScript();
} catch (e) {
  console.warn('AdSense init notice:', e);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

