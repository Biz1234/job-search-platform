import { useEffect } from 'react';
import '../styles/ThemeToggle.css';

function ThemeToggle() {
    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    return (
        <button onClick={toggleTheme} className="theme-toggle">
            Toggle Theme
        </button>
    );
}

export default ThemeToggle;