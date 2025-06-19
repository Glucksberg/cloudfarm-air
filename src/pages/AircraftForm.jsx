import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAircrafts } from '../hooks/useEntities';
import { useValidation } from '../hooks/useUtils';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

function AircraftForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { aircrafts, addAircraft, updateAircraft, deleteAircraft, getAircraftById } = useAircrafts();
  const { validateRequired, validateNumber } = useValidation();
  
  const isEditing = Boolean(id);
  const existingAircraft = isEditing ? getAircraftById(id) : null;
  
  const [formData, setFormData] = useState({
    modelo: existingAircraft?.modelo || '',
    prefixo: existingAircraft?.prefixo || '',
    horimetroAtual: existingAircraft?.horimetroAtual || ''
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
    const modeloError = validateRequired(formData.modelo, 'Modelo');
    if (modeloError) newErrors.modelo = modeloError;
    
    const prefixoError = validateRequired(formData.prefixo, 'Prefixo');
    if (prefixoError) newErrors.prefixo = prefixoError;
    
    // Horimetro validation
    if (formData.horimetroAtual) {
      const horimetroError = validateNumber(formData.horimetroAtual, 'Horímetro Atual', 0);
      if (horimetroError) newErrors.horimetroAtual = horimetroError;
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
      const aircraftData = {
        ...formData,
        horimetroAtual: formData.horimetroAtual ? parseFloat(formData.horimetroAtual) : 0
      };
      
      if (isEditing) {
        updateAircraft(id, aircraftData);
      } else {
        addAircraft(aircraftData);
      }
      
      navigate('/aeronaves');
    } catch (error) {
      console.error('Error saving aircraft:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta aeronave?')) {
      deleteAircraft(id);
      navigate('/aeronaves');
    }
  };
  
  const handleBack = () => {
    navigate('/aeronaves');
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
            {isEditing ? 'Editar Aeronave' : 'Nova Aeronave'}
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
          {/* Modelo */}
          <div>
            <label className="block cf-text-small cf-bold cf-mb-2">
              Modelo *
            </label>
            <input
              type="text"
              value={formData.modelo}
              onChange={(e) => handleInputChange('modelo', e.target.value)}
              className={`cf-input ${errors.modelo ? 'border-red-500' : ''}`}
              placeholder="Ex: Air Tractor AT-502B"
              required
            />
            {errors.modelo && (
              <p className="cf-text-small text-red-500 cf-mt-1">{errors.modelo}</p>
            )}
          </div>
          
          {/* Prefixo */}
          <div>
            <label className="block cf-text-small cf-bold cf-mb-2">
              Prefixo *
            </label>
            <input
              type="text"
              value={formData.prefixo}
              onChange={(e) => handleInputChange('prefixo', e.target.value.toUpperCase())}
              className={`cf-input ${errors.prefixo ? 'border-red-500' : ''}`}
              placeholder="Ex: PT-ABC"
              required
              style={{ textTransform: 'uppercase' }}
            />
            {errors.prefixo && (
              <p className="cf-text-small text-red-500 cf-mt-1">{errors.prefixo}</p>
            )}
          </div>
          
          {/* Horímetro Atual */}
          <div>
            <label className="block cf-text-small cf-bold cf-mb-2">
              Horímetro Atual (horas)
            </label>
            <input
              type="number"
              value={formData.horimetroAtual}
              onChange={(e) => handleInputChange('horimetroAtual', e.target.value)}
              className={`cf-input ${errors.horimetroAtual ? 'border-red-500' : ''}`}
              placeholder="0.0"
              step="0.1"
              min="0"
            />
            {errors.horimetroAtual && (
              <p className="cf-text-small text-red-500 cf-mt-1">{errors.horimetroAtual}</p>
            )}
            <p className="cf-text-small text-gray-500 cf-mt-1">
              Horímetro atual da aeronave (opcional)
            </p>
          </div>
          
          {/* Actions */}
          <div className="cf-flex cf-gap-4 cf-mt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              <Save size={20} className="mr-2" />
              {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Aeronave')}
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

export default AircraftForm;

