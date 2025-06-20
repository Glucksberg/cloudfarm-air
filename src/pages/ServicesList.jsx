import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices, useClients, useEmployees, useAircrafts, useCultures } from '../hooks/useEntities';
import { useSearch, useFormatters } from '../hooks/useUtils';
import { SERVICE_TYPES } from '../utils/constants';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import FloatingActionButton from '../components/common/FloatingActionButton';
import AirplaneIcon from '../components/common/AirplaneIcon';
import { Search, Edit, Trash2, Plus, Calendar, Clock, DollarSign, User, Plane } from 'lucide-react';

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
    navigate(`/servico/editar/${serviceId}`);
  };
  
  const handleDelete = (serviceId) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      deleteService(serviceId);
    }
  };
  
  const handleNewService = () => {
    navigate('/servico/novo');
  };
  
  const getServiceTypeIcon = (type) => {
    const serviceType = SERVICE_TYPES.find(st => st.name === type);
    return serviceType ? serviceType.icon : <AirplaneIcon size={20} className="text-blue-600" />;
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
      <div className="cf-flex cf-items-center cf-justify-between">
        <div>
          <h1 className="cf-text-xl cf-bold">Lista de Serviços</h1>
          <p className="cf-text-small text-gray-600">
            {sortedServices.length} de {services.length} serviços
          </p>
        </div>
        <Button onClick={handleNewService}>
          <Plus size={20} className="mr-2" />
          Novo
        </Button>
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
            <Card key={service.id}>
              <div className="space-y-4">
                {/* Header */}
                <div className="cf-flex cf-items-start cf-justify-between">
                  <div className="cf-flex cf-items-center cf-gap-3">
                    <div className="cf-text-large">
                      {renderServiceTypeIcon(service.tipoServico)}
                    </div>
                    <div>
                      <div className="cf-text-medium cf-bold">
                        {service.tipoServico}
                      </div>
                      <div className="cf-text-small text-gray-600">
                        {formatDate(service.data)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="cf-flex cf-gap-2">
                    <button
                      onClick={() => handleEdit(service.id)}
                      className="cf-touch-target hover:bg-blue-100 rounded-lg transition-colors"
                      aria-label="Editar serviço"
                    >
                      <Edit size={20} className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="cf-touch-target hover:bg-red-100 rounded-lg transition-colors"
                      aria-label="Excluir serviço"
                    >
                      <Trash2 size={20} className="text-red-600" />
                    </button>
                  </div>
                </div>
                
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 cf-text-small">
                  {/* Client */}
                  <div className="cf-flex cf-items-center cf-gap-2">
                    <User size={16} className="text-gray-400" />
                    <div>
                      <div className="cf-bold">{client?.nome || 'Cliente não encontrado'}</div>
                      {client?.empresa && (
                        <div className="text-gray-600">{client.empresa}</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Aircraft */}
                  <div className="cf-flex cf-items-center cf-gap-2">
                    <AirplaneIcon size={16} className="text-gray-400" />
                    <div>
                      <div className="cf-bold">{aircraft?.prefixo || 'N/A'}</div>
                      <div className="text-gray-600">{aircraft?.modelo || 'Aeronave não encontrada'}</div>
                    </div>
                  </div>
                  
                  {/* Employee */}
                  <div className="cf-flex cf-items-center cf-gap-2">
                    <User size={16} className="text-gray-400" />
                    <div>
                      <div className="cf-bold">Piloto</div>
                      <div className="text-gray-600">{employee?.nomeCompleto || 'Funcionário não encontrado'}</div>
                    </div>
                  </div>
                  
                  {/* Culture */}
                  <div className="cf-flex cf-items-center cf-gap-2">
                    <div className="text-gray-400">🌾</div>
                    <div>
                      <div className="cf-bold">Cultura</div>
                      <div className="text-gray-600">{culture?.nome || 'Cultura não encontrada'}</div>
                    </div>
                  </div>
                </div>
                
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 cf-bg-gray-50 cf-p-3 rounded-lg">
                  <div className="text-center">
                    <div className="cf-text-small text-gray-600">Área</div>
                    <div className="cf-text-medium cf-bold">{formatNumber(service.area)} ha</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="cf-text-small text-gray-600">Horas Voo</div>
                    <div className="cf-text-medium cf-bold">{formatNumber(metrics.horasVoo)} h</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="cf-text-small text-gray-600">Receita</div>
                    <div className="cf-text-medium cf-bold text-green-600">{formatCurrency(metrics.receita)}</div>
                  </div>
                </div>
                
                {/* Additional Info */}
                {(service.observacoes || service.fotos?.length > 0) && (
                  <div className="cf-border-t cf-pt-3">
                    {service.observacoes && (
                      <div className="cf-text-small text-gray-600 cf-mb-2">
                        <strong>Obs:</strong> {service.observacoes}
                      </div>
                    )}
                    {service.fotos?.length > 0 && (
                      <div className="cf-text-small text-gray-600">
                        📷 {service.fotos.length} foto{service.fotos.length !== 1 ? 's' : ''} anexada{service.fotos.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                )}
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

