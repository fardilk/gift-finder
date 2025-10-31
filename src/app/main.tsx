import React, { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from '../app';
import { CONFIG } from '../config-global';
import { Provider } from 'react-redux';
import { store } from 'src/store/store';

// Reload Window on Vite preload error
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={CONFIG.site.basePath}>
        <Suspense>
          <Provider store={store}>
            <App />
          </Provider>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
