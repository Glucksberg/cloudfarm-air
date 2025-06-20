import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useServices, useClients, useEmployees, useAircrafts, useCultures, useHarvests } from '../hooks/useEntities';
import { useFormatters } from '../hooks/useUtils';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { 
  Download, 
  Upload, 
  Calendar,
  Database,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Plus,
  Edit,
  Star
} from 'lucide-react';

function Settings() {
  const { clearAllData, populateSystemDemo } = useApp();
  const { services, clearServices, importServices } = useServices();
  const { clients, clearClients, importClients } = useClients();
  const { employees, clearEmployees, importEmployees } = useEmployees();
  const { aircrafts, clearAircrafts, importAircrafts } = useAircrafts();
  const { cultures, clearCultures, importCultures } = useCultures();
  const { 
    harvests, 
    currentHarvest, 
    addHarvest, 
    updateHarvest, 
    deleteHarvest, 
    setCurrentHarvest, 
    getServicesCountForHarvest 
  } = useHarvests();
  const { formatDate } = useFormatters();
  
  const [newSafra, setNewSafra] = useState('');
  const [editingSafra, setEditingSafra] = useState(null);
  const [editSafraName, setEditSafraName] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [isPopulating, setIsPopulating] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(0);
  const [confirmationTimer, setConfirmationTimer] = useState(null);
  const [showDemoConfirm, setShowDemoConfirm] = useState(false);
  
  // Multi-step confirmation system
  const confirmationSteps = [
    {
      title: "Tem certeza?",
      message: "Isso vai excluir TODOS os dados!",
      buttonText: "Sim, tenho certeza",
      color: "bg-yellow-500 hover:bg-yellow-600",
      icon: "⚠️"
    },
    {
      title: "Sério mesmo?",
      message: "São todos os clientes, serviços, auxiliares...",
      buttonText: "Ainda tenho certeza",
      color: "bg-orange-500 hover:bg-orange-600", 
      icon: "😰"
    },
    {
      title: "Última chance!",
      message: "Não tem volta! Vai perder tudo mesmo?",
      buttonText: "SIM, EXCLUIR TUDO!",
      color: "bg-red-600 hover:bg-red-700",
      icon: "💀"
    }
  ];
  
  // Generate current safra if not set
  const getCurrentSafra = () => {
    if (currentHarvest) return currentHarvest.name;
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    return `${currentYear}/${String(nextYear).slice(-2)}`;
  };
  
  // Safra management
  const handleAddSafra = () => {
    if (!newSafra.trim()) return;
    
    try {
      const newHarvest = addHarvest(newSafra.trim());
      setNewSafra('');
      setImportStatus({
        type: 'success',
        message: `Safra "${newHarvest.name}" criada com sucesso!`
      });
      setTimeout(() => setImportStatus(null), 3000);
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: 'Erro ao criar safra. Tente novamente.'
      });
      setTimeout(() => setImportStatus(null), 3000);
    }
  };
  
  const handleEditSafra = (harvest) => {
    setEditingSafra(harvest.id);
    setEditSafraName(harvest.name);
  };
  
  const handleSaveEditSafra = () => {
    if (!editSafraName.trim()) return;
    
    try {
      updateHarvest(editingSafra, { name: editSafraName.trim() });
      setEditingSafra(null);
      setEditSafraName('');
      setImportStatus({
        type: 'success',
        message: 'Safra atualizada com sucesso!'
      });
      setTimeout(() => setImportStatus(null), 3000);
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: 'Erro ao atualizar safra. Tente novamente.'
      });
      setTimeout(() => setImportStatus(null), 3000);
    }
  };
  
  const handleCancelEditSafra = () => {
    setEditingSafra(null);
    setEditSafraName('');
  };
  
  const handleDeleteSafra = (harvestId) => {
    const harvest = harvests.find(h => h.id === harvestId);
    if (!harvest) return;
    
    const servicesCount = getServicesCountForHarvest(harvestId);
    const confirmMessage = servicesCount > 0 
      ? `Tem certeza que deseja excluir a safra "${harvest.name}"?\n\nEsta safra possui ${servicesCount} serviços que serão perdidos permanentemente.`
      : `Tem certeza que deseja excluir a safra "${harvest.name}"?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        deleteHarvest(harvestId);
        setImportStatus({
          type: 'success',
          message: `Safra "${harvest.name}" excluída com sucesso!`
        });
        setTimeout(() => setImportStatus(null), 3000);
      } catch (error) {
        setImportStatus({
          type: 'error',
          message: error.message || 'Erro ao excluir safra.'
        });
        setTimeout(() => setImportStatus(null), 3000);
      }
    }
  };
  
  const handleSelectSafra = (harvestId) => {
    setCurrentHarvest(harvestId);
    setImportStatus({
      type: 'success',
      message: 'Safra selecionada com sucesso!'
    });
    setTimeout(() => setImportStatus(null), 2000);
  };
  
  // Legacy safra change function
  const handleSafraChange = () => {
    if (!newSafra.trim()) return;
    
    if (window.confirm(`Tem certeza que deseja alterar a safra para "${newSafra}"? Isso criará uma nova safra e os dados atuais serão mantidos.`)) {
      handleAddSafra();
    }
  };
  
  // Backup/Export functionality
  const exportAllData = () => {
    setIsExporting(true);
    
    try {
      const backupData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        safra: getCurrentSafra(),
        data: {
          services,
          clients,
          employees,
          aircrafts,
          cultures
        },
        metadata: {
          totalServices: services.length,
          totalClients: clients.length,
          totalEmployees: employees.length,
          totalAircrafts: aircrafts.length,
          totalCultures: cultures.length
        }
      };
      
      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `cloudfarm-backup-${getCurrentSafra().replace('/', '-')}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setImportStatus({
        type: 'success',
        message: 'Backup exportado com sucesso!'
      });
      
      setTimeout(() => setImportStatus(null), 3000);
    } catch (error) {
      console.error('Error exporting data:', error);
      setImportStatus({
        type: 'error',
        message: 'Erro ao exportar backup. Tente novamente.'
      });
      setTimeout(() => setImportStatus(null), 5000);
    } finally {
      setIsExporting(false);
    }
  };
  
  // Restore/Import functionality
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsImporting(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target.result);
        
        // Validate backup structure
        if (!backupData.version || !backupData.data) {
          throw new Error('Formato de backup inválido');
        }
        
        const { data } = backupData;
        
        // Confirm import
        const confirmMessage = `
Importar backup da safra ${backupData.safra || 'N/A'}?

Dados no backup:
• ${data.services?.length || 0} serviços
• ${data.clients?.length || 0} clientes  
• ${data.employees?.length || 0} auxiliares
• ${data.aircrafts?.length || 0} aeronaves
• ${data.cultures?.length || 0} culturas

ATENÇÃO: Isso substituirá todos os dados atuais!
        `;
        
        if (window.confirm(confirmMessage)) {
          // Import data
          if (data.services) importServices(data.services);
          if (data.clients) importClients(data.clients);
          if (data.employees) importEmployees(data.employees);
          if (data.aircrafts) importAircrafts(data.aircrafts);
          if (data.cultures) importCultures(data.cultures);
          
          // Update safra if available
          if (backupData.safra) {
            setCurrentHarvest({ name: backupData.safra });
          }
          
          setImportStatus({
            type: 'success',
            message: 'Backup importado com sucesso!'
          });
        }
      } catch (error) {
        console.error('Error importing data:', error);
        setImportStatus({
          type: 'error',
          message: 'Erro ao importar backup. Verifique se o arquivo é válido.'
        });
      } finally {
        setIsImporting(false);
        event.target.value = ''; // Clear file input
        setTimeout(() => setImportStatus(null), 5000);
      }
    };
    
    reader.readAsText(file);
  };
  
  // Clear all data with fun confirmation
  const handleClearAllData = () => {
    if (confirmationStep < confirmationSteps.length) {
      setConfirmationStep(confirmationStep + 1);
      
      // Auto-reset after 10 seconds of inactivity
      if (confirmationTimer) clearTimeout(confirmationTimer);
      const timer = setTimeout(() => {
        setConfirmationStep(0);
        setImportStatus({
          type: 'success',
          message: '😌 Ufa! Cancelamos a exclusão por segurança.'
        });
        setTimeout(() => setImportStatus(null), 3000);
      }, 10000);
      setConfirmationTimer(timer);
      
      return;
    }

    // Final confirmation reached
    if (confirmationTimer) clearTimeout(confirmationTimer);
    
    clearAllData();
    setConfirmationStep(0);
    setImportStatus({
      type: 'success',
      message: '💥 Todos os dados foram removidos! (Você realmente quis isso...)'
    });
    setTimeout(() => setImportStatus(null), 4000);
  };
  
  const cancelConfirmation = () => {
    if (confirmationTimer) clearTimeout(confirmationTimer);
    setConfirmationStep(0);
    setImportStatus({
      type: 'success',
      message: '😅 Boa escolha! Seus dados estão seguros.'
    });
    setTimeout(() => setImportStatus(null), 3000);
  };
  
  // Populate system with demo data
  const handlePopulateSystem = () => {
    setShowDemoConfirm(true);
  };
  
  const confirmPopulateSystem = async () => {
    setIsPopulating(true);
    setShowDemoConfirm(false);
    
    try {
      // Clear existing data first
      clearAllData();
      
      // Populate with new demo data (including photos)
      await populateSystemDemo();
      
      setImportStatus({
        type: 'success',
        message: 'Sistema populado com 25 clientes, 5 auxiliares, 8 aeronaves, 12 culturas e 120 serviços!'
      });
      setTimeout(() => setImportStatus(null), 5000);
    } catch (error) {
      console.error('Error populating system:', error);
      setImportStatus({
        type: 'error',
        message: 'Erro ao popular o sistema. Tente novamente.'
      });
      setTimeout(() => setImportStatus(null), 3000);
    } finally {
      setIsPopulating(false);
    }
  };
  
  const cancelPopulateSystem = () => {
    setShowDemoConfirm(false);
  };
  
  // Clear demo data
  const handleClearDemoData = () => {
    setShowDemoConfirm(true);
  };

  const confirmClearDemoData = () => {
    try {
      // Clear all entities
      clearServices();
      clearClients();
      clearEmployees();
      clearAircrafts();
      clearCultures();
      
      setShowDemoConfirm(false);
      setImportStatus({
        type: 'success',
        message: 'Dados de demonstração removidos com sucesso!'
      });
      setTimeout(() => setImportStatus(null), 3000);
    } catch (error) {
      console.error('Error clearing demo data:', error);
      setShowDemoConfirm(false);
      setImportStatus({
        type: 'error',
        message: 'Erro ao remover dados. Tente novamente.'
      });
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  const cancelClearDemoData = () => {
    setShowDemoConfirm(false);
  };
  
  // Check if system has demo-like data (heuristic)
  const hasDemoData = () => {
    return getTotalDataCount() > 50; // Assume demo data if more than 50 total items
  };
  
  // Calculate total data size
  const getTotalDataCount = () => {
    return services.length + clients.length + employees.length + aircrafts.length + cultures.length;
  };
  
  return (
    <div className="cf-flex cf-flex-col cf-gap-4">
      {/* Header */}
      <div>
        <h1 className="cf-text-xl cf-bold">Configurações</h1>
        <p className="cf-text-small text-gray-600">Safras, backup e configurações do sistema</p>
      </div>
      
      {/* Status Messages */}
      {importStatus && (
        <Card>
          <div className={`cf-flex cf-items-center cf-gap-3 cf-p-3 rounded-lg ${
            importStatus.type === 'success' 
              ? 'cf-bg-green-50 text-green-700' 
              : 'cf-bg-red-50 text-red-700'
          }`}>
            {importStatus.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertTriangle size={20} />
            )}
            <span className="cf-text-small cf-bold">{importStatus.message}</span>
          </div>
        </Card>
      )}
      
      {/* Safras Management */}
      <Card title="Gerenciamento de Safras">
        <div className="space-y-6">
          {/* Current Harvest Display */}
          <div className="cf-flex cf-items-center cf-gap-3 cf-p-4 cf-bg-blue-50 rounded-lg">
            <Star size={24} className="text-blue-600" />
            <div className="flex-1">
              <div className="cf-text-medium cf-bold text-blue-900">
                Safra Atual: {currentHarvest?.name}
              </div>
              <div className="cf-text-small text-blue-700">
                {services.length} serviços registrados nesta safra
              </div>
            </div>
          </div>
          
          {/* Add New Harvest */}
          <div className="cf-border-t cf-pt-4">
            <div className="cf-text-small cf-bold cf-mb-2">
              Adicionar Nova Safra
            </div>
            <div className="cf-flex cf-gap-2">
              <input
                type="text"
                value={newSafra}
                onChange={(e) => setNewSafra(e.target.value)}
                placeholder="Ex: 2025/26"
                className="cf-input flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSafra()}
              />
              <Button
                onClick={handleAddSafra}
                disabled={!newSafra.trim()}
              >
                <Plus size={16} className="mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
          
          {/* Harvests List */}
          <div className="cf-border-t cf-pt-4">
            <div className="cf-text-small cf-bold cf-mb-3">
              Todas as Safras ({harvests.length})
            </div>
            <div className="space-y-2">
              {harvests.map((harvest) => (
                <div
                  key={harvest.id}
                  className={`cf-flex cf-items-center cf-justify-between cf-p-3 rounded-lg border ${
                    harvest.id === currentHarvest?.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="cf-flex cf-items-center cf-gap-3">
                    {harvest.id === currentHarvest?.id && (
                      <Star size={16} className="text-blue-600" />
                    )}
                    <div>
                      {editingSafra === harvest.id ? (
                        <div className="cf-flex cf-gap-2">
                          <input
                            type="text"
                            value={editSafraName}
                            onChange={(e) => setEditSafraName(e.target.value)}
                            className="cf-input cf-text-small"
                            style={{ width: '120px' }}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') handleSaveEditSafra();
                              if (e.key === 'Escape') handleCancelEditSafra();
                            }}
                            autoFocus
                          />
                          <Button
                            onClick={handleSaveEditSafra}
                            disabled={!editSafraName.trim()}
                            size="sm"
                            variant="outline"
                          >
                            <Save size={14} />
                          </Button>
                          <Button
                            onClick={handleCancelEditSafra}
                            size="sm"
                            variant="outline"
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="cf-text-medium cf-bold">
                            {harvest.name}
                            {harvest.id === currentHarvest?.id && (
                              <span className="cf-text-small text-blue-600 cf-ml-2">(Ativa)</span>
                            )}
                          </div>
                          <div className="cf-text-small text-gray-600">
                            {getServicesCountForHarvest(harvest.id)} serviços • Criada em {formatDate(harvest.createdAt)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {editingSafra !== harvest.id && (
                    <div className="cf-flex cf-gap-1">
                      {harvest.id !== currentHarvest?.id && (
                        <Button
                          onClick={() => handleSelectSafra(harvest.id)}
                          size="sm"
                          variant="outline"
                          title="Selecionar esta safra"
                        >
                          <Star size={14} />
                        </Button>
                      )}
                      <Button
                        onClick={() => handleEditSafra(harvest)}
                        size="sm"
                        variant="outline"
                        title="Editar nome da safra"
                      >
                        <Edit size={14} />
                      </Button>
                      {harvests.length > 1 && (
                        <Button
                          onClick={() => handleDeleteSafra(harvest.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                          title="Excluir safra"
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Data Summary */}
      <Card title="Resumo dos Dados">
        <div className="space-y-3">
          <div className="cf-flex cf-justify-between cf-items-center">
            <span className="cf-text-small">Serviços</span>
            <span className="cf-text-small cf-bold">{services.length}</span>
          </div>
          <div className="cf-flex cf-justify-between cf-items-center">
            <span className="cf-text-small">Clientes</span>
            <span className="cf-text-small cf-bold">{clients.length}</span>
          </div>
          <div className="cf-flex cf-justify-between cf-items-center">
            <span className="cf-text-small">Auxiliares</span>
            <span className="cf-text-small cf-bold">{employees.length}</span>
          </div>
          <div className="cf-flex cf-justify-between cf-items-center">
            <span className="cf-text-small">Aeronaves</span>
            <span className="cf-text-small cf-bold">{aircrafts.length}</span>
          </div>
          <div className="cf-flex cf-justify-between cf-items-center">
            <span className="cf-text-small">Culturas</span>
            <span className="cf-text-small cf-bold">{cultures.length}</span>
          </div>
          <div className="cf-border-t cf-pt-2 cf-flex cf-justify-between cf-items-center">
            <span className="cf-text-small cf-bold">Total</span>
            <span className="cf-text-small cf-bold text-blue-600">{getTotalDataCount()}</span>
          </div>
        </div>
      </Card>
      
      {/* Backup & Restore */}
      <Card title="Backup & Restore">
        <div className="space-y-4">
          {/* Export */}
          <div>
            <div className="cf-text-small cf-bold cf-mb-2">
              Exportar Backup
            </div>
            <div className="cf-text-small text-gray-600 cf-mb-3">
              Faça backup de todos os dados da safra atual
            </div>
            <Button
              onClick={exportAllData}
              disabled={isExporting || getTotalDataCount() === 0}
              className="w-full"
            >
              <Download size={20} className="mr-2" />
              {isExporting ? 'Exportando...' : 'Exportar Backup'}
            </Button>
          </div>
          
          {/* Import */}
          <div className="cf-border-t cf-pt-4">
            <div className="cf-text-small cf-bold cf-mb-2">
              Importar Backup
            </div>
            <div className="cf-text-small text-gray-600 cf-mb-3">
              Restaure dados de um arquivo de backup
            </div>
            <div className="cf-flex cf-items-center cf-gap-2">
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                disabled={isImporting}
                className="hidden"
                id="backup-import"
              />
              <label
                htmlFor="backup-import"
                className={`cf-flex cf-items-center cf-gap-2 cf-px-4 cf-py-2 rounded-lg cursor-pointer transition-colors w-full justify-center ${
                  isImporting 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Upload size={20} />
                <span>{isImporting ? 'Importando...' : 'Selecionar Arquivo'}</span>
              </label>
            </div>
            <div className="cf-text-small text-orange-600 cf-mt-2">
              ⚠️ Importar substituirá todos os dados atuais
            </div>
          </div>
        </div>
      </Card>
      
      {/* Demo Data */}
      <Card title="Dados de Demonstração">
        <div className="space-y-6">
          {/* Status indicator */}
          <div className="cf-flex cf-items-center cf-justify-between cf-p-4 cf-bg-gray-50 rounded-lg">
            <div className="cf-flex cf-items-center cf-gap-3">
              <div className={`w-3 h-3 rounded-full ${hasDemoData() ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div>
                <div className="cf-text-small cf-bold">
                  Status: {hasDemoData() ? 'Sistema com dados' : 'Sistema vazio'}
                </div>
                <div className="cf-text-small text-gray-600">
                  {getTotalDataCount()} itens no total
                </div>
              </div>
            </div>
            {hasDemoData() && (
              <div className="cf-text-small text-green-600 cf-bold">
                ✓ Dados carregados
              </div>
            )}
          </div>

          {/* Popular System Section */}
          <div className="cf-border cf-border-green-200 cf-bg-green-50 rounded-lg cf-p-4">
            <div className="cf-flex cf-items-start cf-gap-3 cf-mb-4">
              <Database size={24} className="text-green-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="cf-text-medium cf-bold text-green-800 cf-mb-2">
                  Popular Sistema para Demonstração
                </div>
                <div className="cf-text-small text-green-700 cf-mb-3">
                  Gera dados realistas para explorar todas as funcionalidades:
                </div>
                <div className="grid grid-cols-2 gap-2 cf-mb-4">
                  <div className="cf-text-small text-green-600">• 25 clientes variados</div>
                  <div className="cf-text-small text-green-600">• 5 auxiliares</div>
                  <div className="cf-text-small text-green-600">• 8 aeronaves diferentes</div>
                  <div className="cf-text-small text-green-600">• 12 culturas</div>
                  <div className="cf-text-small text-green-600 col-span-2">• 120 serviços distribuídos no ano</div>
                </div>
              </div>
            </div>
            
            {/* Simple confirmation dialog */}
            {showDemoConfirm ? (
              <div className="cf-border cf-border-green-300 cf-bg-green-100 rounded-lg cf-p-3 cf-mb-4">
                <div className="cf-flex cf-items-center cf-gap-2 cf-mb-3">
                  <span className="text-lg">📸</span>
                  <div>
                    <div className="cf-text-small cf-bold text-green-800">
                      Popular sistema com dados e fotos de demonstração?
                    </div>
                    <div className="cf-text-small text-green-600">
                      Isso irá limpar dados existentes e criar novos com fotos de exemplo.
                    </div>
                  </div>
                </div>
                
                <div className="cf-flex cf-gap-2">
                  <Button
                    onClick={confirmPopulateSystem}
                    size="small"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={isPopulating}
                  >
                    {isPopulating ? 'Populando...' : 'Sim, popular'}
                  </Button>
                  <Button
                    onClick={cancelPopulateSystem}
                    size="small"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={handlePopulateSystem}
                disabled={isPopulating}
                className="w-full"
                variant="success"
              >
                <Database size={20} className="mr-2" />
                {isPopulating ? 'Populando Sistema...' : 'Popular Sistema para Demonstração'}
              </Button>
            )}
          </div>

          {/* Clear Demo Data Section */}
          {hasDemoData() && (
            <div className="cf-border cf-border-orange-200 cf-bg-orange-50 rounded-lg cf-p-4">
              <div className="cf-flex cf-items-start cf-gap-3 cf-mb-4">
                <Trash2 size={24} className="text-orange-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="cf-text-medium cf-bold text-orange-800 cf-mb-2">
                    Excluir Dados de Demonstração
                  </div>
                  <div className="cf-text-small text-orange-700 cf-mb-3">
                    Remove todos os dados atuais mantendo apenas a estrutura do sistema.
                    Útil para começar com dados reais após os testes.
                  </div>
                </div>
              </div>
              
              {/* Simple confirmation dialog */}
              {showDemoConfirm ? (
                <div className="cf-border cf-border-orange-300 cf-bg-orange-100 rounded-lg cf-p-3 cf-mb-4">
                  <div className="cf-flex cf-items-center cf-gap-2 cf-mb-3">
                    <span className="text-lg">🗑️</span>
                    <div>
                      <div className="cf-text-small cf-bold text-orange-800">
                        Excluir dados de demonstração?
                      </div>
                      <div className="cf-text-small text-orange-600">
                        Esta ação não pode ser desfeita.
                      </div>
                    </div>
                  </div>
                  
                  <div className="cf-flex cf-gap-2">
                    <Button
                      onClick={confirmClearDemoData}
                      size="small"
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Sim, excluir
                    </Button>
                    <Button
                      onClick={cancelClearDemoData}
                      size="small"
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleClearDemoData}
                  variant="outline"
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  <Trash2 size={20} className="mr-2" />
                  Excluir Dados de Demonstração
                </Button>
              )}
              
              <div className="cf-text-small text-orange-600 cf-mt-3 text-center">
                ⚠️ Esta ação remove todos os dados mas preserva as safras
              </div>
            </div>
          )}

          {/* Empty State */}
          {!hasDemoData() && (
            <div className="text-center cf-py-8 cf-border-2 cf-border-dashed cf-border-gray-200 rounded-lg">
              <Database size={48} className="mx-auto text-gray-400 cf-mb-4" />
              <div className="cf-text-medium cf-bold text-gray-600 cf-mb-2">
                Sistema Vazio
              </div>
              <div className="cf-text-small text-gray-500">
                Popule com dados de demonstração ou importe um backup para começar
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Danger Zone */}
      <Card title="Zona de Perigo">
        <div className="space-y-4">
          <div>
            <div className="cf-text-small cf-bold cf-mb-2 text-red-600">
              Limpar Todos os Dados
            </div>
            <div className="cf-text-small text-gray-600 cf-mb-3">
              Remove permanentemente todos os dados da aplicação
            </div>
            
            {/* Interactive confirmation system */}
            {confirmationStep > 0 && (
              <div className="cf-mb-4 cf-p-4 border-2 border-red-200 rounded-lg bg-red-50">
                <div className="cf-flex cf-items-center cf-justify-between cf-mb-3">
                  <div className="cf-flex cf-items-center cf-gap-3">
                    <span className="text-2xl">{confirmationSteps[confirmationStep - 1].icon}</span>
                    <div>
                      <div className="cf-text-medium cf-bold text-red-800">
                        {confirmationSteps[confirmationStep - 1].title}
                      </div>
                      <div className="cf-text-small text-red-600">
                        {confirmationSteps[confirmationStep - 1].message}
                      </div>
                    </div>
                  </div>
                  
                  {/* Small cancel button in corner */}
                  <button
                    onClick={cancelConfirmation}
                    className="cf-flex cf-items-center cf-justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                    title="Cancelar (ufa!)"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="cf-flex cf-gap-2">
                  <Button
                    onClick={handleClearAllData}
                    className={`flex-1 text-white ${confirmationSteps[confirmationStep - 1].color}`}
                  >
                    {confirmationSteps[confirmationStep - 1].buttonText}
                  </Button>
                  
                  <Button
                    onClick={cancelConfirmation}
                    variant="outline"
                    className="cf-px-4 border-green-300 text-green-700 hover:bg-green-50"
                  >
                    😌 Melhor não
                  </Button>
                </div>
                
                {/* Progress indicator */}
                <div className="cf-flex cf-items-center cf-gap-2 cf-mt-3">
                  <span className="cf-text-small text-red-600">Etapa {confirmationStep} de {confirmationSteps.length}</span>
                  <div className="flex-1 cf-bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(confirmationStep / confirmationSteps.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="cf-text-small text-gray-500">10s auto-cancel</span>
                </div>
              </div>
            )}
            
            <Button
              onClick={handleClearAllData}
              variant="danger"
              className="w-full"
              disabled={getTotalDataCount() === 0 || confirmationStep > 0}
            >
              {confirmationStep > 0 ? (
                <>
                  {confirmationSteps[confirmationStep - 1].icon} {confirmationSteps[confirmationStep - 1].title}
                </>
              ) : (
                <>
                  <Trash2 size={20} className="mr-2" />
                  Limpar Todos os Dados
                </>
              )}
            </Button>
            
            {confirmationStep === 0 && (
              <div className="cf-text-small text-gray-500 cf-mt-2 text-center">
                🛡️ Sistema com proteção multi-etapa contra exclusão acidental
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {/* App Info */}
      <Card title="Informações do App">
        <div className="space-y-3">
          <div className="cf-flex cf-justify-between cf-items-center">
            <span className="cf-text-small">Versão</span>
            <span className="cf-text-small cf-bold">v1.0</span>
          </div>
          <div className="cf-flex cf-justify-between cf-items-center">
            <span className="cf-text-small">Última atualização</span>
            <span className="cf-text-small cf-bold">{formatDate(new Date().toISOString().split('T')[0])}</span>
          </div>
          <div className="cf-flex cf-justify-between cf-items-center">
            <span className="cf-text-small">Desenvolvido por</span>
            <span className="cf-text-small cf-bold">CloudFarm Team</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Settings;

