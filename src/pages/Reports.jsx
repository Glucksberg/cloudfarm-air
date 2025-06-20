import React, { useState } from 'react';
import { useServices, useClients, useEmployees, useAircrafts, useCultures } from '../hooks/useEntities';
import { useFormatters } from '../hooks/useUtils';
import { SERVICE_TYPES } from '../utils/constants';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { 
  RevenueTrendChart, 
  ServiceTypesChart, 
  MonthlyPerformanceChart, 
  ClientRevenueChart,
  AircraftUsageChart 
} from '../components/charts';
import { 
  Download, 
  FileText, 
  BarChart3, 
  Calendar,
  Filter,
  TrendingUp,
  Users,
  Plane
} from 'lucide-react';
import jsPDF from 'jspdf';

function Reports() {
  const { services } = useServices();
  const { clients, getClientById } = useClients();
  const { employees, getEmployeeById } = useEmployees();
  const { aircrafts, getAircraftById } = useAircrafts();
  const { cultures, getCultureById } = useCultures();
  const { formatCurrency, formatNumber, formatDate } = useFormatters();
  
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of year
    end: new Date().toISOString().split('T')[0] // Today
  });
  
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  
  // Função para converter data ISO para formato brasileiro
  const formatDateToBrazilian = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };
  
  // Função para converter data brasileira para ISO
  const formatDateToISO = (brazilianDate) => {
    if (!brazilianDate) return '';
    const [day, month, year] = brazilianDate.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };
  
  // Estados para exibição das datas em formato brasileiro
  const [displayDates, setDisplayDates] = useState({
    start: formatDateToBrazilian(dateRange.start),
    end: formatDateToBrazilian(dateRange.end)
  });
  
  // Função para lidar com mudança na data de início
  const handleStartDateChange = (value) => {
    setDateRange(prev => ({ ...prev, start: value }));
    setDisplayDates(prev => ({ ...prev, start: formatDateToBrazilian(value) }));
  };
  
  // Função para lidar com mudança na data de fim
  const handleEndDateChange = (value) => {
    setDateRange(prev => ({ ...prev, end: value }));
    setDisplayDates(prev => ({ ...prev, end: formatDateToBrazilian(value) }));
  };
  
  // Filter services based on date range and filters
  const filteredServices = services.filter(service => {
    const serviceDate = new Date(service.data);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    const inDateRange = serviceDate >= startDate && serviceDate <= endDate;
    const matchesClient = !selectedClient || service.clienteId === selectedClient;
    const matchesServiceType = !selectedServiceType || service.tipoServico === selectedServiceType;
    
    return inDateRange && matchesClient && matchesServiceType;
  });
  
  // Calculate summary metrics
  const summaryMetrics = filteredServices.reduce((acc, service) => {
    const horasVoo = service.horimetroFinal - service.horimetroInicio;
    const receita = horasVoo * service.precoHora;
    const comissao = receita * (service.comissao / 100);
    
    return {
      totalServices: acc.totalServices + 1,
      totalArea: acc.totalArea + service.area,
      totalHours: acc.totalHours + horasVoo,
      totalRevenue: acc.totalRevenue + receita,
      totalCommission: acc.totalCommission + comissao,
      totalTranslado: acc.totalTranslado + (service.translado || 0)
    };
  }, {
    totalServices: 0,
    totalArea: 0,
    totalHours: 0,
    totalRevenue: 0,
    totalCommission: 0,
    totalTranslado: 0
  });
  
  // Prepare chart data
  const prepareRevenueTrendData = () => {
    const monthlyData = {};
    
    filteredServices.forEach(service => {
      const date = new Date(service.data);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          label: monthLabel,
          revenue: 0
        };
      }
      
      const horasVoo = service.horimetroFinal - service.horimetroInicio;
      monthlyData[monthKey].revenue += horasVoo * service.precoHora;
    });
    
    return Object.values(monthlyData).sort((a, b) => a.label.localeCompare(b.label));
  };
  
  const prepareServiceTypesData = () => {
    const typeCounts = {};
    
    filteredServices.forEach(service => {
      typeCounts[service.tipoServico] = (typeCounts[service.tipoServico] || 0) + 1;
    });
    
    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count
    }));
  };
  
  const prepareMonthlyPerformanceData = () => {
    const monthlyData = {};
    
    filteredServices.forEach(service => {
      const date = new Date(service.data);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthLabel,
          area: 0,
          hours: 0
        };
      }
      
      const horasVoo = service.horimetroFinal - service.horimetroInicio;
      monthlyData[monthKey].area += service.area;
      monthlyData[monthKey].hours += horasVoo;
    });
    
    return Object.values(monthlyData);
  };
  
  const prepareClientRevenueData = () => {
    const clientRevenue = {};
    
    filteredServices.forEach(service => {
      const client = getClientById(service.clienteId);
      const clientName = client ? client.nome : 'Cliente não encontrado';
      
      if (!clientRevenue[clientName]) {
        clientRevenue[clientName] = 0;
      }
      
      const horasVoo = service.horimetroFinal - service.horimetroInicio;
      clientRevenue[clientName] += horasVoo * service.precoHora;
    });
    
    return Object.entries(clientRevenue)
      .map(([client, revenue]) => ({ client, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10); // Top 10 clients
  };
  
  const prepareAircraftUsageData = () => {
    const aircraftUsage = {};
    
    filteredServices.forEach(service => {
      const aircraft = getAircraftById(service.aeronaveId);
      const aircraftName = aircraft ? `${aircraft.prefixo} (${aircraft.modelo})` : 'Aeronave não encontrada';
      
      if (!aircraftUsage[aircraftName]) {
        aircraftUsage[aircraftName] = 0;
      }
      
      const horasVoo = service.horimetroFinal - service.horimetroInicio;
      aircraftUsage[aircraftName] += horasVoo;
    });
    
    return Object.entries(aircraftUsage)
      .map(([aircraft, hours]) => ({ aircraft, hours }))
      .sort((a, b) => b.hours - a.hours);
  };
  
  // Export functions
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('CloudFarm - Air', 20, 20);
    doc.setFontSize(16);
    doc.text('Relatório de Serviços', 20, 30);
    
    // Date range
    doc.setFontSize(12);
    doc.text(`Período: ${displayDates.start} a ${displayDates.end}`, 20, 45);
    
    // Summary metrics
    let yPos = 60;
    doc.setFontSize(14);
    doc.text('Resumo Geral', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.text(`Total de Serviços: ${summaryMetrics.totalServices}`, 20, yPos);
    yPos += 7;
    doc.text(`Área Total Aplicada: ${formatNumber(summaryMetrics.totalArea)} ha`, 20, yPos);
    yPos += 7;
    doc.text(`Horas Totais de Voo: ${formatNumber(summaryMetrics.totalHours)} h`, 20, yPos);
    yPos += 7;
    doc.text(`Receita Total: ${formatCurrency(summaryMetrics.totalRevenue)}`, 20, yPos);
    yPos += 7;
    doc.text(`Comissão Total: ${formatCurrency(summaryMetrics.totalCommission)}`, 20, yPos);
    yPos += 15;
    
    // Services list
    doc.setFontSize(14);
    doc.text('Detalhamento dos Serviços', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(9);
    filteredServices.forEach((service, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      const client = getClientById(service.clienteId);
      const aircraft = getAircraftById(service.aeronaveId);
      const horasVoo = service.horimetroFinal - service.horimetroInicio;
      const receita = horasVoo * service.precoHora;
      
      doc.text(`${index + 1}. ${formatDate(service.data)} - ${service.tipoServico}`, 20, yPos);
      yPos += 5;
      doc.text(`   Cliente: ${client?.nome || 'N/A'} | Aeronave: ${aircraft?.prefixo || 'N/A'}`, 20, yPos);
      yPos += 5;
      doc.text(`   Área: ${formatNumber(service.area)} ha | Horas: ${formatNumber(horasVoo)} h | Receita: ${formatCurrency(receita)}`, 20, yPos);
      yPos += 8;
    });
    
    // Save PDF
    doc.save(`relatorio-cloudfarm-${dateRange.start}-${dateRange.end}.pdf`);
  };
  
  const exportToCSV = () => {
    const headers = [
      'Data',
      'Tipo de Serviço',
      'Cliente',
      'Auxiliar',
      'Aeronave',
      'Cultura',
      'Área (ha)',
      'Vazão (L/ha)',
      'Horímetro Início',
      'Horímetro Final',
      'Horas Voo',
      'Translado (h)',
      'Preço Hora (R$)',
      'Receita (R$)',
      'Comissão (%)',
      'Valor Comissão (R$)',
      'Observações'
    ];
    
    const rows = filteredServices.map(service => {
      const client = getClientById(service.clienteId);
      const employee = getEmployeeById(service.funcionarioId);
      const aircraft = getAircraftById(service.aeronaveId);
      const culture = getCultureById(service.culturaId);
      const horasVoo = service.horimetroFinal - service.horimetroInicio;
      const receita = horasVoo * service.precoHora;
      const valorComissao = receita * (service.comissao / 100);
      
      return [
        formatDate(service.data),
        service.tipoServico,
        client?.nome || '',
        employee?.nomeCompleto || '',
        aircraft ? `${aircraft.prefixo} (${aircraft.modelo})` : '',
        culture?.nome || '',
        service.area,
        service.vazao,
        service.horimetroInicio,
        service.horimetroFinal,
        horasVoo.toFixed(2),
        service.translado || 0,
        service.precoHora,
        receita.toFixed(2),
        service.comissao || 0,
        valorComissao.toFixed(2),
        service.observacoes || ''
      ];
    });
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-cloudfarm-${dateRange.start}-${dateRange.end}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (services.length === 0) {
    return (
      <div className="cf-flex cf-flex-col cf-gap-4">
        <div>
          <h1 className="cf-text-xl cf-bold">Relatórios</h1>
          <p className="cf-text-small text-gray-600">Análises e estatísticas dos serviços</p>
        </div>
        
        <Card>
          <div className="text-center cf-py-12">
            <BarChart3 size={48} className="mx-auto text-gray-400 cf-mb-4" />
            <div className="cf-text-large cf-bold cf-mb-4">
              Nenhum dado para relatórios
            </div>
            <div className="cf-text-small text-gray-600">
              Registre alguns serviços para visualizar relatórios e estatísticas
            </div>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="cf-flex cf-flex-col cf-gap-4">
      {/* Header */}
      <div>
        <h1 className="cf-text-xl cf-bold">Relatórios</h1>
        <p className="cf-text-small text-gray-600">
          Análises e estatísticas dos serviços ({filteredServices.length} de {services.length} serviços)
        </p>
      </div>
      
      {/* Filters */}
      <Card title="Filtros">
        <div className="space-y-4">
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block cf-text-small cf-bold cf-mb-2">
                Data Início
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="cf-input"
                  lang="pt-BR"
                  data-date-format="dd/mm/yyyy"
                />
                {displayDates.start && (
                  <div className="cf-text-small text-gray-600 cf-flex cf-items-center cf-gap-2">
                    <Calendar size={16} />
                    <span>{displayDates.start}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block cf-text-small cf-bold cf-mb-2">
                Data Fim
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className="cf-input"
                  lang="pt-BR"
                  data-date-format="dd/mm/yyyy"
                />
                {displayDates.end && (
                  <div className="cf-text-small text-gray-600 cf-flex cf-items-center cf-gap-2">
                    <Calendar size={16} />
                    <span>{displayDates.end}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Additional Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block cf-text-small cf-bold cf-mb-2">
                Cliente
              </label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="cf-input"
              >
                <option value="">Todos os clientes</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nome}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block cf-text-small cf-bold cf-mb-2">
                Tipo de Serviço
              </label>
              <select
                value={selectedServiceType}
                onChange={(e) => setSelectedServiceType(e.target.value)}
                className="cf-input"
              >
                <option value="">Todos os tipos</option>
                {SERVICE_TYPES.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Export Actions */}
      <Card title="Exportar Relatórios">
        <div className="cf-flex cf-gap-4">
          <Button
            onClick={exportToPDF}
            className="flex-1"
            disabled={filteredServices.length === 0}
          >
            <FileText size={20} className="mr-2" />
            Exportar PDF
          </Button>
          
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="flex-1"
            disabled={filteredServices.length === 0}
          >
            <Download size={20} className="mr-2" />
            Exportar CSV
          </Button>
        </div>
        
        {filteredServices.length === 0 && (
          <div className="cf-text-small text-gray-500 cf-mt-2 text-center">
            Nenhum serviço encontrado no período selecionado
          </div>
        )}
      </Card>
      
      {/* Summary Metrics */}
      <Card title="Resumo do Período">
        <div className="grid grid-cols-2 gap-4">
          <div className="cf-bg-blue-50 cf-p-4 rounded-lg">
            <div className="cf-flex cf-items-center cf-gap-3">
              <BarChart3 size={24} className="text-blue-600" />
              <div>
                <div className="cf-text-small text-gray-600">Total de Serviços</div>
                <div className="cf-text-large cf-bold text-blue-600">
                  {summaryMetrics.totalServices}
                </div>
              </div>
            </div>
          </div>
          
          <div className="cf-bg-green-50 cf-p-4 rounded-lg">
            <div className="cf-flex cf-items-center cf-gap-3">
              <TrendingUp size={24} className="text-green-600" />
              <div>
                <div className="cf-text-small text-gray-600">Área Total</div>
                <div className="cf-text-large cf-bold text-green-600">
                  {formatNumber(summaryMetrics.totalArea)} ha
                </div>
              </div>
            </div>
          </div>
          
          <div className="cf-bg-purple-50 cf-p-4 rounded-lg">
            <div className="cf-flex cf-items-center cf-gap-3">
              <Plane size={24} className="text-purple-600" />
              <div>
                <div className="cf-text-small text-gray-600">Horas de Voo</div>
                <div className="cf-text-large cf-bold text-purple-600">
                  {formatNumber(summaryMetrics.totalHours)} h
                </div>
              </div>
            </div>
          </div>
          
          <div className="cf-bg-orange-50 cf-p-4 rounded-lg">
            <div className="cf-flex cf-items-center cf-gap-3">
              <div className="text-orange-600">💰</div>
              <div>
                <div className="cf-text-small text-gray-600">Receita Total</div>
                <div className="cf-text-large cf-bold text-orange-600">
                  {formatCurrency(summaryMetrics.totalRevenue)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Charts */}
      {filteredServices.length > 0 && (
        <>
          {/* Revenue Trend */}
          <Card title="Evolução da Receita">
            <RevenueTrendChart data={prepareRevenueTrendData()} />
          </Card>
          
          {/* Service Types Distribution */}
          <Card title="Distribuição por Tipo de Serviço">
            <ServiceTypesChart data={prepareServiceTypesData()} />
          </Card>
          
          {/* Monthly Performance */}
          <Card title="Performance Mensal">
            <MonthlyPerformanceChart data={prepareMonthlyPerformanceData()} />
          </Card>
          
          {/* Client Revenue */}
          {prepareClientRevenueData().length > 0 && (
            <Card title="Receita por Cliente (Top 10)">
              <ClientRevenueChart data={prepareClientRevenueData()} />
            </Card>
          )}
          
          {/* Aircraft Usage */}
          {prepareAircraftUsageData().length > 0 && (
            <Card title="Uso de Aeronaves">
              <AircraftUsageChart data={prepareAircraftUsageData()} />
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export default Reports;

