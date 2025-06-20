import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAircrafts } from '../hooks/useEntities';
import { useSearch, useFormatters } from '../hooks/useUtils';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import FloatingActionButton from '../components/common/FloatingActionButton';
import { Search, Plus, Edit, Trash2, Plane, Hash, Clock } from 'lucide-react';

function AircraftsList() {
  const navigate = useNavigate();
  const { aircrafts, deleteAircraft } = useAircrafts();
  const { filterBySearch, sortItems } = useSearch();
  const { formatNumber } = useFormatters();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('modelo');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Filter and sort aircrafts
  const filteredAircrafts = filterBySearch(
    aircrafts,
    searchTerm,
    ['modelo', 'prefixo']
  );
  
  const sortedAircrafts = sortItems(filteredAircrafts, sortField, sortDirection);
  
  const handleAddAircraft = () => {
    navigate('/aeronaves/novo');
  };
  
  const handleEditAircraft = (aircraftId) => {
    navigate(`/aeronaves/editar/${aircraftId}`);
  };
  
  const handleDeleteAircraft = (aircraft) => {
    if (window.confirm(`Tem certeza que deseja excluir a aeronave "${aircraft.modelo} (${aircraft.prefixo})"?`)) {
      deleteAircraft(aircraft.id);
    }
  };
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  return (
    <div className="cf-flex cf-flex-col cf-gap-4">
      {/* Header */}
      <div className="cf-flex cf-items-center cf-justify-between">
        <div>
          <h1 className="cf-text-xl cf-bold">Aeronaves</h1>
          <p className="cf-text-small text-gray-600">
            {aircrafts.length} aeronave{aircrafts.length !== 1 ? 's' : ''} cadastrada{aircrafts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      
      {/* Search */}
      <Card>
        <div className="cf-flex cf-items-center cf-gap-3">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por modelo ou prefixo..."
            className="flex-1 border-none outline-none cf-text-medium"
          />
        </div>
      </Card>
      
      {/* Sort Options */}
      {aircrafts.length > 1 && (
        <div className="cf-flex cf-gap-2 overflow-x-auto">
          <button
            onClick={() => handleSort('modelo')}
            className={`cf-px-3 cf-py-2 rounded-lg cf-text-small whitespace-nowrap ${
              sortField === 'modelo' 
                ? 'cf-bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Modelo {sortField === 'modelo' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('prefixo')}
            className={`cf-px-3 cf-py-2 rounded-lg cf-text-small whitespace-nowrap ${
              sortField === 'prefixo' 
                ? 'cf-bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Prefixo {sortField === 'prefixo' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('horimetroAtual')}
            className={`cf-px-3 cf-py-2 rounded-lg cf-text-small whitespace-nowrap ${
              sortField === 'horimetroAtual' 
                ? 'cf-bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Horímetro {sortField === 'horimetroAtual' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      )}
      
      {/* Aircrafts List */}
      {sortedAircrafts.length > 0 ? (
        <div className="space-y-3">
          {sortedAircrafts.map((aircraft) => (
            <Card key={aircraft.id} className="hover:shadow-md transition-shadow">
              <div className="cf-flex cf-items-start cf-justify-between">
                <div className="flex-1">
                  <div className="cf-flex cf-items-center cf-gap-2 cf-mb-2">
                    <Plane size={16} className="text-gray-500" />
                    <h3 className="cf-text-medium cf-bold">{aircraft.modelo}</h3>
                  </div>
                  
                  <div className="cf-flex cf-items-center cf-gap-2 cf-mb-1">
                    <Hash size={14} className="text-gray-400" />
                    <span className="cf-text-small text-gray-600 cf-bold">
                      {aircraft.prefixo}
                    </span>
                  </div>
                  
                  {aircraft.horimetroAtual > 0 && (
                    <div className="cf-flex cf-items-center cf-gap-2 cf-mb-1">
                      <Clock size={14} className="text-gray-400" />
                      <span className="cf-text-small text-gray-600">
                        {formatNumber(aircraft.horimetroAtual)} horas
                      </span>
                    </div>
                  )}
                  
                  <div className="cf-text-small text-gray-400 cf-mt-2">
                    Cadastrada em {new Date(aircraft.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                
                <div className="cf-flex cf-gap-2 ml-4">
                  <button
                    onClick={() => handleEditAircraft(aircraft.id)}
                    className="cf-touch-target hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                    aria-label="Editar aeronave"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteAircraft(aircraft)}
                    className="cf-touch-target hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    aria-label="Excluir aeronave"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center cf-py-12">
            {searchTerm ? (
              <>
                <div className="cf-text-large cf-bold cf-mb-2">
                  Nenhuma aeronave encontrada
                </div>
                <div className="cf-text-small text-gray-600 cf-mb-4">
                  Tente ajustar os termos de busca
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm('')}
                >
                  Limpar busca
                </Button>
              </>
            ) : (
              <>
                <div className="cf-text-large cf-bold cf-mb-2">
                  Nenhuma aeronave cadastrada
                </div>
                <div className="cf-text-small text-gray-600 cf-mb-4">
                  Comece cadastrando sua primeira aeronave
                </div>
                <Button onClick={handleAddAircraft}>
                  <Plus size={20} className="mr-2" />
                  Cadastrar Primeira Aeronave
                </Button>
              </>
            )}
          </div>
        </Card>
      )}
      
      {/* Floating Action Button */}
      <FloatingActionButton 
        onClick={handleAddAircraft}
        label="Nova Aeronave"
      />
    </div>
  );
}

export default AircraftsList;

