import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useServices, useClients, useEmployees, useAircrafts, useCultures } from '../hooks/useEntities';
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
  RotateCcw
} from 'lucide-react';

function Settings() {
  const { currentSafra, setCurrentSafra, clearAllData } = useApp();
  const { services, clearServices, importServices } = useServices();
  const { clients, clearClients, importClients } = useClients();
  const { employees, clearEmployees, importEmployees } = useEmployees();
  const { aircrafts, clearAircrafts, importAircrafts } = useAircrafts();
  const { cultures, clearCultures, importCultures } = useCultures();
  const { formatDate } = useFormatters();
  
  const [newSafra, setNewSafra] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  // Generate current safra if not set
  const getCurrentSafra = () => {
    if (currentSafra) return currentSafra;
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    return `${currentYear}/${String(nextYear).slice(-2)}`;
  };
  
  // Safra management
  const handleSafraChange = () => {
    if (!newSafra.trim()) return;
    
    if (window.confirm(`Tem certeza que deseja alterar a safra para "${newSafra}"? Isso criará uma nova safra e os dados atuais serão mantidos.`)) {
      setCurrentSafra(newSafra.trim());
      setNewSafra('');
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
• ${data.employees?.length || 0} funcionários
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
            setCurrentSafra(backupData.safra);
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
  
  // Clear all data
  const handleClearAllData = () => {
    if (showClearConfirm) {
      clearAllData();
      setShowClearConfirm(false);
      setImportStatus({
        type: 'success',
        message: 'Todos os dados foram removidos!'
      });
      setTimeout(() => setImportStatus(null), 3000);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 10000); // Auto-cancel after 10s
    }
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
      
      {/* Current Safra */}
      <Card title="Safra Atual">
        <div className="space-y-4">
          <div className="cf-flex cf-items-center cf-gap-3">
            <Calendar size={24} className="text-blue-600" />
            <div>
              <div className="cf-text-medium cf-bold">
                Safra {getCurrentSafra()}
              </div>
              <div className="cf-text-small text-gray-600">
                {getTotalDataCount()} registros no total
              </div>
            </div>
          </div>
          
          <div className="cf-border-t cf-pt-4">
            <div className="cf-text-small cf-bold cf-mb-2">
              Alterar Safra
            </div>
            <div className="cf-flex cf-gap-2">
              <input
                type="text"
                value={newSafra}
                onChange={(e) => setNewSafra(e.target.value)}
                placeholder="Ex: 2025/26"
                className="cf-input flex-1"
              />
              <Button
                onClick={handleSafraChange}
                disabled={!newSafra.trim()}
                variant="outline"
              >
                <Save size={16} className="mr-2" />
                Alterar
              </Button>
            </div>
            <div className="cf-text-small text-gray-500 cf-mt-2">
              Alterar a safra criará uma nova safra mantendo os dados atuais
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
            <span className="cf-text-small">Funcionários</span>
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
            <Button
              onClick={handleClearAllData}
              variant="danger"
              className="w-full"
              disabled={getTotalDataCount() === 0}
            >
              {showClearConfirm ? (
                <>
                  <AlertTriangle size={20} className="mr-2" />
                  Confirmar Exclusão
                </>
              ) : (
                <>
                  <Trash2 size={20} className="mr-2" />
                  Limpar Todos os Dados
                </>
              )}
            </Button>
            {showClearConfirm && (
              <div className="cf-text-small text-red-600 cf-mt-2 text-center">
                Clique novamente para confirmar a exclusão permanente
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

