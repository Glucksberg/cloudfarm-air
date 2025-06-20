// Constants for the application

// Service types with icons and colors
export const SERVICE_TYPES = [
  { id: 'fungicida', name: 'Fungicida', icon: '🍄', color: '#006494' },
  { id: 'inseticida', name: 'Inseticida', icon: '🐛', color: '#0582CA' },
  { id: 'fertilizante', name: 'Fertilizante', icon: '🌾', color: '#00A6FB' },
  { id: 'biologico', name: 'Biológico', icon: '🦠', color: '#0CB0A9' },
  { id: 'semeadura', name: 'Semeadura', icon: '🌱', color: '#40C9A2' },
  { id: 'dessecacao', name: 'Dessecação', icon: '🍂', color: '#84D2F6' },
  { id: 'fogo', name: 'Fogo', icon: '🔥', color: '#91E5F6' },
  { id: 'outro', name: 'Outro', icon: '📌', color: '#BEE9E8' }
];

// Default cultures
export const DEFAULT_CULTURES = [
  'Soja',
  'Milho',
  'Algodão',
  'Feijão',
  'Sorgo',
  'Girassol',
  'Amendoim',
  'Cana-de-açúcar'
];

// Form field configurations
export const FORM_FIELDS = {
  client: [
    { name: 'nome', label: 'Nome', type: 'text', required: true },
    { name: 'empresa', label: 'Empresa', type: 'text', required: false },
    { name: 'email', label: 'E-mail', type: 'email', required: false },
    { name: 'telefone', label: 'Telefone', type: 'tel', required: false }
  ],
  employee: [
    { name: 'nomeCompleto', label: 'Nome Completo', type: 'text', required: true },
    { name: 'telefone', label: 'Telefone', type: 'tel', required: false }
  ],
  aircraft: [
    { name: 'modelo', label: 'Modelo', type: 'text', required: true },
    { name: 'prefixo', label: 'Prefixo', type: 'text', required: true },
    { name: 'horimetroAtual', label: 'Horímetro Atual', type: 'number', required: false }
  ],
  culture: [
    { name: 'nome', label: 'Nome da Cultura', type: 'text', required: true }
  ],
  service: [
    { name: 'tipoServico', label: 'Tipo de Serviço', type: 'select', required: true },
    { name: 'clienteId', label: 'Cliente', type: 'select', required: true },
    { name: 'aeronaveId', label: 'Aeronave', type: 'select', required: true },
    { name: 'funcionarioId', label: 'Funcionário', type: 'select', required: true },
    { name: 'culturaId', label: 'Cultura', type: 'select', required: true },
    { name: 'area', label: 'Área (ha)', type: 'number', required: true },
    { name: 'vazao', label: 'Vazão (L/ha)', type: 'number', required: true },
    { name: 'data', label: 'Data', type: 'date', required: true },
    { name: 'horimetroInicio', label: 'Horímetro Início', type: 'number', required: true },
    { name: 'horimetroFinal', label: 'Horímetro Final', type: 'number', required: true },
    { name: 'translado', label: 'Translado (h)', type: 'number', required: false },
    { name: 'precoHora', label: 'Preço Hora (R$)', type: 'number', required: true },
    { name: 'comissao', label: 'Comissão (%)', type: 'number', required: false },
    { name: 'observacoes', label: 'Observações', type: 'textarea', required: false }
  ]
};

// Chart configurations
export const CHART_CONFIG = {
  pie: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            family: 'Roboto',
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  },
  bar: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} horas`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E5E5'
        },
        ticks: {
          font: {
            family: 'Roboto',
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Roboto',
            size: 11
          }
        }
      }
    }
  }
};

// Validation rules
export const VALIDATION_RULES = {
  required: (value, fieldName) => {
    if (!value || value.toString().trim() === '') {
      return `${fieldName} é obrigatório`;
    }
    return null;
  },
  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Email inválido';
    }
    return null;
  },
  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!phoneRegex.test(value)) {
      return 'Telefone deve estar no formato (XX) XXXXX-XXXX';
    }
    return null;
  },
  number: (value, fieldName, min = 0) => {
    if (!value) return null;
    const num = parseFloat(value);
    if (isNaN(num)) {
      return `${fieldName} deve ser um número válido`;
    }
    if (num < min) {
      return `${fieldName} deve ser maior ou igual a ${min}`;
    }
    return null;
  },
  positiveNumber: (value, fieldName) => {
    if (!value) return null;
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      return `${fieldName} deve ser um número positivo`;
    }
    return null;
  }
};

// Local storage keys
export const STORAGE_KEYS = {
  APP_DATA: 'cloudfarm-data',
  USER_PREFERENCES: 'cloudfarm-preferences',
  BACKUP_DATA: 'cloudfarm-backup'
};

// Date formats
export const DATE_FORMATS = {
  INPUT: 'YYYY-MM-DD',
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  ISO: 'YYYY-MM-DDTHH:mm:ss.sssZ'
};

// File types for photo upload
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

// Maximum file size for photos (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Pagination settings
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

// Export formats
export const EXPORT_FORMATS = {
  JSON: 'json',
  CSV: 'csv',
  PDF: 'pdf'
};

// Report filters
export const REPORT_FILTERS = {
  PERIOD: [
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mês' },
    { value: 'quarter', label: 'Este trimestre' },
    { value: 'year', label: 'Este ano' },
    { value: 'custom', label: 'Período customizado' }
  ]
};

// Currency and number formatting
export const FORMATTING = {
  CURRENCY: {
    locale: 'pt-BR',
    currency: 'BRL',
    style: 'currency'
  },
  NUMBER: {
    locale: 'pt-BR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  },
  PERCENTAGE: {
    locale: 'pt-BR',
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }
};

