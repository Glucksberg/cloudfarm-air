import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCultures } from '../hooks/useEntities';
import { useSearch } from '../hooks/useUtils';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import FloatingActionButton from '../components/common/FloatingActionButton';
import { Search, Plus, Edit, Trash2, Wheat } from 'lucide-react';

function CulturesList() {
  const navigate = useNavigate();
  const { cultures, deleteCulture } = useCultures();
  const { filterBySearch, sortItems } = useSearch();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('nome');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Filter and sort cultures
  const filteredCultures = filterBySearch(
    cultures,
    searchTerm,
    ['nome']
  );
  
  const sortedCultures = sortItems(filteredCultures, sortField, sortDirection);
  
  const handleAddCulture = () => {
    navigate('/culturas/novo');
  };
  
  const handleEditCulture = (cultureId) => {
    navigate(`/culturas/editar/${cultureId}`);
  };
  
  const handleDeleteCulture = (culture) => {
    if (window.confirm(`Tem certeza que deseja excluir a cultura "${culture.nome}"?`)) {
      deleteCulture(culture.id);
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
          <h1 className="cf-text-xl cf-bold">Culturas</h1>
          <p className="cf-text-small text-gray-600">
            {cultures.length} cultura{cultures.length !== 1 ? 's' : ''} cadastrada{cultures.length !== 1 ? 's' : ''}
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
            placeholder="Buscar por nome da cultura..."
            className="flex-1 border-none outline-none cf-text-medium"
          />
        </div>
      </Card>
      
      {/* Sort Options */}
      {cultures.length > 1 && (
        <div className="cf-flex cf-gap-2 overflow-x-auto">
          <button
            onClick={() => handleSort('nome')}
            className={`cf-px-3 cf-py-2 rounded-lg cf-text-small whitespace-nowrap ${
              sortField === 'nome' 
                ? 'cf-bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Nome {sortField === 'nome' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('createdAt')}
            className={`cf-px-3 cf-py-2 rounded-lg cf-text-small whitespace-nowrap ${
              sortField === 'createdAt' 
                ? 'cf-bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Data {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      )}
      
      {/* Cultures List */}
      {sortedCultures.length > 0 ? (
        <div className="space-y-3">
          {sortedCultures.map((culture) => (
            <Card key={culture.id} className="hover:shadow-md transition-shadow">
              <div className="cf-flex cf-items-start cf-justify-between">
                <div className="flex-1">
                  <div className="cf-flex cf-items-center cf-gap-2 cf-mb-2">
                    <Wheat size={16} className="text-gray-500" />
                    <h3 className="cf-text-medium cf-bold">{culture.nome}</h3>
                  </div>
                  
                  <div className="cf-text-small text-gray-400 cf-mt-2">
                    Cadastrada em {new Date(culture.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                
                <div className="cf-flex cf-gap-2 ml-4">
                  <button
                    onClick={() => handleEditCulture(culture.id)}
                    className="cf-touch-target hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                    aria-label="Editar cultura"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteCulture(culture)}
                    className="cf-touch-target hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    aria-label="Excluir cultura"
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
                  Nenhuma cultura encontrada
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
                  Nenhuma cultura cadastrada
                </div>
                <div className="cf-text-small text-gray-600 cf-mb-4">
                  Comece cadastrando sua primeira cultura
                </div>
                <Button onClick={handleAddCulture}>
                  <Plus size={20} className="mr-2" />
                  Cadastrar Primeira Cultura
                </Button>
              </>
            )}
          </div>
        </Card>
      )}
      
      {/* Floating Action Button */}
      <FloatingActionButton 
        onClick={handleAddCulture}
        label="Nova Cultura"
      />
    </div>
  );
}

export default CulturesList;

