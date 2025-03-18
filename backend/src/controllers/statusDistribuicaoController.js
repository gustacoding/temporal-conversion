const db = require('../../config/db');
const { handleDatabaseError } = require('../utils/errorHandling');
const { cache, getCacheTTL } = require('../utils/cache');

const getStatusDistribuicao = async (req, res, next) => {
  try {
    const { canal, startDate, endDate } = req.query;

    const cacheKey = `status-distribuicao:${canal || 'all'}:${startDate || 'none'}:${endDate || 'none'}`;
    
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Cache HIT: ${cacheKey}`);
      return res.json(cachedData);
    }
    console.log(`Cache MISS: ${cacheKey}`);

    let query = `
      SELECT 
        origin AS canal,
        COUNT(CASE WHEN response_status_id = 1 THEN 1 END) AS valido,
        COUNT(CASE WHEN response_status_id = 2 THEN 1 END) AS invalido,
        COUNT(CASE WHEN response_status_id = 3 THEN 1 END) AS incompleto,
        COUNT(CASE WHEN response_status_id = 4 THEN 1 END) AS pendente,
        COUNT(CASE WHEN response_status_id = 5 THEN 1 END) AS aberto,
        COUNT(CASE WHEN response_status_id = 6 THEN 1 END) AS visualizou
      FROM inside.users_surveys_responses_aux
    `;
    
    const params = [];
    const whereClauses = [];
    
    if (canal) {
      whereClauses.push('origin = $1');
      params.push(canal);
    }
    
    if (startDate) {
      whereClauses.push('data_envio >= $' + (params.length + 1));
      params.push(`${startDate} 00:00:00-03`);
    }
    
    if (endDate) {
      whereClauses.push('data_envio <= $' + (params.length + 1));
      params.push(`${endDate} 23:59:59-03`);
    }

    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }

    query += ` GROUP BY origin ORDER BY origin LIMIT 1000`;

    const startTime = Date.now();
    if (process.env.NODE_ENV === 'development') {
      console.log('Executing query:', { query, params });
      
      if (process.env.DEBUG_LEVEL === 'deep') {
        try {
          const explainResult = await db.query(`EXPLAIN ANALYZE ${query}`, params);
          console.log('Query execution plan:', explainResult.rows);
        } catch (err) {
          console.error('Error getting execution plan:', err.message);
        }
      }
    }

    const queryPromise = db.query(query, params);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Query timeout')), 15000);
    });
    
    const result = await Promise.race([queryPromise, timeoutPromise]);
    
    const duration = Date.now() - startTime;
    if (duration > 500) {
      console.log(`Performance alert: Slow status distribution query took ${duration}ms`, 
        { params, rowCount: result.rowCount });
    }
    
    const ttl = getCacheTTL(startDate, endDate);
    
    cache.set(cacheKey, result.rows, ttl);
    
    res.json(result.rows);
  } catch (error) {
    if (error.message === 'Query timeout') {
      return res.status(408).json({
        status: 'error',
        message: 'A consulta excedeu o tempo limite. Por favor, refine seus filtros.'
      });
    }
    handleDatabaseError(error, req, res, next);
  }
};

module.exports = {
  getStatusDistribuicao
};
