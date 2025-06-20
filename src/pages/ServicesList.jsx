import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices, useClients, useEmployees, useAircrafts, useCultures } from '../hooks/useEntities';
import { useSearch, useFormatters } from '../hooks/useUtils';
import { SERVICE_TYPES } from '../utils/constants';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import FloatingActionButton from '../components/common/FloatingActionButton';
import AirplaneIcon from '../components/common/AirplaneIcon';
import LocationDisplay from '../components/common/LocationDisplay';
import { Search, Edit, Trash2, Plus, Calendar, Clock, DollarSign, User, Plane, MapPin } from 'lucide-react';

function ServicesList() {
  const navigate = useNavigate();
  const { services, deleteService } = useServices();
  const { clients, getClientById } = useClients();
  const { employees, getEmployeeById } = useEmployees();
  const { aircrafts, getAircraftById } = useAircrafts();
  const { cultures, getCultureById } = useCultures();
  const { formatCurrency, formatNumber, formatDate } = useFormatters();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterClient, setFilterClient] = useState('');
  const [sortBy, setSortBy] = useState('data');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Search and filter services
  const filteredServices = services.filter(service => {
    const client = getClientById(service.clienteId);
    const employee = getEmployeeById(service.funcionarioId);
    const aircraft = getAircraftById(service.aeronaveId);
    const culture = getCultureById(service.culturaId);
    
    const searchableText = [
      service.tipoServico,
      client?.nome,
      client?.empresa,
      employee?.nomeCompleto,
      aircraft?.modelo,
      aircraft?.prefixo,
      culture?.nome,
      service.observacoes
    ].filter(Boolean).join(' ').toLowerCase();
    
    const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
    const matchesType = !filterType || service.tipoServico === filterType;
    const matchesClient = !filterClient || service.clienteId === filterClient;
    
    return matchesSearch && matchesType && matchesClient;
  });
  
  // Sort services
  const sortedServices = [...filteredServices].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'data':
        aValue = new Date(a.data);
        bValue = new Date(b.data);
        break;
      case 'cliente':
        const clientA = getClientById(a.clienteId);
        const clientB = getClientById(b.clienteId);
        aValue = clientA?.nome || '';
        bValue = clientB?.nome || '';
        break;
      case 'receita':
        aValue = (a.horimetroFinal - a.horimetroInicio) * a.precoHora;
        bValue = (b.horimetroFinal - b.horimetroInicio) * b.precoHora;
        break;
      case 'area':
        aValue = a.area;
        bValue = b.area;
        break;
      default:
        aValue = a[sortBy];
        bValue = b[sortBy];
    }
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  const handleEdit = (serviceId) => {
    navigate(`/servicos/editar/${serviceId}`);
  };
  
  const handleDelete = (serviceId) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      deleteService(serviceId);
    }
  };
  
  const handleNewService = () => {
    navigate('/servicos/novo');
  };
  
  // Get service type icon
  const getServiceTypeIcon = (type) => {
    const serviceType = SERVICE_TYPES.find(st => st.name === type);
    return serviceType?.icon || <AirplaneIcon size={16} />;
  };
  
  // Get service type color
  const getServiceTypeColor = (type) => {
    const serviceType = SERVICE_TYPES.find(st => st.name === type);
    return serviceType?.color || '#6B7280';
  };
  
  const renderServiceTypeIcon = (type) => {
    const icon = getServiceTypeIcon(type);
    // Se for um componente React (object), renderiza diretamente
    // Se for string (emoji), renderiza dentro de uma div
    return typeof icon === 'string' ? <span className="cf-text-large">{icon}</span> : icon;
  };
  
  const calculateServiceMetrics = (service) => {
    const horasVoo = service.horimetroFinal - service.horimetroInicio;
    const receita = horasVoo * service.precoHora;
    const comissao = receita * (service.comissao / 100);
    
    return {
      horasVoo,
      receita,
      comissao
    };
  };
  
  if (services.length === 0) {
    return (
      <div className="cf-flex cf-flex-col cf-gap-4">
        <div className="cf-flex cf-items-center cf-justify-between">
          <div>
            <h1 className="cf-text-xl cf-bold">Lista de Serviços</h1>
            <p className="cf-text-small text-gray-600">0 serviços cadastrados</p>
          </div>
          <Button onClick={handleNewService}>
            <Plus size={20} className="mr-2" />
            Novo
          </Button>
        </div>
        
        <Card>
          <div className="text-center cf-py-12">
            <div className="cf-text-large cf-bold cf-mb-4">
              Nenhum serviço cadastrado
            </div>
            <div className="cf-text-small text-gray-600 cf-mb-6">
              Comece registrando seu primeiro serviço aéreo
            </div>
            <Button onClick={handleNewService}>
              Registrar Primeiro Serviço
            </Button>
          </div>
        </Card>
        
        <FloatingActionButton
          onClick={handleNewService}
          title="Novo Serviço"
        />
      </div>
    );
  }
  
  return (
    <div className="cf-flex cf-flex-col cf-gap-4">
      {/* Header */}
      <div className="cf-flex cf-items-center cf-justify-between cf-gap-4">
        <div>
          <h1 className="cf-text-xl cf-bold">Lista de Serviços</h1>
          <p className="cf-text-small text-gray-600">
            {filteredServices.length} de {services.length} serviços
          </p>
        </div>
        
        <div className="cf-flex cf-gap-2">
          <Button
            onClick={() => navigate('/servicos/mapa')}
            variant="secondary"
            size="sm"
            disabled={services.filter(s => s.location).length === 0}
          >
            <MapPin size={16} className="mr-1" />
            Ver Mapa
          </Button>
          
          <Button onClick={handleNewService}>
            <Plus size={20} className="mr-2" />
            Novo
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente, funcionário, aeronave, cultura..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cf-input pl-10"
            />
          </div>
          
          {/* Filter Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Filter by Type */}
            <div>
              <label className="block cf-text-small cf-bold cf-mb-2">
                Tipo de Serviço
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="cf-input"
              >
                <option value="">Todos os tipos</option>
                {SERVICE_TYPES.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Filter by Client */}
            <div>
              <label className="block cf-text-small cf-bold cf-mb-2">
                Cliente
              </label>
              <select
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="cf-input"
              >
                <option value="">Todos os clientes</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nome} {client.empresa && `(${client.empresa})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Sort Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block cf-text-small cf-bold cf-mb-2">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cf-input"
              >
                <option value="data">Data</option>
                <option value="cliente">Cliente</option>
                <option value="receita">Receita</option>
                <option value="area">Área</option>
                <option value="tipoServico">Tipo de Serviço</option>
              </select>
            </div>
            
            <div>
              <label className="block cf-text-small cf-bold cf-mb-2">
                Ordem
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="cf-input"
              >
                <option value="desc">Decrescente</option>
                <option value="asc">Crescente</option>
              </select>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Services List */}
      <div className="space-y-4">
        {sortedServices.map((service) => {
          const client = getClientById(service.clienteId);
          const employee = getEmployeeById(service.funcionarioId);
          const aircraft = getAircraftById(service.aeronaveId);
          const culture = getCultureById(service.culturaId);
          const metrics = calculateServiceMetrics(service);
          
          return (
            <Card key={service.id} className="overflow-hidden hover:shadow-md transition-all duration-300 border-0 bg-gradient-to-r from-white to-gray-50/50">
              <div className="relative">
                {/* Barra colorida lateral */}
                <div 
                  className="absolute left-0 top-0 w-1 h-full"
                  style={{ backgroundColor: getServiceTypeColor(service.tipoServico) }}
                />
                
                <div className="pl-6 pr-4 py-4">
                  {/* Header compacto */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* Ícone menor */}
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                        style={{ 
                          background: `linear-gradient(135deg, ${getServiceTypeColor(service.tipoServico)}, ${getServiceTypeColor(service.tipoServico)}dd)` 
                        }}
                      >
                        <span className="text-lg text-white drop-shadow-sm">
                          {getServiceTypeIcon(service.tipoServico)}
                        </span>
                      </div>
                      
                      {/* Info principal */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{service.tipoServico}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{formatDate(service.data)}</span>
                          </div>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                            #{service.id.slice(0, 6)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Botões compactos */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => navigate(`/servicos/editar/${service.id}`)}
                        className="w-8 h-8 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                        aria-label="Editar serviço"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        aria-label="Excluir serviço"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Grid de informações compacto */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    {/* Métricas principais */}
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 text-sm">📏</span>
                        <div>
                          <div className="text-xs text-blue-600 font-medium">Área</div>
                          <div className="text-lg font-bold text-blue-800">{formatNumber(service.area)} ha</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-green-600" />
                        <div>
                          <div className="text-xs text-green-600 font-medium">Horas</div>
                          <div className="text-lg font-bold text-green-800">
                            {formatNumber(service.horimetroFinal - service.horimetroInicio)}h
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                      <div className="flex items-center gap-2">
                        <DollarSign size={14} className="text-emerald-600" />
                        <div>
                          <div className="text-xs text-emerald-600 font-medium">Receita</div>
                          <div className="text-lg font-bold text-emerald-800">
                            {formatCurrency(service.precoHora * (service.horimetroFinal - service.horimetroInicio))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-100">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-600 text-sm">💧</span>
                        <div>
                          <div className="text-xs text-cyan-600 font-medium">Volume</div>
                          <div className="text-lg font-bold text-cyan-800">
                            {formatNumber(service.area * service.vazao)}L
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Informações de pessoas e equipamentos - layout horizontal */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                        <User size={12} className="text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-gray-500 uppercase tracking-wide font-medium">Cliente</div>
                        <div className="font-semibold text-gray-800 truncate">{client?.nome || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                        <User size={12} className="text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-gray-500 uppercase tracking-wide font-medium">Piloto</div>
                        <div className="font-semibold text-gray-800 truncate">{employee?.nomeCompleto || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                        <AirplaneIcon size={12} color="#7C3AED" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-gray-500 uppercase tracking-wide font-medium">Aeronave</div>
                        <div className="font-semibold text-gray-800 truncate">
                          {aircraft ? `${aircraft.modelo} (${aircraft.prefixo})` : 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-amber-100 rounded-md flex items-center justify-center">
                        <span className="text-amber-600 text-xs">🌾</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-gray-500 uppercase tracking-wide font-medium">Cultura</div>
                        <div className="font-semibold text-gray-800 truncate">{culture?.nome || 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Informações extras - apenas se existirem */}
                  {(service.location || (service.fotos && service.fotos.length > 0) || service.observacoes) && (
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                      {/* Localização */}
                      {service.location && (
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center">
                            <MapPin size={10} className="text-indigo-600" />
                          </div>
                          <span className="text-indigo-700 font-medium">Localização</span>
                        </div>
                      )}
                      
                      {/* Fotos */}
                      {service.fotos && service.fotos.length > 0 && (
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
                            <span className="text-purple-600 text-xs">📷</span>
                          </div>
                          <span className="text-purple-700 font-medium">
                            {service.fotos.length} foto{service.fotos.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                      
                      {/* Observações */}
                      {service.observacoes && (
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-5 h-5 bg-amber-100 rounded flex items-center justify-center">
                            <span className="text-amber-600 text-xs">📝</span>
                          </div>
                          <span className="text-amber-700 font-medium">Observações</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      <FloatingActionButton
        onClick={handleNewService}
        title="Novo Serviço"
      />
    </div>
  );
}

export default ServicesList;

