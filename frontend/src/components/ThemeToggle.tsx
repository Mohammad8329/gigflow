import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className={`relative w-[72px] h-[36px] p-1 rounded-full flex items-center justify-between cursor-pointer transition-all duration-300 shadow-sm border select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        ${isDark 
          ? 'bg-[#2a303c] border-slate-700/80' 
          : 'bg-[#ffffff] border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
        }`}
      aria-label="Toggle Theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {/* Icon Left: Sun */}
      <div className={`flex items-center justify-center transition-all duration-300 ml-1.5 z-10 ${isDark ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <Sun className="h-[18px] w-[18px] text-amber-500 fill-amber-500/10 stroke-[2.5]" />
      </div>

      {/* Sliding Active Knob */}
      <div
        className={`absolute top-1 left-1 w-[26px] h-[26px] rounded-full transition-all duration-300 ease-out z-20
          ${isDark 
            ? 'bg-transparent border-[3px] border-white translate-x-0' 
            : 'bg-[#fef3c7] border-[3.5px] border-amber-500 shadow-sm translate-x-[36px]'
          }`}
      />

      {/* Icon Right: Moon */}
      <div className={`flex items-center justify-center transition-all duration-300 mr-1.5 z-10 ${isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
        <Moon className={`h-[18px] w-[18px] stroke-[2.2] ${isDark ? 'text-white' : 'text-slate-400'}`} />
      </div>
    </button>
  );
};