# Projeto de Conversão Temporal

Este repositório contém o código frontend e backend do projeto de Conversão Temporal.

## Visão Geral do Projeto

O Projeto de Conversão Temporal é uma aplicação full-stack projetada para visualizar e analisar dados de conversão em múltiplos canais de comunicação ao longo do tempo. Ele fornece gráficos interativos mostrando taxas de conversão e distribuição de status para diferentes canais.

## Estrutura

- `/frontend` - Contém todo o código frontend (painel de visualização baseado em React)
- `/backend` - Contém todo o código backend (API Node.js/Express)

## Stack de Tecnologia

### Frontend
- **React 19.0.0** com hooks para gerenciamento de estado
- **Chart.js 4.4.8 & react-chartjs-2 5.3.0** para visualização de dados
- **Axios 1.8.3** para comunicação com API
- **Vitest** para testes
- **Docker & Nginx** para implantação

### Backend
- **Node.js & Express** para endpoints de API
- **PostgreSQL** para armazenamento de dados e consultas analíticas
- **node-cache** para sistema inteligente de cache
- **Docker** para containerização

## Principais Funcionalidades

- **Análise de Dados Temporais**: Visualize taxas de conversão em diferentes períodos de tempo
- **Comparação Multi-Canal**: Compare performance entre e-mail, celular e WhatsApp
- **Distribuição de Status**: Veja o detalhamento dos status das mensagens
- **Design Responsivo**: Otimizado para experiências em dispositivos móveis e desktop
- **Tema Claro/Escuro**: Temas baseados na preferência do usuário
- **Cache Inteligente de API**: TTL dinâmico baseado em parâmetros de consulta
- **Consultas de Banco Otimizadas**: Para lidar eficientemente com grandes conjuntos de dados

## Começando

1. Clone este repositório
2. Configure o backend:
   ```
   cd backend
   npm install
   npm start
   ```
3. Configure o frontend:
   ```
   cd frontend
   npm install
   npm start
   ```

## Usando Docker

### Para a aplicação completa:
```bash
# Construa as imagens Docker
docker-compose build

# Inicie os contêineres em modo desanexado
docker-compose up -d
```

### Para testes do backend:
```bash
docker-compose run --rm test
```

### Para testes do frontend:
```bash
docker-compose run test npm test
```

## Endpoints da API

### Taxa de Conversão
```
GET /api/taxa-conversao
```
Parâmetros:
- `periodo` (opcional): Agrupamento temporal (dia, semana, mes). Padrão: dia
- `canal` (opcional): Filtrar por canal específico
- `startDate` (opcional): Data inicial (formato YYYY-MM-DD)
- `endDate` (opcional): Data final (formato YYYY-MM-DD)

### Distribuição de Status
```
GET /api/status-distribuicao
```
Parâmetros:
- `canal` (opcional): Filtrar por canal específico
- `startDate` (opcional): Data inicial (formato YYYY-MM-DD)
- `endDate` (opcional): Data final (formato YYYY-MM-DD)

### Verificação de Saúde
```
GET /api/health
```

## Otimizações de Performance

- **Cache Inteligente**: TTL variável baseado em parâmetros de consulta
- **Otimização de Consultas**: Indexação de banco de dados e timeouts de consulta
- **Renderização Condicional**: Componentes só são renderizados quando os dados estão disponíveis
- **Callbacks Memorizados**: Usando useCallback para componentes filhos
- **Builds Docker Multi-Estágio**: Reduzindo o tamanho final da imagem

## Desenvolvimento

Tanto o frontend quanto o backend são gerenciados neste monorepo para facilitar o desenvolvimento. Veja os respectivos arquivos README nos diretórios `/frontend` e `/backend` para informações mais detalhadas.

## Testes

O projeto inclui suítes de teste abrangentes para frontend e backend:

### Testes do Frontend
```bash
cd frontend
npm test
```

### Testes do Backend
```bash
cd backend
npm test
```

Ambos também podem ser executados através do Docker, conforme mencionado na seção Docker acima.
