const db = require('../../config/db');
const { handleDatabaseError } = require('../utils/errorHandling');
const { cache, getCacheTTL } = require('../utils/cache');

const getTaxaConversao = async (req, res, next) => {
  try {
    const { periodo = 'dia', canal, startDate, endDate } = req.query;
    
    const cacheKey = `taxa-conversao:${periodo}:${canal || 'all'}:${startDate || 'none'}:${endDate || 'none'}`;
    
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Cache HIT: ${cacheKey}`);
      return res.json(cachedData);
    }
    console.log(`Cache MISS: ${cacheKey}`);
    
    let groupBy;
    switch (periodo) {
      case 'semana': 
        groupBy = "DATE_TRUNC('week', data_envio)"; 
        break;
      case 'mes': 
        groupBy = "DATE_TRUNC('month', data_envio)"; 
        break;
      default: 
        groupBy = "DATE(data_envio)";
    }

    let query = `
      SELECT 
        origin AS canal,
        ${groupBy} AS periodo,
        COUNT(*) AS total_envios,
        SUM(CASE WHEN response_status_id IN (5, 6) THEN 1 ELSE 0 END) AS conversoes,
        ROUND((SUM(CASE WHEN response_status_id IN (5, 6) THEN 1.0 ELSE 0 END) / COUNT(*)) * 100, 2) AS taxa_conversao
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

    query += ` GROUP BY origin, ${groupBy} ORDER BY origin, periodo`;

    const result = await db.query(query, params);
    
    const ttl = getCacheTTL(startDate, endDate);
    
    cache.set(cacheKey, result.rows, ttl);
    
    res.json(result.rows);
  } catch (error) {
    handleDatabaseError(error, req, res, next);
  }
};

module.exports = {
  getTaxaConversao
};
