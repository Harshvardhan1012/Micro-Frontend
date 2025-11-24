import { createRoot } from 'react-dom/client';
import App from './App';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

export function mount(el) {
  const root = createRoot(el);
  root.render(
    <React.StrictMode>
      <AppProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProvider>
    </React.StrictMode>
  );
}

// If running standalone (not as remote), mount to #root automatically
if (typeof document !== 'undefined') {
  const el = document.getElementById('root');
  if (el) mount(el);
}
