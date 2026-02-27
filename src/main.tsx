import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import '/src/index.css';

import App from './App';

registerSW({
  immediate: true,
  onRegisteredSW(_swScriptUrl: string, registration: ServiceWorkerRegistration | undefined) {
    if (!registration) {
      return;
    }

    const updateIfOnline = () => {
      if (!navigator.onLine) {
        return;
      }

      registration.update();
    };

    window.addEventListener('online', updateIfOnline);
    window.addEventListener('focus', updateIfOnline);

    updateIfOnline();
    setInterval(updateIfOnline, 60 * 1000);
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
