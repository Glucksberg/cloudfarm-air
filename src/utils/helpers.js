// Utility functions for data management and calculations

// Generate unique ID
export const generateId = () => {
  // Use crypto.randomUUID if available (secure)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for older browsers - more robust than Date.now() alone
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 9);
  const extraRandom = Math.random().toString(36).substr(2, 5);
  
  return `${timestamp}-${randomPart}-${extraRandom}`;
};

// Format date for input fields
export const formatDateForInput = (date) => {
  if (!date) return '';
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Parse date from input
export const parseDateFromInput = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString);
};

// Calculate service metrics
export const calculateServiceMetrics = (service) => {
  const inicio = parseFloat(service.horimetroInicio) || 0;
  const final = parseFloat(service.horimetroFinal) || 0;
  const area = parseFloat(service.area) || 0;
  const vazao = parseFloat(service.vazao) || 0;
  const precoHora = parseFloat(service.precoHora) || 0;
  const comissao = parseFloat(service.comissao) || 0;
  const translado = parseFloat(service.translado) || 0;
  
  const horasVoo = Math.max(0, final - inicio);
  const horasTotal = horasVoo + translado;
  const receita = horasVoo * precoHora;
  const valorComissao = receita * (comissao / 100);
  const volumeAplicado = area * vazao;
  
  return {
    horasVoo,
    horasTotal,
    receita,
    valorComissao,
    volumeAplicado
  };
};

// Validate service data
export const validateServiceData = (service) => {
  const errors = {};
  
  if (!service.tipoServico) {
    errors.tipoServico = 'Tipo de serviço é obrigatório';
  }
  
  if (!service.clienteId) {
    errors.clienteId = 'Cliente é obrigatório';
  }
  
  if (!service.aeronaveId) {
    errors.aeronaveId = 'Aeronave é obrigatória';
  }
  
  if (!service.funcionarioId) {
    errors.funcionarioId = 'Auxiliar é obrigatório';
  }
  
  if (!service.culturaId) {
    errors.culturaId = 'Cultura é obrigatória';
  }
  
  if (!service.area || parseFloat(service.area) <= 0) {
    errors.area = 'Área deve ser maior que zero';
  }
  
  if (!service.vazao || parseFloat(service.vazao) <= 0) {
    errors.vazao = 'Vazão deve ser maior que zero';
  }
  
  if (!service.data) {
    errors.data = 'Data é obrigatória';
  }
  
  if (!service.horimetroInicio) {
    errors.horimetroInicio = 'Horímetro inicial é obrigatório';
  }
  
  if (!service.horimetroFinal) {
    errors.horimetroFinal = 'Horímetro final é obrigatório';
  }
  
  if (service.horimetroInicio && service.horimetroFinal) {
    const inicio = parseFloat(service.horimetroInicio);
    const final = parseFloat(service.horimetroFinal);
    
    if (final <= inicio) {
      errors.horimetroFinal = 'Horímetro final deve ser maior que o inicial';
    }
  }
  
  if (!service.precoHora || parseFloat(service.precoHora) <= 0) {
    errors.precoHora = 'Preço por hora deve ser maior que zero';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Export/Import data utilities
export const exportToJSON = (data, filename = 'cloudfarm-backup') => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(link.href);
};

export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Arquivo JSON inválido'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
    
    reader.readAsText(file);
  });
};

// Local storage utilities
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

// Chart data utilities
export const prepareChartData = (data, type = 'pie') => {
  if (type === 'pie') {
    const labels = Object.keys(data);
    const values = Object.values(data);
    const total = values.reduce((sum, value) => sum + value, 0);
    
    return {
      labels,
      datasets: [{
        data: values,
        backgroundColor: [
          '#006494',
          '#0582CA',
          '#00A6FB',
          '#0CB0A9',
          '#40C9A2',
          '#84D2F6',
          '#91E5F6',
          '#BEE9E8'
        ],
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }],
      total
    };
  }
  
  if (type === 'bar') {
    const labels = Object.keys(data);
    const values = Object.values(data);
    
    return {
      labels,
      datasets: [{
        label: 'Horas',
        data: values,
        backgroundColor: '#006494',
        borderColor: '#004A73',
        borderWidth: 1
      }]
    };
  }
  
  return data;
};

// File utilities
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    
    reader.readAsDataURL(file);
  });
};

export const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Deep clone utility
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

