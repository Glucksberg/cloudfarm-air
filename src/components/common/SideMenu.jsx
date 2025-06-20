import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  Settings, 
  FileText, 
  Users, 
  UserCheck, 
  Plane, 
  Wheat,
  BarChart3,
  X,
  Home,
  ChevronRight
} from 'lucide-react';

function SideMenu() {
  const { state, dispatch, actionTypes } = useApp();
  const location = useLocation();
  
  const closeSideMenu = () => {
    dispatch({ type: actionTypes.TOGGLE_SIDE_MENU });
  };
  
  const menuItems = [
    {
      section: 'Configurações',
      icon: <Settings size={20} />,
      items: [
        { path: '/configuracoes', label: 'Safras & Backup', icon: <Settings size={16} /> }
      ]
    },
    {
      section: 'Operações',
      icon: <FileText size={20} />,
      items: [
        { path: '/servicos', label: 'Lista de Serviços', icon: <FileText size={16} /> }
      ]
    },
    {
      section: 'Cadastros',
      icon: <Users size={20} />,
      items: [
        { path: '/clientes', label: 'Clientes', icon: <Users size={16} /> },
        { path: '/funcionarios', label: 'Funcionários', icon: <UserCheck size={16} /> },
        { path: '/aeronaves', label: 'Aeronaves', icon: <Plane size={16} /> },
        { path: '/culturas', label: 'Culturas', icon: <Wheat size={16} /> }
      ]
    },
    {
      section: 'Relatórios',
      icon: <BarChart3 size={20} />,
      items: [
        { path: '/relatorios', label: 'Relatórios', icon: <BarChart3 size={16} /> }
      ]
    }
  ];
  
  const isActive = (path) => location.pathname === path;
  
  if (!state.sideMenuOpen) return null;
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeSideMenu}
      />
      
      {/* Side Menu */}
      <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-xl transform transition-transform duration-300">
        <div className="cf-flex cf-flex-col h-full">
          {/* Header */}
          <div className="cf-bg-primary cf-flex cf-items-center cf-justify-between cf-px-4 cf-py-4">
            <div className="cf-flex cf-items-center cf-gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg cf-flex cf-items-center cf-justify-center">
                <span className="text-white font-bold text-sm">CF</span>
              </div>
              <h2 className="cf-text-large cf-bold text-white">CloudFarm - Air</h2>
            </div>
            <button
              onClick={closeSideMenu}
              className="cf-touch-target text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Dashboard Link - Featured */}
          <div className="cf-px-3 cf-py-3 border-b border-gray-200">
            <Link
              to="/"
              onClick={closeSideMenu}
              className={`
                cf-flex cf-items-center cf-gap-4 cf-p-3 rounded-xl
                transition-all duration-200 cf-touch-target
                ${isActive('/') 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <div className={`
                w-12 h-12 rounded-xl cf-flex cf-items-center cf-justify-center flex-shrink-0
                ${isActive('/') ? 'bg-white/20' : 'bg-blue-100'}
              `}>
                <Home size={24} className={isActive('/') ? 'text-white' : 'text-blue-600'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="cf-text-medium cf-bold">Dashboard</div>
                <div className={`cf-text-small ${isActive('/') ? 'text-blue-100' : 'text-gray-500'}`}>
                  Página Principal
                </div>
              </div>
              <ChevronRight size={18} className={`flex-shrink-0 ${isActive('/') ? 'text-white' : 'text-gray-400'}`} />
            </Link>
          </div>
          
          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto cf-scrollbar-hide">
            {menuItems.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border-b border-gray-100 last:border-b-0">
                <div className="cf-flex cf-items-center cf-gap-3 cf-px-4 cf-py-3 bg-gray-50/50">
                  <div className="w-6 h-6 cf-flex cf-items-center cf-justify-center">
                    {section.icon}
                  </div>
                  <span className="cf-bold cf-text-small text-gray-600 uppercase tracking-wide">
                    {section.section}
                  </span>
                </div>
                
                <div className="cf-py-1">
                  {section.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      to={item.path}
                      onClick={closeSideMenu}
                      className={`
                        cf-flex cf-items-center cf-justify-between cf-px-4 cf-py-3 cf-mx-2 rounded-lg
                        transition-all duration-200 cf-touch-target
                        ${isActive(item.path) 
                          ? 'bg-blue-50 text-blue-600 shadow-sm' 
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="cf-flex cf-items-center cf-gap-3">
                        <div className={`
                          w-8 h-8 rounded-lg cf-flex cf-items-center cf-justify-center
                          ${isActive(item.path) ? 'bg-blue-100' : 'bg-gray-100'}
                        `}>
                          {React.cloneElement(item.icon, {
                            className: isActive(item.path) ? 'text-blue-600' : 'text-gray-500'
                          })}
                        </div>
                        <span className="cf-text-medium">{item.label}</span>
                      </div>
                      <ChevronRight size={14} className={isActive(item.path) ? 'text-blue-400' : 'text-gray-300'} />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer */}
          <div className="cf-px-4 cf-py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="cf-flex cf-items-center cf-justify-center cf-gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded cf-flex cf-items-center cf-justify-center">
                <span className="text-white font-bold text-xs">CF</span>
              </div>
              <div className="cf-text-small text-gray-600">
                <span className="font-semibold">CloudFarm Air</span> v1.0
              </div>
            </div>
            <div className="cf-text-small text-gray-400 text-center cf-mt-1">
              Safra: {state.currentHarvest?.name || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideMenu;

