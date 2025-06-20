import React from 'react';
import { MapPin, ExternalLink, Navigation, Crosshair } from 'lucide-react';

function LocationDisplay({ location, className = '', showActions = true, compact = false }) {
  if (!location) {
    return (
      <div className={`flex items-center gap-2 text-gray-400 ${className}`}>
        <MapPin size={16} />
        <span className="text-sm">Localização não disponível</span>
      </div>
    );
  }

  const { latitude, longitude, accuracy, method, timestamp } = location;

  // Função para abrir no Google Maps
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  // Função para copiar coordenadas
  const copyCoordinates = async () => {
    const coords = `${latitude}, ${longitude}`;
    try {
      await navigator.clipboard.writeText(coords);
      // Feedback visual simples
      const button = event.target.closest('button');
      const originalText = button.textContent;
      button.textContent = 'Copiado!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 1000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  // Formatação de coordenadas
  const formatCoordinates = () => {
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  };

  // Obter ícone baseado no método
  const getMethodIcon = () => {
    switch (method) {
      case 'gps':
        return <Navigation size={14} className="text-green-500" />;
      case 'manual':
        return <Crosshair size={14} className="text-blue-500" />;
      default:
        return <MapPin size={14} className="text-gray-500" />;
    }
  };

  // Obter cor baseada na precisão
  const getAccuracyColor = () => {
    if (!accuracy) return 'text-gray-500';
    if (accuracy <= 5) return 'text-green-600';
    if (accuracy <= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Versão compacta
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {getMethodIcon()}
        <span className="text-sm font-mono text-gray-700">
          {formatCoordinates()}
        </span>
        {accuracy && (
          <span className={`text-xs ${getAccuracyColor()}`}>
            ±{accuracy}m
          </span>
        )}
      </div>
    );
  }

  // Versão completa
  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-3 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <MapPin size={16} className="text-blue-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-800">
              Localização do Serviço
            </span>
            {getMethodIcon()}
          </div>
          
          <div className="text-sm font-mono text-gray-600 mb-1">
            {formatCoordinates()}
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {accuracy && (
              <span className={`flex items-center gap-1 ${getAccuracyColor()}`}>
                <span className="w-2 h-2 rounded-full bg-current"></span>
                Precisão: ±{accuracy}m
              </span>
            )}
            
            {method && (
              <span className="flex items-center gap-1">
                Método: {method === 'gps' ? 'GPS' : 'Manual'}
              </span>
            )}
            
            {timestamp && (
              <span className="flex items-center gap-1">
                {new Date(timestamp).toLocaleString('pt-BR')}
              </span>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="flex flex-col gap-1">
            <button
              onClick={openInGoogleMaps}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              title="Abrir no Google Maps"
            >
              <ExternalLink size={12} />
              Maps
            </button>
            
            <button
              onClick={copyCoordinates}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              title="Copiar coordenadas"
            >
              📋 Copiar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationDisplay; 