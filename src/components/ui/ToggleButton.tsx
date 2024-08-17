import React from 'react';
import { ThemeProvider, useTheme } from "@/components/ui/ThemeContext";
import { Moon, Sun } from 'lucide-react'; // Make sure you have lucide-react installed

export const ToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full ${
        theme === 'dark' ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-800'
      }`}
    >
      {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
};