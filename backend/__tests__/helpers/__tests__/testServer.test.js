const createTestServer = require('../testServer');

describe('createTestServer', () => {
  test('should create an express app instance', () => {
    const app = createTestServer();
    expect(app).toBeDefined();
    expect(typeof app).toBe('function');
    expect(app._router).toBeDefined();
  });
});
