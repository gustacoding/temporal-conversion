const { cache, getCacheTTL } = require('../../../src/utils/cache');

describe('Cache Utility', () => {
  beforeEach(() => {
    cache.flushAll();
  });

  test('should store and retrieve data from cache', () => {
    const key = 'test-key';
    const data = { test: 'data' };
    
    cache.set(key, data);
    const result = cache.get(key);
    
    expect(result).toEqual(data);
  });

  test('should return undefined for non-existent cache key', () => {
    const result = cache.get('non-existent-key');
    expect(result).toBeUndefined();
  });

  describe('getCacheTTL', () => {
    test('should return default TTL if dates not provided', () => {
      const ttl = getCacheTTL(null, null);
      expect(ttl).toBe(300);
    });

    test('should return 3600s TTL for date range > 60 days', () => {
      const startDate = '2023-01-01';
      const endDate = '2023-03-15';
      const ttl = getCacheTTL(startDate, endDate);
      expect(ttl).toBe(3600);
    });

    test('should return 1800s TTL for date range 30-60 days', () => {
      const startDate = '2023-01-01';
      const endDate = '2023-02-15';
      const ttl = getCacheTTL(startDate, endDate);
      expect(ttl).toBe(1800);
    });

    test('should return 900s TTL for date range 14-30 days', () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-20';
      const ttl = getCacheTTL(startDate, endDate);
      expect(ttl).toBe(900);
    });

    test('should return 300s TTL for date range < 14 days', () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-10';
      const ttl = getCacheTTL(startDate, endDate);
      expect(ttl).toBe(300);
    });
  });
});
