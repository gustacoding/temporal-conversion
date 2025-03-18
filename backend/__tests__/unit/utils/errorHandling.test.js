const { handleDatabaseError } = require('../../../src/utils/errorHandling');

describe('Error Handling Utility', () => {
  let mockRequest, mockResponse, mockNext;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    process.env.NODE_ENV = 'test';
  });

  test('should handle duplicate record error (code 23505)', () => {
    const error = { code: '23505', message: 'Duplicate key value' };
    handleDatabaseError(error, mockRequest, mockResponse, mockNext);
    
    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'Registro duplicado encontrado'
      })
    );
  });

  test('should handle table not found error (code 42P01)', () => {
    const error = { code: '42P01', message: 'Table does not exist' };
    handleDatabaseError(error, mockRequest, mockResponse, mockNext);
    
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'Tabela não encontrada no banco de dados'
      })
    );
  });

  test('should handle generic database errors', () => {
    const error = { message: 'Generic database error' };
    handleDatabaseError(error, mockRequest, mockResponse, mockNext);
    
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'Erro ao processar consulta no banco de dados'
      })
    );
  });

  test('should include error detail in development mode', () => {
    process.env.NODE_ENV = 'development';
    const error = { message: 'Detailed error message' };
    handleDatabaseError(error, mockRequest, mockResponse, mockNext);
    
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: 'Detailed error message'
      })
    );
  });
});
