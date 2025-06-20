import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useServices, useClients, useEmployees, useAircrafts, useCultures } from '../hooks/useEntities';
import { useValidation, useFormatters } from '../hooks/useUtils';
import { SERVICE_TYPES } from '../utils/constants';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { ArrowLeft, Save, Trash2, Camera, X } from 'lucide-react';
import LocationPicker from '../components/common/LocationPicker';

function ServiceForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { services, addService, updateService, deleteService, getServiceById } = useServices();
  const { clients } = useClients();
  const { employees } = useEmployees();
  const { aircrafts } = useAircrafts();
  const { cultures } = useCultures();
  const { validateRequired, validateNumber, validateHorimeter } = useValidation();
  const { formatCurrency, formatNumber } = useFormatters();
  
  const isEditing = Boolean(id);
  const existingService = isEditing ? getServiceById(id) : null;
  
  const [formData, setFormData] = useState({
    tipoServico: existingService?.tipoServico || '',
    clienteId: existingService?.clienteId || '',
    aeronaveId: existingService?.aeronaveId || '',
    funcionarioId: existingService?.funcionarioId || '',
    culturaId: existingService?.culturaId || '',
    area: existingService?.area || '',
    vazao: existingService?.vazao || '',
    data: existingService?.data || new Date().toISOString().split('T')[0],
    horimetroInicio: existingService?.horimetroInicio || '',
    horimetroFinal: existingService?.horimetroFinal || '',
    translado: existingService?.translado || '',
    precoHora: existingService?.precoHora || '',
    comissao: existingService?.comissao || '',
    observacoes: existingService?.observacoes || '',
    fotos: existingService?.fotos || [],
    location: existingService?.location || null
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedMetrics, setCalculatedMetrics] = useState({
    horasVoo: 0,
    horasTotal: 0,
    receita: 0,
    valorComissao: 0,
    volumeAplicado: 0
  });
  
  // Calculate metrics when relevant fields change
  useEffect(() => {
    const inicio = parseFloat(formData.horimetroInicio) || 0;
    const final = parseFloat(formData.horimetroFinal) || 0;
    const area = parseFloat(formData.area) || 0;
    const vazao = parseFloat(formData.vazao) || 0;
    const precoHora = parseFloat(formData.precoHora) || 0;
    const comissao = parseFloat(formData.comissao) || 0;
    const translado = parseFloat(formData.translado) || 0;
    
    const horasVoo = Math.max(0, final - inicio);
    const horasTotal = horasVoo + translado;
    const receita = horasVoo * precoHora;
    const valorComissao = receita * (comissao / 100);
    const volumeAplicado = area * vazao;
    
    setCalculatedMetrics({
      horasVoo,
      horasTotal,
      receita,
      valorComissao,
      volumeAplicado
    });
  }, [formData.horimetroInicio, formData.horimetroFinal, formData.area, formData.vazao, formData.precoHora, formData.comissao, formData.translado]);
  
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
  
  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        // Limit file size to 2MB
        if (file.size > 2 * 1024 * 1024) {
          alert(`A imagem ${file.name} é muito grande (máximo 2MB). Por favor, escolha uma imagem menor.`);
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          // Create image element for compression
          const img = new Image();
          img.onload = () => {
            // Create canvas for compression
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calculate compressed dimensions (max 800x600)
            let { width, height } = img;
            const maxWidth = 800;
            const maxHeight = 600;
            
            if (width > height) {
              if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw compressed image
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to compressed dataUrl (60% quality)
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
            
            // Generate secure ID using crypto if available
            const photoId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            const newPhoto = {
              id: photoId,
              name: file.name,
              dataUrl: compressedDataUrl,
              originalSize: file.size,
              compressedSize: Math.round((compressedDataUrl.length * 3) / 4) // Approximate size
            };
            
            setFormData(prev => ({
              ...prev,
              fotos: [...prev.fotos, newPhoto]
            }));
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Clear the input
    event.target.value = '';
  };
  
  const handleRemovePhoto = (photoId) => {
    setFormData(prev => ({
      ...prev,
      fotos: prev.fotos.filter(photo => photo.id !== photoId)
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const tipoServicoError = validateRequired(formData.tipoServico, 'Tipo de Serviço');
    if (tipoServicoError) newErrors.tipoServico = tipoServicoError;
    
    const clienteError = validateRequired(formData.clienteId, 'Cliente');
    if (clienteError) newErrors.clienteId = clienteError;
    
    const aeronaveError = validateRequired(formData.aeronaveId, 'Aeronave');
    if (aeronaveError) newErrors.aeronaveId = aeronaveError;
    
    const funcionarioError = validateRequired(formData.funcionarioId, 'Funcionário');
    if (funcionarioError) newErrors.funcionarioId = funcionarioError;
    
    const culturaError = validateRequired(formData.culturaId, 'Cultura');
    if (culturaError) newErrors.culturaId = culturaError;
    
    const dataError = validateRequired(formData.data, 'Data');
    if (dataError) newErrors.data = dataError;
    
    // Number validations
    const areaError = validateNumber(formData.area, 'Área', 0.1);
    if (areaError) newErrors.area = areaError;
    
    const vazaoError = validateNumber(formData.vazao, 'Vazão', 0.1);
    if (vazaoError) newErrors.vazao = vazaoError;
    
    const precoHoraError = validateNumber(formData.precoHora, 'Preço Hora', 0.01);
    if (precoHoraError) newErrors.precoHora = precoHoraError;
    
    // Horimeter validation
    const horimetroError = validateHorimeter(formData.horimetroInicio, formData.horimetroFinal);
    if (horimetroError) newErrors.horimetroFinal = horimetroError;
    
    // Optional number validations
    if (formData.translado) {
      const transladoError = validateNumber(formData.translado, 'Translado', 0);
      if (transladoError) newErrors.translado = transladoError;
    }
    
    if (formData.comissao) {
      const comissaoError = validateNumber(formData.comissao, 'Comissão', 0);
      if (comissaoError) newErrors.comissao = comissaoError;
      else if (parseFloat(formData.comissao) > 100) {
        newErrors.comissao = 'Comissão não pode ser maior que 100%';
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
      const serviceData = {
        ...formData,
        area: parseFloat(formData.area),
        vazao: parseFloat(formData.vazao),
        horimetroInicio: parseFloat(formData.horimetroInicio),
        horimetroFinal: parseFloat(formData.horimetroFinal),
        translado: formData.translado ? parseFloat(formData.translado) : 0,
        precoHora: parseFloat(formData.precoHora),
        comissao: formData.comissao ? parseFloat(formData.comissao) : 0
      };
      
      if (isEditing) {
        updateService(id, serviceData);
      } else {
        addService(serviceData);
      }
      
      navigate('/servicos');
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      deleteService(id);
      navigate('/servicos');
    }
  };
  
  const handleBack = () => {
    navigate('/servicos');
  };
  
  // Check if we have all required data
  const hasRequiredData = clients.length > 0 && employees.length > 0 && aircrafts.length > 0 && cultures.length > 0;
  
  if (!hasRequiredData) {
    return (
      <div className="cf-flex cf-flex-col cf-gap-4">
        <div className="cf-flex cf-items-center cf-gap-4">
          <button
            onClick={handleBack}
            className="cf-touch-target hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="cf-text-xl cf-bold">Novo Serviço</h1>
        </div>
        
        <Card>
          <div className="text-center cf-py-12">
            <div className="cf-text-large cf-bold cf-mb-4">
              Dados necessários não encontrados
            </div>
            <div className="cf-text-small text-gray-600 cf-mb-6">
              Para registrar um serviço, você precisa ter pelo menos:
            </div>
            <div className="space-y-2 cf-mb-6">
              {clients.length === 0 && (
                <div className="cf-text-small text-red-600">• 1 cliente cadastrado</div>
              )}
              {employees.length === 0 && (
                <div className="cf-text-small text-red-600">• 1 funcionário cadastrado</div>
              )}
              {aircrafts.length === 0 && (
                <div className="cf-text-small text-red-600">• 1 aeronave cadastrada</div>
              )}
              {cultures.length === 0 && (
                <div className="cf-text-small text-red-600">• 1 cultura cadastrada</div>
              )}
            </div>
            <div className="cf-flex cf-gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate('/clientes')}
              >
                Cadastrar Clientes
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/funcionarios')}
              >
                Cadastrar Funcionários
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  
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
            {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
          </h1>
          {isEditing && (
            <p className="cf-text-small text-gray-600">
              ID: {id}
            </p>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <Card title="Informações Básicas">
          <div className="space-y-4">
            {/* Tipo de Serviço */}
            <div>
              <label className="block cf-text-small cf-bold cf-mb-2">
                Tipo de Serviço *
              </label>
              <select
                value={formData.tipoServico}
                onChange={(e) => handleInputChange('tipoServico', e.target.value)}
                className={`cf-input ${errors.tipoServico ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Selecione o tipo de serviço</option>
                {SERVICE_TYPES.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
              {errors.tipoServico && (
                <p className="cf-text-small text-red-500 cf-mt-1">{errors.tipoServico}</p>
              )}
            </div>
            
            {/* Data */}
            <div>
              <label className="block cf-text-small cf-bold cf-mb-2">
                Data *
              </label>
              <input
                type="date"
                value={formData.data}
                onChange={(e) => handleInputChange('data', e.target.value)}
                className={`cf-input ${errors.data ? 'border-red-500' : ''}`}
                required
              />
              {errors.data && (
                <p className="cf-text-small text-red-500 cf-mt-1">{errors.data}</p>
              )}
            </div>
          </div>
        </Card>
        
        {/* Assignments */}
        <Card title="Responsáveis">
          <div className="space-y-4">
            {/* Cliente */}
            <div>
              <label className="block cf-text-small cf-bold cf-mb-2">
                Cliente *
              </label>
              <select
                value={formData.clienteId}
                onChange={(e) => handleInputChange('clienteId', e.target.value)}
                className={`cf-input ${errors.clienteId ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Selecione o cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nome} {client.empresa && `(${client.empresa})`}
                  </option>
                ))}
              </select>
              {errors.clienteId && (
                <p className="cf-text-small text-red-500 cf-mt-1">{errors.clienteId}</p>
              )}
            </div>
            
            {/* Funcionário */}
            <div>
              <label className="block cf-text-small cf-bold cf-mb-2">
                Funcionário *
              </label>
              <select
                value={formData.funcionarioId}
                onChange={(e) => handleInputChange('funcionarioId', e.target.value)}
                className={`cf-input ${errors.funcionarioId ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Selecione o funcionário</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.nomeCompleto}
                  </option>
                ))}
              </select>
              {errors.funcionarioId && (
                <p className="cf-text-small text-red-500 cf-mt-1">{errors.funcionarioId}</p>
              )}
            </div>
            
            {/* Aeronave */}
            <div>
              <label className="block cf-text-small cf-bold cf-mb-2">
                Aeronave *
              </label>
              <select
                value={formData.aeronaveId}
                onChange={(e) => handleInputChange('aeronaveId', e.target.value)}
                className={`cf-input ${errors.aeronaveId ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Selecione a aeronave</option>
                {aircrafts.map((aircraft) => (
                  <option key={aircraft.id} value={aircraft.id}>
                    {aircraft.modelo} ({aircraft.prefixo})
                  </option>
                ))}
              </select>
              {errors.aeronaveId && (
                <p className="cf-text-small text-red-500 cf-mt-1">{errors.aeronaveId}</p>
              )}
            </div>
            
            {/* Cultura */}
            <div>
              <label className="block cf-text-small cf-bold cf-mb-2">
                Cultura *
              </label>
              <select
                value={formData.culturaId}
                onChange={(e) => handleInputChange('culturaId', e.target.value)}
                className={`cf-input ${errors.culturaId ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Selecione a cultura</option>
                {cultures.map((culture) => (
                  <option key={culture.id} value={culture.id}>
                    {culture.nome}
                  </option>
                ))}
              </select>
              {errors.culturaId && (
                <p className="cf-text-small text-red-500 cf-mt-1">{errors.culturaId}</p>
              )}
            </div>
          </div>
        </Card>
        
        {/* Technical Data */}
        <Card title="Dados Técnicos">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Área */}
              <div>
                <label className="block cf-text-small cf-bold cf-mb-2">
                  Área (ha) *
                </label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className={`cf-input ${errors.area ? 'border-red-500' : ''}`}
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  required
                />
                {errors.area && (
                  <p className="cf-text-small text-red-500 cf-mt-1">{errors.area}</p>
                )}
              </div>
              
              {/* Vazão */}
              <div>
                <label className="block cf-text-small cf-bold cf-mb-2">
                  Vazão (L/ha) *
                </label>
                <input
                  type="number"
                  value={formData.vazao}
                  onChange={(e) => handleInputChange('vazao', e.target.value)}
                  className={`cf-input ${errors.vazao ? 'border-red-500' : ''}`}
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  required
                />
                {errors.vazao && (
                  <p className="cf-text-small text-red-500 cf-mt-1">{errors.vazao}</p>
                )}
              </div>
            </div>
            
            {/* Volume Aplicado (calculated) */}
            {calculatedMetrics.volumeAplicado > 0 && (
              <div className="cf-bg-gray-50 cf-p-3 rounded-lg">
                <div className="cf-text-small cf-bold text-gray-700">
                  Volume Total Aplicado: {formatNumber(calculatedMetrics.volumeAplicado)} L
                </div>
              </div>
            )}
          </div>
        </Card>
        
        {/* Location Data */}
        <Card title="📍 Localização do Serviço">
          <div className="space-y-3">
            <div className="text-sm text-gray-600 mb-3">
              <p>Capture a localização onde o serviço foi realizado para referência futura e visualização no mapa.</p>
            </div>
            
            <LocationPicker
              value={formData.location}
              onChange={(location) => handleInputChange('location', location)}
              disabled={isSubmitting}
            />
            
            {formData.location && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">💡</span>
                  <div className="text-blue-800">
                    <strong>Localização salva!</strong> Este serviço aparecerá no mapa de serviços e poderá ser usado para análises geográficas futuras.
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
        
        {/* Flight Data */}
        <Card title="Dados de Voo">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Horímetro Início */}
              <div>
                <label className="block cf-text-small cf-bold cf-mb-2">
                  Horímetro Início *
                </label>
                <input
                  type="number"
                  value={formData.horimetroInicio}
                  onChange={(e) => handleInputChange('horimetroInicio', e.target.value)}
                  className={`cf-input ${errors.horimetroInicio ? 'border-red-500' : ''}`}
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  required
                />
                {errors.horimetroInicio && (
                  <p className="cf-text-small text-red-500 cf-mt-1">{errors.horimetroInicio}</p>
                )}
              </div>
              
              {/* Horímetro Final */}
              <div>
                <label className="block cf-text-small cf-bold cf-mb-2">
                  Horímetro Final *
                </label>
                <input
                  type="number"
                  value={formData.horimetroFinal}
                  onChange={(e) => handleInputChange('horimetroFinal', e.target.value)}
                  className={`cf-input ${errors.horimetroFinal ? 'border-red-500' : ''}`}
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  required
                />
                {errors.horimetroFinal && (
                  <p className="cf-text-small text-red-500 cf-mt-1">{errors.horimetroFinal}</p>
                )}
              </div>
            </div>
            
            {/* Translado */}
            <div>
              <label className="block cf-text-small cf-bold cf-mb-2">
                Translado (horas)
              </label>
              <input
                type="number"
                value={formData.translado}
                onChange={(e) => handleInputChange('translado', e.target.value)}
                className={`cf-input ${errors.translado ? 'border-red-500' : ''}`}
                placeholder="0.0"
                step="0.1"
                min="0"
              />
              {errors.translado && (
                <p className="cf-text-small text-red-500 cf-mt-1">{errors.translado}</p>
              )}
            </div>
            
            {/* Flight metrics (calculated) */}
            {calculatedMetrics.horasVoo > 0 && (
              <div className="cf-bg-blue-50 cf-p-3 rounded-lg space-y-1">
                <div className="cf-text-small cf-bold text-blue-700">
                  Horas de Voo: {formatNumber(calculatedMetrics.horasVoo)} h
                </div>
                <div className="cf-text-small text-blue-600">
                  Horas Totais (com translado): {formatNumber(calculatedMetrics.horasTotal)} h
                </div>
              </div>
            )}
          </div>
        </Card>
        
        {/* Financial Data */}
        <Card title="Dados Financeiros">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Preço Hora */}
              <div>
                <label className="block cf-text-small cf-bold cf-mb-2">
                  Preço Hora (R$) *
                </label>
                <input
                  type="number"
                  value={formData.precoHora}
                  onChange={(e) => handleInputChange('precoHora', e.target.value)}
                  className={`cf-input ${errors.precoHora ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
                {errors.precoHora && (
                  <p className="cf-text-small text-red-500 cf-mt-1">{errors.precoHora}</p>
                )}
              </div>
              
              {/* Comissão */}
              <div>
                <label className="block cf-text-small cf-bold cf-mb-2">
                  Comissão (%)
                </label>
                <input
                  type="number"
                  value={formData.comissao}
                  onChange={(e) => handleInputChange('comissao', e.target.value)}
                  className={`cf-input ${errors.comissao ? 'border-red-500' : ''}`}
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  max="100"
                />
                {errors.comissao && (
                  <p className="cf-text-small text-red-500 cf-mt-1">{errors.comissao}</p>
                )}
              </div>
            </div>
            
            {/* Financial metrics (calculated) */}
            {calculatedMetrics.receita > 0 && (
              <div className="cf-bg-green-50 cf-p-3 rounded-lg space-y-1">
                <div className="cf-text-small cf-bold text-green-700">
                  Receita Total: {formatCurrency(calculatedMetrics.receita)}
                </div>
                {calculatedMetrics.valorComissao > 0 && (
                  <div className="cf-text-small text-green-600">
                    Valor da Comissão: {formatCurrency(calculatedMetrics.valorComissao)}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
        
        {/* Photos */}
        <Card title="Fotos do Serviço">
          <div className="space-y-4">
            {/* Photo Upload */}
            <div>
              <label className="block cf-text-small cf-bold cf-mb-2">
                Adicionar Fotos
              </label>
              <div className="cf-flex cf-items-center cf-gap-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="cf-flex cf-items-center cf-gap-2 cf-px-4 cf-py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                >
                  <Camera size={20} />
                  <span className="cf-text-small">Escolher Fotos</span>
                </label>
                <span className="cf-text-small text-gray-500">
                  {formData.fotos.length} foto{formData.fotos.length !== 1 ? 's' : ''} adicionada{formData.fotos.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            {/* Photo Preview */}
            {formData.fotos.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {formData.fotos.map((photo) => (
                  <div key={photo.id} className="relative">
                    <img
                      src={photo.dataUrl}
                      alt={photo.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="absolute top-2 right-2 cf-bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <div className="cf-text-small text-gray-600 cf-mt-1 truncate">
                      {photo.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
        
        {/* Observations */}
        <Card title="Observações">
          <div>
            <label className="block cf-text-small cf-bold cf-mb-2">
              Observações Adicionais
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              className="cf-input"
              placeholder="Observações sobre o serviço..."
              rows={4}
            />
          </div>
        </Card>
        
        {/* Actions */}
        <Card>
          <div className="cf-flex cf-gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              <Save size={20} className="mr-2" />
              {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Serviço')}
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
        </Card>
      </form>
      
      {/* Required fields note */}
      <div className="cf-text-small text-gray-500 text-center">
        * Campos obrigatórios
      </div>
    </div>
  );
}

export default ServiceForm;

