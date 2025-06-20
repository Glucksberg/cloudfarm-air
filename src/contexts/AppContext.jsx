import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { debounce, generateId } from '../utils/helpers';
import { gerarDadosCompletos } from '../utils/demoData';

// Initial state
const initialState = {
  // Current active harvest
  currentHarvest: {
    id: '1',
    name: '24/25',
    active: true,
    createdAt: new Date()
  },
  
  // All harvests
  harvests: [
    { id: '1', name: '24/25', active: true, createdAt: new Date() }
  ],
  
  // Services organized by harvest - estrutura: { harvestId: [services] }
  servicesByHarvest: {
    '1': [] // Safra 24/25 inicia vazia
  },
  
  // Entities - compartilhados entre safras
  clients: [],
  employees: [],
  aircrafts: [],
  cultures: [],
  
  // UI state
  sideMenuOpen: false,
  loading: false,
  
  // Service types with icons
  serviceTypes: [
    { id: 'fungicida', name: 'Fungicida', icon: '🍄' },
    { id: 'inseticida', name: 'Inseticida', icon: '🐛' },
    { id: 'fertilizante', name: 'Fertilizante', icon: '🌾' },
    { id: 'biologico', name: 'Biológico', icon: '🦠' },
    { id: 'semeadura', name: 'Semeadura', icon: '🌱' },
    { id: 'dessecacao', name: 'Dessecação', icon: '🍂' },
    { id: 'fogo', name: 'Fogo', icon: '🔥' },
    { id: 'outro', name: 'Outro', icon: '📌' }
  ]
};

// Action types
const actionTypes = {
  // UI actions
  TOGGLE_SIDE_MENU: 'TOGGLE_SIDE_MENU',
  SET_LOADING: 'SET_LOADING',
  
  // Harvest actions
  SET_CURRENT_HARVEST: 'SET_CURRENT_HARVEST',
  ADD_HARVEST: 'ADD_HARVEST',
  UPDATE_HARVEST: 'UPDATE_HARVEST',
  DELETE_HARVEST: 'DELETE_HARVEST',
  
  // Entity actions
  ADD_CLIENT: 'ADD_CLIENT',
  UPDATE_CLIENT: 'UPDATE_CLIENT',
  DELETE_CLIENT: 'DELETE_CLIENT',
  SET_CLIENTS: 'SET_CLIENTS',
  CLEAR_CLIENTS: 'CLEAR_CLIENTS',
  IMPORT_CLIENTS: 'IMPORT_CLIENTS',
  
  ADD_EMPLOYEE: 'ADD_EMPLOYEE',
  UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
  DELETE_EMPLOYEE: 'DELETE_EMPLOYEE',
  SET_EMPLOYEES: 'SET_EMPLOYEES',
  CLEAR_EMPLOYEES: 'CLEAR_EMPLOYEES',
  IMPORT_EMPLOYEES: 'IMPORT_EMPLOYEES',
  
  ADD_AIRCRAFT: 'ADD_AIRCRAFT',
  UPDATE_AIRCRAFT: 'UPDATE_AIRCRAFT',
  DELETE_AIRCRAFT: 'DELETE_AIRCRAFT',
  SET_AIRCRAFTS: 'SET_AIRCRAFTS',
  CLEAR_AIRCRAFTS: 'CLEAR_AIRCRAFTS',
  IMPORT_AIRCRAFTS: 'IMPORT_AIRCRAFTS',
  
  ADD_CULTURE: 'ADD_CULTURE',
  UPDATE_CULTURE: 'UPDATE_CULTURE',
  DELETE_CULTURE: 'DELETE_CULTURE',
  SET_CULTURES: 'SET_CULTURES',
  CLEAR_CULTURES: 'CLEAR_CULTURES',
  IMPORT_CULTURES: 'IMPORT_CULTURES',
  
  // Service actions - agora trabalham com safras
  ADD_SERVICE: 'ADD_SERVICE',
  UPDATE_SERVICE: 'UPDATE_SERVICE',
  DELETE_SERVICE: 'DELETE_SERVICE',
  SET_SERVICES_FOR_HARVEST: 'SET_SERVICES_FOR_HARVEST',
  CLEAR_SERVICES_FOR_HARVEST: 'CLEAR_SERVICES_FOR_HARVEST',
  
  // Data actions
  LOAD_DATA: 'LOAD_DATA',
  RESET_DATA: 'RESET_DATA'
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_SIDE_MENU:
      return {
        ...state,
        sideMenuOpen: !state.sideMenuOpen
      };
      
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case actionTypes.SET_CURRENT_HARVEST:
      // Atualiza a safra atual e marca as outras como inativas
      const updatedHarvests = state.harvests.map(harvest => ({
        ...harvest,
        active: harvest.id === action.payload.id
      }));
      
      return {
        ...state,
        currentHarvest: action.payload,
        harvests: updatedHarvests
      };
      
    case actionTypes.ADD_HARVEST:
      // Cria nova safra e inicializa array de serviços vazio
      return {
        ...state,
        harvests: [...state.harvests, action.payload],
        servicesByHarvest: {
          ...state.servicesByHarvest,
          [action.payload.id]: []
        }
      };
      
    case actionTypes.UPDATE_HARVEST:
      return {
        ...state,
        harvests: state.harvests.map(harvest =>
          harvest.id === action.payload.id ? action.payload : harvest
        )
      };
      
    case actionTypes.DELETE_HARVEST:
      const { [action.payload]: deletedServices, ...remainingServices } = state.servicesByHarvest;
      return {
        ...state,
        harvests: state.harvests.filter(harvest => harvest.id !== action.payload),
        servicesByHarvest: remainingServices
      };
      
    // Client actions
    case actionTypes.ADD_CLIENT:
      return {
        ...state,
        clients: [...state.clients, action.payload]
      };
      
    case actionTypes.UPDATE_CLIENT:
      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === action.payload.id ? action.payload : client
        )
      };
      
    case actionTypes.DELETE_CLIENT:
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload)
      };
      
    case actionTypes.SET_CLIENTS:
      return {
        ...state,
        clients: action.payload
      };
      
    // Employee actions
    case actionTypes.ADD_EMPLOYEE:
      return {
        ...state,
        employees: [...state.employees, action.payload]
      };
      
    case actionTypes.UPDATE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.map(employee =>
          employee.id === action.payload.id ? action.payload : employee
        )
      };
      
    case actionTypes.DELETE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.filter(employee => employee.id !== action.payload)
      };
      
    case actionTypes.SET_EMPLOYEES:
      return {
        ...state,
        employees: action.payload
      };
      
    // Aircraft actions
    case actionTypes.ADD_AIRCRAFT:
      return {
        ...state,
        aircrafts: [...state.aircrafts, action.payload]
      };
      
    case actionTypes.UPDATE_AIRCRAFT:
      return {
        ...state,
        aircrafts: state.aircrafts.map(aircraft =>
          aircraft.id === action.payload.id ? action.payload : aircraft
        )
      };
      
    case actionTypes.DELETE_AIRCRAFT:
      return {
        ...state,
        aircrafts: state.aircrafts.filter(aircraft => aircraft.id !== action.payload)
      };
      
    case actionTypes.SET_AIRCRAFTS:
      return {
        ...state,
        aircrafts: action.payload
      };
      
    // Culture actions
    case actionTypes.ADD_CULTURE:
      return {
        ...state,
        cultures: [...state.cultures, action.payload]
      };
      
    case actionTypes.UPDATE_CULTURE:
      return {
        ...state,
        cultures: state.cultures.map(culture =>
          culture.id === action.payload.id ? action.payload : culture
        )
      };
      
    case actionTypes.DELETE_CULTURE:
      return {
        ...state,
        cultures: state.cultures.filter(culture => culture.id !== action.payload)
      };
      
    case actionTypes.SET_CULTURES:
      return {
        ...state,
        cultures: action.payload
      };
      
    // Service actions
    case actionTypes.ADD_SERVICE:
      const currentHarvestId = state.currentHarvest.id;
      return {
        ...state,
        servicesByHarvest: {
          ...state.servicesByHarvest,
          [currentHarvestId]: [...(state.servicesByHarvest[currentHarvestId] || []), action.payload]
        }
      };
      
    case actionTypes.UPDATE_SERVICE:
      const updateHarvestId = state.currentHarvest.id;
      return {
        ...state,
        servicesByHarvest: {
          ...state.servicesByHarvest,
          [updateHarvestId]: state.servicesByHarvest[updateHarvestId].map(service =>
            service.id === action.payload.id ? action.payload : service
          )
        }
      };
      
    case actionTypes.DELETE_SERVICE:
      const deleteHarvestId = state.currentHarvest.id;
      return {
        ...state,
        servicesByHarvest: {
          ...state.servicesByHarvest,
          [deleteHarvestId]: state.servicesByHarvest[deleteHarvestId].filter(
            service => service.id !== action.payload
          )
        }
      };
      
    case actionTypes.SET_SERVICES_FOR_HARVEST:
      return {
        ...state,
        servicesByHarvest: {
          ...state.servicesByHarvest,
          [action.payload.harvestId]: action.payload.services
        }
      };
      
    case actionTypes.CLEAR_SERVICES_FOR_HARVEST:
      return {
        ...state,
        servicesByHarvest: {
          ...state.servicesByHarvest,
          [action.payload]: []
        }
      };
      
    case actionTypes.LOAD_DATA:
      return {
        ...state,
        ...action.payload
      };
      
    case actionTypes.RESET_DATA:
      return {
        ...initialState,
        currentHarvest: state.currentHarvest,
        harvests: state.harvests,
        servicesByHarvest: {
          [state.currentHarvest.id]: []
        }
      };
      
    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const saveTimeoutRef = useRef(null);
  
  // Load data from localStorage on mount
  useEffect(() => {
    console.log('🔄 Carregando dados do localStorage...');
    const savedData = localStorage.getItem('cloudfarm-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('✅ Dados encontrados no localStorage:', parsedData);
        dispatch({ type: actionTypes.LOAD_DATA, payload: parsedData });
      } catch (error) {
        console.error('❌ Erro ao carregar dados salvos:', error);
      }
    } else {
      console.log('ℹ️ Nenhum dado encontrado no localStorage, usando dados padrão');
    }
  }, []);
  
  // Debounced save function
  const debouncedSave = useRef(
    debounce((dataToSave) => {
      try {
        localStorage.setItem('cloudfarm-data', JSON.stringify(dataToSave));
        console.log('💾 Dados salvos no localStorage:', {
          clients: dataToSave.clients.length,
          employees: dataToSave.employees.length,
          aircrafts: dataToSave.aircrafts.length,
          cultures: dataToSave.cultures.length,
          services: dataToSave.services.length
        });
      } catch (error) {
        console.error('❌ Erro ao salvar dados no localStorage:', error);
        // Handle localStorage quota exceeded
        if (error.name === 'QuotaExceededError') {
          alert('Armazenamento local cheio. Considere fazer backup e limpar dados antigos.');
        }
      }
    }, 500)
  ).current;
  
  // Save data to localStorage whenever state changes (debounced)
  useEffect(() => {
    const dataToSave = {
      currentHarvest: state.currentHarvest,
      harvests: state.harvests,
      servicesByHarvest: state.servicesByHarvest,
      clients: state.clients,
      employees: state.employees,
      aircrafts: state.aircrafts,
      cultures: state.cultures
    };
    
    debouncedSave(dataToSave);
  }, [state.currentHarvest, state.harvests, state.servicesByHarvest, state.clients, state.employees, state.aircrafts, state.cultures, debouncedSave]);
  
  // Clear all data function
  const clearAllData = () => {
    console.log('🗑️ Limpando todos os dados...');
    dispatch({ type: actionTypes.RESET_DATA });
    localStorage.removeItem('cloudfarm-data');
    console.log('✅ Todos os dados foram removidos!');
  };
  
  // Harvest management functions
  const addHarvest = (name) => {
    const newHarvest = {
      id: generateId(),
      name: name,
      active: false,
      createdAt: new Date()
    };
    dispatch({ type: actionTypes.ADD_HARVEST, payload: newHarvest });
    return newHarvest;
  };
  
  const updateHarvest = (harvestId, updates) => {
    const harvest = state.harvests.find(h => h.id === harvestId);
    if (harvest) {
      const updatedHarvest = { ...harvest, ...updates };
      dispatch({ type: actionTypes.UPDATE_HARVEST, payload: updatedHarvest });
      return updatedHarvest;
    }
  };
  
  const deleteHarvest = (harvestId) => {
    // Não permite excluir se for a única safra
    if (state.harvests.length <= 1) {
      throw new Error('Não é possível excluir a única safra existente');
    }
    
    // Se for a safra ativa, define outra como ativa
    if (state.currentHarvest.id === harvestId) {
      const otherHarvest = state.harvests.find(h => h.id !== harvestId);
      if (otherHarvest) {
        setCurrentHarvest(otherHarvest.id);
      }
    }
    
    dispatch({ type: actionTypes.DELETE_HARVEST, payload: harvestId });
  };
  
  const setCurrentHarvest = (harvestId) => {
    const harvest = state.harvests.find(h => h.id === harvestId);
    if (harvest) {
      const updatedHarvest = { ...harvest, active: true };
      dispatch({ type: actionTypes.SET_CURRENT_HARVEST, payload: updatedHarvest });
    }
  };
  
  // Get current harvest services
  const getCurrentHarvestServices = () => {
    return state.servicesByHarvest[state.currentHarvest.id] || [];
  };
  
  // Set current safra function (legacy - mantido para compatibilidade)
  const setCurrentSafra = (safraName) => {
    const existingHarvest = state.harvests.find(h => h.name === safraName);
    if (existingHarvest) {
      setCurrentHarvest(existingHarvest.id);
    } else {
      const newHarvest = addHarvest(safraName);
      setCurrentHarvest(newHarvest.id);
    }
  };
  
  // Populate system with demo data
  const populateSystemDemo = () => {
    console.log('🚀 Populando sistema com dados de demonstração...');
    
    try {
      const dadosDemo = gerarDadosCompletos();
      
      // Carrega entidades compartilhadas
      dispatch({ type: actionTypes.SET_CLIENTS, payload: dadosDemo.clients });
      dispatch({ type: actionTypes.SET_EMPLOYEES, payload: dadosDemo.employees });
      dispatch({ type: actionTypes.SET_AIRCRAFTS, payload: dadosDemo.aircrafts });
      dispatch({ type: actionTypes.SET_CULTURES, payload: dadosDemo.cultures });
      
      // Carrega serviços para a safra atual
      const currentHarvestId = state.currentHarvest.id;
      dispatch({ 
        type: actionTypes.SET_SERVICES_FOR_HARVEST, 
        payload: { 
          harvestId: currentHarvestId, 
          services: dadosDemo.services 
        } 
      });
      
      console.log('✅ Sistema populado com sucesso!');
      return true;
    } catch (error) {
      console.error('❌ Erro ao popular sistema:', error);
      return false;
    }
  };
  
  // Get current safra name
  const currentSafra = state.currentHarvest?.name;
  
  const value = {
    state,
    dispatch,
    actionTypes,
    
    // Data management
    clearAllData,
    populateSystemDemo,
    
    // Harvest management
    addHarvest,
    updateHarvest,
    deleteHarvest,
    setCurrentHarvest,
    getCurrentHarvestServices,
    
    // Legacy compatibility
    setCurrentSafra,
    currentSafra
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;

