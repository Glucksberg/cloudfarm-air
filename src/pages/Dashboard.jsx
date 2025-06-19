import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard, useFormatters } from '../hooks/useUtils';
import { useApp } from '../contexts/AppContext';
import Card from '../components/common/Card';
import FloatingActionButton from '../components/common/FloatingActionButton';
import { Plus, TrendingUp, Clock, MapPin, DollarSign } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const { state } = useApp();
  const { metrics, charts, counts } = useDashboard();
  const { formatCurrency, formatNumber } = useFormatters();
  
  const handleAddService = () => {
    navigate('/servico/novo');
  };
  
  // Prepare service type chart data
  const serviceTypeData = Object.entries(charts.serviceTypeDistribution).map(([type, count]) => ({
    name: type,
    value: count,
    percentage: ((count / counts.totalServices) * 100).toFixed(1)
  }));
  
  // Prepare culture chart data
  const cultureData = Object.entries(charts.cultureDistribution).map(([culture, area]) => ({
    name: culture,
    value: area,
    percentage: ((area / metrics.totalAreaApplied) * 100).toFixed(1)
  }));
  
  // Get recent services for quick overview
  const recentServices = state.services
    .filter(service => service.safraId === state.currentHarvest.id)
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 3);
  
  return (
    <div className="cf-flex cf-flex-col cf-gap-4">
      {/* Header */}
      <div className="cf-flex cf-items-center cf-justify-between">
        <div>
          <h1 className="cf-text-xl cf-bold">Dashboard</h1>
          <p className="cf-text-small text-gray-600">
            Safra: {state.currentHarvest?.name || 'N/A'}
          </p>
        </div>
        <div className="cf-text-small text-gray-500">
          {counts.totalServices} serviços registrados
        </div>
      </div>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center">
          <div className="cf-flex cf-items-center cf-justify-center cf-mb-2">
            <MapPin className="text-blue-600 mr-2" size={20} />
            <span className="cf-text-small text-gray-600">Área Aplicada</span>
          </div>
          <div className="cf-text-large cf-bold cf-primary">
            {formatNumber(metrics.totalAreaApplied)} ha
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="cf-flex cf-items-center cf-justify-center cf-mb-2">
            <Clock className="text-green-600 mr-2" size={20} />
            <span className="cf-text-small text-gray-600">Horas Voadas</span>
          </div>
          <div className="cf-text-large cf-bold text-green-600">
            {formatNumber(metrics.totalFlightHours)} h
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="cf-flex cf-items-center cf-justify-center cf-mb-2">
            <Clock className="text-orange-600 mr-2" size={20} />
            <span className="cf-text-small text-gray-600">Translado</span>
          </div>
          <div className="cf-text-large cf-bold text-orange-600">
            {formatNumber(metrics.totalTransladoHours)} h
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="cf-flex cf-items-center cf-justify-center cf-mb-2">
            <DollarSign className="text-green-700 mr-2" size={20} />
            <span className="cf-text-small text-gray-600">Receita</span>
          </div>
          <div className="cf-text-large cf-bold text-green-700">
            {formatCurrency(metrics.totalRevenue)}
          </div>
        </Card>
      </div>
      
      {/* Commission Card */}
      <Card>
        <div className="cf-flex cf-items-center cf-justify-between">
          <div className="cf-flex cf-items-center">
            <TrendingUp className="text-blue-600 mr-3" size={24} />
            <div>
              <div className="cf-text-small text-gray-600">Comissão Total</div>
              <div className="cf-text-large cf-bold cf-primary">
                {formatCurrency(metrics.totalCommission)}
              </div>
            </div>
          </div>
          <div className="cf-text-small text-gray-500">
            {metrics.totalRevenue > 0 
              ? `${((metrics.totalCommission / metrics.totalRevenue) * 100).toFixed(1)}%`
              : '0%'
            } da receita
          </div>
        </div>
      </Card>
      
      {/* Charts Section */}
      {counts.totalServices > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service Types Chart */}
            <Card title="Tipos de Serviço">
              <div className="space-y-3">
                {serviceTypeData.map((item, index) => (
                  <div key={index} className="cf-flex cf-items-center cf-justify-between">
                    <div className="cf-flex cf-items-center">
                      <div 
                        className="w-4 h-4 rounded mr-3"
                        style={{ backgroundColor: `hsl(${index * 45}, 70%, 50%)` }}
                      />
                      <span className="cf-text-small">{item.name}</span>
                    </div>
                    <div className="cf-text-small cf-bold">
                      {item.value} ({item.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Cultures Chart */}
            <Card title="Culturas por Área">
              <div className="space-y-3">
                {cultureData.map((item, index) => (
                  <div key={index} className="cf-flex cf-items-center cf-justify-between">
                    <div className="cf-flex cf-items-center">
                      <div 
                        className="w-4 h-4 rounded mr-3"
                        style={{ backgroundColor: `hsl(${index * 60 + 120}, 60%, 50%)` }}
                      />
                      <span className="cf-text-small">{item.name}</span>
                    </div>
                    <div className="cf-text-small cf-bold">
                      {formatNumber(item.value)} ha ({item.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Recent Services */}
          <Card title="Serviços Recentes">
            {recentServices.length > 0 ? (
              <div className="space-y-3">
                {recentServices.map((service) => {
                  const client = state.clients.find(c => c.id === service.clienteId);
                  const culture = state.cultures.find(c => c.id === service.culturaId);
                  
                  return (
                    <div key={service.id} className="cf-flex cf-items-center cf-justify-between cf-py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <div className="cf-text-small cf-bold">
                          {new Date(service.data).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="cf-text-small text-gray-600">
                          {client?.nome || 'Cliente não encontrado'} • {culture?.nome || 'Cultura não encontrada'}
                        </div>
                        <div className="cf-text-small text-gray-500">
                          {service.tipoServico} • {formatNumber(service.area)} ha
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="cf-text-small cf-bold cf-primary">
                          {formatNumber(
                            Math.max(0, (parseFloat(service.horimetroFinal) || 0) - (parseFloat(service.horimetroInicio) || 0))
                          )} h
                        </div>
                        <div className="cf-text-small text-gray-500">
                          {formatCurrency(
                            Math.max(0, (parseFloat(service.horimetroFinal) || 0) - (parseFloat(service.horimetroInicio) || 0)) * 
                            (parseFloat(service.precoHora) || 0)
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={() => navigate('/servicos')}
                  className="w-full cf-text-small cf-primary hover:underline cf-py-2"
                >
                  Ver todos os serviços →
                </button>
              </div>
            ) : (
              <div className="text-center cf-py-8">
                <div className="cf-text-small text-gray-500 cf-mb-4">
                  Nenhum serviço registrado ainda
                </div>
                <button
                  onClick={handleAddService}
                  className="cf-button cf-button-secondary"
                >
                  Registrar primeiro serviço
                </button>
              </div>
            )}
          </Card>
        </>
      )}
      
      {/* Empty State */}
      {counts.totalServices === 0 && (
        <Card>
          <div className="text-center cf-py-12">
            <div className="cf-text-xl cf-bold cf-mb-4">
              Bem-vindo ao CloudFarm - Air! ✈️
            </div>
            <div className="cf-text-small text-gray-600 cf-mb-6">
              Comece registrando seu primeiro serviço aéreo para ver as métricas aparecerem aqui.
            </div>
            <button
              onClick={handleAddService}
              className="cf-button"
            >
              <Plus size={20} className="mr-2" />
              Registrar Primeiro Serviço
            </button>
          </div>
        </Card>
      )}
      
      {/* Floating Action Button */}
      <FloatingActionButton 
        onClick={handleAddService}
        label="Novo Serviço"
      />
    </div>
  );
}

export default Dashboard;

