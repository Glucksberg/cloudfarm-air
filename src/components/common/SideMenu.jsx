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
  X
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
            <h2 className="cf-text-large cf-bold text-white">Menu</h2>
            <button
              onClick={closeSideMenu}
              className="cf-touch-target text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto cf-scrollbar-hide">
            {menuItems.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border-b border-gray-200">
                <div className="cf-flex cf-items-center cf-gap-3 cf-px-4 cf-py-3 bg-gray-50">
                  {section.icon}
                  <span className="cf-bold cf-text-small text-gray-700">
                    {section.section}
                  </span>
                </div>
                
                <div className="cf-py-2">
                  {section.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      to={item.path}
                      onClick={closeSideMenu}
                      className={`
                        cf-flex cf-items-center cf-gap-3 cf-px-6 cf-py-3 
                        transition-colors cf-touch-target
                        ${isActive(item.path) 
                          ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      {item.icon}
                      <span className="cf-text-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer */}
          <div className="cf-px-4 cf-py-4 border-t border-gray-200 bg-gray-50">
            <div className="cf-text-small text-gray-500 text-center">
              CloudFarm - Air v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideMenu;

