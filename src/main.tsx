import React, { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import { Toaster } from '@/components/ui/toaster';
import { CONFIG } from './config-global';
import { store } from './store/store';
import './index.css';

/**
 * Reload Window on Vite preload error
 */
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={CONFIG.site.basePath}>
        <Suspense>
          <Provider store={store}>
            <Toaster>
              <App />
            </Toaster>
          </Provider>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
