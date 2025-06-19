import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClients } from '../hooks/useEntities';
import { useValidation, useFormatters } from '../hooks/useUtils';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

function ClientForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { clients, addClient, updateClient, deleteClient, getClientById } = useClients();
  const { validateRequired, validateEmail } = useValidation();
  const { formatPhone, parsePhone } = useFormatters();
  
  const isEditing = Boolean(id);
  const existingClient = isEditing ? getClientById(id) : null;
  
  const [formData, setFormData] = useState({
    nome: existingClient?.nome || '',
    empresa: existingClient?.empresa || '',
    email: existingClient?.email || '',
    telefone: existingClient?.telefone || ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };
  
  const handlePhoneChange = (value) => {
    // Format phone as user types
    const cleaned = value.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length >= 2) {
      formatted = `(${cleaned.slice(0, 2)})`;
      if (cleaned.length > 2) {
        formatted += ` ${cleaned.slice(2, cleaned.length <= 10 ? 6 : 7)}`;
        if (cleaned.length > (cleaned.length <= 10 ? 6 : 7)) {
          formatted += `-${cleaned.slice(cleaned.length <= 10 ? 6 : 7, cleaned.length <= 10 ? 10 : 11)}`;
        }
      }
    }
    
    handleInputChange('telefone', formatted);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const nomeError = validateRequired(formData.nome, 'Nome');
    if (nomeError) newErrors.nome = nomeError;
    
    // Email validation
    if (formData.email) {
      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;
    }
    
    // Phone validation
    if (formData.telefone) {
      const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
      if (!phoneRegex.test(formData.telefone)) {
        newErrors.telefone = 'Telefone deve estar no formato (XX) XXXXX-XXXX';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const clientData = {
        ...formData,
        telefone: formData.telefone ? parsePhone(formData.telefone) : ''
      };
      
      if (isEditing) {
        updateClient(id, clientData);
      } else {
        addClient(clientData);
      }
      
      navigate('/clientes');
    } catch (error) {
      console.error('Error saving client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteClient(id);
      navigate('/clientes');
    }
  };
  
  const handleBack = () => {
    navigate('/clientes');
  };
  
  return (
    <div className="cf-flex cf-flex-col cf-gap-4">
      {/* Header */}
      <div className="cf-flex cf-items-center cf-gap-4">
        <button
          onClick={handleBack}
          className="cf-touch-target hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="cf-text-xl cf-bold">
            {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
          </h1>
          {isEditing && (
            <p className="cf-text-small text-gray-600">
              ID: {id}
            </p>
          )}
        </div>
      </div>
      
      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block cf-text-small cf-bold cf-mb-2">
              Nome *
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              className={`cf-input ${errors.nome ? 'border-red-500' : ''}`}
              placeholder="Nome do cliente"
              required
            />
            {errors.nome && (
              <p className="cf-text-small text-red-500 cf-mt-1">{errors.nome}</p>
            )}
          </div>
          
          {/* Empresa */}
          <div>
            <label className="block cf-text-small cf-bold cf-mb-2">
              Empresa
            </label>
            <input
              type="text"
              value={formData.empresa}
              onChange={(e) => handleInputChange('empresa', e.target.value)}
              className="cf-input"
              placeholder="Nome da empresa (opcional)"
            />
          </div>
          
          {/* Email */}
          <div>
            <label className="block cf-text-small cf-bold cf-mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`cf-input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="email@exemplo.com"
            />
            {errors.email && (
              <p className="cf-text-small text-red-500 cf-mt-1">{errors.email}</p>
            )}
          </div>
          
          {/* Telefone */}
          <div>
            <label className="block cf-text-small cf-bold cf-mb-2">
              Telefone
            </label>
            <input
              type="tel"
              value={formData.telefone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`cf-input ${errors.telefone ? 'border-red-500' : ''}`}
              placeholder="(XX) XXXXX-XXXX"
              maxLength={15}
            />
            {errors.telefone && (
              <p className="cf-text-small text-red-500 cf-mt-1">{errors.telefone}</p>
            )}
          </div>
          
          {/* Actions */}
          <div className="cf-flex cf-gap-4 cf-mt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              <Save size={20} className="mr-2" />
              {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Cliente')}
            </Button>
            
            {isEditing && (
              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
                className="cf-px-4"
              >
                <Trash2 size={20} />
              </Button>
            )}
          </div>
        </form>
      </Card>
      
      {/* Required fields note */}
      <div className="cf-text-small text-gray-500 text-center">
        * Campos obrigatórios
      </div>
    </div>
  );
}

export default ClientForm;

