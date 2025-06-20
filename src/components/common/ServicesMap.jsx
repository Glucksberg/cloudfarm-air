import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Layers, ZoomIn, ZoomOut, RotateCcw, Filter } from 'lucide-react';
import { useServices, useClients, useCultures } from '../../hooks/useEntities';
import { useFormatters } from '../../hooks/useUtils';
import { SERVICE_TYPES } from '../../utils/constants';
import Button from './Button';

function ServicesMap({ className = '', height = '400px' }) {
  const { services } = useServices();
  const { getClientById } = useClients();
  const { getCultureById } = useCultures();
  const { formatDate, formatCurrency } = useFormatters();
  
  const [selectedService, setSelectedService] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: -15.7801, lng: -47.9292 }); // Centro do Brasil
  const [mapZoom, setMapZoom] = useState(4);
  const mapRef = useRef(null);

  // Filtrar serviços que têm localização
  const servicesWithLocation = services.filter(service => service.location);

  // Filtrar por tipo se selecionado
  const filteredServices = filterType 
    ? servicesWithLocation.filter(service => service.tipoServico === filterType)
    : servicesWithLocation;

  // Calcular centro do mapa baseado nos serviços
  const calculateMapCenter = () => {
    if (filteredServices.length === 0) return { lat: -15.7801, lng: -47.9292 };

    const lats = filteredServices.map(s => s.location.latitude);
    const lngs = filteredServices.map(s => s.location.longitude);
    
    const centerLat = lats.reduce((sum, lat) => sum + lat, 0) / lats.length;
    const centerLng = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length;
    
    return { lat: centerLat, lng: centerLng };
  };

  // Obter cor do marcador baseado no tipo de serviço
  const getMarkerColor = (serviceType) => {
    const type = SERVICE_TYPES.find(t => t.name === serviceType);
    return type?.color || '#6B7280';
  };

  // Obter ícone do tipo de serviço
  const getServiceIcon = (serviceType) => {
    const type = SERVICE_TYPES.find(t => t.name === serviceType);
    return type?.icon || '📍';
  };

  // Renderizar marcador customizado
  const renderMarker = (service, index) => {
    const { location } = service;
    const color = getMarkerColor(service.tipoServico);
    const icon = getServiceIcon(service.tipoServico);
    
    // Calcular posição no mapa (simulado - em produção usar biblioteca de mapas real)
    const x = ((location.longitude + 180) / 360) * 100;
    const y = ((90 - location.latitude) / 180) * 100;
    
    return (
      <div
        key={service.id}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
        style={{ 
          left: `${x}%`, 
          top: `${y}%`,
        }}
        onClick={() => setSelectedService(service)}
      >
        <div 
          className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-sm font-bold hover:scale-110 transition-transform"
          style={{ backgroundColor: color }}
          title={`${service.tipoServico} - ${formatDate(service.data)}`}
        >
          {icon}
        </div>
        
        {/* Pulso de animação */}
        <div 
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: color }}
        />
      </div>
    );
  };

  // Renderizar popup de detalhes do serviço
  const renderServicePopup = () => {
    if (!selectedService) return null;

    const client = getClientById(selectedService.clienteId);
    const culture = getCultureById(selectedService.culturaId);
    
    return (
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm z-20">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getServiceIcon(selectedService.tipoServico)}</span>
            <div>
              <h3 className="font-semibold text-gray-800">{selectedService.tipoServico}</h3>
              <p className="text-sm text-gray-600">{formatDate(selectedService.data)}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedService(null)}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Cliente:</span>
            <span className="font-medium">{client?.nome || 'N/A'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Cultura:</span>
            <span className="font-medium">{culture?.nome || 'N/A'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Área:</span>
            <span className="font-medium">{selectedService.area} ha</span>
          </div>
          
          {selectedService.precoHora && (
            <div className="flex justify-between">
              <span className="text-gray-600">Valor:</span>
              <span className="font-medium text-green-600">
                {formatCurrency(selectedService.precoHora * (selectedService.horimetroFinal - selectedService.horimetroInicio))}
              </span>
            </div>
          )}
          
          <div className="pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-500 font-mono">
              📍 {selectedService.location.latitude.toFixed(6)}, {selectedService.location.longitude.toFixed(6)}
            </div>
            {selectedService.location.accuracy && (
              <div className="text-xs text-gray-500">
                Precisão: ±{selectedService.location.accuracy}m
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Atualizar centro do mapa quando os serviços mudarem
  useEffect(() => {
    const center = calculateMapCenter();
    setMapCenter(center);
  }, [filteredServices]);

  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`} style={{ height }}>
      {/* Controles do mapa */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {/* Filtro por tipo */}
        <div className="bg-white rounded-lg shadow-lg p-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm border-0 bg-transparent focus:ring-0 focus:outline-none"
          >
            <option value="">Todos os Tipos</option>
            {SERVICE_TYPES.map(type => (
              <option key={type.id} value={type.name}>
                {type.icon} {type.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Controles de zoom */}
        <div className="bg-white rounded-lg shadow-lg p-1 flex flex-col">
          <button
            onClick={() => setMapZoom(prev => Math.min(prev + 1, 10))}
            className="p-2 hover:bg-gray-100 transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setMapZoom(prev => Math.max(prev - 1, 1))}
            className="p-2 hover:bg-gray-100 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={() => {
              setMapCenter({ lat: -15.7801, lng: -47.9292 });
              setMapZoom(4);
            }}
            className="p-2 hover:bg-gray-100 transition-colors"
            title="Reset View"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Contador de serviços */}
      <div className="absolute bottom-4 left-4 z-20 bg-white rounded-lg shadow-lg px-3 py-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={16} className="text-blue-600" />
          <span className="font-medium">
            {filteredServices.length} serviço{filteredServices.length !== 1 ? 's' : ''} 
            {filterType && ` (${filterType})`}
          </span>
        </div>
      </div>

      {/* Área do mapa */}
      <div 
        ref={mapRef}
        className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 relative overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)
          `
        }}
      >
        {/* Grid de referência */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Renderizar marcadores */}
        {filteredServices.map((service, index) => renderMarker(service, index))}

        {/* Mensagem quando não há serviços */}
        {servicesWithLocation.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-lg font-medium">Nenhum serviço com localização</p>
              <p className="text-sm">Adicione localizações aos serviços para vê-los no mapa</p>
            </div>
          </div>
        )}

        {/* Popup de detalhes */}
        {renderServicePopup()}
      </div>

      {/* Legenda */}
      <div className="absolute bottom-4 right-4 z-20 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <div className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
          <Layers size={16} />
          Legenda
        </div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {SERVICE_TYPES.slice(0, 6).map(type => (
            <div key={type.id} className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-full border border-white"
                style={{ backgroundColor: type.color }}
              />
              <span className="truncate">{type.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServicesMap; 