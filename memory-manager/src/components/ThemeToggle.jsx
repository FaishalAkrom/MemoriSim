import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('memorisim-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('memorisim-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle-btn"
      title={theme === 'dark' ? 'Ganti ke Light Mode' : 'Ganti ke Dark Mode'}
    >
      {theme === 'dark' ? (
        <>
          <Sun size={16} />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon size={16} />
          <span>Dark</span>
        </>
      )}
    </button>
  );
}