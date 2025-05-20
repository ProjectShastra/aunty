
// Theme configuration for Aunty app
export type ThemeName = 'pastel' | 'earth' | 'mystical';
export type TypographyStyle = 'playful' | 'elegant';

export interface ThemeConfig {
  name: ThemeName;
  typography: TypographyStyle;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    cardBg: string;
    text: string;
    textMuted: string;
    border: string;
    highlight: string;
  };
}

// Warm Pastels (Version A)
export const pastelTheme: ThemeConfig = {
  name: 'pastel',
  typography: 'playful',
  colors: {
    primary: '#6d4773',
    secondary: '#e45964',
    accent: '#e5deff',
    background: '#ffffff',
    cardBg: '#faf3eb',
    text: '#6d4773',
    textMuted: '#6d4773/70',
    border: '#e45964/20',
    highlight: '#e5deff',
  }
};

// Earth Tones (Version B)
export const earthTheme: ThemeConfig = {
  name: 'earth',
  typography: 'elegant',
  colors: {
    primary: '#5d4037',
    secondary: '#8d6e63',
    accent: '#d7ccc8',
    background: '#f5f5f0',
    cardBg: '#efebe9',
    text: '#3e2723',
    textMuted: '#3e2723/70',
    border: '#8d6e63/20',
    highlight: '#d7ccc8',
  }
};

// Mystical Premium (Version C)
export const mysticalTheme: ThemeConfig = {
  name: 'mystical',
  typography: 'elegant',
  colors: {
    primary: '#303f9f',
    secondary: '#b2721d',
    accent: '#9fa8da',
    background: '#000c2b',
    cardBg: '#001242',
    text: '#ffffff',
    textMuted: '#ffffff/70',
    border: '#b2721d/40',
    highlight: '#9fa8da',
  }
};

export const themes: Record<ThemeName, ThemeConfig> = {
  pastel: pastelTheme,
  earth: earthTheme,
  mystical: mysticalTheme,
};
