export interface Prompt {
  title: string;
  text: string;
  duration: number; // in minutes
}

export interface StuckPoint {
  id: string;
  title: string;
  icon: string; // FontAwesome class name
  session: {
    intro: string;
    prompts: Prompt[];
    outro: string;
  };
}

export interface Reflection {
  id: string; // timestamp
  stuckPointTitle: string;
  text: string;
  date: string;
}

export type Screen = 'home' | 'session' | 'reflections' | 'about';
