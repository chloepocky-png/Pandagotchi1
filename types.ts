
export type PetState = 'happy' | 'sad' | 'hungry' | 'dirty' | 'sleeping' | 'bathing';

export type Stat = 'hunger' | 'happiness' | 'cleanliness';

export type PetStage = 'baby' | 'adult';

export type AccessoryName = 'tophat' | 'sunglasses' | 'partyhat' | 'bowtie';

export type BackgroundKey = 'none' | 'park' | 'beach' | 'space';

export interface CapturedImage {
  id: number;
  state: PetState;
  stage: PetStage;
  equippedAccessory: AccessoryName | null;
  background: BackgroundKey;
}

export interface ChatMessage {
  sender: 'user' | 'panda';
  text: string;
}

export interface Friend {
  code: string;
  name: string;
  personality: string;
}
