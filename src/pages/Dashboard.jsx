import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard, useFormatters } from '../hooks/useUtils';
import { useApp } from '../contexts/AppContext';
import { useServices } from '../hooks/useEntities';
import Card from '../components/common/Card';
import FloatingActionButton from '../components/common/FloatingActionButton';
import { Plus, TrendingUp, Clock, MapPin, DollarSign } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const { state } = useApp();
  const { services } = useServices();
  const { metrics, charts, counts } = useDashboard();
  const { formatCurrency, formatNumber } = useFormatters();
  
  const handleAddService = () => {
    navigate('/servico/novo');
  };
  
  // Prepare service type chart data - ordenado do maior para o menor
  const serviceTypeData = Object.entries(charts.serviceTypeDistribution)
    .map(([type, count]) => ({
      name: type,
      value: count,
      percentage: ((count / counts.totalServices) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value); // Ordenar do maior para o menor
  
  // Prepare culture chart data - ordenado do maior para o menor
  const cultureData = Object.entries(charts.cultureDistribution)
    .map(([culture, area]) => ({
      name: culture,
      value: area,
      percentage: ((area / metrics.totalAreaApplied) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value); // Ordenar do maior para o menor
  
  // Get recent services for quick overview
  const recentServices = services
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 3);

  // Custom tooltip for service types
  const ServiceTypeTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-blue-600">
            {data.value} serviços ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for cultures
  const CultureTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-green-600">
            {formatNumber(data.value)} ha ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };
  
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
            {/* Service Types Bar Chart */}
            <Card title="Tipos de Serviço">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={serviceTypeData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                      interval={0}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip content={<ServiceTypeTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="#3B82F6" 
                      radius={[4, 4, 0, 0]}
                      name="Quantidade"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            {/* Cultures Bar Chart */}
            <Card title="Culturas por Área">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={cultureData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                      interval={0}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CultureTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="#10B981" 
                      radius={[4, 4, 0, 0]}
                      name="Área (ha)"
                    />
                  </BarChart>
                </ResponsiveContainer>
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

