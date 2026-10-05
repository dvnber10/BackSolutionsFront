import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeChoice = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'backsolutions:theme';

type ThemeContextValue = {
  choice: ThemeChoice;
  resolved: ResolvedTheme;
  setChoice: (choice: ThemeChoice) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredChoice(): ThemeChoice {
  if (typeof window === 'undefined') {
    return 'system';
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
}

function systemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'dark';
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function resolve(choice: ThemeChoice): ResolvedTheme {
  return choice === 'system' ? systemTheme() : choice;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>(readStoredChoice);
  const [resolved, setResolved] = useState<ResolvedTheme>(() => resolve(readStoredChoice()));

  // El atributo va en <html> y no en <body> para que el color-scheme y los controles
  // nativos del navegador también cambien, y para evitar el flash blanco al cargar.
  useEffect(() => {
    const next = resolve(choice);

    setResolved(next);
    document.documentElement.dataset.theme = next;

    if (choice === 'system') {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, choice);
    }
  }, [choice]);

  // Con "system" hay que seguir el cambio del sistema operativo en vivo.
  useEffect(() => {
    if (choice !== 'system' || !window.matchMedia) {
      return;
    }

    const query = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      const next = systemTheme();

      setResolved(next);
      document.documentElement.dataset.theme = next;
    };

    query.addEventListener('change', onChange);

    return () => query.removeEventListener('change', onChange);
  }, [choice]);

  const setChoice = useCallback((next: ThemeChoice) => setChoiceState(next), []);

  const toggle = useCallback(() => {
    setChoiceState((current) => (resolve(current) === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(
    () => ({ choice, resolved, setChoice, toggle }),
    [choice, resolved, setChoice, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme tiene que usarse dentro de <ThemeProvider>.');
  }

  return context;
}
