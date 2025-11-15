import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

function main() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Erreur fatale : L'élément racine #root n'a pas été trouvé.");
    return;
  }

  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}

// Le script étant chargé à la fin du corps de la page, le DOM est déjà prêt.
main();