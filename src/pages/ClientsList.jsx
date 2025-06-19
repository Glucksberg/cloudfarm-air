import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '../hooks/useEntities';
import { useSearch, useFormatters } from '../hooks/useUtils';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import FloatingActionButton from '../components/common/FloatingActionButton';
import { Search, Plus, Edit, Trash2, User, Building, Mail, Phone } from 'lucide-react';

function ClientsList() {
  const navigate = useNavigate();
  const { clients, deleteClient } = useClients();
  const { filterBySearch, sortItems } = useSearch();
  const { formatPhone } = useFormatters();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('nome');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Filter and sort clients
  const filteredClients = filterBySearch(
    clients,
    searchTerm,
    ['nome', 'empresa', 'email', 'telefone']
  );
  
  const sortedClients = sortItems(filteredClients, sortField, sortDirection);
  
  const handleAddClient = () => {
    navigate('/cliente/novo');
  };
  
  const handleEditClient = (clientId) => {
    navigate(`/cliente/${clientId}`);
  };
  
  const handleDeleteClient = (client) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente "${client.nome}"?`)) {
      deleteClient(client.id);
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
          <h1 className="cf-text-xl cf-bold">Clientes</h1>
          <p className="cf-text-small text-gray-600">
            {clients.length} cliente{clients.length !== 1 ? 's' : ''} cadastrado{clients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleAddClient} size="small">
          <Plus size={16} className="mr-2" />
          Novo
        </Button>
      </div>
      
      {/* Search */}
      <Card>
        <div className="cf-flex cf-items-center cf-gap-3">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, empresa, email ou telefone..."
            className="flex-1 border-none outline-none cf-text-medium"
          />
        </div>
      </Card>
      
      {/* Sort Options */}
      {clients.length > 1 && (
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
            onClick={() => handleSort('empresa')}
            className={`cf-px-3 cf-py-2 rounded-lg cf-text-small whitespace-nowrap ${
              sortField === 'empresa' 
                ? 'cf-bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Empresa {sortField === 'empresa' && (sortDirection === 'asc' ? '↑' : '↓')}
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
      
      {/* Clients List */}
      {sortedClients.length > 0 ? (
        <div className="space-y-3">
          {sortedClients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <div className="cf-flex cf-items-start cf-justify-between">
                <div className="flex-1">
                  <div className="cf-flex cf-items-center cf-gap-2 cf-mb-2">
                    <User size={16} className="text-gray-500" />
                    <h3 className="cf-text-medium cf-bold">{client.nome}</h3>
                  </div>
                  
                  {client.empresa && (
                    <div className="cf-flex cf-items-center cf-gap-2 cf-mb-1">
                      <Building size={14} className="text-gray-400" />
                      <span className="cf-text-small text-gray-600">{client.empresa}</span>
                    </div>
                  )}
                  
                  {client.email && (
                    <div className="cf-flex cf-items-center cf-gap-2 cf-mb-1">
                      <Mail size={14} className="text-gray-400" />
                      <span className="cf-text-small text-gray-600">{client.email}</span>
                    </div>
                  )}
                  
                  {client.telefone && (
                    <div className="cf-flex cf-items-center cf-gap-2 cf-mb-1">
                      <Phone size={14} className="text-gray-400" />
                      <span className="cf-text-small text-gray-600">
                        {formatPhone(client.telefone)}
                      </span>
                    </div>
                  )}
                  
                  <div className="cf-text-small text-gray-400 cf-mt-2">
                    Cadastrado em {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                
                <div className="cf-flex cf-gap-2 ml-4">
                  <button
                    onClick={() => handleEditClient(client.id)}
                    className="cf-touch-target hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                    aria-label="Editar cliente"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client)}
                    className="cf-touch-target hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    aria-label="Excluir cliente"
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
                  Nenhum cliente encontrado
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
                  Nenhum cliente cadastrado
                </div>
                <div className="cf-text-small text-gray-600 cf-mb-4">
                  Comece cadastrando seu primeiro cliente
                </div>
                <Button onClick={handleAddClient}>
                  <Plus size={20} className="mr-2" />
                  Cadastrar Primeiro Cliente
                </Button>
              </>
            )}
          </div>
        </Card>
      )}
      
      {/* Floating Action Button */}
      <FloatingActionButton 
        onClick={handleAddClient}
        label="Novo Cliente"
      />
    </div>
  );
}

export default ClientsList;

