import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { debounce, generateId } from '../utils/helpers';
import { gerarDadosCompletos } from '../utils/demoData';

// Initial state
const initialState = {
  // Current active harvest
  currentHarvest: {
    id: '1',
    name: '24/25',
    active: true
  },
  
  // All harvests
  harvests: [
    { id: '1', name: '24/25', active: true, createdAt: new Date() }
  ],
  
  // Entities - inicialmente vazios
  clients: [],
  employees: [],
  aircrafts: [],
  cultures: [],
  services: [],
  
  // UI state
  sideMenuOpen: false,
  loading: false,
  
  // Service types with icons
  serviceTypes: [
    { id: 'fungicida', name: 'Fungicida', icon: '🐾' },
    { id: 'inseticida', name: 'Inseticida', icon: '🐛' },
    { id: 'fertilizante', name: 'Fertilizante', icon: '🌾' },
    { id: 'adubacao', name: 'Adubação', icon: '🌱' },
    { id: 'semeadura', name: 'Semeadura', icon: '🌱' },
    { id: 'dessecacao', name: 'Dessecação', icon: '🌵' },
    { id: 'fogo', name: 'Fogo', icon: '🔥' },
    { id: 'outro', name: 'Outro', icon: '✳️' }
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
  
  // Entity actions
  ADD_CLIENT: 'ADD_CLIENT',
  UPDATE_CLIENT: 'UPDATE_CLIENT',
  DELETE_CLIENT: 'DELETE_CLIENT',
  SET_CLIENTS: 'SET_CLIENTS',
  
  ADD_EMPLOYEE: 'ADD_EMPLOYEE',
  UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
  DELETE_EMPLOYEE: 'DELETE_EMPLOYEE',
  SET_EMPLOYEES: 'SET_EMPLOYEES',
  
  ADD_AIRCRAFT: 'ADD_AIRCRAFT',
  UPDATE_AIRCRAFT: 'UPDATE_AIRCRAFT',
  DELETE_AIRCRAFT: 'DELETE_AIRCRAFT',
  SET_AIRCRAFTS: 'SET_AIRCRAFTS',
  
  ADD_CULTURE: 'ADD_CULTURE',
  UPDATE_CULTURE: 'UPDATE_CULTURE',
  DELETE_CULTURE: 'DELETE_CULTURE',
  SET_CULTURES: 'SET_CULTURES',
  
  ADD_SERVICE: 'ADD_SERVICE',
  UPDATE_SERVICE: 'UPDATE_SERVICE',
  DELETE_SERVICE: 'DELETE_SERVICE',
  SET_SERVICES: 'SET_SERVICES',
  
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
      return {
        ...state,
        currentHarvest: action.payload
      };
      
    case actionTypes.ADD_HARVEST:
      return {
        ...state,
        harvests: [...state.harvests, action.payload]
      };
      
    case actionTypes.UPDATE_HARVEST:
      return {
        ...state,
        harvests: state.harvests.map(harvest =>
          harvest.id === action.payload.id ? action.payload : harvest
        )
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
      return {
        ...state,
        services: [...state.services, action.payload]
      };
      
    case actionTypes.UPDATE_SERVICE:
      return {
        ...state,
        services: state.services.map(service =>
          service.id === action.payload.id ? action.payload : service
        )
      };
      
    case actionTypes.DELETE_SERVICE:
      return {
        ...state,
        services: state.services.filter(service => service.id !== action.payload)
      };
      
    case actionTypes.SET_SERVICES:
      return {
        ...state,
        services: action.payload
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
        harvests: state.harvests
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
      clients: state.clients,
      employees: state.employees,
      aircrafts: state.aircrafts,
      cultures: state.cultures,
      services: state.services
    };
    
    debouncedSave(dataToSave);
  }, [state.currentHarvest, state.harvests, state.clients, state.employees, state.aircrafts, state.cultures, state.services, debouncedSave]);
  
  // Clear all data function
  const clearAllData = () => {
    console.log('🗑️ Limpando todos os dados...');
    dispatch({ type: actionTypes.RESET_DATA });
    localStorage.removeItem('cloudfarm-data');
    console.log('✅ Todos os dados foram removidos!');
  };
  
  // Set current safra function
  const setCurrentSafra = (safraName) => {
    const newSafra = {
      id: generateId(),
      name: safraName,
      active: true,
      createdAt: new Date()
    };
    dispatch({ type: actionTypes.SET_CURRENT_HARVEST, payload: newSafra });
    dispatch({ type: actionTypes.ADD_HARVEST, payload: newSafra });
  };
  
  // Populate system with demo data
  const populateSystemDemo = () => {
    console.log('🚀 Populando sistema com dados de demonstração...');
    
    try {
      const dadosDemo = gerarDadosCompletos();
      
      // Carrega todos os dados de uma vez
      dispatch({ type: actionTypes.SET_CLIENTS, payload: dadosDemo.clients });
      dispatch({ type: actionTypes.SET_EMPLOYEES, payload: dadosDemo.employees });
      dispatch({ type: actionTypes.SET_AIRCRAFTS, payload: dadosDemo.aircrafts });
      dispatch({ type: actionTypes.SET_CULTURES, payload: dadosDemo.cultures });
      dispatch({ type: actionTypes.SET_SERVICES, payload: dadosDemo.services });
      
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
    clearAllData,
    setCurrentSafra,
    currentSafra,
    populateSystemDemo
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

