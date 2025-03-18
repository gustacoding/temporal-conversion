const handleDatabaseError = (error, req, res, next) => {
  console.error('Erro na consulta ao banco:', error.message);
  
  if (error.code === '23505') {
    return res.status(409).json({ 
      status: 'error',
      message: 'Registro duplicado encontrado'
    });
  }
  
  if (error.code === '42P01') {
    return res.status(500).json({ 
      status: 'error',
      message: 'Tabela não encontrada no banco de dados'
    });
  }
  
  res.status(500).json({ 
    status: 'error',
    message: 'Erro ao processar consulta no banco de dados',
    detail: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

module.exports = {
  handleDatabaseError
};
