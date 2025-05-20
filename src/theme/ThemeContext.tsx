
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeName, ThemeConfig, themes } from './themeConfig';

type ThemeContextType = {
  currentTheme: ThemeConfig;
  setTheme: (themeName: ThemeName) => void;
  themeName: ThemeName;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>('pastel');
  const currentTheme = themes[themeName];

  const setTheme = (name: ThemeName) => {
    setThemeName(name);
    // Update CSS variables when theme changes
    document.documentElement.style.setProperty('--primary-color', currentTheme.colors.primary);
    document.documentElement.style.setProperty('--secondary-color', currentTheme.colors.secondary);
    document.documentElement.style.setProperty('--accent-color', currentTheme.colors.accent);
    document.documentElement.style.setProperty('--background-color', currentTheme.colors.background);
    document.documentElement.style.setProperty('--card-bg', currentTheme.colors.cardBg);
    document.documentElement.style.setProperty('--text-color', currentTheme.colors.text);
    document.documentElement.style.setProperty('--text-muted', currentTheme.colors.textMuted);
    document.documentElement.style.setProperty('--border-color', currentTheme.colors.border);
    document.documentElement.style.setProperty('--highlight-color', currentTheme.colors.highlight);
    
    // Set typography class
    document.body.className = currentTheme.typography;
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
