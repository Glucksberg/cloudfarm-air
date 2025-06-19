# CloudFarm - Air

## Aplicativo Mobile para Gestão de Aplicações Aéreas Agrícolas

CloudFarm - Air é um aplicativo web mobile-first desenvolvido para gestão completa de serviços de aplicação aérea agrícola. O sistema oferece controle total sobre operações, desde o cadastro de clientes até relatórios detalhados de performance.

## 🎯 Características Principais

### Interface Mobile-First
- Design otimizado para dispositivos móveis
- Interface responsiva e intuitiva
- Navegação por menu lateral deslizante
- Botões flutuantes para ações rápidas

### Paleta de Cores
- **Primária**: #006494 (Sapphire Blue)
- **Secundária**: Cinza neutro (#F5F5F5), Branco (#FFFFFF), Preto (#000000)
- **Fonte**: Roboto Bold e Roboto Regular

### Funcionalidades Completas
- Dashboard com métricas em tempo real
- Sistema completo de CRUD para todas as entidades
- Relatórios avançados com gráficos interativos
- Sistema de backup e restore
- Gerenciamento de safras
- Exportação de dados (PDF/CSV)

## 🚀 Tecnologias Utilizadas

- **React 18** - Framework principal
- **React Router DOM** - Navegação entre páginas
- **Chart.js + React-ChartJS-2** - Gráficos e visualizações
- **jsPDF** - Geração de relatórios PDF
- **html2canvas** - Captura de telas
- **date-fns** - Manipulação de datas
- **Lucide React** - Ícones modernos
- **CSS3** - Estilização customizada

## 📱 Módulos do Sistema

### 1. Dashboard
- Métricas principais (área aplicada, horas voadas, receita, comissão)
- Gráficos de performance
- Estado vazio inteligente
- Navegação rápida para cadastros

### 2. Gestão de Clientes
- Cadastro completo (nome, empresa, email, telefone)
- Lista com busca e filtros
- Validações automáticas
- Edição e exclusão

### 3. Gestão de Funcionários
- Cadastro de pilotos e operadores
- Informações de contato
- Controle de equipe

### 4. Gestão de Aeronaves
- Cadastro de modelo e prefixo
- Controle de horímetro
- Histórico de uso

### 5. Gestão de Culturas
- Cadastro de culturas
- Seleção rápida de culturas comuns
- Personalização de culturas

### 6. Gestão de Serviços
- Formulário completo de serviços
- Tipos de aplicação (fungicida, inseticida, fertilizante, etc.)
- Dados técnicos (área, vazão, horímetros)
- Dados financeiros (preço/hora, comissão)
- Upload de fotos
- Observações detalhadas

### 7. Relatórios e Análises
- Gráficos interativos de performance
- Filtros por período, cliente e tipo
- Métricas consolidadas
- Exportação em PDF e CSV
- Análises de receita por cliente
- Uso de aeronaves

### 8. Configurações e Backup
- Gerenciamento de safras
- Backup completo dos dados
- Importação de dados
- Limpeza segura do sistema

## 🛠 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou pnpm

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre no diretório
cd cloudfarm-air

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm run dev
```

### Dependências Principais
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "chart.js": "^4.2.1",
  "react-chartjs-2": "^5.2.0",
  "jspdf": "^2.5.1",
  "html2canvas": "^1.4.1",
  "date-fns": "^2.29.3",
  "lucide-react": "^0.263.1"
}
```

## 📊 Estrutura do Projeto

```
cloudfarm-air/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/          # Componentes reutilizáveis
│   │   ├── charts/          # Componentes de gráficos
│   │   ├── dashboard/       # Componentes do dashboard
│   │   ├── forms/           # Componentes de formulários
│   │   └── lists/           # Componentes de listas
│   ├── contexts/            # Context API
│   ├── hooks/               # Hooks customizados
│   ├── pages/               # Páginas da aplicação
│   ├── services/            # Serviços e APIs
│   ├── utils/               # Utilitários e helpers
│   ├── App.jsx              # Componente principal
│   ├── App.css              # Estilos globais
│   └── main.jsx             # Ponto de entrada
├── package.json
└── README.md
```

## 🎨 Design System

### Componentes Base
- **Button**: Botão reutilizável com variantes
- **Card**: Container para conteúdo
- **LoadingSpinner**: Indicador de carregamento
- **FloatingActionButton**: Botão flutuante para ações principais

### Layout
- **Header**: Cabeçalho com menu e informações da safra
- **SideMenu**: Menu lateral com navegação
- **Layout**: Container principal da aplicação

### Formulários
- Validação em tempo real
- Formatação automática (telefone, valores)
- Estados de erro e sucesso
- Campos obrigatórios destacados

## 💾 Persistência de Dados

### LocalStorage
- Todos os dados são salvos automaticamente no localStorage
- Sincronização em tempo real
- Backup automático a cada alteração

### Estrutura de Dados
```javascript
{
  currentSafra: "2025/26",
  services: [...],
  clients: [...],
  employees: [...],
  aircrafts: [...],
  cultures: [...]
}
```

## 📈 Funcionalidades de Relatórios

### Gráficos Disponíveis
1. **Evolução da Receita** - Linha temporal
2. **Distribuição por Tipo de Serviço** - Gráfico de pizza
3. **Performance Mensal** - Barras duplas (área vs horas)
4. **Receita por Cliente** - Barras horizontais
5. **Uso de Aeronaves** - Barras verticais

### Filtros
- Período (data início/fim)
- Cliente específico
- Tipo de serviço
- Ordenação customizada

### Exportação
- **PDF**: Relatório completo com resumo e detalhamento
- **CSV**: Dados estruturados para análise externa

## 🔒 Backup e Restore

### Exportação
- Backup completo em formato JSON
- Inclui metadados e informações da safra
- Nome do arquivo com data e safra

### Importação
- Validação de estrutura do arquivo
- Confirmação antes da importação
- Substituição completa dos dados

### Formato do Backup
```json
{
  "version": "1.0",
  "exportDate": "2025-06-19T03:00:00.000Z",
  "safra": "2025/26",
  "data": {
    "services": [...],
    "clients": [...],
    "employees": [...],
    "aircrafts": [...],
    "cultures": [...]
  },
  "metadata": {
    "totalServices": 0,
    "totalClients": 1,
    "totalEmployees": 1,
    "totalAircrafts": 1,
    "totalCultures": 1
  }
}
```

## 🧪 Testes e Validação

### Testes Realizados
- ✅ Navegação entre todas as páginas
- ✅ CRUD completo para todas as entidades
- ✅ Validações de formulários
- ✅ Persistência de dados
- ✅ Responsividade mobile
- ✅ Estados vazios
- ✅ Exportação de relatórios
- ✅ Backup e restore

### Validações Implementadas
- Campos obrigatórios
- Formato de email
- Formatação de telefone
- Valores numéricos
- Datas válidas
- Horímetros sequenciais

## 🚀 Deploy e Produção

### Build de Produção
```bash
pnpm run build
```

### Otimizações
- Componentes otimizados para performance
- Lazy loading quando necessário
- Minimização de re-renders
- Gestão eficiente de estado

## 📱 Compatibilidade

### Dispositivos Suportados
- Smartphones (iOS/Android)
- Tablets
- Desktops (responsivo)

### Navegadores
- Chrome/Chromium
- Safari
- Firefox
- Edge

## 🔧 Manutenção

### Atualizações
- Versionamento semântico
- Changelog detalhado
- Migração de dados quando necessário

### Monitoramento
- Logs de erro no console
- Validação de dados
- Feedback visual para usuário

## 👥 Equipe de Desenvolvimento

**Desenvolvido por**: CloudFarm Team  
**Versão**: v1.0  
**Data**: 19/06/2025

## 📄 Licença

Este projeto é propriedade da CloudFarm e está protegido por direitos autorais.

## 🆘 Suporte

Para suporte técnico ou dúvidas sobre o sistema, entre em contato com a equipe CloudFarm.

---

**CloudFarm - Air v1.0** - Gestão Profissional de Aplicações Aéreas Agrícolas

