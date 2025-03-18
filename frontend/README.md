# Painel de Conversão Temporal

## Visão Geral

O Painel de Conversão Temporal é uma aplicação web baseada em React projetada para visualizar e analisar dados de conversão em múltiplos canais ao longo do tempo. O painel fornece gráficos interativos mostrando tanto as taxas de conversão ao longo do tempo quanto a distribuição de status para diferentes canais de comunicação.

## Tecnologias Utilizadas

### Frontend
- **React 19.0.0**: Versão mais recente do React para melhor desempenho e capacidades
- **Chart.js 4.4.8 & react-chartjs-2 5.3.0**: Para recursos robustos de visualização de dados
- **Axios 1.8.3**: Para comunicação com a API com sintaxe baseada em promises
- **Vitest**: Para testes modernos de componentes React

### Infraestrutura
- **Docker & Docker Compose**: Para containerização e fácil implantação
- **Nginx**: Como servidor web para servir os ativos estáticos
- **Node.js 16-alpine**: Para tamanho mínimo de container no estágio de build

## Arquitetura

### Estrutura de Componentes
A aplicação segue uma arquitetura de componentes modular:

- **Dashboard**: Componente principal que gerencia estado e busca de dados
- **Controls**: Interface do usuário para filtrar dados por canal e intervalo de datas
- **ConversionChart**: Visualização em gráfico de linha das taxas de conversão ao longo do tempo
- **StatusCharts**: Gráficos de pizza mostrando distribuição de status por canal
- **Header**: Contém título do aplicativo e alternador de tema

### Fluxo de Dados
1. O componente Dashboard busca dados das APIs de backend
2. O estado é gerenciado no nível do Dashboard e passado para componentes filhos
3. Interações do usuário nos Controls acionam novas buscas de dados com parâmetros atualizados
4. Componentes de gráfico recebem dados via props e renderizam as visualizações

### Containerização
A aplicação usa um build Docker multi-estágio:
1. Primeiro estágio: Ambiente Node.js para construir a aplicação React
2. Segundo estágio: Ambiente Nginx para servir os arquivos estáticos gerados
3. Configuração personalizada do Nginx para lidar com roteamento SPA e otimizar performance

## Funcionalidades

- **Análise de Dados Temporais**: Visualize taxas de conversão ao longo de períodos de tempo
- **Comparação Multi-Canal**: Compare desempenho entre diferentes canais de comunicação (email, celular, WhatsApp)
- **Distribuição de Status**: Veja detalhamento dos status das mensagens
- **Design Responsivo**: Otimizado para experiências em dispositivos móveis e desktop
- **Tema Claro/Escuro**: Temas baseados na preferência do usuário com transições suaves
- **Filtro de Intervalo de Datas**: Personalize o intervalo de datas para análise
- **Filtro de Canais**: Foque em canais específicos conforme necessário

## Testes Automatizados

A aplicação inclui uma suíte completa de testes automatizados para garantir a qualidade e confiabilidade do código.

### Estrutura de Testes
- **Testes de Componentes**: Verificação de renderização correta e comportamento dos componentes da UI
- **Mocks**: Simulação de dependências externas como APIs para testes isolados
- **Cobertura**: Testes para os principais componentes (Dashboard, Controls, Header, ConversionChart, StatusCharts)

### Tecnologias de Testes
- **Jest**: Framework de testes para JavaScript
- **Testing Library**: Utilitários para testar componentes React de forma centrada no usuário
- **Mock de Componentes**: Simulação de componentes complexos como gráficos Chart.js

### Executando Testes

#### Localmente
Para executar a suíte de testes completa em seu ambiente local:
```bash
# No diretório do projeto
npm test
```

Para executar testes específicos:
```bash
# Testa apenas um componente
npm test -- Dashboard

# Modo de observação (reexecuta testes ao detectar alterações)
npm test -- --watch

# Gera relatório de cobertura de testes
npm test -- --coverage
```

#### Em ambiente Docker
Para executar os testes em um ambiente Docker isolado:
```bash
# Construir e executar os testes em um container
docker-compose run test

# Para executar testes com geração de relatório de cobertura
docker-compose run test npm test -- --coverage

# Para executar testes com outras opções
docker-compose run test npm test -- --testNamePattern="Dashboard"
```

### Interpretando Resultados

- ✓ Verde: Teste passou com sucesso
- ✕ Vermelho: Falha no teste (verifique a mensagem de erro para detalhes)
- Estatísticas de cobertura: Porcentagem do código coberto pelos testes

## Processo de Desenvolvimento

### Decisões de Design
1. **Separação de Componentes**: Componentes foram separados com base em sua funcionalidade e reusabilidade
2. **Gerenciamento de Estado**: Utilizados hooks do React (useState, useEffect, useCallback) em vez de bibliotecas externas de gerenciamento de estado para reduzir o tamanho do bundle
3. **Design Responsivo**: Implementado com cálculos de estilo dinâmicos em vez de frameworks CSS para minimizar dependências
4. **Biblioteca de Gráficos**: Chart.js selecionado pelo seu desempenho com grandes conjuntos de dados e opções extensivas de personalização

### Fluxo de Trabalho de Desenvolvimento
1. Configuração inicial com Create React App para aproveitar sua configuração otimizada
2. Desenvolvimento de componentes com foco na separação de responsabilidades
3. Integração de API com testes de dados simulados
4. Implementação e teste de design responsivo
5. Implementação do sistema de temas
6. Otimização de desempenho
7. Containerização com Docker

## Otimizações de Performance

1. **Renderização Condicional**: Componentes só são renderizados quando os dados necessários estão disponíveis
2. **Callbacks Memorizados**: Uso de useCallback para funções passadas para componentes filhos
3. **Renderizações Otimizadas**: Estado estruturado para minimizar re-renderizações desnecessárias
4. **Efeitos de Transição**: Transições CSS são usadas em vez de animações JavaScript quando possível
5. **Preferência de Tema Armazenada**: A preferência de tema do usuário é armazenada no localStorage
6. **CSS Eficiente**: Transições de estilo são gerenciadas através de uma única injeção de stylesheet
7. **Build Multi-Estágio do Docker**: Reduz o tamanho final da imagem separando ambientes de build e runtime

## Trade-offs e Decisões

### React vs Frameworks Alternativos
- **Escolha**: React 19.0
- **Justificativa**: O modelo de componentes do React e o DOM virtual proporcionam excelente desempenho para esta aplicação com foco em visualização de dados, mantendo amplo suporte da comunidade
- **Trade-off**: Tamanho inicial do bundle maior em comparação com alternativas mais leves, mas melhor experiência para desenvolvedores e ecossistema de componentes

### Chart.js vs D3.js
- **Escolha**: Chart.js com react-chartjs-2
- **Justificativa**: Chart.js fornece abstrações de alto nível que permitem desenvolvimento mais rápido mantendo bom desempenho
- **Trade-off**: Menos flexibilidade de personalização que D3.js, mas tempo de desenvolvimento significativamente mais rápido

### Abordagem de Estilização
- **Escolha**: Estilos inline com cálculos dinâmicos
- **Justificativa**: Permite design responsivo sem dependências adicionais
- **Trade-off**: Menos separação entre estilo e lógica, mas implementação de tema mais fácil

### Docker + Nginx vs Implantação Serverless
- **Escolha**: Containerização Docker com Nginx
- **Justificativa**: Fornece ambientes consistentes entre desenvolvimento e produção
- **Trade-off**: Configuração mais complexa que serverless, mas melhor controle sobre o ambiente de hospedagem

### Design de API
- **Escolha**: API RESTful com parâmetros de consulta
- **Justificativa**: Simples de implementar e entender
- **Trade-off**: Múltiplas chamadas de API necessárias vs um único endpoint GraphQL, mas implementação de backend mais simples

## Instalação e Configuração

### Pré-requisitos
- Node.js 16+
- Docker e Docker Compose (para implantação containerizada)

### Desenvolvimento Local
```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start
```

### Implantação com Docker

#### Construção e Inicialização
```bash
# Construir a imagem Docker
docker-compose build

# Construir e iniciar contêineres com docker-compose em modo detached
docker-compose up -d
```

#### Gerenciamento dos Contêineres
```bash
# Verificar status dos contêineres
docker-compose ps

# Visualizar logs
docker-compose logs -f

# Parar contêineres
docker-compose down

# Reconstruir e reiniciar após mudanças no código
docker-compose up -d --build
```

#### Acesso à Aplicação
Após a inicialização, a aplicação estará disponível em:
- http://localhost:3000 (quando usando docker-compose)

## Uso

1. Acesse o painel em http://localhost:3000 (desenvolvimento) ou http://localhost:3000 (Docker)
2. Use o painel de controle para filtrar dados por canal e intervalo de datas
3. Analise tendências de conversão no gráfico de linhas
4. Examine a distribuição de status nos gráficos de pizza
5. Alterne entre temas escuro e claro conforme necessário

## Integração com API

O painel se conecta a dois endpoints principais de API:
- `/api/taxa-conversao`: Para dados de série temporal de taxa de conversão
- `/api/status-distribuicao`: Para dados de distribuição de status

Ambos os endpoints aceitam parâmetros de consulta para filtragem:
- `periodo`: Agrupamento de período de tempo (ex: 'dia')
- `canal`: Filtro de canal de comunicação
- `startDate`: Início do intervalo de datas
- `endDate`: Fim do intervalo de datas
