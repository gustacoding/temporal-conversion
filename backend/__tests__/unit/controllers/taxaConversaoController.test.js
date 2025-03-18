jest.mock('../../../config/db', () => require('../../mocks/db'));

const mockHandleDatabaseError = jest.fn((error, req, res, next) => next(error));
jest.mock('../../../src/utils/errorHandling', () => ({
  handleDatabaseError: mockHandleDatabaseError
}));

const { getTaxaConversao } = require('../../../src/controllers/taxaConversaoController');
const db = require('../../../config/db');
const { cache } = require('../../../src/utils/cache');

describe('Taxa Conversao Controller', () => {
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

  test('should fetch conversion rate data with default period', async () => {
    const mockData = [
      {
        canal: 'email',
        periodo: '2023-01-01',
        total_envios: 100,
        conversoes: 30,
        taxa_conversao: 30.00
      }
    ];

    db.query.mockResolvedValueOnce({ rows: mockData });
    
    await getTaxaConversao(mockRequest, mockResponse, mockNext);
    
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('DATE(data_envio)'),
      []
    );
    expect(mockResponse.json).toHaveBeenCalledWith(mockData);
  });

  test('should use correct period grouping for weekly data', async () => {
    mockRequest.query.periodo = 'semana';
    
    db.query.mockResolvedValueOnce({ rows: [] });
    
    await getTaxaConversao(mockRequest, mockResponse, mockNext);
    
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("DATE_TRUNC('week', data_envio)"),
      []
    );
  });

  test('should use correct period grouping for monthly data', async () => {
    mockRequest.query.periodo = 'mes';
    
    db.query.mockResolvedValueOnce({ rows: [] });
    
    await getTaxaConversao(mockRequest, mockResponse, mockNext);
    
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("DATE_TRUNC('month', data_envio)"),
      []
    );
  });

  test('should apply canal filter when specified', async () => {
    mockRequest.query.canal = 'email';
    
    db.query.mockResolvedValueOnce({ rows: [] });
    
    await getTaxaConversao(mockRequest, mockResponse, mockNext);
    
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE origin = $1'),
      ['email']
    );
  });

  test('should apply date range filters when specified', async () => {
    mockRequest.query.startDate = '2023-01-01';
    mockRequest.query.endDate = '2023-01-31';
    
    db.query.mockResolvedValueOnce({ rows: [] });
    
    await getTaxaConversao(mockRequest, mockResponse, mockNext);
    
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE data_envio >= $1 AND data_envio <= $2'),
      ['2023-01-01 00:00:00-03', '2023-01-31 23:59:59-03']
    );
  });

  test('should use cache when data was previously retrieved', async () => {
    const mockData = [{ canal: 'email', total_envios: 100 }];
    const cacheKey = 'taxa-conversao:dia:all:none:none';
    
    db.query.mockResolvedValueOnce({ rows: mockData });
    await getTaxaConversao(mockRequest, mockResponse, mockNext);
    
    mockResponse.json.mockReset();
    db.query.mockReset();
    
    await getTaxaConversao(mockRequest, mockResponse, mockNext);
    
    expect(db.query).not.toHaveBeenCalled();
    expect(mockResponse.json).toHaveBeenCalledWith(mockData);
  });

  test('should handle database errors', async () => {
    const error = new Error('Database error');
    db.query.mockRejectedValueOnce(error);
    
    await getTaxaConversao(mockRequest, mockResponse, mockNext);
    
    expect(mockHandleDatabaseError).toHaveBeenCalled();
    expect(mockHandleDatabaseError.mock.calls[0][0]).toBe(error);
    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
