# CloudFarm - Air - Manual do Usuário

## Guia Completo de Utilização

### Introdução

O CloudFarm - Air é um sistema completo para gestão de aplicações aéreas agrícolas. Este manual irá guiá-lo através de todas as funcionalidades do sistema, desde o primeiro acesso até a geração de relatórios avançados.

### Primeiro Acesso

Ao acessar o sistema pela primeira vez, você verá o Dashboard com uma mensagem de boas-vindas. O sistema está pronto para uso imediatamente, sem necessidade de configuração inicial.

#### Navegação Principal

O sistema utiliza um menu lateral que pode ser acessado através do ícone de menu (☰) no canto superior esquerdo. O menu está organizado em seções:

**Configurações**
- Safras & Backup

**Operações**
- Lista de Serviços

**Cadastros**
- Clientes
- Funcionários
- Aeronaves
- Culturas

**Relatórios**
- Relatórios

### Configuração Inicial

#### Gerenciamento de Safras

1. Acesse **Configurações > Safras & Backup**
2. A safra atual é gerada automaticamente (ex: 2025/26)
3. Para alterar a safra:
   - Digite a nova safra no campo "Alterar Safra"
   - Clique em "Alterar"
   - Confirme a alteração

#### Cadastros Básicos

Antes de registrar serviços, é recomendado cadastrar:

**1. Clientes**
- Acesse **Cadastros > Clientes**
- Clique no botão "+" ou "Novo"
- Preencha os campos obrigatórios:
  - Nome (obrigatório)
  - Empresa (opcional)
  - Email (obrigatório, com validação)
  - Telefone (opcional, formatação automática)
- Clique em "Salvar"

**2. Funcionários**
- Acesse **Cadastros > Funcionários**
- Clique em "Novo"
- Preencha:
  - Nome Completo (obrigatório)
  - Telefone (opcional)
- Clique em "Salvar"

**3. Aeronaves**
- Acesse **Cadastros > Aeronaves**
- Clique em "Novo"
- Preencha:
  - Modelo (obrigatório)
  - Prefixo (obrigatório, convertido automaticamente para maiúscula)
  - Horímetro Atual (obrigatório)
- Clique em "Salvar"

**4. Culturas**
- Acesse **Cadastros > Culturas**
- Clique em "Novo"
- Opções:
  - Selecione uma cultura comum (Soja, Milho, Algodão, etc.)
  - Ou digite uma cultura personalizada
- Clique em "Salvar"

### Registro de Serviços

#### Formulário de Serviços

1. Acesse **Operações > Lista de Serviços**
2. Clique em "Registrar Primeiro Serviço" ou "Novo"
3. Preencha as seções:

**Informações Básicas**
- Tipo de Serviço (obrigatório): Fungicida, Inseticida, Fertilizante, etc.
- Data (obrigatório): Data da aplicação

**Responsáveis**
- Cliente (obrigatório): Selecione da lista cadastrada
- Funcionário (obrigatório): Piloto responsável
- Aeronave (obrigatório): Aeronave utilizada
- Cultura (obrigatório): Cultura aplicada

**Dados Técnicos**
- Área (ha) (obrigatório): Área aplicada em hectares
- Vazão (L/ha) (obrigatório): Vazão utilizada
- Horímetro Início (obrigatório): Leitura inicial
- Horímetro Final (obrigatório): Leitura final
- Translado (h) (opcional): Horas de translado

**Dados Financeiros**
- Preço por Hora (obrigatório): Valor cobrado por hora
- Comissão (%) (opcional): Percentual de comissão

**Informações Adicionais**
- Observações (opcional): Detalhes do serviço
- Fotos (opcional): Upload de imagens

4. Clique em "Salvar Serviço"

#### Validações Automáticas

O sistema realiza validações em tempo real:
- Horímetro final deve ser maior que inicial
- Campos obrigatórios são destacados
- Cálculos automáticos de horas voadas e receita
- Formatação automática de valores

### Dashboard e Métricas

#### Visualização de Dados

O Dashboard apresenta:

**Métricas Principais**
- Área Total Aplicada (hectares)
- Horas Totais de Voo
- Horas de Translado
- Receita Total
- Comissão Total

**Gráficos Interativos**
- Evolução da receita ao longo do tempo
- Distribuição por tipo de serviço
- Performance mensal

#### Estados do Dashboard

**Estado Vazio**: Quando não há serviços cadastrados, o dashboard exibe uma mensagem de boas-vindas com orientações.

**Estado Populado**: Com dados cadastrados, o dashboard mostra métricas reais e gráficos interativos.

### Relatórios e Análises

#### Acesso aos Relatórios

1. Acesse **Relatórios > Relatórios**
2. Configure os filtros desejados:
   - Período (data início/fim)
   - Cliente específico
   - Tipo de serviço
3. Visualize os dados e gráficos

#### Tipos de Relatórios

**Resumo do Período**
- Total de serviços
- Área total aplicada
- Horas totais de voo
- Receita total

**Gráficos Disponíveis**
- Evolução da Receita: Tendência temporal
- Distribuição por Tipo: Gráfico de pizza
- Performance Mensal: Área vs Horas
- Receita por Cliente: Top 10 clientes
- Uso de Aeronaves: Horas por aeronave

#### Exportação de Dados

**Exportar PDF**
1. Configure os filtros desejados
2. Clique em "Exportar PDF"
3. O arquivo será baixado automaticamente

**Exportar CSV**
1. Configure os filtros desejados
2. Clique em "Exportar CSV"
3. Abra o arquivo em Excel ou similar

### Backup e Restore

#### Criando Backup

1. Acesse **Configurações > Safras & Backup**
2. Na seção "Backup & Restore"
3. Clique em "Exportar Backup"
4. O arquivo JSON será baixado

#### Restaurando Backup

1. Acesse **Configurações > Safras & Backup**
2. Clique em "Selecionar Arquivo"
3. Escolha o arquivo de backup (.json)
4. Confirme a importação
5. **ATENÇÃO**: Isso substituirá todos os dados atuais

#### Limpeza de Dados

Para remover todos os dados:
1. Acesse **Configurações > Safras & Backup**
2. Na seção "Zona de Perigo"
3. Clique em "Limpar Todos os Dados"
4. Clique novamente para confirmar

### Gerenciamento de Listas

#### Busca e Filtros

Todas as listas possuem:
- Campo de busca em tempo real
- Filtros específicos por categoria
- Ordenação customizada
- Contadores de registros

#### Ações Disponíveis

**Editar**: Clique no ícone de lápis para editar um registro
**Excluir**: Clique no ícone de lixeira para remover (com confirmação)
**Visualizar**: Clique no registro para ver detalhes

### Dicas de Uso

#### Produtividade

1. **Use os botões flutuantes**: Acesso rápido para adicionar novos registros
2. **Aproveite a busca**: Encontre registros rapidamente digitando qualquer informação
3. **Configure filtros**: Use filtros para análises específicas
4. **Faça backups regulares**: Proteja seus dados exportando backups periodicamente

#### Boas Práticas

1. **Cadastre dados básicos primeiro**: Clientes, funcionários, aeronaves e culturas antes dos serviços
2. **Mantenha dados atualizados**: Revise e atualize informações regularmente
3. **Use observações**: Adicione detalhes importantes nos serviços
4. **Monitore métricas**: Acompanhe performance através do dashboard
5. **Exporte relatórios**: Gere relatórios para análises externas

### Solução de Problemas

#### Problemas Comuns

**Não consigo salvar um serviço**
- Verifique se todos os campos obrigatórios estão preenchidos
- Certifique-se de que há clientes, funcionários, aeronaves e culturas cadastrados
- Verifique se o horímetro final é maior que o inicial

**Dados não aparecem no dashboard**
- Confirme que há serviços cadastrados
- Verifique se a data dos serviços está no período atual
- Recarregue a página se necessário

**Backup não funciona**
- Verifique se há dados para exportar
- Certifique-se de que o navegador permite downloads
- Tente usar um navegador diferente

**Importação falha**
- Verifique se o arquivo é um backup válido do CloudFarm
- Certifique-se de que o arquivo não está corrompido
- Tente fazer um novo backup e importar

#### Suporte Técnico

Para problemas não resolvidos:
1. Anote a mensagem de erro exata
2. Descreva os passos que levaram ao problema
3. Entre em contato com o suporte CloudFarm

### Atualizações do Sistema

O sistema é atualizado regularmente com:
- Novas funcionalidades
- Correções de bugs
- Melhorias de performance
- Aprimoramentos de interface

As atualizações são aplicadas automaticamente e não afetam os dados existentes.

---

**CloudFarm - Air** - Sua solução completa para gestão de aplicações aéreas agrícolas.

