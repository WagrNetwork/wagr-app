import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      setIsDark(JSON.parse(saved));
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  return [isDark, setIsDark] as const;
}
