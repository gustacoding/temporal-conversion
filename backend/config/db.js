require('dotenv').config();
const { Pool } = require('pg');

const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD', 'DB_PORT'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`Erro: Variáveis de ambiente necessárias não definidas: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10),
  max: 10,
  idleTimeoutMillis: 30000,     
  connectionTimeoutMillis: 5000, 
  statement_timeout: 10000,
  query_timeout: 10000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool de conexão do PostgreSQL', err);
  process.exit(-1);
});

const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (duration > 200) {
      console.log('Slow query:', { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (e) {
    console.error('Query error', { text, error: e });
    throw e;
  }
};

module.exports = {
  query,
  pool
};
