export interface Prompt {
  title: string;
  text: string;
}

export interface StuckPoint {
  id: string;
  title: string;
  icon: string; // FontAwesome class name
}

export interface ActiveSession {
  stuckPointTitle: string;
  intro: string;
  prompts: Prompt[];
  outro: string;
}

export interface Reflection {
  id: string; // timestamp
  stuckPointTitle: string;
  text: string;
  date: string;
}

export type Screen = 'home' | 'session' | 'reflections' | 'about';

export interface PromptData {
  [key: string]: {
    intro: string;
    outro: string;
    prompts: {
      entry: string[];
      unblocker: string[];
      momentum: string[];
    };
  };
}

export interface ThinkingStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  allTime: number;
}
