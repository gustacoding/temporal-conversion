jest.mock('../../../config/db', () => require('../../mocks/db'));

const mockHandleDatabaseError = jest.fn((error, req, res, next) => next(error));
jest.mock('../../../src/utils/errorHandling', () => ({
  handleDatabaseError: mockHandleDatabaseError
}));

const { getStatusDistribuicao } = require('../../../src/controllers/statusDistribuicaoController');
const db = require('../../../config/db');
const { cache } = require('../../../src/utils/cache');

describe('Status Distribuicao Controller', () => {
  let mockRequest, mockResponse, mockNext;

  beforeEach(() => {
    jest.clearAllMocks();
    cache.flushAll();
    
    mockRequest = {
      query: {}
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  test('should fetch status distribution data', async () => {
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
    
    await getStatusDistribuicao(mockRequest, mockResponse, mockNext);
    
    expect(db.query).toHaveBeenCalledWith(
      expect.any(String),
      []
    );
    expect(mockResponse.json).toHaveBeenCalledWith(mockData);
  });

  test('should apply canal filter when specified', async () => {
    mockRequest.query.canal = 'email';
    
    db.query.mockResolvedValueOnce({ rows: [] });
    
    await getStatusDistribuicao(mockRequest, mockResponse, mockNext);
    
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE origin = $1'),
      ['email']
    );
  });

  test('should apply date range filters when specified', async () => {
    mockRequest.query.startDate = '2023-01-01';
    mockRequest.query.endDate = '2023-01-31';
    
    db.query.mockResolvedValueOnce({ rows: [] });
    
    await getStatusDistribuicao(mockRequest, mockResponse, mockNext);
    
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE data_envio >= $1 AND data_envio <= $2'),
      ['2023-01-01 00:00:00-03', '2023-01-31 23:59:59-03']
    );
  });

  test('should use cache when data was previously retrieved', async () => {
    const mockData = [{ canal: 'email', valido: 50, invalido: 10 }];
    const cacheKey = 'status-distribuicao:all:none:none';
    
    db.query.mockResolvedValueOnce({ rows: mockData });
    await getStatusDistribuicao(mockRequest, mockResponse, mockNext);
    
    mockResponse.json.mockReset();
    db.query.mockReset();
    
    await getStatusDistribuicao(mockRequest, mockResponse, mockNext);
    
    expect(db.query).not.toHaveBeenCalled();
    expect(mockResponse.json).toHaveBeenCalledWith(mockData);
  });

  test('should handle query timeout', async () => {
    db.query.mockRejectedValueOnce(new Error('Query timeout'));
    
    await getStatusDistribuicao(mockRequest, mockResponse, mockNext);
    
    expect(mockResponse.status).toHaveBeenCalledWith(408);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'A consulta excedeu o tempo limite. Por favor, refine seus filtros.'
      })
    );
  });

  test('should handle general database errors', async () => {
    const error = new Error('General database error');
    db.query.mockRejectedValueOnce(error);
    
    await getStatusDistribuicao(mockRequest, mockResponse, mockNext);
    
    expect(mockHandleDatabaseError).toHaveBeenCalled();
    expect(mockHandleDatabaseError.mock.calls[0][0]).toBe(error);
    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
