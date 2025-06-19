import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCultures } from '../hooks/useEntities';
import { useValidation } from '../hooks/useUtils';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

function CultureForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { cultures, addCulture, updateCulture, deleteCulture, getCultureById } = useCultures();
  const { validateRequired } = useValidation();
  
  const isEditing = Boolean(id);
  const existingCulture = isEditing ? getCultureById(id) : null;
  
  const [formData, setFormData] = useState({
    nome: existingCulture?.nome || ''
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
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const nomeError = validateRequired(formData.nome, 'Nome da Cultura');
    if (nomeError) newErrors.nome = nomeError;
    
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
      if (isEditing) {
        updateCulture(id, formData);
      } else {
        addCulture(formData);
      }
      
      navigate('/culturas');
    } catch (error) {
      console.error('Error saving culture:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta cultura?')) {
      deleteCulture(id);
      navigate('/culturas');
    }
  };
  
  const handleBack = () => {
    navigate('/culturas');
  };
  
  // Common cultures for quick selection
  const commonCultures = [
    'Soja', 'Milho', 'Algodão', 'Feijão', 'Sorgo', 
    'Girassol', 'Amendoim', 'Cana-de-açúcar', 'Arroz', 'Trigo'
  ];
  
  const handleQuickSelect = (cultureName) => {
    handleInputChange('nome', cultureName);
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
            {isEditing ? 'Editar Cultura' : 'Nova Cultura'}
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
          {/* Nome da Cultura */}
          <div>
            <label className="block cf-text-small cf-bold cf-mb-2">
              Nome da Cultura *
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              className={`cf-input ${errors.nome ? 'border-red-500' : ''}`}
              placeholder="Ex: Soja, Milho, Algodão..."
              required
            />
            {errors.nome && (
              <p className="cf-text-small text-red-500 cf-mt-1">{errors.nome}</p>
            )}
          </div>
          
          {/* Quick Selection */}
          {!isEditing && (
            <div>
              <label className="block cf-text-small cf-bold cf-mb-2">
                Seleção Rápida
              </label>
              <div className="grid grid-cols-2 gap-2">
                {commonCultures.map((culture) => (
                  <button
                    key={culture}
                    type="button"
                    onClick={() => handleQuickSelect(culture)}
                    className={`cf-px-3 cf-py-2 rounded-lg cf-text-small border transition-colors ${
                      formData.nome === culture
                        ? 'cf-bg-primary text-white border-blue-600'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {culture}
                  </button>
                ))}
              </div>
              <p className="cf-text-small text-gray-500 cf-mt-2">
                Clique em uma cultura comum ou digite uma personalizada acima
              </p>
            </div>
          )}
          
          {/* Actions */}
          <div className="cf-flex cf-gap-4 cf-mt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              <Save size={20} className="mr-2" />
              {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Cultura')}
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

export default CultureForm;

