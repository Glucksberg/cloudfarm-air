import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Menu, X, Home } from 'lucide-react';

function Header({ title = 'CloudFarm - Air' }) {
  const { state, dispatch, actionTypes } = useApp();
  const navigate = useNavigate();
  
  const toggleSideMenu = () => {
    dispatch({ type: actionTypes.TOGGLE_SIDE_MENU });
  };
  
  const goToHome = () => {
    navigate('/');
  };
  
  return (
    <header className="cf-bg-primary cf-flex cf-items-center cf-justify-between cf-px-4 cf-py-2 sticky top-0 z-50">
      <div className="cf-flex cf-items-center cf-gap-4">
        <button
          onClick={toggleSideMenu}
          className="cf-touch-target text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {state.sideMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <h1 className="cf-text-large cf-bold text-white truncate">
          {title}
        </h1>
      </div>
      
      <div className="cf-flex cf-items-center cf-gap-4">
        <div className="cf-text-small text-white/80">
          Safra: {state.currentHarvest?.name || 'N/A'}
        </div>
        
        <button
          onClick={goToHome}
          className="cf-touch-target text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Ir para o Dashboard"
          title="Voltar ao Dashboard"
        >
          <Home size={24} />
        </button>
      </div>
    </header>
  );
}

export default Header;

