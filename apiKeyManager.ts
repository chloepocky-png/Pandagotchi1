/**
 * Récupère la clé API depuis les variables d'environnement.
 * @returns {string | undefined} La clé API ou undefined si elle n'est pas définie.
 */
export function getApiKey(): string | undefined {
  return process.env.API_KEY;
}

/**
 * Cette fonction est obsolète. La clé API doit être définie via les variables d'environnement.
 * @param {string} apiKey - La clé API.
 */
export function setApiKey(apiKey: string): void {
  console.warn(
    "setApiKey() est obsolète. Veuillez définir la clé API via la variable d'environnement API_KEY."
  );
}
