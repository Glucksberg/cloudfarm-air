import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Crosshair, AlertCircle, Check, Loader2 } from 'lucide-react';
import Button from './Button';

function LocationPicker({ value, onChange, disabled = false, className = '' }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualCoords, setManualCoords] = useState({ lat: '', lng: '' });
  const watchIdRef = useRef(null);

  // Função para obter localização atual
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada neste dispositivo');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Opções de geolocalização otimizadas para agricultura
    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    };

    const successCallback = (position) => {
      const { latitude, longitude, accuracy: posAccuracy } = position.coords;
      
      const locationData = {
        latitude: parseFloat(latitude.toFixed(6)),
        longitude: parseFloat(longitude.toFixed(6)),
        accuracy: Math.round(posAccuracy),
        timestamp: new Date().toISOString(),
        method: 'gps'
      };

      setAccuracy(Math.round(posAccuracy));
      onChange(locationData);
      setIsLoading(false);
    };

    const errorCallback = (error) => {
      let errorMessage = 'Erro ao obter localização';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Permissão de localização negada. Ative a localização nas configurações.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Localização indisponível. Tente novamente em área aberta.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Tempo limite excedido. Verifique o sinal GPS.';
          break;
      }
      
      setError(errorMessage);
      setIsLoading(false);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
  };

  // Função para entrada manual de coordenadas
  const handleManualSubmit = () => {
    const lat = parseFloat(manualCoords.lat);
    const lng = parseFloat(manualCoords.lng);

    if (isNaN(lat) || isNaN(lng)) {
      setError('Coordenadas inválidas. Use formato: -23.550520, -46.633309');
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError('Coordenadas fora do intervalo válido');
      return;
    }

    const locationData = {
      latitude: lat,
      longitude: lng,
      accuracy: null,
      timestamp: new Date().toISOString(),
      method: 'manual'
    };

    onChange(locationData);
    setIsManualMode(false);
    setError(null);
  };

  // Função para limpar localização
  const clearLocation = () => {
    onChange(null);
    setError(null);
    setAccuracy(null);
    setManualCoords({ lat: '', lng: '' });
  };

  // Formatação de coordenadas para exibição
  const formatCoordinates = (location) => {
    if (!location) return '';
    return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  };

  // Obter endereço aproximado (simulado - em produção usar API de geocoding)
  const getApproximateAddress = (location) => {
    if (!location) return '';
    
    // Simulação de endereço baseado em coordenadas brasileiras
    const { latitude, longitude } = location;
    
    if (latitude > -35 && latitude < 6 && longitude > -75 && longitude < -30) {
      return 'Localização no Brasil';
    }
    
    return 'Localização internacional';
  };

  useEffect(() => {
    // Cleanup do watch de geolocalização
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Status atual da localização */}
      {value && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin size={16} className="text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-green-800">
                Localização Capturada
              </div>
              <div className="text-sm text-green-600 font-mono">
                {formatCoordinates(value)}
              </div>
              <div className="text-xs text-green-500 mt-1">
                {getApproximateAddress(value)}
                {value.accuracy && ` • Precisão: ±${value.accuracy}m`}
                {value.method && ` • Método: ${value.method === 'gps' ? 'GPS' : 'Manual'}`}
              </div>
            </div>
            <button
              onClick={clearLocation}
              className="text-green-400 hover:text-green-600 transition-colors"
              title="Remover localização"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start gap-3">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </div>
      )}

      {/* Modo manual */}
      {isManualMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div className="text-sm font-medium text-blue-800">
            Inserir Coordenadas Manualmente
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-blue-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                value={manualCoords.lat}
                onChange={(e) => setManualCoords(prev => ({ ...prev, lat: e.target.value }))}
                placeholder="-23.550520"
                step="any"
                className="w-full px-3 py-2 text-sm border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-blue-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                value={manualCoords.lng}
                onChange={(e) => setManualCoords(prev => ({ ...prev, lng: e.target.value }))}
                placeholder="-46.633309"
                step="any"
                className="w-full px-3 py-2 text-sm border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleManualSubmit}
              size="sm"
              disabled={!manualCoords.lat || !manualCoords.lng}
            >
              <Check size={14} className="mr-1" />
              Confirmar
            </Button>
            <Button
              onClick={() => setIsManualMode(false)}
              variant="secondary"
              size="sm"
            >
              Cancelar
            </Button>
          </div>
          <div className="text-xs text-blue-600">
            💡 Dica: Use Google Maps para obter coordenadas precisas
          </div>
        </div>
      )}

      {/* Botões de ação */}
      {!value && !isManualMode && (
        <div className="flex gap-2">
          <Button
            onClick={getCurrentLocation}
            disabled={disabled || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <Navigation size={16} className="mr-2" />
            )}
            {isLoading ? 'Obtendo...' : 'Capturar Localização'}
          </Button>
          
          <Button
            onClick={() => setIsManualMode(true)}
            variant="secondary"
            disabled={disabled}
          >
            <Crosshair size={16} className="mr-2" />
            Manual
          </Button>
        </div>
      )}

      {/* Informações sobre precisão */}
      {!value && !error && (
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            <span>A localização será salva com o serviço para referência futura</span>
          </div>
          <div className="flex items-center gap-1">
            <Navigation size={12} />
            <span>Recomendado: Use em área aberta para melhor precisão GPS</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationPicker; 