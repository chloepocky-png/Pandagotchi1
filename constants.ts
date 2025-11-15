import { Stat, AccessoryName, Friend } from './types';

export const MAX_STAT = 100;
export const GAME_SPEED = 2000; // milliseconds
export const EVOLUTION_AGE = 2; // in game days for faster testing, was 30
export const DAY_CYCLE_TICKS = 30; // 1 minute cycle at 2000ms/tick
export const NIGHT_START_TICK = 20; // Night starts after 20 ticks (40 seconds)


export const STAT_DECAY_RATE: Record<Stat, number> = {
  hunger: 5,
  happiness: 3,
  cleanliness: 2,
};

export const SLEEP_STAT_DECAY_RATE: Record<Stat, number> = {
  hunger: 1, // Decays slowly while sleeping
  happiness: 0,
  cleanliness: 0,
};

export const ACTION_AMOUNTS: Record<Stat, number> = {
    hunger: 25,
    happiness: 20,
    cleanliness: 30,
};

export const ACCESSORIES: Record<AccessoryName, { price: number }> = {
  tophat: { price: 25 },
  sunglasses: { price: 15 },
  partyhat: { price: 10 },
  bowtie: { price: 20 },
};

export const ACCESSORY_NAMES_FR: Record<AccessoryName, string> = {
  tophat: 'Haut-de-forme',
  sunglasses: 'Lunettes de soleil',
  partyhat: 'Chapeau de fête',
  bowtie: 'Nœud papillon',
};
