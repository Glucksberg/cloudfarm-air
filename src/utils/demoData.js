import { generateId } from './helpers';

// Listas de dados realistas para gerar variações
const nomes = [
  'João Silva', 'Maria Santos', 'Carlos Oliveira', 'Ana Costa', 'Pedro Almeida',
  'Lucia Ferreira', 'Roberto Lima', 'Fernanda Souza', 'Marcos Pereira', 'Juliana Rodrigues',
  'Antonio Barbosa', 'Cristina Martins', 'Rafael Gomes', 'Patricia Dias', 'Eduardo Ribeiro',
  'Mariana Carvalho', 'Felipe Nascimento', 'Camila Araújo', 'Gustavo Moreira', 'Isabela Campos',
  'Leonardo Teixeira', 'Gabriela Monteiro', 'Thiago Cardoso', 'Vanessa Castro', 'Bruno Correia'
];

const sobrenomes = [
  'Silva', 'Santos', 'Oliveira', 'Costa', 'Almeida', 'Ferreira', 'Lima', 'Souza',
  'Pereira', 'Rodrigues', 'Barbosa', 'Martins', 'Gomes', 'Dias', 'Ribeiro',
  'Carvalho', 'Nascimento', 'Araújo', 'Moreira', 'Campos', 'Teixeira', 'Monteiro',
  'Cardoso', 'Castro', 'Correia', 'Mendes', 'Rocha', 'Nunes', 'Freitas', 'Vieira'
];

const empresas = [
  'Fazenda', 'Agropecuária', 'Sítio', 'Estância', 'Granja', 'Hacienda', 'Propriedade',
  'Agro', 'Campo', 'Terra', 'Verde', 'Rural', 'Plantio', 'Cultivo'
];

const complementosEmpresa = [
  'São João', 'Santa Maria', 'Boa Vista', 'Esperança', 'Progresso', 'Vitória',
  'Paraíso', 'Horizonte', 'Alegria', 'Prosperidade', 'Abundância', 'Felicidade',
  'Sucesso', 'Fortuna', 'Riqueza', 'Colheita', 'Safra', 'Plantação', 'Cultivo',
  'Verde', 'Dourada', 'Rica', 'Fértil', 'Produtiva', 'Moderna', 'Sustentável'
];

const modelosAeronaves = [
  'Cessna 152', 'Cessna 172', 'Cessna 182', 'Piper Cherokee', 'Piper Warrior',
  'Beechcraft Bonanza', 'Mooney M20', 'Cirrus SR20', 'Cirrus SR22', 'Diamond DA40',
  'Tecnam P2008', 'Flight Design CTLS', 'Pipistrel Alpha', 'Ultralight Rans',
  'Zenith CH750', 'Van\'s RV-12', 'Jabiru J170', 'Aeronca Champion', 'Citabria',
  'Decathlon', 'Super Cub', 'Maule M-7', 'American Champion', 'Aviat Husky'
];

const culturas = [
  'Soja', 'Milho', 'Algodão', 'Feijão', 'Arroz', 'Trigo', 'Sorgo', 'Girassol',
  'Amendoim', 'Cana-de-açúcar', 'Café', 'Mandioca', 'Batata', 'Tomate',
  'Cebola', 'Alho', 'Cenoura', 'Beterraba', 'Abóbora', 'Melancia'
];

const tiposServico = [
  'fungicida', 'inseticida', 'fertilizante', 'adubacao', 'semeadura', 'dessecacao', 'fogo', 'outro'
];

// Função para gerar nome aleatório
const gerarNome = () => {
  const nome = nomes[Math.floor(Math.random() * nomes.length)];
  const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
  return `${nome} ${sobrenome}`;
};

// Função para gerar empresa aleatória
const gerarEmpresa = () => {
  const tipo = empresas[Math.floor(Math.random() * empresas.length)];
  const complemento = complementosEmpresa[Math.floor(Math.random() * complementosEmpresa.length)];
  return `${tipo} ${complemento}`;
};

// Função para gerar telefone aleatório
const gerarTelefone = () => {
  const ddd = Math.floor(Math.random() * 89) + 11; // DDDs de 11 a 99
  const numero = Math.floor(Math.random() * 900000000) + 100000000; // 9 dígitos
  return `(${ddd}) ${numero.toString().slice(0, 5)}-${numero.toString().slice(5)}`;
};

// Função para gerar email baseado no nome
const gerarEmail = (nome) => {
  const nomeFormatado = nome.toLowerCase()
    .replace(/\s+/g, '.')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const dominios = ['gmail.com', 'hotmail.com', 'yahoo.com.br', 'outlook.com', 'agro.com.br'];
  const dominio = dominios[Math.floor(Math.random() * dominios.length)];
  return `${nomeFormatado}@${dominio}`;
};

// Função para gerar prefixo de aeronave
const gerarPrefixo = () => {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let prefixo = 'PP-';
  for (let i = 0; i < 3; i++) {
    prefixo += letras[Math.floor(Math.random() * letras.length)];
  }
  return prefixo;
};

// Função para gerar data aleatória nos últimos 12 meses
const gerarDataRecente = () => {
  const agora = new Date();
  const umAnoAtras = new Date(agora.getFullYear() - 1, agora.getMonth(), agora.getDate());
  const timestamp = umAnoAtras.getTime() + Math.random() * (agora.getTime() - umAnoAtras.getTime());
  return new Date(timestamp);
};

// Gerar clientes de demonstração
export const gerarClientesDemo = (quantidade = 25) => {
  const clientes = [];
  
  for (let i = 0; i < quantidade; i++) {
    const nome = gerarNome();
    const cliente = {
      id: generateId(),
      nome,
      empresa: gerarEmpresa(),
      email: gerarEmail(nome),
      telefone: gerarTelefone(),
      createdAt: gerarDataRecente().toISOString()
    };
    clientes.push(cliente);
  }
  
  return clientes;
};

// Gerar funcionários de demonstração
export const gerarFuncionariosDemo = (quantidade = 5) => {
  const funcionarios = [];
  
  for (let i = 0; i < quantidade; i++) {
    const funcionario = {
      id: generateId(),
      nomeCompleto: gerarNome(),
      telefone: gerarTelefone(),
      createdAt: gerarDataRecente().toISOString()
    };
    funcionarios.push(funcionario);
  }
  
  return funcionarios;
};

// Gerar aeronaves de demonstração
export const gerarAeronavesDemo = (quantidade = 8) => {
  const aeronaves = [];
  
  for (let i = 0; i < quantidade; i++) {
    const aeronave = {
      id: generateId(),
      modelo: modelosAeronaves[Math.floor(Math.random() * modelosAeronaves.length)],
      prefixo: gerarPrefixo(),
      horimetroAtual: Math.floor(Math.random() * 2000) + 100, // Entre 100 e 2100 horas
      createdAt: gerarDataRecente().toISOString()
    };
    aeronaves.push(aeronave);
  }
  
  return aeronaves;
};

// Gerar culturas de demonstração
export const gerarCulturasDemo = (quantidade = 12) => {
  const culturasDemo = [];
  const culturasUsadas = new Set();
  
  for (let i = 0; i < quantidade && culturasUsadas.size < culturas.length; i++) {
    let cultura;
    do {
      cultura = culturas[Math.floor(Math.random() * culturas.length)];
    } while (culturasUsadas.has(cultura));
    
    culturasUsadas.add(cultura);
    
    const culturaObj = {
      id: generateId(),
      nome: cultura,
      createdAt: gerarDataRecente().toISOString()
    };
    culturasDemo.push(culturaObj);
  }
  
  return culturasDemo;
};

// Gerar serviços de demonstração
export const gerarServicosDemo = (quantidade = 120, clientes, funcionarios, aeronaves, culturas) => {
  if (!clientes.length || !funcionarios.length || !aeronaves.length || !culturas.length) {
    throw new Error('É necessário ter clientes, funcionários, aeronaves e culturas cadastrados');
  }
  
  const servicos = [];
  
  for (let i = 0; i < quantidade; i++) {
    const dataServico = gerarDataRecente();
    const horimetroInicio = Math.floor(Math.random() * 1000) + 100;
    const horasVoo = Math.random() * 5 + 0.5; // Entre 0.5 e 5.5 horas
    const horimetroFinal = horimetroInicio + horasVoo;
    
    const servico = {
      id: generateId(),
      tipoServico: tiposServico[Math.floor(Math.random() * tiposServico.length)],
      clienteId: clientes[Math.floor(Math.random() * clientes.length)].id,
      funcionarioId: funcionarios[Math.floor(Math.random() * funcionarios.length)].id,
      aeronaveId: aeronaves[Math.floor(Math.random() * aeronaves.length)].id,
      culturaId: culturas[Math.floor(Math.random() * culturas.length)].id,
      area: Math.floor(Math.random() * 500) + 10, // Entre 10 e 510 hectares
      vazao: Math.floor(Math.random() * 50) + 5, // Entre 5 e 55 L/ha
      data: dataServico.toISOString().split('T')[0],
      horimetroInicio: horimetroInicio.toFixed(1),
      horimetroFinal: horimetroFinal.toFixed(1),
      precoHora: Math.floor(Math.random() * 200) + 150, // Entre R$ 150 e R$ 350
      observacoes: Math.random() > 0.7 ? 'Serviço realizado conforme planejado' : '',
      safraId: '1', // Safra atual
      createdAt: dataServico.toISOString()
    };
    servicos.push(servico);
  }
  
  return servicos.sort((a, b) => new Date(b.data) - new Date(a.data)); // Ordenar por data decrescente
};

// Função principal para popular o sistema
export const gerarDadosCompletos = () => {
  console.log('🚀 Gerando dados de demonstração...');
  
  const clientes = gerarClientesDemo(25);
  const funcionarios = gerarFuncionariosDemo(5);
  const aeronaves = gerarAeronavesDemo(8);
  const culturas = gerarCulturasDemo(12);
  const servicos = gerarServicosDemo(120, clientes, funcionarios, aeronaves, culturas);
  
  console.log('✅ Dados gerados:', {
    clientes: clientes.length,
    funcionarios: funcionarios.length,
    aeronaves: aeronaves.length,
    culturas: culturas.length,
    servicos: servicos.length
  });
  
  return {
    clients: clientes,
    employees: funcionarios,
    aircrafts: aeronaves,
    cultures: culturas,
    services: servicos
  };
}; 