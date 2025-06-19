import React from 'react';
import { Plus } from 'lucide-react';

function FloatingActionButton({ onClick, icon, label = 'Adicionar' }) {
  return (
    <button
      onClick={onClick}
      className="cf-fab"
      aria-label={label}
      title={label}
    >
      {icon || <Plus size={24} />}
    </button>
  );
}

export default FloatingActionButton;

