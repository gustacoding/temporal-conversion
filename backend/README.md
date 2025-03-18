# API de Análise de Conversão Temporal

API para análise de taxas de conversão e distribuição de status por diferentes períodos temporais.

## Arquitetura e Design

### Visão Geral da Arquitetura

O projeto segue uma arquitetura em camadas com separação clara de responsabilidades:

- **Camada de API**: Implementada com Express.js para gerenciar endpoints RESTful
- **Camada de Controladores**: Encapsula a lógica de negócio e processamento dos dados
- **Camada de Acesso a Dados**: Gerencia consultas ao banco PostgreSQL
- **Camada de Utilitários**: Funcionalidades transversais como cache e tratamento de erros

### Escolhas Técnicas

#### Node.js e Express

Optei por Node.js com Express pelos seguintes motivos:
- **Desempenho não-bloqueante**: Ideal para operações I/O intensivas como consultas ao banco
- **Ecossistema rico**: Grande disponibilidade de bibliotecas para todas as necessidades
- **Escalabilidade horizontal**: Facilidade para escalar horizontalmente em ambientes de produção

#### PostgreSQL

Escolhemos PostgreSQL como SGBD devido a:
- **Robustez para consultas analíticas**: Suporte excelente para agregações complexas
- **Confiabilidade**: Sistema maduro com garantias ACID
- **Funções temporais avançadas**: Funções como `DATE_TRUNC` essenciais para agrupamentos temporais

#### Sistema de Cache

Implementamos cache com `node-cache` para reduzir carga no banco:
- O TTL do cache é dinâmico baseado no intervalo de datas da consulta
- Consultas para períodos históricos maiores são cacheadas por mais tempo
- Redução significativa no tempo de resposta para consultas repetidas

## Otimização de Performance

### Estratégias de Otimização de Consultas

- **Indexação**: Presume-se índices em `data_envio` e `origin` na tabela de dados
- **Limitação de resultados**: Consultas limitadas a 1000 registros para evitar excesso de memória
- **Monitoramento de consultas lentas**: Logging automático para consultas que excedem 500ms
- **Timeout de consultas**: Implementação de timeout para evitar consultas infinitas (15s)

### Cache Inteligente

O sistema utiliza TTL (Time-To-Live) variável baseado no intervalo da consulta:
- Dados históricos antigos (>60 dias): Cache de 1 hora
- Dados de médio prazo (30-60 dias): Cache de 30 minutos
- Dados recentes (14-30 dias): Cache de 15 minutos
- Dados muito recentes (<14 dias): Cache de 5 minutos

## Configuração

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```
3. Configure o arquivo `.env` com suas credenciais de banco de dados
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=data
DB_PASSWORD=sua_senha
DB_PORT=5432
PORT=4000
NODE_ENV=development
```
4. Inicie o servidor:
```bash
npm run dev  # Para desenvolvimento com hot-reload
npm start    # Para produção
```

## Usando Docker

1. Clone o repositório
2. Configure o arquivo `.env` com suas credenciais de banco de dados
3. Construa os contêineres:
```bash
docker-compose build
```
4. Inicie os contêineres em segundo plano:
```bash
docker-compose up -d
```
5. Acesse a aplicação em `http://localhost:4000`

## Executando Testes com Docker

Para executar testes utilizando Docker, você tem as seguintes opções:

1. Executar os testes uma vez:
```bash
docker-compose run --rm test
```

2. Executar os testes com cobertura:
```bash
docker-compose run --rm test npm run test:coverage
```

3. Executar os testes em modo de observação (útil durante desenvolvimento):
```bash
docker-compose run --rm test npm run test:watch
```

4. Executar testes para um arquivo específico:
```bash
docker-compose run --rm test npm test -- path/to/test/file.test.js
```

Os resultados dos testes serão exibidos no console e, se você executar com cobertura, 
um relatório de cobertura será gerado na pasta `/app/coverage` dentro do contêiner, 
que está mapeada para a pasta `./coverage` no seu sistema de arquivos local.

## Endpoints da API

### Taxa de Conversão

```
GET /api/taxa-conversao
```

Parâmetros:
- `periodo` (opcional): Agrupamento temporal (dia, semana, mes). Default: dia
- `canal` (opcional): Filtrar por canal específico
- `startDate` (opcional): Data inicial (formato YYYY-MM-DD)
- `endDate` (opcional): Data final (formato YYYY-MM-DD)

Resposta:
```json
[
  {
    "canal": "email",
    "periodo": "2023-01-01T00:00:00.000Z",
    "total_envios": 150,
    "conversoes": 45,
    "taxa_conversao": 30.00
  }
]
```

### Distribuição de Status

```
GET /api/status-distribuicao
```

Parâmetros:
- `canal` (opcional): Filtrar por canal específico
- `startDate` (opcional): Data inicial (formato YYYY-MM-DD)
- `endDate` (opcional): Data final (formato YYYY-MM-DD)

Resposta:
```json
[
  {
    "canal": "email",
    "valido": 50,
    "invalido": 10,
    "incompleto": 20,
    "pendente": 25,
    "aberto": 30,
    "visualizou": 15
  }
]
```

### Verificação de Saúde

```
GET /api/health
```

Resposta:
```json
{
  "status": "UP",
  "timestamp": "2025-03-18T12:34:56.789Z"
}
```

## Segurança e Boas Práticas

- **Helmet**: Proteção contra vulnerabilidades comuns de segurança web
- **Cors**: Configuração adequada de Cross-Origin Resource Sharing
- **Rate Limiting**: Configurado implicitamente através do pool de conexões
- **Variáveis de ambiente**: Informações sensíveis armazenadas em variáveis de ambiente
- **Sanitização de entrada**: Parâmetros validados antes de uso em consultas SQL

## Monitoramento e Logging

- Logs detalhados de consultas lentas
- Monitoramento de erros com stack traces em ambiente de desenvolvimento
- Análise de performance para otimização contínua

## Trade-offs e Decisões de Design

1. **Simplicidade vs. Complexidade**:
   - Escolhemos uma arquitetura mais simples para facilitar manutenção e compreensão do código
   - Evitamos ORM em favor de consultas SQL diretas para maior controle sobre a performance

2. **Abordagem de Cache**:
   - Optei por cache em memória por simplicidade vs. soluções distribuídas como Redis
   - Trade-off: Perda de dados no cache durante reinicializações do serviço

3. **Agrupamento por Período**:
   - Implementamos agrupamento por dia, semana e mês usando funções nativas do PostgreSQL
   - Trade-off: Maior carga no banco de dados vs. processamento na aplicação
