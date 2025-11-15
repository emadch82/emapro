import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// --- Service Worker Registration Removed ---
// The registration code was causing a same-origin policy error in the current
// execution environment. It has been removed to resolve the error.
// We can re-introduce it later in a production-like environment if needed.
