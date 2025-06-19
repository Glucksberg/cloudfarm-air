import { useApp } from '../contexts/AppContext';
import { generateId } from '../utils/helpers';

// Hook for managing clients
export function useClients() {
  const { state, dispatch, actionTypes } = useApp();
  
  const addClient = (clientData) => {
    const newClient = {
      ...clientData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: actionTypes.ADD_CLIENT, payload: newClient });
    return newClient;
  };
  
  const updateClient = (id, clientData) => {
    const updatedClient = {
      ...clientData,
      id,
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: actionTypes.UPDATE_CLIENT, payload: updatedClient });
    return updatedClient;
  };
  
  const deleteClient = (id) => {
    dispatch({ type: actionTypes.DELETE_CLIENT, payload: id });
  };
  
  const getClientById = (id) => {
    return state.clients.find(client => client.id === id);
  };
  
  const clearClients = () => {
    dispatch({ type: actionTypes.SET_CLIENTS, payload: [] });
  };
  
  const importClients = (clientsData) => {
    dispatch({ type: actionTypes.SET_CLIENTS, payload: clientsData });
  };
  
  return {
    clients: state.clients,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    clearClients,
    importClients
  };
}

// Hook for managing employees
export function useEmployees() {
  const { state, dispatch, actionTypes } = useApp();
  
  const addEmployee = (employeeData) => {
    const newEmployee = {
      ...employeeData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: actionTypes.ADD_EMPLOYEE, payload: newEmployee });
    return newEmployee;
  };
  
  const updateEmployee = (id, employeeData) => {
    const updatedEmployee = {
      ...employeeData,
      id,
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: actionTypes.UPDATE_EMPLOYEE, payload: updatedEmployee });
    return updatedEmployee;
  };
  
  const deleteEmployee = (id) => {
    dispatch({ type: actionTypes.DELETE_EMPLOYEE, payload: id });
  };
  
  const getEmployeeById = (id) => {
    return state.employees.find(employee => employee.id === id);
  };
  
  const clearEmployees = () => {
    dispatch({ type: actionTypes.SET_EMPLOYEES, payload: [] });
  };
  
  const importEmployees = (employeesData) => {
    dispatch({ type: actionTypes.SET_EMPLOYEES, payload: employeesData });
  };
  
  return {
    employees: state.employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    clearEmployees,
    importEmployees
  };
}

// Hook for managing aircrafts
export function useAircrafts() {
  const { state, dispatch, actionTypes } = useApp();
  
  const addAircraft = (aircraftData) => {
    const newAircraft = {
      ...aircraftData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: actionTypes.ADD_AIRCRAFT, payload: newAircraft });
    return newAircraft;
  };
  
  const updateAircraft = (id, aircraftData) => {
    const updatedAircraft = {
      ...aircraftData,
      id,
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: actionTypes.UPDATE_AIRCRAFT, payload: updatedAircraft });
    return updatedAircraft;
  };
  
  const deleteAircraft = (id) => {
    dispatch({ type: actionTypes.DELETE_AIRCRAFT, payload: id });
  };
  
  const getAircraftById = (id) => {
    return state.aircrafts.find(aircraft => aircraft.id === id);
  };
  
  const clearAircrafts = () => {
    dispatch({ type: actionTypes.SET_AIRCRAFTS, payload: [] });
  };
  
  const importAircrafts = (aircraftsData) => {
    dispatch({ type: actionTypes.SET_AIRCRAFTS, payload: aircraftsData });
  };
  
  return {
    aircrafts: state.aircrafts,
    addAircraft,
    updateAircraft,
    deleteAircraft,
    getAircraftById,
    clearAircrafts,
    importAircrafts
  };
}

// Hook for managing cultures
export function useCultures() {
  const { state, dispatch, actionTypes } = useApp();
  
  const addCulture = (cultureData) => {
    const newCulture = {
      ...cultureData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: actionTypes.ADD_CULTURE, payload: newCulture });
    return newCulture;
  };
  
  const updateCulture = (id, cultureData) => {
    const updatedCulture = {
      ...cultureData,
      id,
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: actionTypes.UPDATE_CULTURE, payload: updatedCulture });
    return updatedCulture;
  };
  
  const deleteCulture = (id) => {
    dispatch({ type: actionTypes.DELETE_CULTURE, payload: id });
  };
  
  const getCultureById = (id) => {
    return state.cultures.find(culture => culture.id === id);
  };
  
  const clearCultures = () => {
    dispatch({ type: actionTypes.SET_CULTURES, payload: [] });
  };
  
  const importCultures = (culturesData) => {
    dispatch({ type: actionTypes.SET_CULTURES, payload: culturesData });
  };
  
  return {
    cultures: state.cultures,
    addCulture,
    updateCulture,
    deleteCulture,
    getCultureById,
    clearCultures,
    importCultures
  };
}

// Hook for managing services
export function useServices() {
  const { state, dispatch, actionTypes } = useApp();
  
  const addService = (serviceData) => {
    const newService = {
      ...serviceData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: actionTypes.ADD_SERVICE, payload: newService });
    return newService;
  };
  
  const updateService = (id, serviceData) => {
    const updatedService = {
      ...serviceData,
      id,
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: actionTypes.UPDATE_SERVICE, payload: updatedService });
    return updatedService;
  };
  
  const deleteService = (id) => {
    dispatch({ type: actionTypes.DELETE_SERVICE, payload: id });
  };
  
  const getServiceById = (id) => {
    return state.services.find(service => service.id === id);
  };
  
  const getServicesForCurrentHarvest = () => {
    return state.services.filter(service => service.safraId === state.currentHarvest.id);
  };
  
  const clearServices = () => {
    dispatch({ type: actionTypes.SET_SERVICES, payload: [] });
  };
  
  const importServices = (servicesData) => {
    dispatch({ type: actionTypes.SET_SERVICES, payload: servicesData });
  };
  
  return {
    services: state.services,
    currentHarvestServices: getServicesForCurrentHarvest(),
    addService,
    updateService,
    deleteService,
    getServiceById,
    getServicesForCurrentHarvest,
    clearServices,
    importServices
  };
}

// Hook for managing harvests
export function useHarvests() {
  const { state, dispatch, actionTypes } = useApp();
  
  const addHarvest = (harvestData) => {
    const newHarvest = {
      ...harvestData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: actionTypes.ADD_HARVEST, payload: newHarvest });
    return newHarvest;
  };
  
  const updateHarvest = (id, harvestData) => {
    const updatedHarvest = {
      ...harvestData,
      id,
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: actionTypes.UPDATE_HARVEST, payload: updatedHarvest });
    return updatedHarvest;
  };
  
  const setCurrentHarvest = (harvest) => {
    // Update all harvests to inactive
    state.harvests.forEach(h => {
      if (h.id !== harvest.id) {
        dispatch({ 
          type: actionTypes.UPDATE_HARVEST, 
          payload: { ...h, active: false } 
        });
      }
    });
    
    // Set the selected harvest as active
    const activeHarvest = { ...harvest, active: true };
    dispatch({ type: actionTypes.UPDATE_HARVEST, payload: activeHarvest });
    dispatch({ type: actionTypes.SET_CURRENT_HARVEST, payload: activeHarvest });
  };
  
  return {
    harvests: state.harvests,
    currentHarvest: state.currentHarvest,
    addHarvest,
    updateHarvest,
    setCurrentHarvest
  };
}

