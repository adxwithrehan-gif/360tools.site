import './compat.ts';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initGSCVerification } from './config/gscConfig.ts';
import { initAdSenseScript } from './config/adsConfig.ts';

// Initialize Google Search Console verification meta tag & AdSense SDK
initGSCVerification();
initAdSenseScript();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
