import { useState } from "react";

export const useTheme = () => {
    const [isLight, setIsLight] = useState(() => {
        return localStorage.getItem('theme') === 'light';
    });
    
    const handleToggle = () => {
        const newTheme = !isLight;
        setIsLight(newTheme);
        const themeName = newTheme ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('theme', themeName);
    };

    return { isLight, handleToggle };
}