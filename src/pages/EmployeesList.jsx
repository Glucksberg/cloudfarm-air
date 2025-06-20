import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../hooks/useEntities';
import { useSearch, useFormatters } from '../hooks/useUtils';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import FloatingActionButton from '../components/common/FloatingActionButton';
import { Search, Plus, Edit, Trash2, User, Phone } from 'lucide-react';

function EmployeesList() {
  const navigate = useNavigate();
  const { employees, deleteEmployee } = useEmployees();
  const { filterBySearch, sortItems } = useSearch();
  const { formatPhone } = useFormatters();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('nomeCompleto');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Filter and sort employees
  const filteredEmployees = filterBySearch(
    employees,
    searchTerm,
    ['nomeCompleto', 'telefone']
  );
  
  const sortedEmployees = sortItems(filteredEmployees, sortField, sortDirection);
  
  const handleAddEmployee = () => {
    navigate('/auxiliares/novo');
  };
  
  const handleEditEmployee = (employeeId) => {
    navigate(`/auxiliares/editar/${employeeId}`);
  };
  
  const handleDeleteEmployee = (employee) => {
    if (window.confirm(`Tem certeza que deseja excluir o auxiliar "${employee.nomeCompleto}"?`)) {
      deleteEmployee(employee.id);
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
          <h1 className="cf-text-xl cf-bold">Auxiliares</h1>
          <p className="cf-text-small text-gray-600">
            {employees.length} auxiliar{employees.length !== 1 ? 'es' : ''} cadastrado{employees.length !== 1 ? 's' : ''}
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
            placeholder="Buscar por nome ou telefone..."
            className="flex-1 border-none outline-none cf-text-medium"
          />
        </div>
      </Card>
      
      {/* Sort Options */}
      {employees.length > 1 && (
        <div className="cf-flex cf-gap-2 overflow-x-auto">
          <button
            onClick={() => handleSort('nomeCompleto')}
            className={`cf-px-3 cf-py-2 rounded-lg cf-text-small whitespace-nowrap ${
              sortField === 'nomeCompleto' 
                ? 'cf-bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Nome {sortField === 'nomeCompleto' && (sortDirection === 'asc' ? '↑' : '↓')}
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
      
      {/* Employees List */}
      {sortedEmployees.length > 0 ? (
        <div className="space-y-3">
          {sortedEmployees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-md transition-shadow">
              <div className="cf-flex cf-items-start cf-justify-between">
                <div className="flex-1">
                  <div className="cf-flex cf-items-center cf-gap-2 cf-mb-2">
                    <User size={16} className="text-gray-500" />
                    <h3 className="cf-text-medium cf-bold">{employee.nomeCompleto}</h3>
                  </div>
                  
                  {employee.telefone && (
                    <div className="cf-flex cf-items-center cf-gap-2 cf-mb-1">
                      <Phone size={14} className="text-gray-400" />
                      <span className="cf-text-small text-gray-600">
                        {formatPhone(employee.telefone)}
                      </span>
                    </div>
                  )}
                  
                  <div className="cf-text-small text-gray-400 cf-mt-2">
                    Cadastrado em {new Date(employee.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                
                <div className="cf-flex cf-gap-2 ml-4">
                  <button
                    onClick={() => handleEditEmployee(employee.id)}
                    className="cf-touch-target hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                    aria-label="Editar auxiliar"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(employee)}
                    className="cf-touch-target hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    aria-label="Excluir auxiliar"
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
                  Nenhum auxiliar encontrado
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
                  Nenhum auxiliar cadastrado
                </div>
                <div className="cf-text-small text-gray-600 cf-mb-6">
                  Comece cadastrando seu primeiro auxiliar
                </div>
                <Button onClick={handleAddEmployee}>
                  <Plus size={20} className="mr-2" />
                  Cadastrar Primeiro Auxiliar
                </Button>
              </>
            )}
          </div>
        </Card>
      )}
      
      {/* Floating Action Button */}
      <FloatingActionButton 
        onClick={handleAddEmployee}
        label="Novo Auxiliar"
      />
    </div>
  );
}

export default EmployeesList;

