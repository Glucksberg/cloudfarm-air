import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '../hooks/useEntities';
import { ArrowLeft, MapPin, BarChart3, Filter, Download, Share2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ServicesMap from '../components/common/ServicesMap';
import { SERVICE_TYPES } from '../utils/constants';

function ServicesMapPage() {
  const navigate = useNavigate();
  const { services } = useServices();
  
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'stats'
  
  // Estatísticas de localização
  const servicesWithLocation = services.filter(service => service.location);
  const servicesWithoutLocation = services.filter(service => !service.location);
  const locationCoverage = services.length > 0 ? (servicesWithLocation.length / services.length * 100).toFixed(1) : 0;
  
  // Estatísticas por tipo de serviço
  const servicesByType = SERVICE_TYPES.map(type => {
    const typeServices = servicesWithLocation.filter(s => s.tipoServico === type.name);
    return {
      ...type,
      count: typeServices.length,
      percentage: servicesWithLocation.length > 0 ? (typeServices.length / servicesWithLocation.length * 100).toFixed(1) : 0
    };
  }).filter(type => type.count > 0);

  // Estatísticas de precisão GPS
  const gpsServices = servicesWithLocation.filter(s => s.location.method === 'gps');
  const manualServices = servicesWithLocation.filter(s => s.location.method === 'manual');
  
  const accuracyStats = gpsServices.reduce((acc, service) => {
    const accuracy = service.location.accuracy;
    if (!accuracy) return acc;
    
    if (accuracy <= 5) acc.high++;
    else if (accuracy <= 10) acc.medium++;
    else acc.low++;
    
    return acc;
  }, { high: 0, medium: 0, low: 0 });

  const handleBack = () => {
    navigate('/servicos');
  };

  const handleExportData = () => {
    const exportData = servicesWithLocation.map(service => ({
      id: service.id,
      tipo: service.tipoServico,
      data: service.data,
      latitude: service.location.latitude,
      longitude: service.location.longitude,
      precisao: service.location.accuracy,
      metodo: service.location.method,
      area: service.area,
      cliente: service.clienteId
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `servicos-localizacao-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const handleShareLocation = async () => {
    if (!navigator.share) {
      alert('Compartilhamento não suportado neste navegador');
      return;
    }

    try {
      await navigator.share({
        title: 'Mapa de Serviços - CloudFarm Air',
        text: `${servicesWithLocation.length} serviços mapeados com ${locationCoverage}% de cobertura`,
        url: window.location.href
      });
    } catch (error) {
      console.log('Compartilhamento cancelado');
    }
  };

  return (
    <div className="cf-flex cf-flex-col cf-gap-4">
      {/* Header */}
      <div className="cf-flex cf-items-center cf-justify-between">
        <div className="cf-flex cf-items-center cf-gap-4">
          <button
            onClick={handleBack}
            className="cf-touch-target hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="cf-text-xl cf-bold">Mapa de Serviços</h1>
            <p className="cf-text-small text-gray-600">
              Visualização geográfica dos serviços realizados
            </p>
          </div>
        </div>

        <div className="cf-flex cf-gap-2">
          {/* Toggle View Mode */}
          <div className="cf-flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-2 text-sm transition-colors ${
                viewMode === 'map' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MapPin size={16} className="inline mr-1" />
              Mapa
            </button>
            <button
              onClick={() => setViewMode('stats')}
              className={`px-3 py-2 text-sm transition-colors ${
                viewMode === 'stats' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 size={16} className="inline mr-1" />
              Estatísticas
            </button>
          </div>

          {/* Action Buttons */}
          <Button
            onClick={handleExportData}
            variant="secondary"
            size="sm"
            disabled={servicesWithLocation.length === 0}
          >
            <Download size={16} className="mr-1" />
            Exportar
          </Button>
          
          <Button
            onClick={handleShareLocation}
            variant="secondary"
            size="sm"
            disabled={servicesWithLocation.length === 0}
          >
            <Share2 size={16} className="mr-1" />
            Compartilhar
          </Button>
        </div>
      </div>

      {viewMode === 'map' ? (
        /* Map View */
        <div className="space-y-4">
          {/* Coverage Summary */}
          <Card>
            <div className="cf-flex cf-items-center cf-justify-between">
              <div className="cf-flex cf-items-center cf-gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg cf-flex cf-items-center cf-justify-center">
                  <MapPin size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="cf-text-medium cf-bold">Cobertura de Localização</h3>
                  <p className="cf-text-small text-gray-600">
                    {servicesWithLocation.length} de {services.length} serviços mapeados
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="cf-text-large cf-bold text-blue-600">{locationCoverage}%</div>
                <div className="cf-text-small text-gray-500">Cobertura</div>
              </div>
            </div>
            
            {servicesWithoutLocation.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="cf-text-small text-yellow-800">
                  <strong>💡 Dica:</strong> {servicesWithoutLocation.length} serviços ainda não têm localização. 
                  Adicione coordenadas para melhorar a análise geográfica.
                </div>
              </div>
            )}
          </Card>

          {/* Map Component */}
          <Card>
            <ServicesMap height="500px" />
          </Card>
        </div>
      ) : (
        /* Statistics View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Coverage Stats */}
          <Card title="📊 Cobertura Geral">
            <div className="space-y-4">
              <div className="cf-flex cf-items-center cf-justify-between">
                <span className="cf-text-small text-gray-600">Total de Serviços</span>
                <span className="cf-text-medium cf-bold">{services.length}</span>
              </div>
              <div className="cf-flex cf-items-center cf-justify-between">
                <span className="cf-text-small text-gray-600">Com Localização</span>
                <span className="cf-text-medium cf-bold text-green-600">{servicesWithLocation.length}</span>
              </div>
              <div className="cf-flex cf-items-center cf-justify-between">
                <span className="cf-text-small text-gray-600">Sem Localização</span>
                <span className="cf-text-medium cf-bold text-red-600">{servicesWithoutLocation.length}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="cf-flex cf-items-center cf-justify-between cf-text-small">
                  <span>Cobertura</span>
                  <span className="cf-bold">{locationCoverage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${locationCoverage}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Method Stats */}
          <Card title="🎯 Métodos de Captura">
            <div className="space-y-4">
              <div className="cf-flex cf-items-center cf-justify-between">
                <div className="cf-flex cf-items-center cf-gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="cf-text-small text-gray-600">GPS</span>
                </div>
                <span className="cf-text-medium cf-bold">{gpsServices.length}</span>
              </div>
              <div className="cf-flex cf-items-center cf-justify-between">
                <div className="cf-flex cf-items-center cf-gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="cf-text-small text-gray-600">Manual</span>
                </div>
                <span className="cf-text-medium cf-bold">{manualServices.length}</span>
              </div>
              
              {/* Accuracy Stats */}
              {gpsServices.length > 0 && (
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="cf-text-small cf-bold text-gray-700 mb-2">Precisão GPS:</div>
                  <div className="cf-flex cf-items-center cf-justify-between cf-text-small">
                    <span className="text-green-600">Alta (≤5m)</span>
                    <span className="cf-bold">{accuracyStats.high}</span>
                  </div>
                  <div className="cf-flex cf-items-center cf-justify-between cf-text-small">
                    <span className="text-yellow-600">Média (6-10m)</span>
                    <span className="cf-bold">{accuracyStats.medium}</span>
                  </div>
                  <div className="cf-flex cf-items-center cf-justify-between cf-text-small">
                    <span className="text-red-600">Baixa (&gt;10m)</span>
                    <span className="cf-bold">{accuracyStats.low}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Services by Type */}
          <Card title="🌾 Serviços por Tipo" className="md:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {servicesByType.map(type => (
                <div key={type.id} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="cf-text-small cf-bold text-gray-800">{type.name}</div>
                  <div className="cf-text-large cf-bold" style={{ color: type.color }}>
                    {type.count}
                  </div>
                  <div className="cf-text-small text-gray-500">{type.percentage}%</div>
                </div>
              ))}
            </div>
            
            {servicesByType.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                <p>Nenhum serviço com localização encontrado</p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

export default ServicesMapPage; 