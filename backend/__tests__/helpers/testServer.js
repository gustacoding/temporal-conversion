const express = require('express');
const routes = require('../../src/routes');
const errorHandler = require('../../src/middleware/errorHandler');

function createTestServer() {
  const app = express();
  app.use(express.json());
  app.use('/api', routes);
  app.use(errorHandler);
  
  app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
  });

  return app;
}

module.exports = createTestServer;
