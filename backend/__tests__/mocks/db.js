const mockQuery = jest.fn();
const mockPool = {
  query: mockQuery,
  on: jest.fn(),
};

module.exports = {
  query: mockQuery,
  pool: mockPool,
  __resetMocks: () => {
    mockQuery.mockReset();
  }
};
