import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle-btn" onClick={toggleTheme} title={theme === 'light' ? 'Dark mode' : 'Light mode'}>
      <i className={`bi ${theme === 'light' ? 'bi-moon-fill' : 'bi-sun-fill'}`} />
    </button>
  );
}
