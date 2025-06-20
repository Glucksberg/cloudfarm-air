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

// Gerar fotos de demonstração com melhor qualidade
const generateDemoPhotos = () => {
  // Usar imagens placeholder de alta qualidade
  const demoPhotos = [
    {
      id: 'demo-photo-1',
      name: 'campo-aplicacao-1.jpg',
      dataUrl: 'data:image/svg+xml,%3Csvg width="1200" height="800" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%234CAF50;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23388E3C;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23grad1)"/%3E%3Ccircle cx="200" cy="150" r="50" fill="%23FFF" opacity="0.3"/%3E%3Ccircle cx="1000" cy="200" r="80" fill="%23FFF" opacity="0.2"/%3E%3Crect x="100" y="600" width="1000" height="100" fill="%232E7D32" opacity="0.8"/%3E%3Ctext x="50%25" y="45%25" font-family="Arial,sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle" dy=".3em"%3ECampo de Aplicação%3C/text%3E%3Ctext x="50%25" y="55%25" font-family="Arial,sans-serif" font-size="24" fill="white" text-anchor="middle" dy=".3em" opacity="0.9"%3ESoja - 150 hectares%3C/text%3E%3C/svg%3E',
      originalSize: 2048000,
      compressedSize: 1024000
    },
    {
      id: 'demo-photo-2', 
      name: 'aeronave-preparacao.jpg',
      dataUrl: 'data:image/svg+xml,%3Csvg width="1200" height="800" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%232196F3;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%231976D2;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23grad2)"/%3E%3Cellipse cx="600" cy="400" rx="300" ry="100" fill="%23FFF" opacity="0.9"/%3E%3Crect x="450" y="350" width="300" height="100" fill="%231565C0" opacity="0.8"/%3E%3Ccircle cx="500" cy="380" r="15" fill="%23FFF"/%3E%3Ccircle cx="700" cy="380" r="15" fill="%23FFF"/%3E%3Ctext x="50%25" y="25%25" font-family="Arial,sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle" dy=".3em"%3EAeronave Preparada%3C/text%3E%3Ctext x="50%25" y="75%25" font-family="Arial,sans-serif" font-size="24" fill="white" text-anchor="middle" dy=".3em" opacity="0.9"%3ECessna 172 - PP-ABC%3C/text%3E%3C/svg%3E',
      originalSize: 1536000,
      compressedSize: 768000
    },
    {
      id: 'demo-photo-3',
      name: 'resultado-aplicacao.jpg', 
      dataUrl: 'data:image/svg+xml,%3Csvg width="1200" height="800" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF9800;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F57C00;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23grad3)"/%3E%3Cpath d="M0,500 Q300,400 600,500 T1200,500 L1200,800 L0,800 Z" fill="%23FF8F00" opacity="0.7"/%3E%3Cpath d="M0,600 Q400,550 800,600 T1200,600 L1200,800 L0,800 Z" fill="%23FF6F00" opacity="0.5"/%3E%3Ccircle cx="300" cy="200" r="30" fill="%23FFF" opacity="0.4"/%3E%3Ccircle cx="900" cy="150" r="40" fill="%23FFF" opacity="0.3"/%3E%3Ctext x="50%25" y="35%25" font-family="Arial,sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle" dy=".3em"%3EResultado da Aplicação%3C/text%3E%3Ctext x="50%25" y="85%25" font-family="Arial,sans-serif" font-size="24" fill="white" text-anchor="middle" dy=".3em" opacity="0.9"%3ECobertura uniforme - 100%25%3C/text%3E%3C/svg%3E',
      originalSize: 2048000,
      compressedSize: 1024000
    }
  ];

  return demoPhotos;
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

// Gerar auxiliares de demonstração
export const gerarAuxiliaresDemo = (quantidade = 5) => {
  const auxiliares = [];
  
  for (let i = 0; i < quantidade; i++) {
    const auxiliar = {
      id: generateId(),
      nomeCompleto: gerarNome(),
      telefone: gerarTelefone(),
      createdAt: gerarDataRecente().toISOString()
    };
    auxiliares.push(auxiliar);
  }
  
  return auxiliares;
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

// Função para gerar localização aleatória (região do Brasil Central)
const gerarLocalizacaoAleatoria = () => {
  // Coordenadas aproximadas do Centro-Oeste brasileiro (região agrícola)
  const latitudeBase = -15.5; // Brasília como referência
  const longitudeBase = -47.8;
  
  // Variação de aproximadamente 5 graus para simular fazendas na região
  const latitude = latitudeBase + (Math.random() - 0.5) * 10;
  const longitude = longitudeBase + (Math.random() - 0.5) * 10;
  
  return {
    latitude: parseFloat(latitude.toFixed(6)),
    longitude: parseFloat(longitude.toFixed(6))
  };
};

// Gerar serviços de demonstração
export const gerarServicosDemo = (quantidade = 120, clientes, auxiliares, aeronaves, culturas) => {
  if (!clientes.length || !auxiliares.length || !aeronaves.length || !culturas.length) {
    throw new Error('É necessário ter clientes, auxiliares, aeronaves e culturas cadastrados');
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
      funcionarioId: auxiliares[Math.floor(Math.random() * auxiliares.length)].id,
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
      createdAt: dataServico.toISOString(),
      
      // Adicionar fotos de demonstração em alguns serviços (30% dos serviços)
      fotos: Math.random() < 0.3 ? generateDemoPhotos().slice(0, Math.floor(Math.random() * 3) + 1) : [],
      
      // Adicionar localização aleatória a alguns serviços (30% dos serviços)
      location: Math.random() < 0.3 ? gerarLocalizacaoAleatoria() : null
    };
    servicos.push(servico);
  }
  
  return servicos.sort((a, b) => new Date(b.data) - new Date(a.data)); // Ordenar por data decrescente
};

// Função principal para popular o sistema
export const gerarDadosCompletos = () => {
  console.log('🚀 Gerando dados de demonstração...');
  
  const clientes = gerarClientesDemo(25);
  const auxiliares = gerarAuxiliaresDemo(5);
  const aeronaves = gerarAeronavesDemo(8);
  const culturas = gerarCulturasDemo(12);
  const servicos = gerarServicosDemo(120, clientes, auxiliares, aeronaves, culturas);
  
  console.log('✅ Dados gerados:', {
    clientes: clientes.length,
    auxiliares: auxiliares.length,
    aeronaves: aeronaves.length,
    culturas: culturas.length,
    servicos: servicos.length
  });
  
  return {
    clients: clientes,
    employees: auxiliares,
    aircrafts: aeronaves,
    cultures: culturas,
    services: servicos
  };
}; 