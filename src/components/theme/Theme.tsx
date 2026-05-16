import { useState } from "react";
import './theme-styles.css';
import darkMoon from '../../assets/darkTheme.png';
import lightSun from '../../assets/sun.png';

export const Theme = () => {
    const [isLight, setIsLight] = useState(false);

    const handleToggle = () => {
        const newTheme = !isLight;
        setIsLight(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme ? 'light' : 'dark')
    }

    return (
        <div className='container'>
            <div className="theme-container" onClick={handleToggle}>
                <img src={isLight ? lightSun : darkMoon} alt={isLight ? 'темная тема' : 'светлая тема'} className='dark-moon'/>
            </div>
        </div>
    )
}