import React from 'react';

const ThemeButton = ({ theme, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl px-4 py-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl
        ${isSelected 
          ? `ring-2 ring-purple-400 bg-white text-gray-900 shadow-lg` 
          : 'glass-effect text-gray-800 hover:bg-white/70'
        }
      `}
    >
      <div className="flex items-center space-x-3">
        <span className="text-xl">{theme.icon}</span>
        <span className="text-base font-medium">{theme.name}</span>
      </div>
      
      {/* 光效动画 */}
      <div className="absolute inset-0 -top-1 -left-1 -right-1 -bottom-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 shimmer"></div>
    </button>
  );
};

export default ThemeButton;
