import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

function main() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Erreur fatale : L'élément racine #root n'a pas été trouvé.");
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Erreur fatale : Échec du rendu de l'application React.", error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: sans-serif; color: #A76B79;">
        <h2>Oups ! Une erreur critique est survenue.</h2>
        <p>L'application n'a pas pu démarrer. Veuillez vérifier la console du développeur pour plus de détails.</p>
      </div>
    `;
  }
}

// Le script étant chargé à la fin du corps de la page, le DOM est déjà prêt.
main();