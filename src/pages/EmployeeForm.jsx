import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployees } from '../hooks/useEntities';
import { useValidation, useFormatters } from '../hooks/useUtils';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

function EmployeeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { employees, addEmployee, updateEmployee, deleteEmployee, getEmployeeById } = useEmployees();
  const { validateRequired } = useValidation();
  const { formatPhone, parsePhone } = useFormatters();
  
  const isEditing = Boolean(id);
  const existingEmployee = isEditing ? getEmployeeById(id) : null;
  
  const [formData, setFormData] = useState({
    nomeCompleto: existingEmployee?.nomeCompleto || '',
    telefone: existingEmployee?.telefone || ''
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
    const nomeError = validateRequired(formData.nomeCompleto, 'Nome Completo');
    if (nomeError) newErrors.nomeCompleto = nomeError;
    
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
      const employeeData = {
        ...formData,
        telefone: formData.telefone ? parsePhone(formData.telefone) : ''
      };
      
      if (isEditing) {
        updateEmployee(id, employeeData);
      } else {
        addEmployee(employeeData);
      }
      
      navigate('/auxiliares');
    } catch (error) {
      console.error('Error saving employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este auxiliar?')) {
      deleteEmployee(id);
      navigate('/auxiliares');
    }
  };
  
  const handleBack = () => {
    navigate('/auxiliares');
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
            {isEditing ? 'Editar Auxiliar' : 'Novo Auxiliar'}
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
          {/* Nome Completo */}
          <div>
            <label className="block cf-text-small cf-bold cf-mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              value={formData.nomeCompleto}
              onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
              className={`cf-input ${errors.nomeCompleto ? 'border-red-500' : ''}`}
              placeholder="Nome completo do auxiliar"
              required
            />
            {errors.nomeCompleto && (
              <p className="cf-text-small text-red-500 cf-mt-1">{errors.nomeCompleto}</p>
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
              {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Auxiliar')}
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

export default EmployeeForm;

