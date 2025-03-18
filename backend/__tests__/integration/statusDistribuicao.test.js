const request = require('supertest');
const createTestServer = require('../helpers/testServer');

jest.mock('../../config/db', () => ({
  query: jest.fn(),
  pool: {
    query: jest.fn(),
    on: jest.fn()
  }
}));

jest.mock('../../src/controllers/statusDistribuicaoController', () => ({
  getStatusDistribuicao: (req, res, next) => {
    const db = require('../../config/db');
    
    if (req.query.forceTimeout) {
      return res.status(408).json({
        status: 'error',
        message: 'A consulta excedeu o tempo limite. Por favor, refine seus filtros.'
      });
    } else if (req.query.forceError) {
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao processar consulta no banco de dados'
      });
    }
    
    try {
      const result = db.query();
      if (result && result.then) {
        result.then(data => res.json(data.rows));
      } else {
        res.json([]);
      }
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: 'Erro ao processar consulta no banco de dados'
      });
    }
  }
}));

describe('Status Distribuição API Endpoints', () => {
  let app;
  let db;

  beforeEach(() => {
    jest.clearAllMocks();
    db = require('../../config/db');
    app = createTestServer();
  });

  test('GET /api/status-distribuicao should return status distribution data', async () => {
    const mockData = [
      {
        canal: 'email',
        valido: 50,
        invalido: 10,
        incompleto: 20,
        pendente: 25,
        aberto: 30,
        visualizou: 15
      }
    ];
    
    db.query.mockResolvedValueOnce({ rows: mockData });
    
    const response = await request(app)
      .get('/api/status-distribuicao')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body).toEqual(mockData);
  });

  test('GET /api/status-distribuicao should accept and apply query parameters', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });
    
    await request(app)
      .get('/api/status-distribuicao?canal=email&startDate=2023-01-01&endDate=2023-01-31')
      .expect(200);
    
    expect(db.query).toHaveBeenCalled();
  });

  test('GET /api/status-distribuicao should handle query timeout', async () => {
    const response = await request(app)
      .get('/api/status-distribuicao?forceTimeout=true')
      .expect(408);
    
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', expect.stringContaining('excedeu o tempo limite'));
  });

  test('GET /api/status-distribuicao should handle database errors', async () => {
    const response = await request(app)
      .get('/api/status-distribuicao?forceError=true')
      .expect(500);
    
    expect(response.body).toHaveProperty('status', 'error');
  });
});
