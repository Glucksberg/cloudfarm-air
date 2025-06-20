import React from 'react';

function AirplaneIcon({ size = 24, className = '', color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fuselagem principal */}
      <path
        d="M2 12h7l-1-3h4l2 3h6c1 0 2 1 2 2s-1 2-2 2h-6l-2 3h-4l1-3H2z"
        fill={color}
        opacity="0.9"
      />
      
      {/* Asas principais */}
      <path
        d="M6 9l8-2v2l4 1v4l-4 1v2l-8-2V9z"
        fill={color}
      />
      
      {/* Cauda */}
      <path
        d="M18 10v4l3-1v-2l-3-1z"
        fill={color}
        opacity="0.8"
      />
      
      {/* Hélice */}
      <circle
        cx="3"
        cy="12"
        r="1.5"
        fill={color}
        opacity="0.7"
      />
      
      {/* Detalhes da fuselagem */}
      <rect
        x="8"
        y="11"
        width="8"
        height="2"
        fill="white"
        opacity="0.3"
        rx="1"
      />
      
      {/* Janelas */}
      <circle cx="10" cy="12" r="0.5" fill="white" opacity="0.6" />
      <circle cx="12" cy="12" r="0.5" fill="white" opacity="0.6" />
      <circle cx="14" cy="12" r="0.5" fill="white" opacity="0.6" />
    </svg>
  );
}

export default AirplaneIcon; 