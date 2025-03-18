const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'data',
  password: '26069500',
  port: 5432,
});

app.get('/api/taxa-conversao', async (req, res) => {
  const { periodo = 'dia', canal, startDate, endDate } = req.query;
  let groupBy;
  switch (periodo) {
    case 'semana': groupBy = "DATE_TRUNC('week', data_envio)"; break;
    case 'mes': groupBy = "DATE_TRUNC('month', data_envio)"; break;
    default: groupBy = "DATE(data_envio)";
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

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro na consulta:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/status-distribuicao', async (req, res) => {
  const { canal, startDate, endDate } = req.query;

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

  query += ` GROUP BY origin ORDER BY origin`;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro na consulta:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(4000, () => console.log('API rodando na porta 4000'));
