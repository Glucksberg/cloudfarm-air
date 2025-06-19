import { useServices, useClients, useEmployees, useAircrafts, useCultures } from './useEntities';

// Hook for dashboard metrics and calculations
export function useDashboard() {
  const { currentHarvestServices } = useServices();
  const { clients } = useClients();
  const { employees } = useEmployees();
  const { aircrafts } = useAircrafts();
  const { cultures } = useCultures();
  
  // Calculate total area applied
  const totalAreaApplied = currentHarvestServices.reduce((total, service) => {
    return total + (parseFloat(service.area) || 0);
  }, 0);
  
  // Calculate total flight hours
  const totalFlightHours = currentHarvestServices.reduce((total, service) => {
    const inicio = parseFloat(service.horimetroInicio) || 0;
    const final = parseFloat(service.horimetroFinal) || 0;
    return total + Math.max(0, final - inicio);
  }, 0);
  
  // Calculate total translado hours
  const totalTransladoHours = currentHarvestServices.reduce((total, service) => {
    return total + (parseFloat(service.translado) || 0);
  }, 0);
  
  // Calculate total revenue
  const totalRevenue = currentHarvestServices.reduce((total, service) => {
    const inicio = parseFloat(service.horimetroInicio) || 0;
    const final = parseFloat(service.horimetroFinal) || 0;
    const hours = Math.max(0, final - inicio);
    const pricePerHour = parseFloat(service.precoHora) || 0;
    return total + (hours * pricePerHour);
  }, 0);
  
  // Calculate total commission
  const totalCommission = currentHarvestServices.reduce((total, service) => {
    const inicio = parseFloat(service.horimetroInicio) || 0;
    const final = parseFloat(service.horimetroFinal) || 0;
    const hours = Math.max(0, final - inicio);
    const pricePerHour = parseFloat(service.precoHora) || 0;
    const revenue = hours * pricePerHour;
    const commissionPercent = parseFloat(service.comissao) || 0;
    return total + (revenue * commissionPercent / 100);
  }, 0);
  
  // Service type distribution
  const serviceTypeDistribution = currentHarvestServices.reduce((acc, service) => {
    const type = service.tipoServico || 'Outro';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  // Culture distribution
  const cultureDistribution = currentHarvestServices.reduce((acc, service) => {
    const culture = cultures.find(c => c.id === service.culturaId);
    const cultureName = culture?.nome || 'Não especificada';
    const area = parseFloat(service.area) || 0;
    acc[cultureName] = (acc[cultureName] || 0) + area;
    return acc;
  }, {});
  
  // Monthly hours data for chart
  const monthlyHours = currentHarvestServices.reduce((acc, service) => {
    const date = new Date(service.data);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const inicio = parseFloat(service.horimetroInicio) || 0;
    const final = parseFloat(service.horimetroFinal) || 0;
    const hours = Math.max(0, final - inicio);
    
    acc[monthKey] = (acc[monthKey] || 0) + hours;
    return acc;
  }, {});
  
  return {
    metrics: {
      totalAreaApplied,
      totalFlightHours,
      totalTransladoHours,
      totalRevenue,
      totalCommission
    },
    charts: {
      serviceTypeDistribution,
      cultureDistribution,
      monthlyHours
    },
    counts: {
      totalServices: currentHarvestServices.length,
      totalClients: clients.length,
      totalEmployees: employees.length,
      totalAircrafts: aircrafts.length,
      totalCultures: cultures.length
    }
  };
}

// Hook for form validation
export function useValidation() {
  const validateRequired = (value, fieldName) => {
    if (!value || value.toString().trim() === '') {
      return `${fieldName} é obrigatório`;
    }
    return null;
  };
  
  const validateEmail = (email) => {
    if (!email) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Email inválido';
    }
    return null;
  };
  
  const validatePhone = (phone) => {
    if (!phone) return null;
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      return 'Telefone deve estar no formato (XX) XXXXX-XXXX';
    }
    return null;
  };
  
  const validateNumber = (value, fieldName, min = 0) => {
    if (!value) return null;
    const num = parseFloat(value);
    if (isNaN(num)) {
      return `${fieldName} deve ser um número válido`;
    }
    if (num < min) {
      return `${fieldName} deve ser maior ou igual a ${min}`;
    }
    return null;
  };
  
  const validateDate = (date, fieldName) => {
    if (!date) return null;
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return `${fieldName} deve ser uma data válida`;
    }
    return null;
  };
  
  const validateHorimeter = (inicio, final) => {
    if (!inicio || !final) return null;
    const inicioNum = parseFloat(inicio);
    const finalNum = parseFloat(final);
    
    if (isNaN(inicioNum) || isNaN(finalNum)) {
      return 'Horímetros devem ser números válidos';
    }
    
    if (finalNum <= inicioNum) {
      return 'Horímetro final deve ser maior que o inicial';
    }
    
    return null;
  };
  
  return {
    validateRequired,
    validateEmail,
    validatePhone,
    validateNumber,
    validateDate,
    validateHorimeter
  };
}

// Hook for search and filtering
export function useSearch() {
  const filterBySearch = (items, searchTerm, searchFields) => {
    if (!searchTerm) return items;
    
    const term = searchTerm.toLowerCase();
    return items.filter(item => {
      return searchFields.some(field => {
        const value = getNestedValue(item, field);
        return value && value.toString().toLowerCase().includes(term);
      });
    });
  };
  
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };
  
  const sortItems = (items, sortField, sortDirection = 'asc') => {
    return [...items].sort((a, b) => {
      const aValue = getNestedValue(a, sortField);
      const bValue = getNestedValue(b, sortField);
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };
  
  return {
    filterBySearch,
    sortItems
  };
}

// Hook for formatting utilities
export function useFormatters() {
  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const formatNumber = (value, decimals = 2) => {
    if (!value && value !== 0) return '0';
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };
  
  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR');
  };
  
  const formatDateTime = (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleString('pt-BR');
  };
  
  const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };
  
  const parsePhone = (formattedPhone) => {
    return formattedPhone.replace(/\D/g, '');
  };
  
  return {
    formatCurrency,
    formatNumber,
    formatDate,
    formatDateTime,
    formatPhone,
    parsePhone
  };
}

