import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import './theme-toggle-styles.css';

export const ThemeToggle = () => {
    const [isLight, setIsLight] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'light';
    });

    const handleToggle = () => {
        const newTheme = !isLight;
        setIsLight(newTheme);
        const themeName = newTheme ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('theme', themeName);
    };

    return (
        <button className="theme-toggle" onClick={handleToggle}>
            {isLight ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
};