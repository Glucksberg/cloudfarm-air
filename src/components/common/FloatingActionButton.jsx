import React from 'react';
import { Plus } from 'lucide-react';

function FloatingActionButton({ onClick, icon, label = 'Adicionar' }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 group"
      aria-label={label}
      title={label}
    >
      {/* Main button */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
        
        {/* Button background with gradient */}
        <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
          {/* Inner glow */}
          <div className="absolute inset-1 bg-gradient-to-br from-blue-400/30 to-transparent rounded-full"></div>
          
          {/* Icon container */}
          <div className="relative flex items-center justify-center">
            {icon || <Plus size={24} className="text-white" strokeWidth={2.5} />}
          </div>
          
          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-0 group-hover:opacity-20 animate-ping"></div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          {label}
          {/* Tooltip arrow */}
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
        </div>
      </div>
    </button>
  );
}

export default FloatingActionButton;

