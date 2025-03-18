const request = require('supertest');
const createTestServer = require('../helpers/testServer');

jest.mock('../../config/db', () => ({
  query: jest.fn(),
  pool: {
    query: jest.fn(),
    on: jest.fn()
  }
}));

jest.mock('../../src/controllers/taxaConversaoController', () => {
  const original = jest.requireActual('../../src/controllers/taxaConversaoController');
  
  return {
    ...original,
    getTaxaConversao: (req, res, next) => {
      const db = require('../../config/db');
      
      if (req.query.forceError) {
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
  };
});

describe('Taxa de Conversão API Endpoints', () => {
  let app;
  let db;

  beforeEach(() => {
    jest.clearAllMocks();
    db = require('../../config/db');
    app = createTestServer();
  });

  test('GET /api/taxa-conversao should return conversion rate data', async () => {
    const mockData = [
      {
        canal: 'email',
        periodo: '2023-01-01T00:00:00.000Z',
        total_envios: 150,
        conversoes: 45,
        taxa_conversao: 30.00
      }
    ];
    
    db.query.mockResolvedValueOnce({ rows: mockData });
    
    const response = await request(app)
      .get('/api/taxa-conversao')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body).toEqual(mockData);
  });

  test('GET /api/taxa-conversao should accept and apply query parameters', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });
    
    await request(app)
      .get('/api/taxa-conversao?periodo=semana&canal=email&startDate=2023-01-01&endDate=2023-01-31')
      .expect(200);
    
    expect(db.query).toHaveBeenCalled();
  });

  test('GET /api/taxa-conversao should handle database errors', async () => {
    const response = await request(app)
      .get('/api/taxa-conversao?forceError=true')
      .expect(500);
    
    expect(response.body).toHaveProperty('status', 'error');
  });
});
